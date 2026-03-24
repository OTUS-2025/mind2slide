<template>
  <Button icon="pi pi-file" :label="getLabel()" size="small" :aria-label="props.label" :class="props.cssClasses"
    @click="showAddTreeDlg = !showAddTreeDlg" />
  <addTreeDlg :show-dlg="showAddTreeDlg" v-on:close-dlg="showAddTreeDlg = false" />
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import addTreeDlg from './dialogs/addTreeDlg.vue';

const props = defineProps(
  {
    label: { type: String, default: "" },
    labelIsShow: { type: Boolean, default: true },
    cssClasses: { type: String, default: '' }
  }
)

const getLabel = () => {
  return props.labelIsShow ? props.label : "";
}

const showAddTreeDlg = ref(false);
</script>
