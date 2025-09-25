"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Organization } from "@/lib/types"
import { UpdateNgoModal } from "@/components/update-ngo-modal"
import { DeleteNgoDialog } from "@/components/delete-ngo-dialog"
import { ViewNgoModal } from "@/components/view-ngo-modal"

interface NGOsPageClientProps {
  ngo: Organization
}

export function NGOsPageClient({ ngo }: NGOsPageClientProps) {
  const [selectedNgo, setSelectedNgo] = useState<Organization | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleView = () => {
    setSelectedNgo(ngo)
    setIsViewModalOpen(true)
  }

  const handleEdit = () => {
    setSelectedNgo(ngo)
    setIsUpdateModalOpen(true)
  }

  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false)
    setSelectedNgo(null)
    // Page will automatically revalidate due to revalidatePath in server action
  }

  const handleUpdateClose = () => {
    setIsUpdateModalOpen(false)
    setSelectedNgo(null)
  }

  const handleDelete = () => {
    setSelectedNgo(ngo)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setSelectedNgo(null)
    // Page will automatically revalidate due to revalidatePath in server action
  }

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false)
    setSelectedNgo(null)
  }

  const handleViewClose = () => {
    setIsViewModalOpen(false)
    setSelectedNgo(null)
  }

  return (
    <>
      <div className="flex items-center gap-2 justify-start">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleView}
          className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEdit}
          className="h-8 px-3 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* View Modal */}
      <ViewNgoModal
        ngo={selectedNgo}
        isOpen={isViewModalOpen}
        onClose={handleViewClose}
      />

      {/* Update Modal */}
      {selectedNgo && (
        <UpdateNgoModal
          ngo={selectedNgo}
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateClose}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Dialog */}
      <DeleteNgoDialog
        ngo={selectedNgo}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
