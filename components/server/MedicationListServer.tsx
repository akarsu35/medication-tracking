import { toggleMedicationStatus, deleteMedication } from '@/lib/actions'
import MedicationVerifierWrapper from '@/components/client/MedicationVerifierWrapper'

interface Medication {
  id: string
  name: string
  time: string
  onEmptyStomach: string
  days: string[]
  isTaken: boolean
}

interface MedicationListServerProps {
  medications: Medication[]
  userId: string
  memberId?: string
  daysOfWeek: string[]
  type?: 'daily' | 'taken' | 'untaken' | 'approaching' | 'all'
}

export default function MedicationListServer({
  medications,
  userId,
  memberId,
  daysOfWeek,
  type = 'all',
}: MedicationListServerProps) {
  
  async function handleToggleTaken(formData: FormData) {
    'use server'
    const medicationId = formData.get('medicationId') as string
    if (medicationId && memberId) {
      await toggleMedicationStatus(userId, memberId, medicationId)
    }
  }

  async function handleDeleteMedication(formData: FormData) {
    'use server'
    const medicationId = formData.get('medicationId') as string
    if (medicationId && memberId) {
      await deleteMedication(userId, memberId, medicationId)
    }
  }

  if (medications.length === 0) {
    return (
      <p className="text-center text-gray-500 p-4 border border-gray-200 rounded-xl">
        Bu kategoride ilaç bulunmuyor.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {medications.map((med) => (
        <li
          key={med.id}
          className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition transform hover:translate-y-1 hover:shadow-md ${
            med.isTaken
              ? 'bg-green-100'
              : type === 'untaken'
              ? 'bg-red-50'
              : 'bg-blue-50'
          }`}
        >
          <div className="flex-1 min-w-0">
            <p
              className={`text-lg font-semibold text-blue-800 truncate ${
                med.isTaken ? 'line-through text-gray-500' : ''
              }`}
            >
              {med.name}
            </p>
            <p
              className={`text-sm text-gray-500 ${
                med.isTaken ? 'line-through' : ''
              }`}
            >
              {med.time} -{' '}
              <span className="capitalize">{med.onEmptyStomach}</span> Karnına
              <br />
              <span className="text-xs text-gray-400 mt-1">
                {med.days.length === daysOfWeek.length
                  ? 'Her Gün'
                  : med.days.join(', ')}
              </span>
            </p>
          </div>
          <div className="flex space-x-2">
            {!med.isTaken && (
              <MedicationVerifierWrapper 
                medicationName={med.name}
                medicationId={med.id}
                userId={userId}
                memberId={memberId}
                className="flex-shrink-0"
              />
            )}
            <form action={handleToggleTaken}>
              <input type="hidden" name="medicationId" value={med.id} />
              <button
                type="submit"
                className={`p-2 rounded-full ${
                  med.isTaken
                    ? 'text-green-500 hover:text-green-700 hover:bg-green-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                } transition`}
                aria-label="Alındı olarak işaretle"
              >
                {med.isTaken ? '✅' : '⏰'}
              </button>
            </form>
            <form action={handleDeleteMedication}>
              <input type="hidden" name="medicationId" value={med.id} />
              <button
                type="submit"
                className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition"
                aria-label="İlacı Sil"
              >
                🗑️
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  )
}
