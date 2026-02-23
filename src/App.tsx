import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { Tasks } from './pages/Tasks'
import { Goals } from './pages/Goals'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
        <Navigation />
      </div>
    </HashRouter>
  )
}

export default App
