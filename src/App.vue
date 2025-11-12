<script setup>
import { reactive } from 'vue'
import treeData from './moc/jsMind-MRYA-01.json'
import { Button } from 'primevue'
const tree = reactive(treeData)
const toggleBranch = (node) => {
  node.expanded = !node.expanded
}
</script>

<template>
  <div class="container mx-auto">
    <h1>Mind To Slide</h1>
    <Button label="Take it!" icon="pi pi-user" variant="outlined" raised />
    <p v-if="tree.meta !== ''">
      {{ tree.meta.name }} - {{ tree.meta.author }} {{ tree.meta.version }}
    </p>
    <p v-else>Meta not set</p>
    <div v-if="tree.data !== ''" class="">
      <div class="grid grid-cols-4 gap-4">
        <div class="">
          <Button
            v-if="tree.data.children !== ''"
            @click="toggleBranch(tree.data)"
            icon="pi pi-check"
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
