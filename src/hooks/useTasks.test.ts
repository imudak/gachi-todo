import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// taskDB をモック（vi.mock はホイストされるのでimportより前に宣言不要）
vi.mock('../db', () => ({
  taskDB: {
    getAll: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  goalDB: {
    getAll: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import { useTasks } from './useTasks'
import { taskDB } from '../db'

const mockTaskDB = taskDB as {
  getAll: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

// REQ-001-01: 今日のタスク表示
// REQ-002-01: タスク登録
// REQ-002-02: タスク完了
// REQ-002-03: タスク削除
describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTaskDB.getAll.mockResolvedValue([])
    mockTaskDB.put.mockResolvedValue(undefined)
    mockTaskDB.delete.mockResolvedValue(undefined)
  })

  it('初期状態でloadingがtrue (REQ-001-02)', async () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.loading).toBe(true)
  })

  it('データ読み込み後にloading=false', async () => {
    const { result } = renderHook(() => useTasks())
    await act(async () => {})
    expect(result.current.loading).toBe(false)
  })

  it('addTaskでタスクが追加される (REQ-002-01)', async () => {
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    await act(async () => {
      await result.current.addTask({ title: 'テストタスク' })
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('テストタスク')
    expect(result.current.tasks[0].completed).toBe(false)
  })

  it('addTaskは生成したタスクを返す', async () => {
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    let returnedTask: Awaited<ReturnType<typeof result.current.addTask>> | undefined
    await act(async () => {
      returnedTask = await result.current.addTask({ title: '返却テスト' })
    })

    expect(returnedTask).toBeDefined()
    expect(returnedTask?.title).toBe('返却テスト')
    expect(returnedTask?.id).toBeTruthy()
  })

  it('completeTaskでタスクが完了状態になる (REQ-002-02)', async () => {
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    let taskId = ''
    await act(async () => {
      const task = await result.current.addTask({ title: '完了テスト' })
      taskId = task.id
    })

    await act(async () => {
      await result.current.completeTask(taskId)
    })

    const task = result.current.tasks.find((t) => t.id === taskId)
    expect(task?.completed).toBe(true)
    expect(task?.completedAt).toBeTruthy()
  })

  it('deleteTaskでタスクが削除される (REQ-002-03)', async () => {
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    let taskId = ''
    await act(async () => {
      const task = await result.current.addTask({ title: '削除テスト' })
      taskId = task.id
    })

    await act(async () => {
      await result.current.deleteTask(taskId)
    })

    expect(result.current.tasks.find((t) => t.id === taskId)).toBeUndefined()
  })

  it('getTodayTaskで今日予定のタスクを返す (REQ-001-01)', async () => {
    const today = new Date().toISOString().split('T')[0]
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    await act(async () => {
      await result.current.addTask({ title: '今日のタスク', scheduledDate: today })
      await result.current.addTask({ title: '別日のタスク', scheduledDate: '2020-01-01' })
    })

    const todayTask = result.current.getTodayTask()
    expect(todayTask?.title).toBe('今日のタスク')
  })

  it('完了済みタスクはgetTodayTaskに含まれない', async () => {
    const today = new Date().toISOString().split('T')[0]
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    let taskId = ''
    await act(async () => {
      const task = await result.current.addTask({ title: '完了済み', scheduledDate: today })
      taskId = task.id
    })
    await act(async () => {
      await result.current.completeTask(taskId)
    })

    expect(result.current.getTodayTask()).toBeNull()
  })

  it('今日のタスクがない場合はnullを返す', async () => {
    const { result } = renderHook(() => useTasks())
    await act(async () => {})

    expect(result.current.getTodayTask()).toBeNull()
  })
})
