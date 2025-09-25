import { Building2, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Organization } from "@/lib/types";
import { CreateNgoModal } from "@/components/create-ngo-modal";
import { UpdateNgoModal } from "@/components/update-ngo-modal";
import { DeleteNgoDialog } from "@/components/delete-ngo-dialog";
import { getNGOs } from "@/lib/actions/ngo-actions";
import { NGOsPageClient } from "./ngos-client";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

export default async function NGOsPage() {
  const result = await getNGOs();
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NGOs</h1>
            <p className="text-muted-foreground">
              Manage verified organizations and their information
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading organizations: {result.error}</p>
        </div>
      </div>
    );
  }

  const ngos = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NGOs</h1>
          <p className="text-muted-foreground">
            Manage verified organizations and their information
          </p>
        </div>
        <CreateNgoModal />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Verified Organizations</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {ngos.length} organizations
            </span>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Organization</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Social Media</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ngos.map((ngo) => (
                <TableRow key={ngo.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold text-sm">
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
                      <div className="min-w-0">
                        <div className="font-medium truncate">{ngo.name || ngo.username}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          @{ngo.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{ngo.country || "N/A"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{ngo.socialMediaPlatform || "N/A"}</div>
                      <div className="text-muted-foreground">{ngo.socialMediaHandle || "N/A"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <NGOsPageClient ngo={ngo} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
