import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
      return NextResponse.json(newCart)
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error fetching cart:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { productId, quantity, size, color } = await request.json()

    if (!productId || !quantity) {
      return NextResponse.json(
        { message: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: size || '',
          color: color || '',
        },
      },
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
          color,
        },
      })
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Error adding to cart:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}
