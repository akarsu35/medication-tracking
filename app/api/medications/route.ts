import { NextRequest, NextResponse } from 'next/server'
import { mockMedicationService } from '@/lib/services/mock-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, memberId, medication } = body
    
    if (!userId || !memberId || !medication) {
      return NextResponse.json({ error: 'User ID, member ID and medication data are required' }, { status: 400 })
    }

    await mockMedicationService.addMedication(userId, memberId, medication)
    return NextResponse.json({ message: 'Medication added successfully' })
  } catch (error) {
    console.error('Medication add error:', error)
    return NextResponse.json({ error: 'Failed to add medication' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, memberId, medicationId, action } = body
    
    if (!userId || !memberId || !medicationId || !action) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    if (action === 'toggle') {
      await mockMedicationService.toggleMedicationStatus(userId, memberId, medicationId)
      return NextResponse.json({ message: 'Medication status updated successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Medication update error:', error)
    return NextResponse.json({ error: 'Failed to update medication' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const memberId = searchParams.get('memberId')
    const medicationId = searchParams.get('medicationId')
    
    if (!userId || !memberId || !medicationId) {
      return NextResponse.json({ error: 'User ID, member ID and medication ID are required' }, { status: 400 })
    }

    await mockMedicationService.deleteMedication(userId, memberId, medicationId)
    return NextResponse.json({ message: 'Medication deleted successfully' })
  } catch (error) {
    console.error('Medication delete error:', error)
    return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 })
  }
}

