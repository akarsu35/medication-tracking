import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/firebase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, token } = body
    
    if (action === 'anonymous') {
      const userCredential = await authService.signInAnonymously()
      return NextResponse.json({ 
        userId: userCredential.user.uid,
        message: 'Anonymous sign in successful' 
      })
    }
    
    if (action === 'custom-token' && token) {
      const userCredential = await authService.signInWithCustomToken(token)
      return NextResponse.json({ 
        userId: userCredential.user.uid,
        message: 'Custom token sign in successful' 
      })
    }

    return NextResponse.json({ error: 'Invalid action or missing token' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
