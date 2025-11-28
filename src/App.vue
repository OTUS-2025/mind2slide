<script setup>
import { reactive, ref } from 'vue'
import treeData from './moc/jsMind-MRYA-01.json'
import { Button } from 'primevue'

const tree = reactive(treeData)

const toggleIcon = ref('pi pi-check')

const toggleBranch = (node) => {
  node.expanded = !node.expanded
  if (node.expanded) {
    toggleIcon.value = 'pi pi-check'
  } else {
    toggleIcon.value = 'pi pi-times'
  }
}

const meta2html = () => {
  if (tree.meta !== '') {
    return `<p>${tree.meta.name} - ${tree.meta.author} - ${tree.meta.version }<p>`
  } else {
    return `<p>Meta not set</p>`
  }
}
</script>

<template>
  <div class="container mx-auto bg-slate-700 px-4 py-2">
    <h1 class="text-2xl">Mind To Slide</h1>
    <p v-html="meta2html()"></p>
    <div v-if="tree.data !== ''" class="">
      <div class="flex flex-row">
        <div class="">
          <Button
            v-if="tree.data.children !== ''"
            @click="toggleBranch(tree.data)"
            v-bind:icon=toggleIcon
            rounded
            variant="outlined"
            size="small"
            aria-label="Filter"
          />
        </div>
        <div class="">
          {{ tree.data.topic }}
        </div>
      </div>

      <ol v-show="tree.data.expanded" class="">
        <li v-for="(item, ndx) in tree.data.children" :key="ndx" class="">
          {{ item.topic }}
          <ul v-if="item.children !== ''">
            <li v-for="(child, ndx) in item.children" :key="ndx" class="">
              {{ child.topic }}
            </li>
          </ul>
        </li>
      </ol>
    </div>
    <p v-else>Data not set</p>
  </div>
</template>

<style scoped></style>
