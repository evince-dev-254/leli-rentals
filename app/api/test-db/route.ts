import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database-service'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const users = await DatabaseService.getUserById('test')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: users
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Database connection failed'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, avatar } = body

    // Create a test user
    const user = await DatabaseService.createUser({
      id: `test-${Date.now()}`,
      email,
      name,
      avatar
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'User creation failed'
      },
      { status: 500 }
    )
  }
}
