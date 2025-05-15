"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveProduct } from "@/lib/products"

export default function ProductDialog({ open, onOpenChange, product, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
      })
      setImagePreview(product.imageUrl || "")
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        imageUrl: "",
      })
      setImagePreview("")
    }
  }, [product, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this file to a storage service
      // For this demo, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setFormData((prev) => ({ ...prev, imageUrl }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const savedProduct = await saveProduct({
        ...formData,
        price: Number.parseFloat(formData.price),
      })
      onSave(savedProduct)
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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

          <DialogFooter>
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
