<template>
  <div>
    <!-- Диалог добавления нового дерева -->
   <Dialog v-model:visible="showAddTreeDlg" modal header="Создать новое дерево" class="w-1/2">
    <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" :validateOnBlur="true" @submit="onAddTreeSubmit" class="flex flex-col gap-4 w-full px-3 py-2 ">
      <div class="flex flex-col items-left gap-4 mb-2">
        <label for="topic" class="font-semibold ">Заголовок</label>
        <InputText id="topic" name="topic" class="flex-auto w-full" autocomplete="off" />
        <Message v-if="$form.topic?.invalid" severity="error" size="small" variant="simple">{{ $form.topic.error.message }}</Message>
      </div>
      <div class="flex flex-col items-left gap-4 mb-2">
          <label for="thesis" class="font-semibold ">Пояснение</label>
          <Textarea name="thesis" rows="5" style="resize: none" />
      </div>
      <Fieldset legend="Метаданные">
        <div class="flex flex-row justify-between gap-4 mb-2">
          <div class="flex flex-col items-left gap-4 ">
            <label for="shortName" class="font-semibold ">Название (кратко)</label>
            <InputText id="shortName" name="shortName" class="flex-auto w-full" autocomplete="off" />
          </div>
          <div class="flex flex-col items-left gap-4">
              <label for="version" class="font-semibold ">Версия</label>
              <InputText id="version" name="version" class="flex-auto w-full" autocomplete="off" />
          </div>
        </div>
        <div class="flex flex-col items-left gap-4 mb-2">
            <label for="author" class="font-semibold ">Email автора</label>
            <InputText id="author" name="author" class="flex-auto w-full" autocomplete="off" />
        </div>
      </Fieldset>

      <div class="flex flex-row justify-between gap-4 mb-2">
        <div class="flex flex-row items-left items-center gap-4">
          <label for="format" class="font-semibold ">Формат</label>
          <Select name="format" :options="formats" optionLabel="name" placeholder="Выберите формат" fluid />
        </div>
        <div class="flex flex-row items-left items-center gap-4">
          <label for="color" class="font-semibold ">Цвет</label>
          <ColorPicker name="color" inputId="cp-hex" format="hex"/>
        </div>
        <div class="flex flex-row items-left items-center gap-4">
          <label for="expanded" class="font-semibold ">Открыть?</label>
          <Checkbox id="expanded" name="expanded" binary />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Отмена" severity="secondary" @click="onAddTreeCansel"></Button>
        <Button type="submit" label="Сохранить" />
    </div>
    </Form>
   </Dialog>
  </div>
</template>

<script setup>
import { ref,reactive, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Fieldset from 'primevue/fieldset';
import ColorPicker from 'primevue/colorpicker';
import { Form } from '@primevue/forms';
import useSupabase from '@/classes/useSupabase';

const dataSourse = useSupabase;

const props = defineProps(
  {
    showDlg:{type:Boolean, requred: true}
  }
)

const showAddTreeDlg = ref(false)
watch(()=>props.showDlg, (newVal, oldVal) => {
  if (newVal) {
    showAddTreeDlg.value = true
  } else {
    showAddTreeDlg.value = false
  }
},  { deep: true })

const emit = defineEmits(['treeWasAdded','treeWasCenseled'])

const formats = ref([
  { name: 'Дерево', mnemo: 'node_tree' },
  { name: 'Массив', mnemo: 'node_array' },
  { name: 'Freemind', mnemo: 'freemind' },
]);

const initialValues = reactive({
  topic: '',
  shortName: '',
  author: '',
  version: '',
  expanded: false,
  color: '',
  format: '',
  thesis: ''
});

const resolver = ({ values }) => {
  const errors = {};

  if (values.topic === '') {
    errors.topic = [{ message: 'Не может быть пустым' }];
  }

  return {
    values, // (Optional) Used to pass current form values to submit event.
    errors
  };
};

const onAddTreeSubmit = (e) => {
  if (e.valid) {
    showAddTreeDlg.value = false
    dataSourse.setNewTree({
      topic: e.values.topic,
      thesis: e.values.thesis,
      shortName: e.values.shortName,
      author: e.values.author,
      version: e.values.version,
      format: e.values.format,
      color: e.values.color,
      expanded: e.values.expanded
    })
    emit('treeWasAdded', initialValues.topic)
  }
};

const onAddTreeCansel = () => {
  showAddTreeDlg.value = false
  emit('treeWasCenseled', initialValues.topic)
}
</script>
