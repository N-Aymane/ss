"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string | null
  category: string
}

interface Drop {
  id?: string
  title: string
  description: string
  dropDate: Date
  productIds: string[]
}

interface DropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  drop?: Drop | null
  onSave: (drop: Drop) => void
}

export default function DropDialog({ open, onOpenChange, drop, onSave }: DropDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    dropDate: "",
    productIds: [] as string[],
  })
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast.error("Failed to load products")
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (drop) {
      setFormData({
        id: drop.id || "",
        title: drop.title,
        description: drop.description,
        dropDate: format(new Date(drop.dropDate), "yyyy-MM-dd'T'HH:mm"),
        productIds: drop.productIds || [],
      })
    } else {
      setFormData({
        id: "",
        title: "",
        description: "",
        dropDate: "",
        productIds: [],
      })
    }
  }, [drop, open])

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current
        const isScrollable = scrollHeight > clientHeight
        if (isScrollable) {
          scrollRef.current.classList.add('has-scroll')
        } else {
          scrollRef.current.classList.remove('has-scroll')
        }
      }
    }

    if (open) {
      setTimeout(checkScrollable, 100)
    }
  }, [open, formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => {
      const productIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId]

      return { ...prev, productIds }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dropData = {
        ...formData,
        dropDate: new Date(formData.dropDate),
      }

      const response = await fetch(
        drop ? `/api/drops/${drop.id}` : '/api/drops',
        {
          method: drop ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dropData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save drop')
      }

      const savedDrop = await response.json()
      onSave(savedDrop)
      onOpenChange(false)
      toast.success(drop ? 'Drop updated successfully!' : 'Drop created successfully!')
    } catch (error) {
      console.error("Failed to save drop:", error)
      toast.error("Failed to save drop. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{drop ? "Edit Drop" : "Add Drop"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-3 space-y-4 max-h-[60vh] admin-dialog-scroll scroll-fade-bottom"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Drop Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropDate">Drop Date & Time</Label>
              <Input
                id="dropDate"
                name="dropDate"
                type="datetime-local"
                value={formData.dropDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Associated Products ({formData.productIds.length} selected)</Label>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Click products to add/remove them from this drop
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                        formData.productIds.includes(product.id)
                          ? "bg-black text-white border-black"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs opacity-75">${product.price.toFixed(2)}</div>
                      <div className="text-xs opacity-75 capitalize">{product.category}</div>
                    </div>
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No products available. Create some products first.
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Drop"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
