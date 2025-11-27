import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../pages/HomePage.vue')
const TreePage = () => import('../pages/TreePage.vue')
const AboutPage = () => import('../pages/AboutPage.vue')
const NotFound = () => import('../pages/NotFoundPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/tree', component: TreePage },
    { path: '/about', component: AboutPage },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

export default router
