import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSupabaseStore } from '@/stores/supabaseStore'

describe('Supabase Store', () => {
  let supabaseStore = undefined
  beforeEach(() => {
    setActivePinia(createPinia())
    supabaseStore = useSupabaseStore()
  })
  it('client', async () => {
    expect(supabaseStore.client).toBeDefined()
  })
})
