import { NextRequest, NextResponse } from 'next/server'
import { getProducts, saveProduct } from '@/lib/products'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const productData = await request.json()
    const product = await saveProduct(productData)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    
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
      { message: 'Failed to create product' },
      { status: 500 }
    )
  }
}
