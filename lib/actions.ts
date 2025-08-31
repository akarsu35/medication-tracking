'use server'

import { revalidatePath } from 'next/cache'

// Aile üyesi ekleme server action
export async function addFamilyMember(userId: string, name: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/family-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, name }),
    })

    if (!response.ok) {
      throw new Error('Failed to add family member')
    }

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true }
  } catch (error) {
    console.error('Add family member error:', error)
    return { success: false, error: 'Failed to add family member' }
  }
}

// İlaç ekleme server action
export async function addMedication(
  userId: string, 
  memberId: string, 
  medication: {
    name: string
    time: string
    onEmptyStomach: string
    days: string[]
  }
) {
  try {
    const response = await fetch(`http://localhost:3000/api/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, memberId, medication }),
    })

    if (!response.ok) {
      throw new Error('Failed to add medication')
    }

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true }
  } catch (error) {
    console.error('Add medication error:', error)
    return { success: false, error: 'Failed to add medication' }
  }
}

// İlaç durumu değiştirme server action
export async function toggleMedicationStatus(
  userId: string,
  memberId: string,
  medicationId: string
) {
  try {
    const response = await fetch(`http://localhost:3000/api/medications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId, 
        memberId, 
        medicationId, 
        action: 'toggle' 
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update medication status')
    }

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true }
  } catch (error) {
    console.error('Toggle medication error:', error)
    return { success: false, error: 'Failed to toggle medication status' }
  }
}

// İlaç silme server action
export async function deleteMedication(
  userId: string,
  memberId: string,
  medicationId: string
) {
  try {
    const response = await fetch(`http://localhost:3000/api/medications?userId=${userId}&memberId=${memberId}&medicationId=${medicationId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete medication')
    }

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true }
  } catch (error) {
    console.error('Delete medication error:', error)
    return { success: false, error: 'Failed to delete medication' }
  }
}

// Aile üyesi düzenleme server action
export async function updateFamilyMember(userId: string, memberId: string, name: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/family-members`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, memberId, data: { name: name.trim() } }),
    })

    if (!response.ok) {
      throw new Error('Failed to update family member')
    }

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true }
  } catch (error) {
    console.error('Update family member error:', error)
    return { success: false, error: 'Failed to update family member' }
  }
}

// Aile üyesi silme server action
export async function deleteFamilyMember(userId: string, memberId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/family-members?userId=${userId}&memberId=${memberId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete family member')
    }

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true }
  } catch (error) {
    console.error('Delete family member error:', error)
    return { success: false, error: 'Failed to delete family member' }
  }
}

// Aile üyelerini getirme fonksiyonu
export async function getFamilyMembers(userId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/family-members?userId=${userId}`, {
      cache: 'no-store' // Her zaman fresh data
    })

    if (!response.ok) {
      throw new Error('Failed to fetch family members')
    }

    const data = await response.json()
    return data.familyMembers || []
  } catch (error) {
    console.error('Get family members error:', error)
    return []
  }
}
