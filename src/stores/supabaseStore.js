import { reactive } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

export const useSupabaseStore = defineStore('supabase', () => {
  const client = reactive(
    createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
  )
  return { client }
})
