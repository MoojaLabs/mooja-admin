"use client"

import { useState } from "react"
import { Eye, CheckCircle, XCircle, Clock, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  TableProvider,
  TableHeader,
  TableHeaderGroup,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableColumnHeader,
  type ColumnDef,
} from "@/components/ui/shadcn-io/table"
import { RequestData } from "@/lib/actions/request-actions"
import { updateRequestStatus } from "@/lib/actions/request-actions"
import { useRouter } from "next/navigation"

interface RequestsPageClientProps {
  requests: RequestData[]
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "under_review":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Eye className="w-3 h-3 mr-1" />
          Under Review
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "verified":
      return (
        <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
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


// Country code to name mapping
const countryNames: { [key: string]: string } = {
  'US': 'United States',
  'CA': 'Canada',
  'GB': 'United Kingdom',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'HR': 'Croatia',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'CY': 'Cyprus',
  'MT': 'Malta',
  'LU': 'Luxembourg',
  'IS': 'Iceland',
  'LI': 'Liechtenstein',
  'MC': 'Monaco',
  'SM': 'San Marino',
  'VA': 'Vatican City',
  'AD': 'Andorra',
  'JP': 'Japan',
  'KR': 'South Korea',
  'CN': 'China',
  'IN': 'India',
  'TH': 'Thailand',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'TH': 'Thailand',
  'MM': 'Myanmar',
  'KH': 'Cambodia',
  'LA': 'Laos',
  'BN': 'Brunei',
  'TL': 'East Timor',
  'BD': 'Bangladesh',
  'LK': 'Sri Lanka',
  'MV': 'Maldives',
  'NP': 'Nepal',
  'BT': 'Bhutan',
  'PK': 'Pakistan',
  'AF': 'Afghanistan',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'SY': 'Syria',
  'LB': 'Lebanon',
  'JO': 'Jordan',
  'IL': 'Israel',
  'PS': 'Palestine',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'QA': 'Qatar',
  'BH': 'Bahrain',
  'KW': 'Kuwait',
  'OM': 'Oman',
  'YE': 'Yemen',
  'TR': 'Turkey',
  'GE': 'Georgia',
  'AM': 'Armenia',
  'AZ': 'Azerbaijan',
  'KZ': 'Kazakhstan',
  'UZ': 'Uzbekistan',
  'TM': 'Turkmenistan',
  'TJ': 'Tajikistan',
  'KG': 'Kyrgyzstan',
  'MN': 'Mongolia',
  'RU': 'Russia',
  'BY': 'Belarus',
  'UA': 'Ukraine',
  'MD': 'Moldova',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'AL': 'Albania',
  'MK': 'North Macedonia',
  'ME': 'Montenegro',
  'RS': 'Serbia',
  'BA': 'Bosnia and Herzegovina',
  'XK': 'Kosovo',
  'MX': 'Mexico',
  'GT': 'Guatemala',
  'BZ': 'Belize',
  'SV': 'El Salvador',
  'HN': 'Honduras',
  'NI': 'Nicaragua',
  'CR': 'Costa Rica',
  'PA': 'Panama',
  'CU': 'Cuba',
  'JM': 'Jamaica',
  'HT': 'Haiti',
  'DO': 'Dominican Republic',
  'PR': 'Puerto Rico',
  'TT': 'Trinidad and Tobago',
  'BB': 'Barbados',
  'LC': 'Saint Lucia',
  'VC': 'Saint Vincent and the Grenadines',
  'GD': 'Grenada',
  'AG': 'Antigua and Barbuda',
  'KN': 'Saint Kitts and Nevis',
  'DM': 'Dominica',
  'BS': 'Bahamas',
  'AR': 'Argentina',
  'BO': 'Bolivia',
  'BR': 'Brazil',
  'CL': 'Chile',
  'CO': 'Colombia',
  'EC': 'Ecuador',
  'FK': 'Falkland Islands',
  'GF': 'French Guiana',
  'GY': 'Guyana',
  'PY': 'Paraguay',
  'PE': 'Peru',
  'SR': 'Suriname',
  'UY': 'Uruguay',
  'VE': 'Venezuela',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'LY': 'Libya',
  'TN': 'Tunisia',
  'DZ': 'Algeria',
  'MA': 'Morocco',
  'SD': 'Sudan',
  'SS': 'South Sudan',
  'ET': 'Ethiopia',
  'ER': 'Eritrea',
  'DJ': 'Djibouti',
  'SO': 'Somalia',
  'KE': 'Kenya',
  'UG': 'Uganda',
  'TZ': 'Tanzania',
  'RW': 'Rwanda',
  'BI': 'Burundi',
  'MW': 'Malawi',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe',
  'BW': 'Botswana',
  'NA': 'Namibia',
  'SZ': 'Eswatini',
  'LS': 'Lesotho',
  'MG': 'Madagascar',
  'MU': 'Mauritius',
  'SC': 'Seychelles',
  'KM': 'Comoros',
  'YT': 'Mayotte',
  'RE': 'Réunion',
  'MZ': 'Mozambique',
  'AO': 'Angola',
  'CD': 'Democratic Republic of the Congo',
  'CG': 'Republic of the Congo',
  'CM': 'Cameroon',
  'CF': 'Central African Republic',
  'TD': 'Chad',
  'GQ': 'Equatorial Guinea',
  'GA': 'Gabon',
  'ST': 'São Tomé and Príncipe',
  'GH': 'Ghana',
  'TG': 'Togo',
  'BJ': 'Benin',
  'NE': 'Niger',
  'BF': 'Burkina Faso',
  'ML': 'Mali',
  'SN': 'Senegal',
  'GM': 'Gambia',
  'GN': 'Guinea',
  'GW': 'Guinea-Bissau',
  'SL': 'Sierra Leone',
  'LR': 'Liberia',
  'CI': 'Ivory Coast',
  'NG': 'Nigeria',
  'CV': 'Cape Verde',
  'MR': 'Mauritania',
  'EH': 'Western Sahara',
  'FJ': 'Fiji',
  'PG': 'Papua New Guinea',
  'SB': 'Solomon Islands',
  'VU': 'Vanuatu',
  'NC': 'New Caledonia',
  'PF': 'French Polynesia',
  'WS': 'Samoa',
  'KI': 'Kiribati',
  'TV': 'Tuvalu',
  'NR': 'Nauru',
  'TO': 'Tonga',
  'NU': 'Niue',
  'CK': 'Cook Islands',
  'TK': 'Tokelau',
  'WF': 'Wallis and Futuna',
  'AS': 'American Samoa',
  'GU': 'Guam',
  'MP': 'Northern Mariana Islands',
  'VI': 'U.S. Virgin Islands',
  'PR': 'Puerto Rico',
  'AI': 'Anguilla',
  'AW': 'Aruba',
  'BB': 'Barbados',
  'BQ': 'Bonaire',
  'VG': 'British Virgin Islands',
  'KY': 'Cayman Islands',
  'CW': 'Curaçao',
  'DM': 'Dominica',
  'DO': 'Dominican Republic',
  'GD': 'Grenada',
  'GP': 'Guadeloupe',
  'HT': 'Haiti',
  'JM': 'Jamaica',
  'MQ': 'Martinique',
  'MS': 'Montserrat',
  'KN': 'Saint Kitts and Nevis',
  'LC': 'Saint Lucia',
  'MF': 'Saint Martin',
  'VC': 'Saint Vincent and the Grenadines',
  'SX': 'Sint Maarten',
  'TT': 'Trinidad and Tobago',
  'TC': 'Turks and Caicos Islands',
  'VI': 'U.S. Virgin Islands',
  'NZ': 'New Zealand',
  'AU': 'Australia',
  'FJ': 'Fiji',
  'PG': 'Papua New Guinea',
  'SB': 'Solomon Islands',
  'VU': 'Vanuatu',
  'NC': 'New Caledonia',
  'PF': 'French Polynesia',
  'WS': 'Samoa',
  'KI': 'Kiribati',
  'TV': 'Tuvalu',
  'NR': 'Nauru',
  'TO': 'Tonga',
  'NU': 'Niue',
  'CK': 'Cook Islands',
  'TK': 'Tokelau',
  'WF': 'Wallis and Futuna',
  'AS': 'American Samoa',
  'GU': 'Guam',
  'MP': 'Northern Mariana Islands',
  'VI': 'U.S. Virgin Islands',
  'PR': 'Puerto Rico',
  'AI': 'Anguilla',
  'AW': 'Aruba',
  'BB': 'Barbados',
  'BQ': 'Bonaire',
  'VG': 'British Virgin Islands',
  'KY': 'Cayman Islands',
  'CW': 'Curaçao',
  'DM': 'Dominica',
  'DO': 'Dominican Republic',
  'GD': 'Grenada',
  'GP': 'Guadeloupe',
  'HT': 'Haiti',
  'JM': 'Jamaica',
  'MQ': 'Martinique',
  'MS': 'Montserrat',
  'KN': 'Saint Kitts and Nevis',
  'LC': 'Saint Lucia',
  'MF': 'Saint Martin',
  'VC': 'Saint Vincent and the Grenadines',
  'SX': 'Sint Maarten',
  'TT': 'Trinidad and Tobago',
  'TC': 'Turks and Caicos Islands',
  'VI': 'U.S. Virgin Islands'
};

function getCountryName(countryCode: string | null): string {
  if (!countryCode) return 'N/A';
  return countryNames[countryCode] || countryCode;
}

export function RequestsPageClient({ requests }: RequestsPageClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showInviteCode, setShowInviteCode] = useState<{code: string, expiresAt: string} | null>(null)

  const handleStatusUpdate = async (id: string, status: 'pending' | 'under_review' | 'verified' | 'rejected') => {
    setLoading(id)
    try {
      const result = await updateRequestStatus(id, status)
      if (result.success) {
        // If approving, show the invite code
        if (status === 'verified' && result.inviteCode) {
          setShowInviteCode(result.inviteCode)
        }
        router.refresh() // Refresh the page to show updated data
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(null)
    }
  }

  const columns: ColumnDef<RequestData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Organization" />
      ),
      cell: ({ row }) => {
        const request = row.original
        return (
          <div className="min-w-0">
            <div className="font-medium truncate">{request.name || 'Unknown'}</div>
            <div className="text-sm text-muted-foreground truncate">
              @{request.username}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "country",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Country" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{getCountryName(row.getValue("country"))}</span>
      ),
    },
    {
      accessorKey: "socialMediaPlatform",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Social Media" />
      ),
      cell: ({ row }) => {
        const platform = row.getValue("socialMediaPlatform") as string
        const handle = row.original.socialMediaHandle
        return (
          <div className="text-sm">
            <div className="font-medium">{platform || 'N/A'}</div>
            <div className="text-muted-foreground">{handle || 'N/A'}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "verificationStatus",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("verificationStatus") as string
        return getStatusBadge(status)
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original
        const isLoading = loading === request.id
        
        return (
          <div className="flex items-center gap-2 justify-start">
            {request.verificationStatus === 'pending' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleStatusUpdate(request.id, 'under_review')}
                disabled={isLoading}
                className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800"
              >
                <Eye className="mr-2 h-4 w-4" />
                Review
              </Button>
            )}
            
            {request.verificationStatus === 'under_review' && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleStatusUpdate(request.id, 'verified')}
                  disabled={isLoading}
                  className="h-8 px-3 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleStatusUpdate(request.id, 'rejected')}
                  disabled={isLoading}
                  className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
            
            {request.verificationStatus === 'approved' && (
              <span className="text-sm text-muted-foreground">Awaiting mobile app verification</span>
            )}
            
            {request.verificationStatus === 'rejected' && (
              <span className="text-sm text-muted-foreground">No actions available</span>
            )}
          </div>
        )
      },
    },
  ]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatExpirationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <TableProvider columns={columns} data={requests}>
          <TableHeader>
            {({ headerGroup }) => (
              <TableHeaderGroup headerGroup={headerGroup}>
                {({ header }) => <TableHead header={header} />}
              </TableHeaderGroup>
            )}
          </TableHeader>
          <TableBody>
            {({ row }) => (
              <TableRow row={row}>
                {({ cell }) => <TableCell cell={cell} />}
              </TableRow>
            )}
          </TableBody>
        </TableProvider>
      </div>

      {/* Invite Code Dialog */}
      <Dialog open={!!showInviteCode} onOpenChange={() => setShowInviteCode(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Organization Approved!
            </DialogTitle>
            <DialogDescription>
              The organization has been approved and an invite code has been generated. 
              Share this code with the organization so they can complete verification in the mobile app.
            </DialogDescription>
          </DialogHeader>
          
          {showInviteCode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Invite Code</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-md font-mono text-lg font-semibold text-center">
                    {showInviteCode.code}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(showInviteCode.code)}
                    className="px-3"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Expires</label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {formatExpirationDate(showInviteCode.expiresAt)}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> This invite code is valid for 30 days. 
                  The organization must use this code to complete their registration.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowInviteCode(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
