<script setup>
import { reactive, ref } from 'vue'
import Tree from 'primevue/tree';
import Panel from 'primevue/panel';

import TreeBranch from './components/TreeBranch.vue';

import treeData from './moc/jsMind-MRYA-01.json'
import data4Tree from './moc/jsMind-MRYA-01-4Tree.json'

const tree = reactive(treeData)
const complexList = reactive(data4Tree)

const meta2html = () => {
  if (tree.meta !== '') {
    return `<p>${tree.meta.name} - ${tree.meta.author} - ${tree.meta.version }<p>`
  } else {
    return `<p>Meta not set</p>`
  }
}

const isEmptyNode = (node) => {
  if (node !== '') {
    return false
  } else {
    return true
  }
}
const slideNew = (id) => {
  console.log(id);
}
</script>

<template>
  <div class="container mx-auto bg-slate-700 px-4 py-2">
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl">Mind To Slide</h1>
      <p v-html="meta2html()"></p>
    </div>
    <!-- <Tree :value="complexList.data.children">
      <template #default="slotProps">
        <b>{{ slotProps.node.label }}</b> - <em>{{slotProps.node.expanded}}</em>
      </template>
    </Tree> -->
    <Panel v-if="!isEmptyNode(tree.data)" :header="tree.data.topic" toggleable>
      <TreeBranch :node="tree.data" @slide-new="slideNew"/>
    </Panel>
    <p v-else>Data not set</p>
  </div>
</template>

<style scoped></style>
