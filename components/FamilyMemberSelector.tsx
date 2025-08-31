'use client'

import React from 'react'
import { Users, UserPlus } from 'lucide-react'

interface FamilyMember {
  id: string
  name: string
  medications: any[]
}

interface FamilyMemberSelectorProps {
  familyMembers: FamilyMember[]
  selectedFamilyMemberId: string | null
  onSelectMember: (id: string | null) => void
  newFamilyMemberName: string
  onNewMemberNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAddFamilyMember: (e: React.FormEvent) => void
}

const FamilyMemberSelector: React.FC<FamilyMemberSelectorProps> = ({
  familyMembers,
  selectedFamilyMemberId,
  onSelectMember,
  newFamilyMemberName,
  onNewMemberNameChange,
  onAddFamilyMember,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2">
        <Users size={24} /> Aile Üyeleri
      </h2>
      <div className="flex flex-wrap gap-2">
        {familyMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member.id)}
            className={`py-2 px-4 rounded-xl font-semibold transition ${
              selectedFamilyMemberId === member.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {member.name}
          </button>
        ))}
      </div>
      <form
        onSubmit={onAddFamilyMember}
        className="flex items-center gap-2 mt-4"
      >
        <input
          type="text"
          value={newFamilyMemberName}
          onChange={onNewMemberNameChange}
          placeholder="Yeni üye adı..."
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          aria-label="Yeni üye ekle"
        >
          <UserPlus size={20} />
        </button>
      </form>
    </div>
  )
}

export default FamilyMemberSelector
