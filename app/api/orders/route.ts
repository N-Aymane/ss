import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { shippingName, shippingEmail, shippingAddress } = await request.json()

    if (!shippingName || !shippingEmail || !shippingAddress) {
      return NextResponse.json(
        { message: 'Shipping information is required' },
        { status: 400 }
      )
    }

    // Get user's cart
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        total,
        shippingName,
        shippingEmail,
        shippingAddress,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    )
  }
}
