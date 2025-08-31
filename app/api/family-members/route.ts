import { NextRequest, NextResponse } from 'next/server'
import { mockFamilyMemberService } from '@/lib/services/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const familyMembers = await mockFamilyMemberService.getFamilyMembers(userId)
    return NextResponse.json({ familyMembers })
  } catch (error) {
    console.error('Family members fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch family members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name } = body
    
    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and name are required' }, { status: 400 })
    }

    const memberData = {
      name: name.trim(),
      medications: []
    }

    const memberId = await mockFamilyMemberService.addFamilyMember(userId, memberData)
    return NextResponse.json({ memberId, message: 'Family member added successfully' })
  } catch (error) {
    console.error('Family member add error:', error)
    return NextResponse.json({ error: 'Failed to add family member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, memberId, data } = body
    
    if (!userId || !memberId || !data) {
      return NextResponse.json({ error: 'User ID, member ID and data are required' }, { status: 400 })
    }

    await mockFamilyMemberService.updateFamilyMember(userId, memberId, data)
    return NextResponse.json({ message: 'Family member updated successfully' })
  } catch (error) {
    console.error('Family member update error:', error)
    return NextResponse.json({ error: 'Failed to update family member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const memberId = searchParams.get('memberId')
    
    if (!userId || !memberId) {
      return NextResponse.json({ error: 'User ID and member ID are required' }, { status: 400 })
    }

    await mockFamilyMemberService.deleteFamilyMember(userId, memberId)
    return NextResponse.json({ message: 'Family member deleted successfully' })
  } catch (error) {
    console.error('Family member delete error:', error)
    return NextResponse.json({ error: 'Failed to delete family member' }, { status: 500 })
  }
}
