/**
 * Хранилище для фиксации состояния рабочего процесса
 * (создание, редактирование, удаление, сохранение, загрузка)
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkflowStore = defineStore('workflow', () => {
  const workstateActive = ref()
  const nexusActive = ref()
  const nodeActive = ref()

  return { nexusActive, nodeActive, workstateActive }
})
