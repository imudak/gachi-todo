import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { Task } from '../types'

// REQ-001-01: 起動時の今日のタスク表示
// REQ-001-02: ローディング体験
// REQ-002-02: タスクの完了
// REQ-004-01: 完了リアクション

vi.mock('../hooks/useTasks')
vi.mock('../hooks/useGoals', () => ({
  useGoals: () => ({ goals: [], loading: false, addGoal: vi.fn(), deleteGoal: vi.fn() }),
}))

import { useTasks } from '../hooks/useTasks'
import { Home } from './Home'

const mockUseTasks = vi.mocked(useTasks)

const mockTask: Task = {
  id: 'task-1',
  title: '英語を30分勉強する',
  completed: false,
  scheduledDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
}

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )

describe('Home画面', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('がちTODOタイトルが表示される', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })
    renderHome()
    expect(screen.getByRole('heading', { name: 'がちTODO' })).toBeInTheDocument()
  })

  it('ローディング中にスケルトンUIが表示される (REQ-001-02)', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: true,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })
    renderHome()
    expect(screen.getByRole('status', { name: '読み込み中' })).toBeInTheDocument()
  })

  it('今日のタスクがない場合に追加促進UIを表示する (REQ-001-01 State-driven)', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })
    renderHome()
    expect(screen.getByText('タスクを追加する')).toBeInTheDocument()
  })

  it('今日のタスクがある場合にタイトルと完了ボタンを表示する (REQ-001-01)', () => {
    mockUseTasks.mockReturnValue({
      tasks: [mockTask],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(mockTask),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })
    renderHome()
    expect(screen.getByText('英語を30分勉強する')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /完了/ })).toBeInTheDocument()
  })

  it('完了ボタン押下でcompleteTaskが呼ばれる (REQ-002-02)', async () => {
    const mockComplete = vi.fn().mockResolvedValue(undefined)
    mockUseTasks.mockReturnValue({
      tasks: [mockTask],
      loading: false,
      completeTask: mockComplete,
      getTodayTask: vi.fn().mockReturnValue(mockTask),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })

    const user = userEvent.setup()
    renderHome()
    await user.click(screen.getByRole('button', { name: /完了/ }))
    expect(mockComplete).toHaveBeenCalledWith('task-1')
  })

  it('全タスク完了時に完了メッセージを表示する (REQ-002-02 State-driven)', () => {
    const today = new Date().toISOString().split('T')[0]
    const completedTask: Task = { ...mockTask, completed: true, scheduledDate: today }
    mockUseTasks.mockReturnValue({
      tasks: [completedTask],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null), // 未完了タスクなし
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })
    renderHome()
    expect(screen.getByText('今日のタスク完了！')).toBeInTheDocument()
  })

  it('キャラクターが常時表示される (REQ-004-02)', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      completeTask: vi.fn(),
      getTodayTask: vi.fn().mockReturnValue(null),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
    })
    renderHome()
    expect(screen.getByTestId('character')).toBeInTheDocument()
  })
})
