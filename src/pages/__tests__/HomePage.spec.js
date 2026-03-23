import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useWorkflowStore } from '@/stores/workflowStore'
import { useUserStore } from '@/stores/userStore'

import HomePage from '../HomePage.vue'

describe('HomePage', () => {
  let wrapper
  beforeEach(() => {
    const pinia4tests = createTestingPinia({
      createSpy: (fn) => fn,
      stubActions: false,
    })
    // const workflowStore = useWorkflowStore()
    wrapper = mount(HomePage, {
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          $route: {},
          $router: {},
        },
      },
    })
  })

  it('home mount properly', async () => {
    const userStore = useUserStore()
    userStore.login('shumakovmv@gmail.com', '7cJi?#9tvV*)*.')

    expect(wrapper.text()).toContain('Начать с')
  })
})
