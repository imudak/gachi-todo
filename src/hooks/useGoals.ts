import { useState, useEffect, useCallback } from 'react'
import type { Goal } from '../types'
import { goalDB } from '../db'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const all = await goalDB.getAll()
      setGoals(
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

  const addGoal = useCallback(async (title: string): Promise<Goal> => {
    const goal: Goal = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
    }
    await goalDB.put(goal)
    setGoals((prev) => [goal, ...prev])
    return goal
  }, [])

  const deleteGoal = useCallback(async (id: string): Promise<void> => {
    await goalDB.delete(id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }, [])

  return { goals, loading, addGoal, deleteGoal }
}
