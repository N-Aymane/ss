import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth(request)
    const { quantity } = await request.json()

    if (!quantity || quantity < 0) {
      return NextResponse.json(
        { message: 'Valid quantity is required' },
        { status: 400 }
      )
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cart: {
          userId: user.id,
        },
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: params.itemId },
      })
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: params.itemId },
        data: { quantity },
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
    console.error('Error updating cart item:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth(request)

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cart: {
          userId: user.id,
        },
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: params.itemId },
    })

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
    console.error('Error removing cart item:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
