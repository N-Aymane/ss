"use client"

import { useState, useEffect, useRef } from "react"
import { X, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/lib/toast"

interface Product {
  id?: string
  name: string
  description: string
  price: number
  imageUrl?: string | null
  category: string
  colors: string[]
  sizes: string[]
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (product: Product) => void
}

export default function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  })
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const categories = [
    { value: "tshirts", label: "T-Shirts" },
    { value: "hoodies", label: "Hoodies" },
    { value: "pants", label: "Pants" },
    { value: "outerwear", label: "Outerwear" },
    { value: "accessories", label: "Accessories" },
  ]

  const commonColors = ["black", "white", "navy", "cream", "gray"]
  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || "",
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
        category: product.category,
      })
      setColors(product.colors || [])
      setSizes(product.sizes || [])
      setImagePreview(product.imageUrl || "")
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
      })
      setColors([])
      setSizes([])
      setImagePreview("")
    }
  }, [product, open])

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
      // Check after a short delay to ensure content is rendered
      setTimeout(checkScrollable, 100)
    }
  }, [open, colors, sizes, formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to a storage service
      // For this demo, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setFormData((prev) => ({ ...prev, imageUrl }))
    }
  }

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor])
      setNewColor("")
    }
  }

  const removeColor = (colorToRemove: string) => {
    setColors(colors.filter(color => color !== colorToRemove))
  }

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(size => size !== sizeToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        colors,
        sizes,
      }

      const response = await fetch(
        product ? `/api/products/${product.id}` : '/api/products',
        {
          method: product ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      const savedProduct = await response.json()
      onSave(savedProduct)
      onOpenChange(false)
      toast.success(product ? 'Product updated successfully!' : 'Product created successfully!')
    } catch (error) {
      console.error("Failed to save product:", error)
      toast.error("Failed to save product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-3 space-y-4 max-h-[60vh] admin-dialog-scroll scroll-fade-bottom"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
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
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      <span className="text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  />
                  <Button type="button" onClick={addColor} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {commonColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => !colors.includes(color) && setColors([...colors, color])}
                      className={`px-2 py-1 text-xs rounded ${
                        colors.includes(color)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      disabled={colors.includes(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sizes</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      <span className="text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add size"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  />
                  <Button type="button" onClick={addSize} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {commonSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => !sizes.includes(size) && setSizes([...sizes, size])}
                      className={`px-2 py-1 text-xs rounded ${
                        sizes.includes(size)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      disabled={sizes.includes(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("")
                        setFormData((prev) => ({ ...prev, imageUrl: "" }))
                      }}
                      className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
