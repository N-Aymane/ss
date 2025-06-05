import { NextRequest, NextResponse } from 'next/server'
import { getSiteSettings, updateSiteSettings } from '@/lib/drops'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { message: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const settingsData = await request.json()
    const settings = await updateSiteSettings(settingsData)
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating site settings:', error)
    
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
      { message: 'Failed to update site settings' },
      { status: 500 }
    )
  }
}
