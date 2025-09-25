"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Building2, MapPin, Calendar, Globe, ExternalLink } from "lucide-react"
import { Organization } from "@/lib/types"

interface ViewNgoModalProps {
  ngo: Organization | null
  isOpen: boolean
  onClose: () => void
}

function formatDate(dateString: string | null) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function ViewNgoModal({ ngo, isOpen, onClose }: ViewNgoModalProps) {
  if (!ngo) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Organization Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this organization
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="flex aspect-square size-20 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold text-xl">
                  {ngo.pictureUrl ? (
                    <img 
                      src={ngo.pictureUrl} 
                      alt={ngo.name || ngo.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(ngo.name || ngo.username)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-2xl truncate">{ngo.name || ngo.username}</CardTitle>
                  <CardDescription className="text-base">@{ngo.username}</CardDescription>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge 
                      variant={ngo.verificationStatus === 'verified' ? 'default' : 'secondary'}
                    >
                      {ngo.verificationStatus === 'verified' ? 'Verified' : ngo.verificationStatus}
                    </Badge>
                    {ngo.verifiedAt && (
                      <span className="text-sm text-muted-foreground">
                        Verified {formatDate(ngo.verifiedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organization Name</p>
                  <p className="text-sm">{ngo.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p className="text-sm font-mono">@{ngo.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Country</p>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {ngo.country || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platform</p>
                  <p className="text-sm">{ngo.socialMediaPlatform || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Handle</p>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded text-xs">
                    {ngo.socialMediaHandle || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(ngo.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(ngo.updatedAt)}</p>
                </div>
                {ngo.verifiedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Verified At</p>
                    <p className="text-sm">{formatDate(ngo.verifiedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          {(ngo.inviteCodeUsed || ngo.pictureUrl) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ngo.inviteCodeUsed && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Invite Code Used</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded text-xs">
                      {ngo.inviteCodeUsed}
                    </p>
                  </div>
                )}
                {ngo.pictureUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Picture</p>
                    <div className="flex items-center gap-3 mt-2">
                      <img 
                        src={ngo.pictureUrl} 
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <a 
                        href={ngo.pictureUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View full size
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
