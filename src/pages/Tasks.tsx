import React, { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useGoals } from '../hooks/useGoals'

export const Tasks: React.FC = () => {
  const { tasks, loading, addTask, deleteTask, completeTask } = useTasks()
  const { goals } = useGoals()
  const [title, setTitle] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [goalId, setGoalId] = useState('')
  const [titleError, setTitleError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('タイトルを入力してください')
      return
    }
    setTitleError('')
    await addTask({
      title: title.trim(),
      scheduledDate: scheduledDate || undefined,
      goalId: goalId || undefined,
    })
    setTitle('')
    setScheduledDate('')
    setGoalId('')
    setShowForm(false)
  }

  const handleDelete = async (id: string, taskTitle: string) => {
    if (window.confirm(`「${taskTitle}」を削除しますか？`)) {
      await deleteTask(id)
    }
  }

  const pending = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <main className="max-w-lg mx-auto px-4 pt-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">タスク一覧</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          aria-expanded={showForm}
          aria-controls="task-form"
        >
          {showForm ? 'キャンセル' : '＋ 追加'}
        </button>
      </header>

      {showForm && (
        <form
          id="task-form"
          onSubmit={(e) => void handleAdd(e)}
          className="bg-white rounded-2xl p-5 shadow-sm mb-6"
          noValidate
        >
          <div className="mb-4">
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              タイトル <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="タスクのタイトル"
              aria-required="true"
              aria-describedby={titleError ? 'title-error' : undefined}
            />
            {titleError && (
              <p id="title-error" className="text-red-500 text-xs mt-1" role="alert">
                {titleError}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="task-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              実施予定日（任意）
            </label>
            <input
              id="task-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {goals.length > 0 && (
            <div className="mb-4">
              <label
                htmlFor="task-goal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                目標（任意）
              </label>
              <select
                id="task-goal"
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">目標を選択（任意）</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

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
      ) : (
        <>
          <section aria-label="未完了のタスク">
            {pending.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                未完了のタスクはありません
              </p>
            ) : (
              <ul className="space-y-3 mb-6">
                {pending.map((task) => {
                  const goal = task.goalId
                    ? goals.find((g) => g.id === task.goalId)
                    : null
                  return (
                    <li
                      key={task.id}
                      className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <button
                        onClick={() => void completeTask(task.id)}
                        className="mt-0.5 w-6 h-6 rounded-full border-2 border-gray-300 hover:border-indigo-500 flex-shrink-0 transition-colors"
                        aria-label={`「${task.title}」を完了にする`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium">{task.title}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {task.scheduledDate && (
                            <span className="text-xs text-gray-400">
                              {task.scheduledDate}
                            </span>
                          )}
                          {goal && (
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                              {goal.title}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => void handleDelete(task.id, task.title)}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                        aria-label={`「${task.title}」を削除する`}
                      >
                        🗑️
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {completed.length > 0 && (
            <section aria-label="完了済みタスク">
              <h2 className="text-sm font-medium text-gray-400 mb-3">完了済み</h2>
              <ul className="space-y-2 opacity-60">
                {completed.map((task) => (
                  <li
                    key={task.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
                  >
                    <span className="text-green-500" aria-hidden="true">
                      ✓
                    </span>
                    <p className="text-gray-500 line-through text-sm flex-1">
                      {task.title}
                    </p>
                    <button
                      onClick={() => void handleDelete(task.id, task.title)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      aria-label={`「${task.title}」を削除する`}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  )
}
