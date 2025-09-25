"use client"

import { Megaphone, MapPin, Calendar, Clock, Users, Building2, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

interface ViewProtestModalProps {
  protest: ProtestData | null
  isOpen: boolean
  onClose: () => void
}

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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

// Country code to name mapping
const countryNames: { [key: string]: string } = {
  'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'AU': 'Australia',
  'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
  'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway',
  'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary',
  'RO': 'Romania', 'BG': 'Bulgaria', 'HR': 'Croatia', 'SI': 'Slovenia', 'SK': 'Slovakia',
  'LT': 'Lithuania', 'LV': 'Latvia', 'EE': 'Estonia', 'IE': 'Ireland', 'PT': 'Portugal',
  'GR': 'Greece', 'CY': 'Cyprus', 'MT': 'Malta', 'LU': 'Luxembourg', 'IS': 'Iceland',
  'LI': 'Liechtenstein', 'MC': 'Monaco', 'SM': 'San Marino', 'VA': 'Vatican City',
  'AD': 'Andorra', 'JP': 'Japan', 'KR': 'South Korea', 'CN': 'China', 'IN': 'India',
  'SG': 'Singapore', 'MY': 'Malaysia', 'TH': 'Thailand', 'VN': 'Vietnam', 'PH': 'Philippines',
  'ID': 'Indonesia', 'BN': 'Brunei', 'KH': 'Cambodia', 'LA': 'Laos', 'MM': 'Myanmar',
  'BD': 'Bangladesh', 'LK': 'Sri Lanka', 'MV': 'Maldives', 'NP': 'Nepal', 'BT': 'Bhutan',
  'PK': 'Pakistan', 'AF': 'Afghanistan', 'IR': 'Iran', 'IQ': 'Iraq', 'SY': 'Syria',
  'LB': 'Lebanon', 'JO': 'Jordan', 'IL': 'Israel', 'PS': 'Palestine', 'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates', 'QA': 'Qatar', 'BH': 'Bahrain', 'KW': 'Kuwait', 'OM': 'Oman',
  'YE': 'Yemen', 'EG': 'Egypt', 'LY': 'Libya', 'TN': 'Tunisia', 'DZ': 'Algeria', 'MA': 'Morocco',
  'SD': 'Sudan', 'SS': 'South Sudan', 'ET': 'Ethiopia', 'ER': 'Eritrea', 'DJ': 'Djibouti',
  'SO': 'Somalia', 'KE': 'Kenya', 'UG': 'Uganda', 'TZ': 'Tanzania', 'RW': 'Rwanda',
  'BI': 'Burundi', 'MW': 'Malawi', 'ZM': 'Zambia', 'ZW': 'Zimbabwe', 'BW': 'Botswana',
  'NA': 'Namibia', 'ZA': 'South Africa', 'SZ': 'Eswatini', 'LS': 'Lesotho', 'MG': 'Madagascar',
  'MU': 'Mauritius', 'SC': 'Seychelles', 'KM': 'Comoros', 'YT': 'Mayotte', 'RE': 'Réunion',
  'MZ': 'Mozambique', 'AO': 'Angola', 'CD': 'Democratic Republic of the Congo', 'CG': 'Republic of the Congo',
  'CF': 'Central African Republic', 'TD': 'Chad', 'CM': 'Cameroon', 'GQ': 'Equatorial Guinea',
  'GA': 'Gabon', 'ST': 'São Tomé and Príncipe', 'GH': 'Ghana', 'TG': 'Togo', 'BJ': 'Benin',
  'NE': 'Niger', 'BF': 'Burkina Faso', 'ML': 'Mali', 'SN': 'Senegal', 'GM': 'Gambia',
  'GW': 'Guinea-Bissau', 'GN': 'Guinea', 'SL': 'Sierra Leone', 'LR': 'Liberia', 'CI': 'Ivory Coast',
  'MR': 'Mauritania', 'CV': 'Cape Verde', 'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile',
  'UY': 'Uruguay', 'PY': 'Paraguay', 'BO': 'Bolivia', 'PE': 'Peru', 'EC': 'Ecuador',
  'CO': 'Colombia', 'VE': 'Venezuela', 'GY': 'Guyana', 'SR': 'Suriname', 'GF': 'French Guiana',
  'FK': 'Falkland Islands', 'GS': 'South Georgia and the South Sandwich Islands', 'MX': 'Mexico',
  'GT': 'Guatemala', 'BZ': 'Belize', 'SV': 'El Salvador', 'HN': 'Honduras', 'NI': 'Nicaragua',
  'CR': 'Costa Rica', 'PA': 'Panama', 'CU': 'Cuba', 'JM': 'Jamaica', 'HT': 'Haiti',
  'DO': 'Dominican Republic', 'PR': 'Puerto Rico', 'VI': 'U.S. Virgin Islands', 'AG': 'Antigua and Barbuda',
  'BB': 'Barbados', 'DM': 'Dominica', 'GD': 'Grenada', 'KN': 'Saint Kitts and Nevis',
  'LC': 'Saint Lucia', 'VC': 'Saint Vincent and the Grenadines', 'TT': 'Trinidad and Tobago',
  'BS': 'Bahamas', 'TC': 'Turks and Caicos Islands', 'AW': 'Aruba', 'CW': 'Curaçao',
  'SX': 'Sint Maarten', 'BQ': 'Caribbean Netherlands', 'GL': 'Greenland', 'RU': 'Russia',
  'KZ': 'Kazakhstan', 'UZ': 'Uzbekistan', 'TM': 'Turkmenistan', 'TJ': 'Tajikistan',
  'KG': 'Kyrgyzstan', 'MN': 'Mongolia', 'KP': 'North Korea', 'TW': 'Taiwan', 'HK': 'Hong Kong',
  'MO': 'Macau', 'NZ': 'New Zealand', 'FJ': 'Fiji', 'PG': 'Papua New Guinea', 'SB': 'Solomon Islands',
  'VU': 'Vanuatu', 'NC': 'New Caledonia', 'PF': 'French Polynesia', 'WS': 'Samoa', 'TO': 'Tonga',
  'KI': 'Kiribati', 'TV': 'Tuvalu', 'NR': 'Nauru', 'PW': 'Palau', 'FM': 'Micronesia',
  'MH': 'Marshall Islands', 'AS': 'American Samoa', 'GU': 'Guam', 'MP': 'Northern Mariana Islands',
  'CK': 'Cook Islands', 'NU': 'Niue', 'TK': 'Tokelau', 'WF': 'Wallis and Futuna', 'WS': 'Samoa'
};

function getCountryName(countryCode: string | null): string {
  if (!countryCode) return 'N/A';
  return countryNames[countryCode] || countryCode;
}

export function ViewProtestModal({ protest, isOpen, onClose }: ViewProtestModalProps) {
  if (!protest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Protest Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this protest event
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-xl">{protest.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Organized by {protest.organizer?.name || protest.organizer?.username || 'Unknown Organization'}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {getStatusBadge(protest.status || 'scheduled')}
                  {getCategoryBadge(protest.category || 'Other')}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Location & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm">{protest.location}</p>
                </div>
                
                {protest.city && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-sm">{protest.city}</p>
                  </div>
                )}
                
                {protest.country && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-sm">{getCountryName(protest.country)}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(protest.dateTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(protest.dateTime)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Organizer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Organization</label>
                  <p className="text-sm font-medium">{protest.organizer?.name || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-sm text-muted-foreground">@{protest.organizer?.username}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {formatDate(protest.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {protest.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {protest.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
