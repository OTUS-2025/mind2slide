<template>
  <div class="container mx-auto">
    <h1 class="text-2xl py-4 ">Mind To Slide</h1>
    <MenubarMenu />
    <RouterView />
  </div>
</template>

<script setup>
import MenubarMenu from './components/menu/MenubarMenu.vue';
</script>
