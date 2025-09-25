import { 
  BarChart3, 
  Building2, 
  Megaphone, 
  Key, 
  Clock, 
  CheckCircle, 
  Eye, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/actions/dashboard-actions";

function getStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    case "approved":
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Approved</Badge>;
    case "under_review":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
    case "rejected":
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatChange(change: number) {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const color = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className={`flex items-center text-xs ${color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {Math.abs(change)}% from last month
    </div>
  );
}

export default async function Dashboard() {
  const result = await getDashboardStats();
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Mooja Admin Dashboard. Manage NGOs, protests, and invite codes.
          </p>
        </div>
        <div className="rounded-lg border bg-destructive/10 p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading dashboard: {result.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recent } = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Mooja Admin Dashboard. Manage NGOs, protests, and invite codes.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total NGOs</p>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalNGOs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedNGOs} verified
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Pending Requests</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.pendingRequests + stats.underReviewRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Protests</p>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalProtests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProtests} upcoming
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Invite Codes</p>
            <Key className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalInviteCodes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeInviteCodes} active
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Recent NGOs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Latest organization registrations
            </p>
            <div className="space-y-3">
              {recent.ngos.length > 0 ? (
                recent.ngos.map((ngo) => (
                  <div key={ngo.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ngo.name || ngo.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(ngo.createdAt)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(ngo.verificationStatus)}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent NGOs
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Pending Requests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Awaiting verification
            </p>
            <div className="space-y-3">
              {recent.requests.length > 0 ? (
                recent.requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Eye className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{request.name || request.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.verificationStatus)}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No pending requests
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Protests and Invite Codes */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Recent Protests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Latest protest events
            </p>
            <div className="space-y-3">
              {recent.protests.length > 0 ? (
                recent.protests.map((protest) => (
                  <div key={protest.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{protest.title}</p>
                        <p className="text-xs text-muted-foreground">
                          by {protest.organizer?.name || protest.organizer?.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(protest.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent protests
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Recent Invite Codes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Latest generated codes
            </p>
            <div className="space-y-3">
              {recent.inviteCodes.length > 0 ? (
                recent.inviteCodes.map((code) => (
                  <div key={code.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Key className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-mono font-medium">{code.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {code.orgs.length > 0 ? `Used by ${code.orgs.length} org(s)` : 'Unused'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(code.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent codes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}