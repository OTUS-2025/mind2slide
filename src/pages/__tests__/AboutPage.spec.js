import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutPage from '../AboutPage.vue'

describe('AboutPage', () => {
  it('mounts renders properly', async () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.text()).toContain('About')
  })
})
