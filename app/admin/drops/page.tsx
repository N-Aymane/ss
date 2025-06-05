"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DropDialog from "@/components/admin/drop-dialog"
import DeleteConfirmDialog from "@/components/admin/delete-confirm-dialog"
import { toast } from "@/lib/toast"

interface Drop {
  id: string
  title: string
  description: string
  dropDate: Date
  productIds: string[]
  createdAt: Date
  updatedAt: Date
}

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDrop, setCurrentDrop] = useState<Drop | null>(null)

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const response = await fetch('/api/drops')
        if (!response.ok) {
          throw new Error('Failed to fetch drops')
        }
        const data = await response.json()
        setDrops(data)
      } catch (error) {
        console.error("Failed to fetch drops:", error)
        toast.error("Failed to load drops. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrops()
  }, [])

  const handleAddDrop = () => {
    setCurrentDrop(null)
    setIsDropDialogOpen(true)
  }

  const handleEditDrop = (drop: Drop) => {
    setCurrentDrop(drop)
    setIsDropDialogOpen(true)
  }

  const handleDeleteDrop = (drop: Drop) => {
    setCurrentDrop(drop)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteDrop = async () => {
    if (!currentDrop) return

    try {
      const response = await fetch(`/api/drops/${currentDrop.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete drop')
      }

      setDrops(drops.filter((d) => d.id !== currentDrop.id))
      setIsDeleteDialogOpen(false)
      setCurrentDrop(null)
      toast.success("Drop deleted successfully!")
    } catch (error) {
      console.error("Failed to delete drop:", error)
      toast.error("Failed to delete drop. Please try again.")
    }
  }

  const handleDropSave = (savedDrop: Drop) => {
    if (currentDrop) {
      // Update existing drop
      setDrops(drops.map((d) => (d.id === savedDrop.id ? savedDrop : d)))
    } else {
      // Add new drop
      setDrops([...drops, savedDrop])
    }
    setIsDropDialogOpen(false)
  }

  const filteredDrops = drops.filter(
    (drop) =>
      drop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDropStatus = (dropDate: Date) => {
    const now = new Date()
    const date = new Date(dropDate)

    if (date < now) {
      return "Live"
    } else {
      return "Coming Soon"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Drops</h1>
        <Button onClick={handleAddDrop}>
          <Plus className="mr-2 h-4 w-4" />
          Add Drop
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search drops..."
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
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Drop Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No drops found matching your search" : "No drops found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrops.map((drop) => (
                  <TableRow key={drop.id}>
                    <TableCell className="font-medium">{drop.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{drop.description}</TableCell>
                    <TableCell>{format(new Date(drop.dropDate), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getDropStatus(drop.dropDate) === "Live"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getDropStatus(drop.dropDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditDrop(drop)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteDrop(drop)}>
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

      <DropDialog
        open={isDropDialogOpen}
        onOpenChange={setIsDropDialogOpen}
        drop={currentDrop}
        onSave={handleDropSave}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteDrop}
        title="Delete Drop"
        description={`Are you sure you want to delete "${currentDrop?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
