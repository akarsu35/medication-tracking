import { addFamilyMember } from '@/lib/actions'
import Link from 'next/link'

interface FamilyMember {
  id: string
  name: string
  medications: any[]
}

interface FamilyMemberSelectorServerProps {
  familyMembers: FamilyMember[]
  selectedMemberId?: string
  userId: string
}

export default function FamilyMemberSelectorServer({
  familyMembers,
  selectedMemberId,
  userId,
}: FamilyMemberSelectorServerProps) {
  
  async function handleAddFamilyMember(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    if (name?.trim()) {
      await addFamilyMember(userId, name.trim())
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2">
        👥 Aile Üyeleri
      </h2>
      <div className="flex flex-wrap gap-2">
        {familyMembers.map((member) => (
          <Link
            key={member.id}
            href={`/?selectedMember=${member.id}`}
            className={`py-2 px-4 rounded-xl font-semibold transition ${
              selectedMemberId === member.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {member.name}
          </Link>
        ))}
      </div>
      <form action={handleAddFamilyMember} className="flex items-center gap-2 mt-4">
        <input
          type="text"
          name="name"
          placeholder="Yeni üye adı..."
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          aria-label="Yeni üye ekle"
        >
          ➕
        </button>
      </form>
    </div>
  )
}
