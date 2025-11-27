<template>
  <div>
    <Menubar :model="menuItems" />
  </div>
</template>

<script setup>
import Menubar from 'primevue/menubar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const menuItems = ref([
  {
    label: 'В начало', icon: 'pi pi-home', command: () => {
      router.push('/');
    }
  },
  {
    label: 'Вид', icon: 'pi pi-eye', items: [
      {
        label: 'Дерево', icon: 'pi pi-list', command: () => {
          router.push('/tree');
        }
      },
    ]
  },
  {
    label: 'О нас', icon: 'pi pi-users', command: () => {
      router.push('/about');
    }
  }
]);
</script>
