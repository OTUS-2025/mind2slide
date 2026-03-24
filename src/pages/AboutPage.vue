<template>
  <div class="about-page">
    <h2>About</h2>
    <MarkdownRenderer source="/README.md" />
  </div>
</template>

<script setup>
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
</script>

<style scoped>
.about-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
