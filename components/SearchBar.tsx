'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "İlaç ara...",
}) => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={20} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  )
}

export default SearchBar
