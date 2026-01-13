// User types and verification system types

export type UserRole = "renter" | "owner" | "affiliate" | "admin" | "staff"

export type VerificationStatus = "pending" | "submitted" | "verified" | "rejected" | "suspended"

export type AccountStatus = "active" | "pending_verification" | "suspended" | "banned"

export type SubscriptionPlan = "weekly" | "monthly" | null

export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  avatarUrl: string | null
  role: UserRole
  accountStatus: AccountStatus
  verificationStatus: VerificationStatus
  verificationDeadline: Date | null // 5 days from registration for owners/affiliates
  verificationDocuments: VerificationDocument[]
  subscriptionPlan: SubscriptionPlan
  subscriptionExpiresAt: Date | null
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date | null
  // Affiliate specific
  affiliateCode: string | null
  isReferred: boolean
  referredBy: string | null
  totalReferrals: number
  totalEarnings: number
  isStaff: boolean
  isAdmin: boolean
}

export interface VerificationDocument {
  id: string
  userId: string
  type: "national_id" | "passport" | "drivers_license" | "business_registration" | "tax_certificate"
  fileUrl: string
  fileName: string
  backImageUrl?: string
  selfieImageUrl?: string
  uploadedAt: Date
  status: "pending" | "approved" | "rejected"
  reviewedBy: string | null
  reviewedAt: Date | null
  rejectionReason: string | null
}

export interface Listing {
  id: string
  ownerId: string
  title: string
  description: string
  category: string
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  images: string[]
  location: string
  isActive: boolean
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  listingId: string
  renterId: string
  ownerId: string
  startDate: Date
  endDate: Date
  totalPrice: number
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: Date
}

export interface AdminStats {
  totalUsers: number
  totalOwners: number
  totalAffiliates: number
  totalRenters: number
  pendingVerifications: number
  activeListings: number
  totalBookings: number
  totalRevenue: number
  suspendedAccounts: number
}
