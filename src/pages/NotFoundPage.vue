<template>
  <div class="h-80 w-full flex flex-col items-center justify-center">
    <h2 class="text-2xl mb-3">У нас такого нет!</h2>
    <RouterLink to="/" class=" cursor-pointer">На главную</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
