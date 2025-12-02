import { useSupabaseStore } from '@/stores/supabaseStore'
class useSupabase {
  supabaseStore = useSupabaseStore()
  client = undefined

  constructor() {
    this.client = this.supabaseStore.client
  }

  // Получение списка деревьев
  async getTrees() {
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
    const answer = await this.client.from('branches').select('topic').eq('parent_branch', id)
    if (answer.error === null) {
      return answer.data[0].topic
    } else {
      return false
    }
  }

  async getId4RootBranch(rootId) {
    let result = false
    const { data, error } = await this.client
      .from('branches')
      .select('id')
      .eq('parent_branch', rootId)
    if (!error) {
      result = data[0].id
    }
    return result
  }

  async getBranch4Parent(parentId, isRoot = false) {
    let id = parentId
    console.log('🚀 ~ useSupabase ~ getBranch4Parent ~ id:', id)
    if (isRoot) {
      const answer = await this.getId4RootBranch(parentId)
      if (answer) {
        id = answer
      }
    }
    const { data, error } = await this.client
      .from('branch_with_nchildren')
      .select('id, topic, thesis, expanded, nchildren')
      .eq('parent_branch', id)
    if (!error) {
      return data
    } else {
      return []
    }
  }

  async setNewTree(newTreeData) {
    console.log('🚀 ~ useSupabase ~ setNewTree ~ newTreeData:', newTreeData)
    let result = false
    const forestAnswer = await this.client
      .from('forest')
      .insert({
        meta_name: newTreeData.shortName,
        meta_author: newTreeData.author,
        meta_version: newTreeData.version,
        format: newTreeData.format,
        expanded: newTreeData.expanded,
        color: newTreeData.color,
      })
      .select()
    if (!forestAnswer.error) {
      const branchesAnswer = await this.client
        .from('branches')
        .insert({
          parent_branch: forestAnswer.data[0].id,
          topic: newTreeData.topic,
          thesis: newTreeData.thesis,
          expanded: newTreeData.expanded,
          color: newTreeData.color,
        })
        .select()
      if (!branchesAnswer.error) {
        const rootAnswer = await this.client.from('tree_root_branch').insert({
          tree_id: forestAnswer.data[0].id,
          root_branch: branchesAnswer.data[0].id,
        })
        if (!rootAnswer.error) {
          result = true
        }
      }
    }
    return result
  }

  async setNewBrach(newBranchData, isRoot = false) {
    let result = false
    let id = newBranchData.parentBranch
    if (isRoot) {
      let answer = await this.getId4RootBranch(id)
      if (answer) {
        id = answer
      }
    }
    const { error } = await this.client.from('branches').insert({
      topic: newBranchData.topic,
      thesis: newBranchData.thesis,
      color: newBranchData.color,
      expanded: newBranchData.expanded,
      parent_branch: id,
    })
    if (!error) {
      result = true
    }
    return result
  }
}
export default new useSupabase()
