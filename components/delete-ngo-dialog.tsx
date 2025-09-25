"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import { Organization } from "@/lib/types"
import { deleteNGO } from "@/lib/actions/ngo-actions"

interface DeleteNgoDialogProps {
  ngo: Organization | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DeleteNgoDialog({ ngo, isOpen, onClose, onSuccess }: DeleteNgoDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!ngo) return

    const startTime = Date.now()
    console.log(`[${new Date().toISOString()}] Frontend delete started for NGO: ${ngo.id}`)
    
    setLoading(true)
    try {
      const result = await deleteNGO(ngo.id)
      const totalTime = Date.now() - startTime
      console.log(`[${new Date().toISOString()}] Delete completed in ${totalTime}ms`)

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete NGO')
      }

      console.log(`[${new Date().toISOString()}] Delete successful - Total frontend time: ${totalTime}ms`)
      
      onSuccess?.() // Refresh the NGOs list (optional)
      onClose() // Close dialog
    } catch (error) {
      const errorTime = Date.now() - startTime
      console.error(`[${new Date().toISOString()}] Delete error after ${errorTime}ms:`, error)
      // You could add error state handling here if needed
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete Organization
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{ngo?.name || ngo?.username}</strong>? 
            This action cannot be undone and will permanently remove the organization 
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
