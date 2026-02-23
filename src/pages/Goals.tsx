import React, { useState } from 'react'
import { useGoals } from '../hooks/useGoals'
import { useTasks } from '../hooks/useTasks'

export const Goals: React.FC = () => {
  const { goals, loading, addGoal, deleteGoal } = useGoals()
  const { tasks } = useTasks()
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('タイトルを入力してください')
      return
    }
    setTitleError('')
    await addGoal(title.trim())
    setTitle('')
    setShowForm(false)
  }

  const handleDelete = async (id: string, goalTitle: string) => {
    if (window.confirm(`「${goalTitle}」を削除しますか？`)) {
      await deleteGoal(id)
    }
  }

  const getTaskCounts = (goalId: string) => {
    const goalTasks = tasks.filter((t) => t.goalId === goalId)
    return { total: goalTasks.length, done: goalTasks.filter((t) => t.completed).length }
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">目標一覧</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          aria-expanded={showForm}
          aria-controls="goal-form"
        >
          {showForm ? 'キャンセル' : '＋ 追加'}
        </button>
      </header>

      {showForm && (
        <form
          id="goal-form"
          onSubmit={(e) => void handleAdd(e)}
          className="bg-white rounded-2xl p-5 shadow-sm mb-6"
          noValidate
        >
          <div className="mb-4">
            <label
              htmlFor="goal-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              目標のタイトル <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="例: 英語を話せるようになる"
              aria-required="true"
              aria-describedby={titleError ? 'goal-error' : undefined}
            />
            {titleError && (
              <p id="goal-error" className="text-red-500 text-xs mt-1" role="alert">
                {titleError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            追加する
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-400" aria-live="polite">
          読み込み中...
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-1">目標がまだありません</p>
          <p className="text-gray-300 text-sm">目標を追加してタスクと紐づけましょう</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {goals.map((goal) => {
            const { total, done } = getTaskCounts(goal.id)
            const progress = total > 0 ? (done / total) * 100 : 0
            return (
              <li key={goal.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">🎯 {goal.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {total === 0
                        ? 'タスクなし'
                        : `${done} / ${total} タスク完了`}
                    </p>
                    {total > 0 && (
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                          role="progressbar"
                          aria-valuenow={done}
                          aria-valuemin={0}
                          aria-valuemax={total}
                          aria-label={`進捗: ${done}/${total}`}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => void handleDelete(goal.id, goal.title)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    aria-label={`「${goal.title}」を削除する`}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
