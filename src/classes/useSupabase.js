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
    // const { data } = await this.client.from('forest').select()
    const answer = await this.client
      .from('forest')
      .select('id, tree_root_branch!inner (root_branch, branches!inner ( topic ))')
    let list = []
    if (!answer.error) {
      answer.data.forEach((one) => {
        list.push({ name: one.tree_root_branch[0].branches.topic, code: one.id })
      })
    }
    return list
  }

  async getTreeMeta(id) {
    const answer = await this.client
      .from('forest')
      .select('meta_name, meta_author, meta_version')
      .eq('id', id)
    if (answer.error === null) {
      return {
        name: answer.data[0].meta_name,
        author: answer.data[0].meta_author,
        version: answer.data[0].meta_version,
      }
    } else {
      return false
    }
  }

  async getTreeTopic(id) {
    const answer = await this.client.from('forest').select('topic').eq('id', id)
    if (answer.error === null) {
      return answer.data[0].topic
    } else {
      return false
    }
  }

  async getBranch4Parent(parentId) {
    const { data, error } = await this.client
      .from('branch_with_nchildren')
      .select('id, topic, thesis, expanded, nchildren')
      .eq('parent_branch', parentId)
    if (error === null) {
      return data
    } else {
      return []
    }
  }

  async setNewTree(newTreeData) {
    const { error } = await this.client.from('forest').insert({
      topic: newTreeData.topic,
      meta_name: newTreeData.shortName,
      meta_author: newTreeData.author,
      meta_version: newTreeData.version,
      format: newTreeData.format,
      thesis: newTreeData.thesis,
      expanded: newTreeData.expanded,
      color: newTreeData.color,
    })
    console.log('🚀 ~ useSupabase ~ setNewTree ~ error:', error)
  }

  async setNewBrach(newBranchData) {
    const { error } = await this.client.from('branches').insert({
      topic: newBranchData.topic,
      thesis: newBranchData.thesis,
      color: newBranchData.color,
      expanded: newBranchData.expanded,
      parentBranch: newBranchData.parentBranch,
    })
    console.log('🚀 ~ useSupabase ~ setNewBrach ~ error:', error)
  }
}
export default new useSupabase()
