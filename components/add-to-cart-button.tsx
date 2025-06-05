"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  colors?: string[]
  sizes?: string[]
}

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    
    try {
      const result = await addToCart(
        product.id,
        1,
        selectedSize || undefined,
        selectedColor || undefined
      )
      
      if (result) {
        // Show success message or redirect to cart
        alert('Added to cart successfully!')
      } else {
        // User might not be logged in
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg tracking-wider">Color</h2>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const colorClass =
                color === "black"
                  ? "bg-black"
                  : color === "navy"
                    ? "bg-indigo-900"
                    : color === "cream"
                      ? "bg-amber-50"
                      : "bg-gray-500"

              return (
                <div
                  key={color}
                  className={`h-8 w-8 rounded-full ${colorClass} cursor-pointer hover:ring-1 hover:ring-offset-2 hover:ring-gold transition-all border border-gold/20 ${
                    selectedColor === color ? 'ring-2 ring-gold ring-offset-2' : ''
                  }`}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                  onClick={() => setSelectedColor(color)}
                />
              )
            })}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg tracking-wider">Size</h2>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={`h-12 w-12 rounded-none font-light border-gold/30 hover:border-gold hover:text-gold ${
                  selectedSize === size ? 'bg-gold text-black' : ''
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-full rounded-none h-14 text-sm tracking-widest font-light bg-black text-gold hover:bg-gold hover:text-black disabled:opacity-50"
        size="lg"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? 'ADDING...' : 'ADD TO CART'}
      </Button>
    </div>
  )
}
