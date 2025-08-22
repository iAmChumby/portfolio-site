import { NextRequest, NextResponse } from 'next/server'

// Simple admin authentication - in production, use proper authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: true, message: 'Authentication successful' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}