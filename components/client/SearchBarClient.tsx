'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface SearchBarClientProps {
  searchQuery: string
  selectedMemberName?: string
}

export default function SearchBarClient({
  searchQuery,
  selectedMemberName,
}: SearchBarClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchQuery)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (newQuery) {
        params.set('search', newQuery)
      } else {
        params.delete('search')
      }
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="relative mt-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-400">🔍</span>
      </div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder={`${selectedMemberName} için ilaç ara...`}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          isPending ? 'opacity-50' : ''
        }`}
        disabled={isPending}
      />
    </div>
  )
}
