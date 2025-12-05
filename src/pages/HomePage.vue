/**
Главная страница приложения.
Работает в двух режимах:
- для неавторизованного пользователя
- для авторизованного пользоваителя(автора)
*/
<template>
  <div class="flex flex-col items-center justify-center w-full my-0 mx-auto">
    <div v-if="!user.isAuthorised" class="w-1/3">
      <h2 class="text-xl mb-4">Начать с</h2>
      <ul>
        <li>
          <RouterLink to="/user/login">Войти</RouterLink>
        </li>
        <li>
          <RouterLink to="/user/signup">Зарегистрироваться</RouterLink>
        </li>
      </ul>
    </div>
    <div v-else class="w-1/2">
      <h2 class="text-xl mb-4">Продолжить</h2>
      <!-- TODO: Подумать и вынести в отдельный компонент каждый из элементов списка -->
      <ul class="w-full">
        <li class="flex flex-row items-left items-center gap-4 mb-2">
          <Fieldset legend="Разбираемся с" class="w-full">
            <Select v-model="selectedTree" id="tree__selector" @change="treeWasSelected" :options="treeList"
              optionLabel="name" placeholder="Select a Tree" size="small" class="w-full" />
            <div class="flex flex-row justify-end items-stretch w-full gap-2 pt-2">
              <Button icon="pi pi-list" label="Дерево" size="small" aria-label="Открыть как дерево"
                @click="goToNexusAs('tree')" />
              <Button icon="pi pi-sitemap" label="Ментальная карта" size="small"
                aria-label="Открыть как ментальную карту" @click="goToNexusAs('mindmap')" />
              <Button icon="pi pi-clone" label="Слайды" size="small" aria-label="Открыть как набор слайдов"
                @click="goToNexusAs('slides')" />
            </div>
          </Fieldset>
        </li>
        <li class="mb-2">
          <Button icon="pi pi-file" label="Создать новое дерево" size="small" aria-label="Создать новое дерево"
            class="w-full" @click="showAddTreeDlg = true" />
        </li>
        <li></li>
      </ul>
    </div>
  </div>

</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import useSupabase from '@/classes/useSupabase';
import { useWorkflowStore } from '@/stores/workflowStore';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';
import router from '@/router';
import { storeToRefs } from 'pinia';

const user = useUserStore()

const trees = ref([])
const selectedTree = ref()
const dataSourse = useSupabase;
let { nexusActive } = storeToRefs(useWorkflowStore())

onMounted(async () => {
  trees.value = await dataSourse.getTrees()
  if (nexusActive.value) {
    selectedTree.value = nexusActive.value
  }
})
const treeList = computed(() => {
  if (trees?.value.length > 0) {
    return trees.value
  } else {
    return []
  }
})
// TODO: Перенести обработчик со страницы TreePage
const treeWasSelected = () => {
  nexusActive.value = selectedTree.value
}

// TODO: Перенести обработчик со страницы TreePage. Пернести диалог со страницы TreePage
const showAddTreeDlg = () => { }

// TODO: Доработать переход на страницу просмотра в звисимости от выбранного вида
const goToNexusAs = (kind) => {
  router.push({ name: kind })
}

</script>
