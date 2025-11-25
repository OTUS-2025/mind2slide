<template>
  <ol v-if="isParentHasChild" :class="{ 'pl-4': isIncIndent }" class="">
    <li v-for="(item) in branches" :key="item.id" :class="{ 'border-t-1': isNodeHasChild(item) }">
      <div class="flex flex-row justify-between items-center gap-x-2 p-1">
        <div class="expand">
          <Button v-if="isNodeHasChild(item)" rounded :icon="toggleIcon" size="small" aria-label="Open/Close"
            @click="toggleBranch(item)" />
        </div>
        <div class="basis-full">{{ item.topic }}</div>
        <div class="flex flex-row justify-between items-center gap-x-1 controls">
          <!-- <Button v-if="item?.slideNdx" :label="item.slideNdx" size="small" aria-label="" @click="slideNew(item)" />
          <Button v-else icon="pi pi-file" size="small" aria-label="Создать слайд" @click="slideNew(item)" />
          <Button v-if="!item?.slideNdx" icon="pi pi-file-plus" size="small" aria-label="Добавить к слайду"
            @click="slideNew(item)" /> -->
        </div>
      </div>
      <!-- <TreeBranch v-if="isNodeHasChild(item)" v-show="item.expanded" :node="item" @slide-new="dataUp" /> -->
    </li>
  </ol>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Button } from 'primevue'
import useSupabase from '@/classes/useSupabase';

const dataSourse = useSupabase;

const props = defineProps(
  {
    indent: { type: String, default: "inc" },
    parent: { type: String, requred: true, default: '' }
  }
)

const emit = defineEmits(['slideNew'])

const getBranch = async () => {
  // console.log("🚀 ~ getBranch ~ props.parentId:", props.parent)
  let answer = undefined
  if (props.parent !== '') {
    answer = await dataSourse.getBranch4Parent(props.parent)
    // console.log("🚀 ~ branches:", answer)
    return answer
  }
}
const branches = ref()

onMounted(async () => {
  branches.value = await getBranch()
});
watch(() => props.parent, async () => {
  branches.value = await getBranch()
}, { deep: true })

const isParentHasChild = computed(() => {
  // console.log("🚀 ~ branches:", branches.value)
  if (branches.value !== undefined) {
    return branches.value.length > 0 ? true : false
  } else {
    return false
  }
})

const isNodeHasChild = (node) => {
  return node.nchildren > 0 ? true : false
}

const isIncIndent = () => {
  // eslint-disable-next-line no-undef
  return indent === 'inc' ? true : false
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
  emit('slideNew', node.id)
}

const dataUp = (id) => {
  emit('slideNew', id)
}
</script>
