// Cart utility functions for frontend

export interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
    price: number
    imageUrl: string | null
  }
}

export interface Cart {
  id: string
  items: CartItem[]
}

export async function getCart(): Promise<Cart | null> {
  try {
    const response = await fetch('/api/cart')
    if (!response.ok) {
      if (response.status === 401) {
        return null // Not authenticated
      }
      throw new Error('Failed to fetch cart')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  size?: string,
  color?: string
): Promise<Cart | null> {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, size, color }),
    })

    if (!response.ok) {
      throw new Error('Failed to add to cart')
    }

    return await response.json()
  } catch (error) {
    console.error('Error adding to cart:', error)
    return null
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })

    if (!response.ok) {
      throw new Error('Failed to update cart item')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating cart item:', error)
    return null
  }
}

export async function removeFromCart(itemId: string): Promise<Cart | null> {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to remove from cart')
    }

    return await response.json()
  } catch (error) {
    console.error('Error removing from cart:', error)
    return null
  }
}

export async function createOrder(orderData: {
  shippingName: string
  shippingEmail: string
  shippingAddress: string
}): Promise<any> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error('Failed to create order')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}
