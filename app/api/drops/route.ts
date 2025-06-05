import { NextRequest, NextResponse } from 'next/server'
import { getDrops, saveDrop } from '@/lib/drops'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const drops = await getDrops()
    return NextResponse.json(drops)
  } catch (error) {
    console.error('Error fetching drops:', error)
    return NextResponse.json(
      { message: 'Failed to fetch drops' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const dropData = await request.json()
    const drop = await saveDrop(dropData)
    
    return NextResponse.json(drop, { status: 201 })
  } catch (error) {
    console.error('Error creating drop:', error)
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to create drop' },
      { status: 500 }
    )
  }
}
