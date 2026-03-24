import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { describe, it, expect, beforeEach } from 'vitest'

describe('User Store', () => {
  let userStore = undefined
  const userEMail = 'shumakovmv@gmail.com'
  const userPassword = '7cJi?#9tvV*)*.'
  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
  })
  it('login', async () => {
    await userStore.login(userEMail, userPassword)
    expect(userStore.user).toBeDefined()
    expect(userStore.session).toBeDefined()
    expect(userStore.isAuthorised).toBeTruthy()
    expect(userStore.loginError).toBeUndefined()
  })
  it('logout', async () => {
    await userStore.login(userEMail, userPassword)
    expect(userStore.user).toBeDefined()
    await userStore.logout()
    expect(userStore.user).toBeUndefined()
    expect(userStore.session).toBeUndefined()
    expect(userStore.isAuthorised).toBeFalsy()
    expect(userStore.loginError).toBeUndefined()
  })
  it('isAuthorised before login', async () => {
    if (userStore.user !== undefined) {
      await userStore.logout()
    }
    expect(userStore.isAuthorised).toBeFalsy()
  })
  it('isAuthorised after login', async () => {
    if (userStore.user === undefined) {
      await userStore.login(userEMail, userPassword)
    }
    expect(userStore.isAuthorised).toBeTruthy()
  })
})
