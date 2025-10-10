// Simplified Prisma setup - will be enabled when Prisma is properly configured
// import { PrismaClient } from '@prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate())

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Temporary mock for development
export const prisma = {
  user: {
    create: async (data: any) => {
      console.log('Mock Prisma user.create called with:', data)
      return { id: 'mock-id', ...data.data }
    },
    findUnique: async (data: any) => {
      console.log('Mock Prisma user.findUnique called with:', data)
      return null
    },
    findMany: async (data: any) => {
      console.log('Mock Prisma user.findMany called with:', data)
      return []
    },
    update: async (data: any) => {
      console.log('Mock Prisma user.update called with:', data)
      return { id: data.where.id, ...data.data }
    }
  },
  listing: {
    create: async (data: any) => {
      console.log('Mock Prisma listing.create called with:', data)
      return { id: 'mock-listing-id', ...data.data }
    },
    findMany: async (data: any) => {
      console.log('Mock Prisma listing.findMany called with:', data)
      return []
    },
    findUnique: async (data: any) => {
      console.log('Mock Prisma listing.findUnique called with:', data)
      return null
    }
  },
  booking: {
    create: async (data: any) => {
      console.log('Mock Prisma booking.create called with:', data)
      return { id: 'mock-booking-id', ...data.data }
    },
    findMany: async (data: any) => {
      console.log('Mock Prisma booking.findMany called with:', data)
      return []
    }
  },
  review: {
    create: async (data: any) => {
      console.log('Mock Prisma review.create called with:', data)
      return { id: 'mock-review-id', ...data.data }
    },
    findMany: async (data: any) => {
      console.log('Mock Prisma review.findMany called with:', data)
      return []
    }
  }
}
