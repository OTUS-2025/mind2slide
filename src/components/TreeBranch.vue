<script setup>
import {ref} from 'vue'
import { Button } from 'primevue'

defineProps(
  {
    node:{type:Object,requred: true},
    indent: {type:String, default: "inc"}
  }
)

const emit = defineEmits(['slideNew'])

const isNodeHasChild = (node) => {
  return node.children ? true : false
}
const isIncIndent = () => {
  return indent === 'inc'? true:false
}

const toggleIcon = ref('pi pi-arrow-up-left')

const toggleBranch = (node) => {
  node.expanded = !node.expanded
  if (node.expanded) {
    toggleIcon.value = 'pi pi-arrow-up-left'
  } else {
    toggleIcon.value = 'pi pi-arrow-down-right'
  }
}
const slideNew = (node) => {
  emit('slideNew',node.id)
}

const dataUp = (id) => {
  emit('slideNew',id)
}
 </script>

<template>
  <ol v-if="isNodeHasChild(node)" :class="{'pl-4': isIncIndent}" class="">
    <li v-for="(item, ndx) in node.children" :key="ndx" :class="{'border-t-1': isNodeHasChild(item)}">
      <div class="flex flex-row justify-between items-center gap-x-2 p-1">
        <div class="expand">
          <Button v-if="isNodeHasChild(item)" rounded :icon="toggleIcon" size="small" aria-label="Bookmark" @click="toggleBranch(item)"/>
        </div>
        <div class="basis-full">{{ item.topic }}</div>
        <div class="flex flex-row justify-between items-center gap-x-1 controls">
          <Button icon="pi pi-file" size="small" aria-label="Создать слайд" @click="slideNew(item)"/>
          <Button icon="pi pi-file-plus" size="small" aria-label="Создать слайд" @click="slideNew(item)"/>
        </div>
      </div>
      <TreeBranch v-if="isNodeHasChild(item)" v-show="item.expanded" :node="item" @slide-new="dataUp"/>
    </li>
  </ol>
</template>

<style lang="scss" scoped>

</style>
