import { NextRequest, NextResponse } from 'next/server'
import { saveDrop, deleteDrop } from '@/lib/drops'
import { requireAdmin } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)
    
    const dropData = await request.json()
    const drop = await saveDrop({ ...dropData, id: params.id })
    
    return NextResponse.json(drop)
  } catch (error) {
    console.error('Error updating drop:', error)
    
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
      { message: 'Failed to update drop' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)
    
    await deleteDrop(params.id)
    
    return NextResponse.json({ message: 'Drop deleted successfully' })
  } catch (error) {
    console.error('Error deleting drop:', error)
    
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
      { message: 'Failed to delete drop' },
      { status: 500 }
    )
  }
}
