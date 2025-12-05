import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: { requiresAuth: false },
      component: () => import('../pages/HomePage.vue'),
      name: 'home',
    },
    {
      path: '/views',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'mindmap',
          name: 'mindmap',
          meta: { requiresAuth: true, pageTitle: 'Вид -> Ментальная карта' },
          component: () => import('../pages/MapPage.vue'),
        },
        {
          path: 'tree',
          name: 'tree',
          meta: { requiresAuth: true, pageTitle: 'Вид -> Дерево' },
          component: () => import('../pages/TreePage.vue'),
        },
        {
          path: 'slides',
          name: 'slides',
          meta: { requiresAuth: true, pageTitle: 'Вид -> Слайды' },
          component: () => import('../pages/SlidesPage.vue'),
        },
      ],
    },
    {
      path: '/user',
      meta: { requiresAuth: false },
      children: [
        {
          path: 'login',
          name: 'login',
          meta: { requiresAuth: false },
          component: () => import('../pages/LoginPage.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          meta: { requiresAuth: true, pageTitle: 'Пользователь -> Профиль' },
          component: () => import('../pages/UsersProfilePage.vue'),
        },
      ],
    },
    {
      path: '/about',
      meta: { requiresAuth: false },
      component: () => import('../pages/AboutPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach((to) => {
  // Перенаправление на страницу логина, если пользователь пытается заходить на страницу, требующую авторизацию, но не авторизован
  const user = useUserStore()
  if (to.meta.requiresAuth && !user.isAuthorised) {
    return { name: 'login', query: { needAuth: true, destinationTitle: to.meta.pageTitle } }
  }
})

export default router
