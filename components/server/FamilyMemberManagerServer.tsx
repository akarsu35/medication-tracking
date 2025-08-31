import { addFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/lib/actions'
import Link from 'next/link'
import { FamilyMember } from '@/types'

interface FamilyMemberManagerServerProps {
  familyMembers: FamilyMember[]
  selectedMemberId?: string
  userId: string
}

export default function FamilyMemberManagerServer({
  familyMembers,
  selectedMemberId,
  userId,
}: FamilyMemberManagerServerProps) {
  
  async function handleAddFamilyMember(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    if (name?.trim()) {
      await addFamilyMember(userId, name.trim())
    }
  }

  async function handleUpdateFamilyMember(formData: FormData) {
    'use server'
    const memberId = formData.get('memberId') as string
    const name = formData.get('name') as string
    if (memberId && name?.trim()) {
      await updateFamilyMember(userId, memberId, name.trim())
    }
  }

  async function handleDeleteFamilyMember(formData: FormData) {
    'use server'
    const memberId = formData.get('memberId') as string
    if (memberId) {
      await deleteFamilyMember(userId, memberId)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2">
        👥 Aile Üyeleri Yönetimi
      </h2>
      
      {/* Aile Üyeleri Listesi */}
      <div className="space-y-3">
        {familyMembers.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link
                  href={`?selectedMember=${member.id}`}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    selectedMemberId === member.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {member.name}
                </Link>
                <span className="text-sm text-gray-500">
                  {member.medications.length} ilaç
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Düzenleme Formu */}
                <form action={handleUpdateFamilyMember} className="flex items-center space-x-2">
                  <input type="hidden" name="memberId" value={member.id} />
                  <input
                    type="text"
                    name="name"
                    defaultValue={member.name}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="İsim düzenle..."
                  />
                  <button
                    type="submit"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Güncelle"
                  >
                    ✏️
                  </button>
                </form>
                
                {/* Silme Formu */}
                <form action={handleDeleteFamilyMember} className="inline">
                  <input type="hidden" name="memberId" value={member.id} />
                  <button
                    type="submit"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Üye Ekleme */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Yeni Aile Üyesi Ekle</h3>
        <form action={handleAddFamilyMember} className="flex items-center gap-3">
          <input
            type="text"
            name="name"
            placeholder="Yeni üye adı..."
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            ➕ Ekle
          </button>
        </form>
      </div>

      {familyMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">Henüz aile üyesi eklenmemiş</p>
          <p className="text-sm">Yukarıdaki formu kullanarak ilk üyeyi ekleyin</p>
        </div>
      )}
    </div>
  )
}
