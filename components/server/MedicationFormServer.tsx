
import { addMedication } from '@/lib/actions'
import DaySelectionValidator from '@/components/client/DaySelectionValidator'
import SelectAllHandler from '@/components/client/SelectAllHandler'
import CameraOCR from '@/components/client/CameraOCR'
import MedicationFormClient from '../client/MedicationFormClient'

interface MedicationFormServerProps {
  selectedMember?: { id: string; name: string }
  userId: string
  daysOfWeek: string[]
}

export default function MedicationFormServer({
  selectedMember,
  userId,
  daysOfWeek,
}: MedicationFormServerProps) {
  
  async function handleAddMedication(formData: FormData) {
    'use server'
    if (!selectedMember) return
    
    const name = formData.get('name') as string
    const time = formData.get('time') as string
    const onEmptyStomach = formData.get('onEmptyStomach') as string
    let days = formData.getAll('days') as string[]
    
    // "Hepsini Seç" seçeneği kontrol edildi mi?
    const selectAll = formData.get('selectAll')
    if (selectAll) {
      days = daysOfWeek
    }
    
    if (name?.trim() && time && days.length > 0) {
      await addMedication(userId, selectedMember.id, {
        name: name.trim(),
        time,
        onEmptyStomach,
        days
      })
    }
  }

  return (
    <MedicationFormClient
      selectedMember={selectedMember}
      userId={userId}
      daysOfWeek={daysOfWeek}
      onSubmit={handleAddMedication}
    />
  )
}
