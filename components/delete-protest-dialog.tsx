"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { deleteProtest } from "@/lib/actions/protest-actions"

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

interface DeleteProtestDialogProps {
  protest: ProtestData | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DeleteProtestDialog({ protest, isOpen, onClose, onSuccess }: DeleteProtestDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!protest) return

    setLoading(true)
    try {
      const result = await deleteProtest(protest.id)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete protest')
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting protest:', error)
      // You could add a toast notification here
    } finally {
      setLoading(false)
    }
  }

  if (!protest) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            Delete Protest
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the protest <strong>"{protest.title}"</strong>? 
            This action cannot be undone and will permanently remove the protest from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Deleting..." : "Delete Protest"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
