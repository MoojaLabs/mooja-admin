"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2 } from "lucide-react"
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
import { createNGO } from "@/lib/actions/ngo-actions"

interface CreateNgoModalProps {
  onSuccess?: () => void
}

export function CreateNgoModal({ onSuccess }: CreateNgoModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    country: "",
    socialMediaPlatform: "",
    socialMediaHandle: "",
    password: "",
    verificationStatus: "verified" as const
  })
  const [picture, setPicture] = useState<File | null>(null)

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

      const result = await createNGO(formDataToSend)

      if (!result.success) {
        throw new Error(result.error || 'Failed to create NGO')
      }

      // Reset form and close modal
      setFormData({
        username: "",
        name: "",
        country: "",
        socialMediaPlatform: "",
        socialMediaHandle: "",
        password: "",
        verificationStatus: "verified"
      })
      setPicture(null)
      setOpen(false)
      onSuccess?.() // Refresh the NGOs list (optional)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Building2 className="w-4 h-4 mr-2" />
          Add NGO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-full">
        <DialogHeader>
          <DialogTitle>Create New NGO</DialogTitle>
          <DialogDescription>
            Add a new organization to the system. All fields are required.
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
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter password"
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
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Creating..." : "Create NGO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
