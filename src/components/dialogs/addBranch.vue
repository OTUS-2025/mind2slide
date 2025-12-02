<template>
  <div class="">
    <!-- Диалог добавления новой ветви дерева -->
    <Dialog v-model:visible="showAddBranchDlg" @hide="onAddBranchCancel" modal header="Добавить ветвь" class="w-1/2">
      <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" :validateOnBlur="true"
        @submit="onAddBranchSubmit" class="flex flex-col gap-4 w-full px-3 py-2 ">
        <div class="flex flex-col items-left gap-4 mb-2">
          <label for="topic" class="font-semibold ">Заголовок</label>
          <InputText id="topic" name="topic" class="flex-auto w-full" autocomplete="off" />
          <Message v-if="$form.topic?.invalid" severity="error" size="small" variant="simple">
            {{ $form.topic.error.message }}
          </Message>
        </div>
        <div class="flex flex-col items-left gap-4 mb-2">
          <label for="thesis" class="font-semibold ">Пояснение</label>
          <Textarea name="thesis" rows="5" style="resize: none" />
        </div>
        <div class="flex flex-row justify-between gap-4 mb-2">
          <div class="flex flex-row items-left items-center gap-4">
            <label for="color" class="font-semibold ">Цвет</label>
            <ColorPicker name="color" inputId="cp-hex" format="hex" />
          </div>
          <div class="flex flex-row items-left items-center gap-4">
            <label for="expanded" class="font-semibold ">Открыть?</label>
            <Checkbox id="expanded" name="expanded" binary />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Отмена" severity="secondary" @click="onAddBranchCancel"></Button>
          <Button type="submit" label="Сохранить" />
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Checkbox from 'primevue/checkbox';
import Textarea from 'primevue/textarea';
import ColorPicker from 'primevue/colorpicker';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod';
import useSupabase from '@/classes/useSupabase';

const dataSourse = useSupabase;

const props = defineProps(
  {
    showDlg: { type: Boolean, requred: true },
    parentBranch: { type: String, requred: true }
  }
)

const showAddBranchDlg = ref(false)
watch(
  () => props.showDlg, (newVal) => {
    if (newVal) {
      showAddBranchDlg.value = true
    } else {
      showAddBranchDlg.value = false
    }
  },
  { deep: true }
)

const emit = defineEmits(['branchWasAdded', 'branchWasCancelled'])

const initialValues = reactive({
  topic: '',
  expanded: false,
  color: '',
  thesis: ''
});

const resolver = zodResolver(
  z.object({
    topic: z.string().min(3, { message: 'Заголовок не может быть пустым' }),
  })
)

const onAddBranchSubmit = (e) => {
  if (e.valid) {
    showAddBranchDlg.value = false
    dataSourse.setNewBrach({
      topic: e.values.topic,
      thesis: e.values.thesis,
      color: e.values.color,
      expanded: e.values.expanded,
      parentBranch: props.parentBranch
    })
    emit('branchWasAdded', initialValues.topic)
  }
}

const onAddBranchCancel = () => {
  showAddBranchDlg.value = false
  emit('branchWasCancelled')
}
</script>
