import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import router from '@/router'
import PrimeVue from 'primevue/config'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it.skip('mounts renders properly', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Mind To Slide')
  })

  it.skip('routes to home page', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router, PrimeVue] } })
    expect(wrapper.text()).toContain('Mind To Slide')
  })

  it.skip('routes to about page', async () => {
    router.push('/about')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router, PrimeVue] } })
    expect(wrapper.text()).toContain('About')
  })
})
