'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface NavigationBarClientProps {
  currentView: string
}

export default function NavigationBarClient({
  currentView,
}: NavigationBarClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('view', view)
    router.push(`?${params.toString()}`)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg p-4 flex justify-around items-center rounded-t-3xl">
      <button
        onClick={() => handleViewChange('dailyProgram')}
        className={`flex flex-col items-center space-y-1 transition ${
          currentView === 'dailyProgram' ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <span className="text-2xl">🏠</span>
        <span className="text-xs font-semibold">Ana Sayfa</span>
      </button>
      <button
        onClick={() => handleViewChange('statusTracking')}
        className={`flex flex-col items-center space-y-1 transition ${
          currentView === 'statusTracking'
            ? 'text-blue-600'
            : 'text-gray-500'
        }`}
      >
        <span className="text-2xl">📊</span>
        <span className="text-xs font-semibold">Durum</span>
      </button>
      <button
        onClick={() => handleViewChange('allMedications')}
        className={`flex flex-col items-center space-y-1 transition ${
          currentView === 'allMedications'
            ? 'text-blue-600'
            : 'text-gray-500'
        }`}
      >
        <span className="text-2xl">💊</span>
        <span className="text-xs font-semibold">İlaçlar</span>
      </button>
    </nav>
  )
}
