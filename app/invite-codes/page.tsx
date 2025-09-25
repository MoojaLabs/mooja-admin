import { Key, MoreHorizontal, Eye, Copy, Trash2, Building2, CheckCircle, Clock, XCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { getInviteCodes } from "@/lib/actions/invite-code-actions";
import { InviteCodesClient } from "./invite-codes-client";

function getStatusBadge(isUsed: boolean, expiresAt: string) {
  const now = new Date();
  const expires = new Date(expiresAt);
  const isExpired = now > expires;

  if (isUsed) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Used
      </Badge>
    );
  }

  if (isExpired) {
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="w-3 h-3 mr-1" />
        Expired
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
      <Clock className="w-3 h-3 mr-1" />
      Active
    </Badge>
  );
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

export default async function InviteCodesPage() {
  const result = await getInviteCodes();
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invite Codes</h1>
            <p className="text-muted-foreground">
              Manage invitation codes for NGO registration
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-destructive/10 p-6">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading invite codes: {result.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inviteCodes = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invite Codes</h1>
          <p className="text-muted-foreground">
            Manage invitation codes for NGO registration
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Codes</p>
            <Key className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{inviteCodes.length}</div>
            <p className="text-xs text-muted-foreground">
              All time codes
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Active Codes</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {inviteCodes.filter(code => !code.isUsed && new Date(code.expiresAt) > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for use
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Used Codes</p>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {inviteCodes.filter(code => code.isUsed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully used
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Expired Codes</p>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {inviteCodes.filter(code => !code.isUsed && new Date(code.expiresAt) <= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              No longer valid
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Code</TableHead>
              <TableHead>Organizations</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[120px]">Expires</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inviteCodes.map((inviteCode) => (
              <TableRow key={inviteCode.id}>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{inviteCode.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {inviteCode.orgs.length > 0 ? (
                    <div className="space-y-1">
                      {inviteCode.orgs.map((org) => (
                        <div key={org.id} className="flex items-center gap-2 text-sm">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{org.name || org.username}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              org.verificationStatus === 'verified' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {org.verificationStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No organizations</span>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(inviteCode.isUsed, inviteCode.expiresAt)}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(inviteCode.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(inviteCode.expiresAt)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <InviteCodesClient inviteCode={inviteCode} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
