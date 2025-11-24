import { createClient } from '@supabase/supabase-js'

class useSupabase {
  supabaseUrl = undefined
  supabasePublishableKey = undefined
  client = undefined

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    this.supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    this.client = createClient(this.supabaseUrl, this.supabasePublishableKey)
  }

  async getTrees() {
    const { data } = await this.client.from('forest').select()
    return data
  }

  async getTreeMeta(id) {
    const answer = await this.client
      .from('forest')
      .select('meta_name, meta_author, meta_version')
      .eq('id', id)
    if (answer.error === null) {
      return {name: answer.data[0].meta_name, author: answer.data[0].meta_author, version: answer.data[0].meta_version}
    } else {
      return false
    }
  }

  async getTreeTopic(id) {
    console.log("🚀 ~ useSupabase ~ treeMeta ~ id:", id)
    const answer = await this.client
      .from('forest')
      .select('topic')
      .eq('id', id)
    if (answer.error === null) {
      return answer.data[0].topic
    } else {
      return false
    }

  }

  async setNewTree(newTreeData) {
    const { error } = await this.client
      .from('forest')
      .insert(
        {
          topic: newTreeData.topic,
          meta_name: newTreeData.shortName,
          meta_author: newTreeData.author,
          meta_version: newTreeData.version,
          format: 'node_tree',
          thesis: '',
          expanded: true
        }
      )
    console.log("🚀 ~ useSupabase ~ setNewTree ~ error:", error)
  }
}export default new useSupabase
