import { getFamilyMembers } from '@/lib/actions'
import FamilyMemberManagerServer from '@/components/server/FamilyMemberManagerServer'
import Link from 'next/link'
import { FamilyMember, Medication } from '@/types'

interface SearchParams {
  selectedMember?: string
}

interface PageProps {
  searchParams: SearchParams
}

export default async function ManagePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const userId = 'demo-user' // Demo için sabit kullanıcı ID'si
  const familyMembers = await getFamilyMembers(userId)
  const selectedMemberId = params.selectedMember

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🏥 İlaç Takip - Aile Üyesi Yönetimi
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Ana Sayfa
          </Link>
        </div>

        {/* Aile Üyesi Yönetimi */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <FamilyMemberManagerServer
            familyMembers={familyMembers}
            selectedMemberId={selectedMemberId}
            userId={userId}
          />
        </div>

        {/* Seçili Üye Bilgileri */}
        {selectedMemberId && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            {(() => {
              const selectedMember = familyMembers.find((m: FamilyMember) => m.id === selectedMemberId)
              if (!selectedMember) return null
              
              return (
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    📋 {selectedMember.name} - İlaç Listesi
                  </h3>
                  {selectedMember.medications.length > 0 ? (
                    <div className="space-y-3">
                      {selectedMember.medications.map((med: Medication) => (
                        <div key={med.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800">{med.name}</h4>
                              <p className="text-sm text-gray-600">
                                🕐 {med.time} | {med.onEmptyStomach === 'aç' ? '🍽️ Aç karnına' : '🍽️ Tok karnına'}
                              </p>
                              <p className="text-sm text-gray-500">
                                📅 {med.days.join(', ')}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              med.isTaken 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {med.isTaken ? '✅ Alındı' : '⏳ Bekliyor'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Bu üye için henüz ilaç eklenmemiş
                    </p>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
