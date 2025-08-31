'use client'

import React from 'react'
import { Home, LayoutDashboard, ListTodo } from 'lucide-react'

interface NavigationBarProps {
  currentView: string
  onViewChange: (view: string) => void
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg p-4 flex justify-around items-center rounded-t-3xl">
      <button
        onClick={() => onViewChange('dailyProgram')}
        className={`flex flex-col items-center space-y-1 transition ${
          currentView === 'dailyProgram' ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <Home size={24} />
        <span className="text-xs font-semibold">Ana Sayfa</span>
      </button>
      <button
        onClick={() => onViewChange('statusTracking')}
        className={`flex flex-col items-center space-y-1 transition ${
          currentView === 'statusTracking'
            ? 'text-blue-600'
            : 'text-gray-500'
        }`}
      >
        <LayoutDashboard size={24} />
        <span className="text-xs font-semibold">Durum</span>
      </button>
      <button
        onClick={() => onViewChange('allMedications')}
        className={`flex flex-col items-center space-y-1 transition ${
          currentView === 'allMedications'
            ? 'text-blue-600'
            : 'text-gray-500'
        }`}
      >
        <ListTodo size={24} />
        <span className="text-xs font-semibold">İlaçlar</span>
      </button>
    </nav>
  )
}

export default NavigationBar
