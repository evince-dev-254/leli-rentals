import type { User, Listing, Booking, AdminStats, VerificationDocument } from "./types"

// Mock verification documents
const mockDocuments: VerificationDocument[] = [
  {
    id: "doc-1",
    userId: "user-2",
    type: "national_id",
    fileUrl: "/national-id-document.jpg",
    fileName: "national_id_front.jpg",
    uploadedAt: new Date("2025-12-01"),
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
  },
  {
    id: "doc-2",
    userId: "user-2",
    type: "business_registration",
    fileUrl: "/business-registration-certificate.jpg",
    fileName: "business_cert.pdf",
    uploadedAt: new Date("2025-12-01"),
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
  },
  {
    id: "doc-3",
    userId: "user-3",
    type: "national_id",
    fileUrl: "/id-card-scan.jpg",
    fileName: "id_scan.jpg",
    uploadedAt: new Date("2025-11-28"),
    status: "approved",
    reviewedBy: "admin-1",
    reviewedAt: new Date("2025-11-29"),
    rejectionReason: null,
  },
]

// Mock users with various statuses
export const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@lelirentals.com",
    fullName: "System Admin",
    phone: "+254 700 000 000",
    avatarUrl: null,
    role: "admin",
    accountStatus: "active",
    verificationStatus: "verified",
    verificationDeadline: null,
    verificationDocuments: [],
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-12-01"),
    lastLoginAt: new Date("2025-12-05"),
    affiliateCode: null,
    referredBy: null,
    totalReferrals: 0,
    totalEarnings: 0,
  },
  {
    id: "user-2",
    email: "john.owner@gmail.com",
    fullName: "John Kamau",
    phone: "+254 712 345 678",
    avatarUrl: "/african-man-portrait.png",
    role: "owner",
    accountStatus: "pending_verification",
    verificationStatus: "submitted",
    verificationDeadline: new Date("2025-12-08"),
    verificationDocuments: mockDocuments.filter((d) => d.userId === "user-2"),
    subscriptionPlan: "monthly",
    subscriptionExpiresAt: new Date("2026-01-05"),
    createdAt: new Date("2025-12-03"),
    updatedAt: new Date("2025-12-03"),
    lastLoginAt: new Date("2025-12-05"),
    affiliateCode: null,
    referredBy: null,
    totalReferrals: 0,
    totalEarnings: 0,
  },
  {
    id: "user-3",
    email: "mary.affiliate@gmail.com",
    fullName: "Mary Wanjiku",
    phone: "+254 723 456 789",
    avatarUrl: "/african-woman-portrait.png",
    role: "affiliate",
    accountStatus: "active",
    verificationStatus: "verified",
    verificationDeadline: null,
    verificationDocuments: mockDocuments.filter((d) => d.userId === "user-3"),
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    createdAt: new Date("2025-11-20"),
    updatedAt: new Date("2025-11-29"),
    lastLoginAt: new Date("2025-12-04"),
    affiliateCode: "MARY2025",
    referredBy: null,
    totalReferrals: 15,
    totalEarnings: 7500,
  },
  {
    id: "user-4",
    email: "peter.owner@gmail.com",
    fullName: "Peter Ochieng",
    phone: "+254 734 567 890",
    avatarUrl: "/kenyan-man-business.jpg",
    role: "owner",
    accountStatus: "suspended",
    verificationStatus: "pending",
    verificationDeadline: new Date("2025-12-01"), // Deadline passed
    verificationDocuments: [],
    subscriptionPlan: "weekly",
    subscriptionExpiresAt: new Date("2025-12-10"),
    createdAt: new Date("2025-11-26"),
    updatedAt: new Date("2025-12-02"),
    lastLoginAt: new Date("2025-11-28"),
    affiliateCode: null,
    referredBy: "MARY2025",
    totalReferrals: 0,
    totalEarnings: 0,
  },
  {
    id: "user-5",
    email: "grace.renter@gmail.com",
    fullName: "Grace Muthoni",
    phone: "+254 745 678 901",
    avatarUrl: "/young-african-woman.jpg",
    role: "renter",
    accountStatus: "active",
    verificationStatus: "verified",
    verificationDeadline: null,
    verificationDocuments: [],
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-12-01"),
    lastLoginAt: new Date("2025-12-05"),
    affiliateCode: null,
    referredBy: null,
    totalReferrals: 0,
    totalEarnings: 0,
  },
  {
    id: "user-6",
    email: "james.affiliate@gmail.com",
    fullName: "James Kiprop",
    phone: "+254 756 789 012",
    avatarUrl: "/kenyan-businessman.jpg",
    role: "affiliate",
    accountStatus: "pending_verification",
    verificationStatus: "pending",
    verificationDeadline: new Date("2025-12-09"),
    verificationDocuments: [],
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    createdAt: new Date("2025-12-04"),
    updatedAt: new Date("2025-12-04"),
    lastLoginAt: new Date("2025-12-04"),
    affiliateCode: "JAMES2025",
    referredBy: null,
    totalReferrals: 0,
    totalEarnings: 0,
  },
]

export const mockListings: Listing[] = [
  {
    id: "listing-1",
    ownerId: "user-2",
    title: "Toyota Land Cruiser V8",
    description: "Luxury SUV perfect for safaris and road trips",
    category: "vehicles",
    pricePerDay: 15000,
    pricePerWeek: 90000,
    pricePerMonth: 300000,
    images: ["/toyota-land-cruiser-black.jpg"],
    location: "Nairobi, Kenya",
    isActive: true,
    isApproved: true,
    createdAt: new Date("2025-11-20"),
    updatedAt: new Date("2025-11-20"),
  },
  {
    id: "listing-2",
    ownerId: "user-2",
    title: "3 Bedroom Apartment - Westlands",
    description: "Modern furnished apartment in the heart of Westlands",
    category: "homes",
    pricePerDay: 8000,
    pricePerWeek: 50000,
    pricePerMonth: 180000,
    images: ["/modern-apartment-nairobi.jpg"],
    location: "Westlands, Nairobi",
    isActive: true,
    isApproved: false,
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2025-12-01"),
  },
]

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    listingId: "listing-1",
    renterId: "user-5",
    ownerId: "user-2",
    startDate: new Date("2025-12-10"),
    endDate: new Date("2025-12-15"),
    totalPrice: 75000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date("2025-12-03"),
  },
]

export const mockAdminStats: AdminStats = {
  totalUsers: 156,
  totalOwners: 45,
  totalAffiliates: 23,
  totalRenters: 87,
  pendingVerifications: 12,
  activeListings: 234,
  totalBookings: 567,
  totalRevenue: 2450000,
  suspendedAccounts: 3,
}

// Helper function to get all pending verification documents
export function getPendingVerificationDocuments(): (VerificationDocument & { user: User })[] {
  return mockDocuments
    .filter((doc) => doc.status === "pending")
    .map((doc) => ({
      ...doc,
      user: mockUsers.find((u) => u.id === doc.userId)!,
    }))
}

// Helper function to get users needing verification
export function getUsersNeedingVerification(): User[] {
  return mockUsers.filter(
    (user) =>
      (user.role === "owner" || user.role === "affiliate") &&
      (user.verificationStatus === "pending" || user.verificationStatus === "submitted"),
  )
}

// Helper function to get suspended users
export function getSuspendedUsers(): User[] {
  return mockUsers.filter((user) => user.accountStatus === "suspended")
}
