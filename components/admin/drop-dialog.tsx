"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveDrop } from "@/lib/drops"
import { getProducts } from "@/lib/products"

export default function DropDialog({ open, onOpenChange, drop, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    dropDate: "",
    productIds: [],
  })
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (drop) {
      setFormData({
        id: drop.id,
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductSelect = (productId) => {
    setFormData((prev) => {
      const productIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId]

      return { ...prev, productIds }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const savedDrop = await saveDrop({
        ...formData,
        dropDate: new Date(formData.dropDate).toISOString(),
      })
      onSave(savedDrop)
    } catch (error) {
      console.error("Failed to save drop:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{drop ? "Edit Drop" : "Add Drop"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              <Label>Associated Products</Label>
              <div className="grid grid-cols-2 gap-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-2 border rounded-md cursor-pointer ${
                      formData.productIds.includes(product.id) ? "bg-black text-white" : ""
                    }`}
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm">${product.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
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
