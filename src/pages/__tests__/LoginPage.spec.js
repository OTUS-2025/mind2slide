import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginPage from '../LoginPage.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import router from '@/router/index'
import PrimeVue from 'primevue/config'
import { nextTick } from 'vue'

describe('LoginPage', () => {
  let wrapper
  let userStore
  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
    wrapper = mount(LoginPage, {
      global: {
        plugins: [router, PrimeVue],
      },
    })
  })

  it('Page mount properly', async () => {
    router.push({ name: 'login' })
    await router.isReady()
    expect(wrapper.text()).toContain('Вход')
    expect(wrapper.text()).toContain('e-mail')
    expect(wrapper.text()).toContain('пароль')
  })
  it('correct login', async () => {
    wrapper.find('input[name="email"]').setValue('shumakovmv@gmail.com')
    wrapper.find('input[name="password"]').setValue('7cJi?#9tvV*)*.')
    await wrapper.find('button[type="submit"]').trigger('click')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('home')
  })
  it('login without password', async () => {
    wrapper.find('input[name="email"]').setValue('shumakovmv@gmail.com')
    await wrapper.find('button[type="submit"]').trigger('click')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('home')
  })
  it('incorrect e-mail', async () => {
    // console.log('🚀 ~ wrapper:', wrapper.html())
    const input4email = wrapper.find('input[name="email"]')
    const inputBox = wrapper.find('div[data-test-id="email__inputbox"]')
    console.log('🚀 ~ inputBox:', inputBox.html())
    await input4email.trigger('focus')
    input4email.setValue('shumakovmv@gmailcom')
    await input4email.trigger('blur')
    // await wrapper.find('button[type="submit"]').trigger('click')
    await nextTick()
    console.log('🚀 ~ inputBox:', inputBox.text())
    // console.log('🚀 ~ wrapper:', wrapper.html())
    const errorBox = wrapper.find('div[data-test-id="email__error-msg"]')
    // console.log('🚀 ~ errorBox:', errorBox)
    expect(wrapper.text()).toContain('e-mail не соответствует формату')
  })
})
