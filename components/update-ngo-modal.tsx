"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CountrySelector } from "@/components/country-selector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Organization } from "@/lib/types"
import { updateNGO } from "@/lib/actions/ngo-actions"

interface UpdateNgoModalProps {
  ngo: Organization
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UpdateNgoModal({ ngo, isOpen, onClose, onSuccess }: UpdateNgoModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    country: "",
    socialMediaPlatform: "",
    socialMediaHandle: "",
    verificationStatus: "verified" as const
  })
  const [picture, setPicture] = useState<File | null>(null)

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && ngo) {
      setFormData({
        username: ngo.username || "",
        name: ngo.name || "",
        country: ngo.country || "",
        socialMediaPlatform: ngo.socialMediaPlatform || "",
        socialMediaHandle: ngo.socialMediaHandle || "",
        verificationStatus: ngo.verificationStatus as "verified" || "verified"
      })
      setPicture(null)
      setError(null)
    }
  }, [isOpen, ngo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })
      
      // Add picture if selected
      if (picture) {
        formDataToSend.append('picture', picture)
      }

      const result = await updateNGO(ngo.id, formDataToSend)

      if (!result.success) {
        throw new Error(result.error || 'Failed to update NGO')
      }

      onSuccess?.() // Refresh the NGOs list (optional)
      onClose() // Close modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setPicture(file)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-full">
        <DialogHeader>
          <DialogTitle>Update NGO</DialogTitle>
          <DialogDescription>
            Update organization information. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter organization name"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <CountrySelector
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialMediaPlatform">Social Media Platform *</Label>
              <Select
                value={formData.socialMediaPlatform}
                onValueChange={(value) => handleInputChange("socialMediaPlatform", value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialMediaHandle">Social Media Handle *</Label>
            <Input
              id="socialMediaHandle"
              value={formData.socialMediaHandle}
              onChange={(e) => handleInputChange("socialMediaHandle", e.target.value)}
              placeholder="e.g., @organization"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Organization Picture</Label>
            <div className="flex items-center gap-2">
              <input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                disabled={loading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('picture')?.click()}
                disabled={loading}
                className="h-10 px-4"
              >
                Choose File
              </Button>
              {picture && (
                <span className="text-sm text-muted-foreground">
                  {picture.name}
                </span>
              )}
              {!picture && ngo.pictureUrl && (
                <span className="text-sm text-muted-foreground">
                  Current: {ngo.pictureUrl.split('/').pop()}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Updating..." : "Update NGO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
