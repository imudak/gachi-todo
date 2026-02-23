import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// REQ-002-01: タスク登録
// REQ-002-01 Unwanted: タイトル未入力時のエラー

vi.mock('../hooks/useTasks')
vi.mock('../hooks/useGoals', () => ({
  useGoals: () => ({ goals: [], loading: false, addGoal: vi.fn(), deleteGoal: vi.fn() }),
}))

import { useTasks } from '../hooks/useTasks'
import { Tasks } from './Tasks'

const mockUseTasks = vi.mocked(useTasks)

const renderTasks = () =>
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>,
  )

describe('Tasks画面', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null),
      addTask: vi.fn().mockResolvedValue({ id: 'new-1', title: 'テスト', completed: false, createdAt: new Date().toISOString() }),
      deleteTask: vi.fn().mockResolvedValue(undefined),
    })
  })

  it('タスク一覧タイトルが表示される', () => {
    renderTasks()
    expect(screen.getByRole('heading', { name: 'タスク一覧' })).toBeInTheDocument()
  })

  it('追加ボタンをクリックするとフォームが開く', async () => {
    const user = userEvent.setup()
    renderTasks()
    await user.click(screen.getByRole('button', { name: /追加/ }))
    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument()
  })

  it('タイトルなしで保存しようとするとエラーが出る (REQ-002-01 Unwanted)', async () => {
    const user = userEvent.setup()
    renderTasks()
    await user.click(screen.getByRole('button', { name: /追加/ }))
    await user.click(screen.getByRole('button', { name: '追加する' }))
    expect(screen.getByRole('alert')).toHaveTextContent('タイトルを入力してください')
  })

  it('タイトル入力後に保存するとaddTaskが呼ばれる (REQ-002-01)', async () => {
    const mockAdd = vi.fn().mockResolvedValue({ id: '1', title: '新しいタスク', completed: false, createdAt: new Date().toISOString() })
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null),
      addTask: mockAdd,
      deleteTask: vi.fn().mockResolvedValue(undefined),
    })

    const user = userEvent.setup()
    renderTasks()
    await user.click(screen.getByRole('button', { name: /追加/ }))
    await user.type(screen.getByLabelText(/タイトル/), '新しいタスク')
    await user.click(screen.getByRole('button', { name: '追加する' }))
    expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({ title: '新しいタスク' }))
  })
})
