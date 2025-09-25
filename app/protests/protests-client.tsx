"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { UpdateProtestModal } from "@/components/update-protest-modal"
import { ViewProtestModalV2 } from "@/components/view-protest-modal-v2"
import { DeleteProtestDialog } from "@/components/delete-protest-dialog"

interface ProtestData {
  id: string;
  title: string;
  description: string | null;
  location: string;
  dateTime: string;
  organizerId: string;
  city: string | null;
  country: string | null;
  pictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
  organizer: {
    id: string;
    name: string | null;
    username: string;
    pictureUrl: string | null;
  };
}

interface ProtestsClientProps {
  protest: ProtestData
}

export function ProtestsClient({ protest }: ProtestsClientProps) {
  const [selectedProtest, setSelectedProtest] = useState<ProtestData | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleView = () => {
    setSelectedProtest(protest)
    setIsViewModalOpen(true)
  }

  const handleEdit = () => {
    setSelectedProtest(protest)
    setIsUpdateModalOpen(true)
  }

  const handleDelete = () => {
    setSelectedProtest(protest)
    setIsDeleteDialogOpen(true)
  }

  const handleViewClose = () => {
    setIsViewModalOpen(false)
    setSelectedProtest(null)
  }

  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false)
    setSelectedProtest(null)
    // Page will automatically revalidate due to revalidatePath in server action
  }

  const handleUpdateClose = () => {
    setIsUpdateModalOpen(false)
    setSelectedProtest(null)
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setSelectedProtest(null)
    // Page will automatically revalidate due to revalidatePath in server action
  }

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false)
    setSelectedProtest(null)
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleView}
          className="h-6 w-6 p-0"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEdit}
          className="h-6 w-6 p-0"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* View Modal */}
      <ViewProtestModalV2
        protest={selectedProtest}
        isOpen={isViewModalOpen}
        onClose={handleViewClose}
      />

      {/* Update Modal */}
      {selectedProtest && (
        <UpdateProtestModal
          protest={selectedProtest}
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateClose}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Dialog */}
      <DeleteProtestDialog
        protest={selectedProtest}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
