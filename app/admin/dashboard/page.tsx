"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ProductDialog from "@/components/admin/product-dialog"
import DeleteConfirmDialog from "@/components/admin/delete-confirm-dialog"
import { getProducts, deleteProduct } from "@/lib/products"

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product) => {
    setCurrentProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = (product) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(currentProduct.id)
      setProducts(products.filter((p) => p.id !== currentProduct.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const handleProductSave = (savedProduct) => {
    if (currentProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)))
    } else {
      // Add new product
      setProducts([...products, savedProduct])
    }
    setIsProductDialogOpen(false)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No products found matching your search" : "No products found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden relative">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={currentProduct}
        onSave={handleProductSave}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        description={`Are you sure you want to delete "${currentProduct?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
