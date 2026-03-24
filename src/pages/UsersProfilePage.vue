/**
Страница профиля автора(пользователя)
Не проработана в деталях и пока выполняет функции заглушки
*/
<template>
  <h2>User`s Profile Page</h2>
  <div>
    <pre>
      {{ userProfile }}
    </pre>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
const user = useUserStore()
let userProfile = ref()

onMounted(async () => {
  userProfile.value = await user.getProfile()
});
</script>
