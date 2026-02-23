import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Task, Goal } from '../types'

interface GachiTodoDB extends DBSchema {
  tasks: {
    key: string
    value: Task
  }
  goals: {
    key: string
    value: Goal
  }
}

let dbInstance: IDBPDatabase<GachiTodoDB> | null = null

export async function getDB(): Promise<IDBPDatabase<GachiTodoDB>> {
  if (!dbInstance) {
    dbInstance = await openDB<GachiTodoDB>('gachi-todo', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('goals')) {
          db.createObjectStore('goals', { keyPath: 'id' })
        }
      },
    })
  }
  return dbInstance
}

export const taskDB = {
  async getAll(): Promise<Task[]> {
    const db = await getDB()
    return db.getAll('tasks')
  },
  async put(task: Task): Promise<void> {
    const db = await getDB()
    await db.put('tasks', task)
  },
  async delete(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('tasks', id)
  },
}

export const goalDB = {
  async getAll(): Promise<Goal[]> {
    const db = await getDB()
    return db.getAll('goals')
  },
  async put(goal: Goal): Promise<void> {
    const db = await getDB()
    await db.put('goals', goal)
  },
  async delete(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('goals', id)
  },
}

/** テスト用にDBインスタンスをリセットする */
export function resetDBInstance(): void {
  dbInstance = null
}
