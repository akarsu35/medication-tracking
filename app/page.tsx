import { Suspense } from 'react'
import Link from 'next/link'
import { getFamilyMembers } from '@/lib/actions'


// Server Component - Ana sayfa
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; view?: string; selectedMember?: string; search?: string }>
}) {
  const params = await searchParams
  const userId = params.userId || 'demo-user' // Demo için sabit user ID
  const currentView = params.view || 'dailyProgram'
  const selectedMemberId = params.selectedMember
  const searchQuery = params.search || ''

  // Server-side'da veri çekme
  const familyMembers = await getFamilyMembers(userId)
  const selectedMember = familyMembers.find(member => member.id === selectedMemberId) || familyMembers[0]

  // Haftanın günleri
  const daysOfWeek = [
    'Pazartesi',
    'Salı', 
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar',
  ]

  // Bugünün günü
  const today = new Date()
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
  const todayName = daysOfWeek[dayIndex]

  // İlaçları filtrele
  const medications = selectedMember ? selectedMember.medications : []
  const todayMedications = medications.filter((med: any) => med.days.includes(todayName))
  const dayParam = params.day
  const selectedDayName = dayParam || todayName

  const filteredMedications = medications.filter(
    (med: any) =>
      med.days.includes(selectedDayName) &&
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Zaman bazlı kategoriler
  const now = new Date()
  const timeNow = now.getHours() * 60 + now.getMinutes()

  const approachingMeds = filteredMedications.filter((med: any) => {
    const [hour, minute] = med.time.split(':')
    const medTimeInMinutes = parseInt(hour, 10) * 60 + parseInt(minute, 10)
    return !med.isTaken && medTimeInMinutes >= timeNow
  })

  const takenMeds = filteredMedications.filter((med: any) => med.isTaken)
  const untakenMeds = filteredMedications.filter((med: any) => {
    const [hour, minute] = med.time.split(':')
    const medTimeInMinutes = parseInt(hour, 10) * 60 + parseInt(minute, 10)
    return !med.isTaken && medTimeInMinutes < timeNow
  })
const filteredMedicationsByDay = (day: string) =>
  medications.filter((med: any) => med.days.includes(day) && med.name.toLowerCase().includes(searchQuery.toLowerCase()))
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-6 md:p-8 space-y-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🏥 İlaç Takip Sistemi
          </h1>
          <Link
            href="/manage"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            👥 Kişi Yönetimi
          </Link>
        </div>
        <p className="text-gray-500 text-lg">
          Sizin ve ailenizin ilaç takibini kolaylaştırın.
        </p>

        <Suspense fallback={<div>Aile üyeleri yükleniyor...</div>}>
          <FamilyMemberSelectorServer
            familyMembers={familyMembers}
            selectedMemberId={selectedMemberId}
            userId={userId}
          />
        </Suspense>

        <NotificationPermissionClient />

        <Suspense fallback={<div>Form yükleniyor...</div>}>
          <MedicationFormServer
            selectedMember={selectedMember}
            userId={userId}
            daysOfWeek={daysOfWeek}
          />
        </Suspense>

        <SearchBarClient
          searchQuery={searchQuery}
          selectedMemberName={selectedMember?.name}
        />

        <div className="flex-1 overflow-y-auto pb-24">
          {currentView === 'dailyProgram' && (
            <>
              <DaySwitcher daysOfWeek={daysOfWeek} todayIndex={dayIndex} />
              {filteredMedications.length === 0 ? (
                <p className="text-center text-gray-500 p-4 border border-gray-200 rounded-xl">
                  Bu gün alınacak ilaç bulunmuyor.
                </p>
              ) : (
                <MedicationListServer
                  medications={filteredMedications}
                  userId={userId}
                  memberId={selectedMemberId}
                  daysOfWeek={daysOfWeek}
                  type="daily"
                />
              )}
            </>
          )}

          {currentView === 'statusTracking' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-700">
                Bugünkü Durum Takibi: {selectedMember?.name}
              </h2>

              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-3">
                  ⏰ Yaklaşan İlaçlar
                </h3>
                <MedicationListServer
                  medications={approachingMeds}
                  userId={userId}
                  memberId={selectedMember?.id}
                  daysOfWeek={daysOfWeek}
                  type="approaching"
                />
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-3">
                  ✅ Kullanılan İlaçlar
                </h3>
                <MedicationListServer
                  medications={takenMeds}
                  userId={userId}
                  memberId={selectedMember?.id}
                  daysOfWeek={daysOfWeek}
                  type="taken"
                />
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-3">
                  ❌ Kullanılmayan İlaçlar
                </h3>
                <MedicationListServer
                  medications={untakenMeds}
                  userId={userId}
                  memberId={selectedMember?.id}
                  daysOfWeek={daysOfWeek}
                  type="untaken"
                />
              </div>
            </div>
          )}

          {currentView === 'allMedications' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Tüm İlaçlar: {selectedMember?.name}
              </h2>
              {medications.length === 0 ? (
                <p className="text-center text-gray-500 p-4 border border-gray-200 rounded-xl">
                  Henüz ilaç eklenmedi.
                </p>
              ) : (
                <MedicationListServer
                  medications={medications.filter((med: any) =>
                    med.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  userId={userId}
                  memberId={selectedMember?.id}
                  daysOfWeek={daysOfWeek}
                  type="all"
                />
              )}
            </div>
          )}
        </div>

        <NavigationBarClient currentView={currentView} />
      </div>
    </div>
  )
}

import FamilyMemberSelectorServer from '@/components/server/FamilyMemberSelectorServer'
import MedicationFormServer from '@/components/server/MedicationFormServer'
import MedicationListServer from '@/components/server/MedicationListServer'
import SearchBarClient from '@/components/client/SearchBarClient'
import NavigationBarClient from '@/components/client/NavigationBarClient'
import NotificationPermissionClient from '@/components/client/NotificationPermissionClient'
import DaySwitcher from '@/components/client/DaySwitcher';

