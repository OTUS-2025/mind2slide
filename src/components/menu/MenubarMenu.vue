/**
Компонент верхнего горизонтального меню.
Содержит:
- ссылки для перехода на страницы (страницы частично доступны без регистрации и полностью достпны после регистрации
автора)
- кнопку с действиями для автора (доступна после регистрации)
*/
<template>
  <div class="mb-4">
    <Menubar :model="menuItems">
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-if="!item.forAuthorised || user.isAuthorised" class="flex items-center" v-bind="props.action">
          <span :class="item.icon"></span>
          <span>{{ item.label }}</span>
          <i v-if="hasSubmenu"
            :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </a>
      </template>
      <template #end>
        <div v-if="user.isAuthorised" class="flex items-center gap-2">
          <SplitButton label="Автор" icon="pi pi-user" :model="authorsActions" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import Menubar from 'primevue/menubar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SplitButton from 'primevue/splitbutton';
import { useUserStore } from '@/stores/userStore';

const user = useUserStore()

const router = useRouter();

const menuItems = ref([
  {
    label: 'В начало', icon: 'pi pi-home', forAuthorised: false, command: () => {
      router.push('/');
    }
  },
  {
    label: 'Вид', icon: 'pi pi-eye', forAuthorised: true, items: [
      {
        label: 'Дерево', icon: 'pi pi-list', forAuthorised: true, command: () => {
          router.push('/views/tree');
        }
      },
      {
        label: 'Ментальная карта', icon: 'pi pi-sitemap', forAuthorised: true, command: () => {
          router.push('/views/mindmap');
        }
      },
      {
        label: 'Слайды', icon: 'pi pi-clone', forAuthorised: true, command: () => {
          router.push('/views/slides');
        }
      },
    ]
  },
  {
    label: 'О нас', icon: 'pi pi-users', forAuthorised: false, command: () => {
      router.push('/about');
    }
  }
]);

const authorsActions = ref([
  {
    label: 'Профиль', icon: 'pi pi-id-card', command: () => { router.push('/user/profile'); }
  },
  {
    label: 'Выйти', icon: 'pi pi-sign-out', command: async () => { await logout() }
  }
]);

const logout = async () => {
  await user.logout();
  router.push({ name: 'home' })
}

</script>
