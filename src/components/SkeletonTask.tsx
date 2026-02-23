import React from 'react'

export const SkeletonTask: React.FC = () => {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm animate-pulse w-full"
      aria-busy="true"
      aria-label="読み込み中"
      role="status"
    >
      <div className="h-3 bg-gray-200 rounded-full w-24 mb-4" />
      <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4" />
      <div className="h-12 bg-gray-200 rounded-xl w-full" />
    </div>
  )
}
