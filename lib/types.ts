export interface Organization {
  id: string
  username: string
  name: string | null
  country: string | null
  socialMediaPlatform: string | null
  socialMediaHandle: string | null
  pictureUrl: string | null
  verificationStatus: string
  inviteCodeUsed: string | null
  createdAt: string
  updatedAt: string
  verifiedAt: string | null
}
