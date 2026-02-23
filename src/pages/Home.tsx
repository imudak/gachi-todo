import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { Character } from '../components/Character'
import { SkeletonTask } from '../components/SkeletonTask'

export const Home: React.FC = () => {
  const { tasks, loading, completeTask, getTodayTask } = useTasks()
  const [characterState, setCharacterState] = useState<'idle' | 'happy'>('idle')

  const todayTask = getTodayTask()
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter((t) => t.scheduledDate === today)
  const showAllDone =
    !loading && todayTasks.length > 0 && todayTasks.every((t) => t.completed)

  const handleComplete = async () => {
    if (!todayTask) return
    await completeTask(todayTask.id)
    setCharacterState('happy')
    setTimeout(() => {
      setCharacterState('idle')
    }, 3000)
  }

  const dateStr = new Date().toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <main className="max-w-lg mx-auto px-4 pt-8 pb-4">
      <header className="mb-8">
        <p className="text-gray-400 text-sm">{dateStr}</p>
        <h1 className="text-2xl font-bold text-gray-800">がちTODO</h1>
      </header>

      <div className="flex flex-col items-center gap-6">
        <Character state={characterState} />

        {loading ? (
          <SkeletonTask />
        ) : showAllDone ? (
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-lg font-semibold text-indigo-600">今日のタスク完了！</p>
            <p className="text-gray-400 text-sm mt-1">素晴らしい！明日も頑張ろう！</p>
          </div>
        ) : todayTask ? (
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-xs text-indigo-400 font-semibold mb-2 uppercase tracking-widest">
              今日のタスク
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-5">
              {todayTask.title}
            </p>
            <button
              onClick={() => void handleComplete()}
              className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors active:scale-95"
              aria-label={`「${todayTask.title}」を完了する`}
            >
              完了！ 🎯
            </button>
          </div>
        ) : (
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-400 mb-1">今日のタスクはありません</p>
            <p className="text-gray-300 text-sm mb-4">タスクに日付を設定して追加しよう</p>
            <Link
              to="/tasks"
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              タスクを追加する
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
