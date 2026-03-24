<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { parseMarkdown } from '@/lib/markdownParser';

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  }
});

const renderedContent = ref('');

const loadAndRenderContent = async () => {
  if (props.source) {
    // Загружаем содержимое из внешнего источника
    try {
      const response = await fetch(props.source);
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${response.statusText}`);
      }
      const markdown = await response.text();
      renderedContent.value = parseMarkdown(markdown);
    } catch (error) {
      console.error('Error loading markdown file:', error);
      renderedContent.value = '<p>Ошибка при загрузке файла</p>';
    }
  } else if (props.content) {
    // Используем переданное содержимое
    renderedContent.value = parseMarkdown(props.content);
  }
};

onMounted(() => {
  loadAndRenderContent();
});

watch(() => [props.content, props.source], () => {
  loadAndRenderContent();
});
</script>

<style scoped>
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 1.2em;
  margin-bottom: 0.8em;
}

.markdown-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.6;
}

.markdown-content :deep(ul) {
  margin-left: 20px;
  margin-bottom: 1em;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>