/**
 * Хранилище данных о пользователе(авторе).
 * - данные пользователя (user, session) и получение его профиля (getProfile)
 * - функции входа(login) и выхода(logout) пользователя
 * - признак авторизованного пользователя (isAuthorised)
 */
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useSupabaseStore } from './supabaseStore'

export const useUserStore = defineStore('user', () => {
  // const { client } = storeToRefs(useSupabaseStore())
  const client = useSupabaseStore().client
  let user = ref()
  let session = ref()
  let loginError = ref()

  async function logout() {
    let { error } = await client.auth.signOut()
    console.log('🚀 ~ logout ~ error:', error)
    if (!error) {
      user.value = undefined
      session.value = undefined
      return true
    } else {
      return false
    }
  }

  async function login(email, password) {
    let { data, error } = await client.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (!error) {
      user.value = data.user
      session.value = data.session
      return true
    } else {
      loginError.value = error
      return false
    }
  }

  const isAuthorised = computed(() => {
    return user.value !== undefined
  })

  const getProfile = async () => {
    const { data, error } = await client.auth.getUser()
    if (!error) {
      return data
    } else {
      return error
    }
  }
  return { logout, login, user, session, loginError, isAuthorised, getProfile }
})
