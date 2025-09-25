import { Megaphone, MapPin, Eye, Edit, Trash2, Clock, Calendar, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CompactCard,
  CompactCardContent,
  CompactCardDescription,
  CompactCardFooter,
  CompactCardHeader,
  CompactCardTitle,
} from "@/components/ui/shadcn-io/compact-card";
import { CreateProtestModal } from "@/components/create-protest-modal";
import { ProtestsClient } from "./protests-client";
import { getProtests } from "@/lib/actions/protest-actions";

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Active
        </Badge>
      );
    case "scheduled":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
          Scheduled
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          Cancelled
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <div className="w-2 h-2 bg-gray-500 rounded-full mr-2" />
          Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getCategoryBadge(category: string) {
  const colors: { [key: string]: string } = {
    'Environment': 'bg-green-50 text-green-700 border-green-200',
    'Labor Rights': 'bg-blue-50 text-blue-700 border-blue-200',
    'Healthcare': 'bg-red-50 text-red-700 border-red-200',
    'Education': 'bg-purple-50 text-purple-700 border-purple-200',
    'Housing': 'bg-orange-50 text-orange-700 border-orange-200',
    'Digital Rights': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Social Justice': 'bg-pink-50 text-pink-700 border-pink-200',
    'Human Rights': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  const colorClass = colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  
  return (
    <Badge variant="outline" className={`${colorClass} text-xs`}>
      {category || 'Other'}
    </Badge>
  );
}

export default async function ProtestsPage() {
  const result = await getProtests();
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Protests</h1>
            <p className="text-muted-foreground">
              Manage and monitor ongoing and scheduled protests
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-destructive/10 p-6">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading protests: {result.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const protests = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Protests</h1>
          <p className="text-muted-foreground">
            Manage and monitor ongoing and scheduled protests
          </p>
        </div>
        <CreateProtestModal />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Active Protests</p>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {protests.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Scheduled</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {protests.filter(p => p.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Upcoming events
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Completed</p>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {protests.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Past events
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Protests</p>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{protests.length}</div>
            <p className="text-xs text-muted-foreground">
              All time protests
            </p>
          </div>
        </div>
      </div>

      {/* Protests Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {protests.map((protest) => (
          <div key={protest.id} className="aspect-square">
            <CompactCard className="hover:shadow-md transition-shadow h-full flex flex-col">
              <CompactCardHeader className="pb-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <CompactCardTitle className="truncate text-sm leading-tight">{protest.title}</CompactCardTitle>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {getStatusBadge(protest.status)}
                    </div>
                  </div>
                  <CompactCardDescription className="truncate text-xs">
                    {protest.organizer?.name || 'Unknown Organization'}
                  </CompactCardDescription>
                  <div className="flex justify-start">
                    {getCategoryBadge(protest.category || 'Other')}
                  </div>
                </div>
              </CompactCardHeader>
              
              <CompactCardContent className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-2">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{protest.location}</span>
                  </div>
                  
                  {/* Date - Separate Line */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(protest.dateTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Time - Separate Line */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(protest.dateTime)}</span>
                  </div>

                  {/* Description */}
                  {protest.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {protest.description}
                    </div>
                  )}
                </div>
              </CompactCardContent>
              
              <CompactCardFooter className="pt-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span className="truncate">{new Date(protest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <ProtestsClient protest={protest} />
                </div>
              </CompactCardFooter>
            </CompactCard>
          </div>
        ))}
      </div>

      {protests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No protests found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first protest event.
          </p>
          <CreateProtestModal />
        </div>
      )}
    </div>
  );
}
