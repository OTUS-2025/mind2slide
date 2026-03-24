import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../LoginPage.vue'
// import HomePage from '../HomePage.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import PrimeVue from 'primevue/config'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

/**
 * Создаёт роутер с минимальными маршрутами,
 * достаточными для тестирования LoginPage.
 */
function buildRouter(query = {}) {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/login', name: 'login', component: LoginPage },
    ],
  })
}

/**
 * Монтирует LoginPage с подготовленными плагинами.
 *
 * @param {object} options
 * @param {object} options.query           - query-параметры текущего маршрута
 * @param {object} options.storeOverrides  - начальное состояние / мок-методы Pinia
 */
async function mountLoginPage({ query = {}, storeOverrides = {} } = {}) {

  const router = buildRouter()

  const pinia = createTestingPinia({
    createSpy: vi.fn,
    initialState: {
      userStore: { loginError: undefined, ...storeOverrides },
    },
  })
  setActivePinia(pinia)

  const wrapper = mount(LoginPage, {
    global: {
      plugins: [
        PrimeVue,
        pinia,
        router,
      ],
    },
  })

  await router.push({ path: '/login', query })
  await router.isReady()

  await flushPromises()
  return { wrapper, router }
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('LoginPage.vue', () => {
  describe('Рендеринг страницы', () => {
    it('отображает заголовок «Вход»', async () => {
      const { wrapper } = await mountLoginPage()
      expect(wrapper.find('h2').text()).toBe('Вход')
    })

    it('отображает поле email', async () => {
      const { wrapper } = await mountLoginPage()
      expect(wrapper.find('#email').exists()).toBe(true)
    })

    it('отображает поле password', async () => {
      const { wrapper } = await mountLoginPage()
      expect(wrapper.find('#password').exists()).toBe(true)
    })

    it('отображает кнопки «Войти» и «Вернуться»', async () => {
      const { wrapper } = await mountLoginPage()
      const buttons = wrapper.findAll('button')
      const labels = buttons.map(b => b.text())
      expect(labels).toContain('Войти')
      expect(labels).toContain('Вернуться')
    })
  })

  describe('Баннер «необходима авторизация»', () => {
    it('НЕ показывает баннер без query-параметра needAuth', async () => {
      const { wrapper } = await mountLoginPage()
      // Компонент использует v-if="needAuth", проверяем отсутствие
      expect(wrapper.text()).not.toContain('необходимо авторизоваться')
    })

    it('показывает баннер при needAuth=true и указывает destinationTitle', async () => {
      const { wrapper } = await mountLoginPage({
        query: { needAuth: 'true', destinationTitle: 'Профиль' },
      })
      const text = wrapper.text()
      expect(text).toContain('необходимо авторизоваться')
      expect(text).toContain('Профиль')
    })
  })

  describe('Отображение ошибки из userStore', () => {
    it('показывает сообщение loginError, если оно задано в сторе', async () => {
      const { wrapper } = await mountLoginPage({
        storeOverrides: { loginError: 'Неверный логин или пароль' },
      })
      expect(wrapper.text()).toContain('Неверный логин или пароль')
    })

    it('не показывает блок ошибки, если loginError === ""', async () => {
      const { wrapper } = await mountLoginPage({
        storeOverrides: { loginError: "" },
      })
      expect(wrapper.text()).not.toContain('Неверный')
    })
  })

    describe('loginSubmit — бизнес-логика', () => {
    it('НЕ вызывает user.login(), если e.valid === false', async () => {
      const { wrapper } = await mountLoginPage()
      const store = useUserStore()

      wrapper.vm.loginSubmit({ valid: false, values: {} })
      await flushPromises()

      expect(store.login).not.toHaveBeenCalled()
    })

    it('вызывает user.login() с email и паролем при valid === true', async () => {
      const { wrapper } = await mountLoginPage()
      const store = useUserStore()
      store.login.mockReturnValue(true) // успешный вход

      wrapper.vm.loginSubmit({
        valid: true,
        values: { email: 'user@test.com', password: 'Secret123' },
      })
      await flushPromises()

      expect(store.login).toHaveBeenCalledWith('user@test.com', 'Secret123')
    })

    it('выполняет редирект на «home» при успешном login()', async () => {
      const { wrapper, router } = await mountLoginPage()
      const store = useUserStore()
      store.login.mockReturnValue(true)

      wrapper.vm.loginSubmit({
        valid: true,
        values: { email: 'user@test.com', password: 'Secret123' },
      })
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('home')
    })

    it('НЕ делает редирект, если login() вернул false', async () => {
      const { wrapper, router } = await mountLoginPage()
      const store = useUserStore()
      store.login.mockReturnValue(false)

      wrapper.vm.loginSubmit({
        valid: true,
        values: { email: 'wrong@test.com', password: 'badpass' },
      })
      await flushPromises()

      // Остаёмся на /login
      expect(router.currentRoute.value.name).toBe('login')
    })
  })

    describe('loginCancel — кнопка «Вернуться»', () => {
    it('перенаправляет на «home» при нажатии кнопки «Вернуться»', async () => {
      const { wrapper, router } = await mountLoginPage()

      const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Вернуться')
      await cancelBtn.trigger('click')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('home')
    })
  })
})
