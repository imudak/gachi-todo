import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { taskDB, goalDB, resetDBInstance } from './index'
import type { Task, Goal } from '../types'

// 各テスト前に新しいIDBFactoryを使ってDBを完全リセット
beforeEach(() => {
  // @ts-expect-error fake-indexeddb で global.indexedDB を上書き
  global.indexedDB = new IDBFactory()
  resetDBInstance()
})

// REQ-005-01: ローカルストレージへの保存
describe('taskDB', () => {

  it('タスクを保存・取得できる (REQ-002-01)', async () => {
    const task: Task = {
      id: 'test-1',
      title: 'テストタスク',
      completed: false,
      createdAt: new Date().toISOString(),
    }
    await taskDB.put(task)
    const all = await taskDB.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].title).toBe('テストタスク')
  })

  it('タスクを完了状態に更新できる (REQ-002-02)', async () => {
    const task: Task = {
      id: 'test-2',
      title: '更新テスト',
      completed: false,
      createdAt: new Date().toISOString(),
    }
    await taskDB.put(task)
    const updated: Task = { ...task, completed: true, completedAt: new Date().toISOString() }
    await taskDB.put(updated)
    const all = await taskDB.getAll()
    expect(all[0].completed).toBe(true)
  })

  it('タスクを削除できる (REQ-002-03)', async () => {
    const task: Task = {
      id: 'test-3',
      title: '削除テスト',
      completed: false,
      createdAt: new Date().toISOString(),
    }
    await taskDB.put(task)
    await taskDB.delete('test-3')
    const all = await taskDB.getAll()
    expect(all).toHaveLength(0)
  })

  it('複数タスクを保存できる', async () => {
    const tasks: Task[] = [
      { id: 'a', title: 'タスクA', completed: false, createdAt: new Date().toISOString() },
      { id: 'b', title: 'タスクB', completed: false, createdAt: new Date().toISOString() },
    ]
    for (const t of tasks) await taskDB.put(t)
    const all = await taskDB.getAll()
    expect(all).toHaveLength(2)
  })
})

// REQ-003-01: 目標の保存
describe('goalDB', () => {
  it('目標を保存・取得できる (REQ-003-01)', async () => {
    const goal: Goal = {
      id: 'goal-1',
      title: 'テスト目標',
      createdAt: new Date().toISOString(),
    }
    await goalDB.put(goal)
    const all = await goalDB.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].title).toBe('テスト目標')
  })

  it('目標を削除できる', async () => {
    const goal: Goal = {
      id: 'goal-2',
      title: '削除テスト目標',
      createdAt: new Date().toISOString(),
    }
    await goalDB.put(goal)
    await goalDB.delete('goal-2')
    const all = await goalDB.getAll()
    expect(all).toHaveLength(0)
  })
})

describe('DB isolation', () => {
  it('リセット後は空のDBになる', async () => {
    const all = await taskDB.getAll()
    expect(all).toHaveLength(0)
  })
})
