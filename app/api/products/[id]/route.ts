import { NextRequest, NextResponse } from 'next/server'
import { getProductById, saveProduct, deleteProduct } from '@/lib/products'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)
    
    const productData = await request.json()
    const product = await saveProduct({ ...productData, id: params.id })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    
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
      { message: 'Failed to update product' },
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
    
    await deleteProduct(params.id)
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    
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
      { message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
