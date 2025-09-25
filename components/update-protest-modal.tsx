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
import { Textarea } from "@/components/ui/textarea"
import { Megaphone, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CountrySelector } from "@/components/country-selector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProtest } from "@/lib/actions/protest-actions"
import { getNGOs } from "@/lib/actions/ngo-actions"

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

interface UpdateProtestModalProps {
  protest: ProtestData | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UpdateProtestModal({ protest, isOpen, onClose, onSuccess }: UpdateProtestModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    dateTime: "",
    organizerId: "",
    city: "",
    country: "",
  })

  // Pre-fill form when protest data changes
  useEffect(() => {
    if (protest) {
      setFormData({
        title: protest.title,
        description: protest.description || "",
        location: protest.location,
        dateTime: new Date(protest.dateTime).toISOString().slice(0, 16), // Format for datetime-local
        organizerId: protest.organizerId,
        city: protest.city || "",
        country: protest.country || "",
      })
    }
  }, [protest])

  // Fetch organizations when modal opens
  useEffect(() => {
    if (isOpen && organizations.length === 0) {
      const fetchOrganizations = async () => {
        try {
          const result = await getNGOs()
          if (result.success) {
            setOrganizations(result.data || [])
          }
        } catch (err) {
          console.error('Error fetching organizations:', err)
        }
      }
      fetchOrganizations()
    }
  }, [isOpen, organizations.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!protest) return

    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      const result = await updateProtest(protest.id, formDataToSend)

      if (!result.success) {
        throw new Error(result.error || 'Failed to update protest')
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!protest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-full">
        <DialogHeader>
          <DialogTitle>Update Protest</DialogTitle>
          <DialogDescription>
            Update the protest event information. Fields marked with * are required.
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
            <Label htmlFor="title">Protest Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter protest title"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter protest description"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter protest location"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <CountrySelector
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime">Date & Time *</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => handleInputChange("dateTime", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerId">Organizing Organization *</Label>
            <Select
              value={formData.organizerId}
              onValueChange={(value) => handleInputChange("organizerId", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name || org.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {loading ? "Updating..." : "Update Protest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
