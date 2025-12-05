<template>
  <h2>Tree View</h2>
  <div class="container mx-auto bg-slate-700 px-4 py-2">
    <div class="flex flex-row justify-between items-center mb-2">
      <div class="controls flex flex-row justify-between items-center gap-2">
        <Select v-model="selectedTree" @change="treeWasSelected" :options="treeList" optionLabel="name"
          placeholder="Select a Tree" size="small" />
        <Button icon="pi pi-file" size="small" aria-label="Создать новое дерево" @click="showAddTreeDlg = true" />
      </div>
    </div>
    <!-- <Tree :value="complexList.data.children">
      <template #default="slotProps">
        <b>{{ slotProps.node.label }}</b> - <em>{{slotProps.node.expanded}}</em>
      </template>
</Tree> -->
    <Panel v-if="!isEmptyNode(tree.data)" toggleable>
      <template #header>
        <div v-if="selectedTree" class="flex flex-row justify-between items-center w-full">
          <h2 class="text-2xl">{{ treeTopic }}</h2>
          <div class="right-side flex flex-row justify-between items-center gap-2">
            <p v-html="treeMeta" class="text-sm"></p>
            <div class="controls ">
              <Button icon="pi pi-file-import" size="small" aria-label="Создать ветку"
                @click="showAddBranchDlg = true" />
            </div>
          </div>

        </div>
      </template>
      <TreeBranch v-if="selectedTree" :parent="selectedTreeId" :is-root="true" @slide-new="slideNew" />
    </Panel>
    <p v-else>Data not set</p>
  </div>
  <addTree :show-dlg="showAddTreeDlg" @tree-was-added="treeAdd" @tree-was-cancelled="treeAdd" />
  <addBranch :show-dlg="showAddBranchDlg" :parent-branch="selectedTreeId" :is-root="false" @branch-was-added="branchAdd"
    @branch-was-cancelled="branchAdd" />
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
// import Tree from 'primevue/tree';
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import Button from 'primevue/button';
import TreeBranch from '../components/TreeBranch.vue';

// import data4Tree from './moc/jsMind-MRYA-01-4Tree.json'
import someJSON from '../classes/someJSON';
import useSupabase from '../classes/useSupabase';
import addTree from '../components/dialogs/addTree.vue';
import addBranch from '../components/dialogs/addBranch.vue';

// const complexList = reactive(data4Tree)

const tree = reactive(new someJSON())

const isEmptyNode = (node) => {
  if (node) {
    return false
  } else {
    return true
  }
}
const slideNew = () => {
  // tree.slideNew = id
}

const trees = ref([])
const selectedTree = ref()
const dataSourse = useSupabase;

onMounted(async () => {
  trees.value = await dataSourse.getTrees()
})

const treeList = computed(() => {
  if (trees?.value.length > 0) {
    return trees.value
  } else {
    return []
  }
})

const treeMeta = ref('')
const treeTopic = ref('')
const treeWasSelected = async () => {
  if (selectedTree.value.code) {
    const meta = await dataSourse.getTreeMeta(selectedTree.value.code)
    if (meta) {
      treeMeta.value = `<p>${meta.name} - ${meta.author} - ${meta.version}<p>`
    } else {
      treeMeta.value = `<p>Meta not set</p>`
    }
    const topic = await dataSourse.getTreeTopic(selectedTree.value.code)
    if (topic) {
      treeTopic.value = topic
    } else {
      treeTopic.value = ''
    }
  }
}
const selectedTreeId = computed(() => {
  return selectedTree.value !== undefined ? selectedTree.value.code : ''
})
const showAddTreeDlg = ref(false)
const treeAdd = () => {
  showAddTreeDlg.value = false
}

const showAddBranchDlg = ref(false)
const branchAdd = () => {
  showAddBranchDlg.value = false
}
</script>
