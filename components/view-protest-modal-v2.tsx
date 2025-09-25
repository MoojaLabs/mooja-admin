"use client"

import { MapPin, Calendar, Clock, Building2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

interface ViewProtestModalV2Props {
  protest: ProtestData | null
  isOpen: boolean
  onClose: () => void
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    case "scheduled":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    case "cancelled":
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Cancelled</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getCategoryBadge(category: string) {
  return (
    <Badge variant="outline" className="text-xs">
      {category || 'Other'}
    </Badge>
  );
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Country code to name mapping
const countryNames: { [key: string]: string } = {
  'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'AU': 'Australia',
  'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
  'JP': 'Japan', 'KR': 'South Korea', 'CN': 'China', 'IN': 'India',
  'BR': 'Brazil', 'AR': 'Argentina', 'MX': 'Mexico', 'RU': 'Russia'
};

function getCountryName(countryCode: string | null): string {
  if (!countryCode) return 'N/A';
  return countryNames[countryCode] || countryCode;
}

export function ViewProtestModalV2({ protest, isOpen, onClose }: ViewProtestModalV2Props) {
  if (!protest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{protest.title}</DialogTitle>
          <DialogDescription>
            Organized by {protest.organizer?.name || protest.organizer?.username || 'Unknown Organization'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status & Category */}
          <div className="flex items-center gap-2">
            {getStatusBadge(protest.status || 'scheduled')}
            {getCategoryBadge(protest.category || 'Other')}
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Location</h4>
            <p className="text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {protest.location}
              {protest.city && `, ${protest.city}`}
              {protest.country && `, ${getCountryName(protest.country)}`}
            </p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Date</h4>
              <p className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(protest.dateTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Time</h4>
              <p className="text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(protest.dateTime)}
              </p>
            </div>
          </div>

          {/* Organizer */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Organizer</h4>
            <p className="text-sm flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {protest.organizer?.name || 'Unknown'} (@{protest.organizer?.username})
            </p>
          </div>

          {/* Description */}
          {protest.description && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">
                {protest.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
