import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navigation: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 px-5 py-2 text-xs font-medium transition-colors ${
      isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
    }`

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-area-inset-bottom"
      aria-label="メインナビゲーション"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <NavLink to="/" end className={linkClass} aria-label="ホーム">
          <span className="text-2xl" aria-hidden="true">
            🏠
          </span>
          <span>ホーム</span>
        </NavLink>

        <NavLink to="/tasks" className={linkClass} aria-label="タスク一覧">
          <span className="text-2xl" aria-hidden="true">
            ✅
          </span>
          <span>タスク</span>
        </NavLink>

        <NavLink to="/goals" className={linkClass} aria-label="目標一覧">
          <span className="text-2xl" aria-hidden="true">
            🎯
          </span>
          <span>目標</span>
        </NavLink>
      </div>
    </nav>
  )
}
