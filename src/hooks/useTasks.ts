import { useState, useEffect, useCallback } from 'react'
import type { Task } from '../types'
import { taskDB } from '../db'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const all = await taskDB.getAll()
      setTasks(
        all.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const addTask = useCallback(
    async (
      data: Omit<Task, 'id' | 'completed' | 'createdAt'>,
    ): Promise<Task> => {
      const task: Task = {
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
        ...data,
      }
      await taskDB.put(task)
      setTasks((prev) => [task, ...prev])
      return task
    },
    [],
  )

  const completeTask = useCallback(async (id: string): Promise<void> => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id)
      if (!task) return prev
      const updated: Task = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
      }
      void taskDB.put(updated)
      return prev.map((t) => (t.id === id ? updated : t))
    })
  }, [])

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    await taskDB.delete(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTodayTask = useCallback((): Task | null => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.find((t) => !t.completed && t.scheduledDate === today) ?? null
  }, [tasks])

  return { tasks, loading, addTask, completeTask, deleteTask, getTodayTask }
}
