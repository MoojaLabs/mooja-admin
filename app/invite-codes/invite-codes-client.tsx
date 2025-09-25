"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { deleteInviteCode } from "@/lib/actions/invite-code-actions"

interface InviteCodeData {
  id: string;
  code: string;
  isUsed: boolean;
  expiresAt: string;
  sentTo: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  orgs: {
    id: string;
    name: string | null;
    username: string;
    pictureUrl: string | null;
    verificationStatus: string;
    verifiedAt: string | null;
  }[];
}

interface InviteCodesClientProps {
  inviteCode: InviteCodeData
}

export function InviteCodesClient({ inviteCode }: InviteCodesClientProps) {
  const [loading, setLoading] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode.code)
    // You could add a toast notification here
    console.log('Copied to clipboard:', inviteCode.code)
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteInviteCode(inviteCode.id)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete invite code')
      }

      // Page will automatically revalidate due to revalidatePath in server action
    } catch (error) {
      console.error('Error deleting invite code:', error)
      // You could add a toast notification here
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Code
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {loading ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
