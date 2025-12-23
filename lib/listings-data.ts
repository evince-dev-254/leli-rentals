export interface Listing {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  location: string
  city: string
  latitude?: number
  longitude?: number
  images: string[]
  ownerId: string
  ownerName: string
  ownerAvatar: string
  ownerRating: number
  ownerReviews: number
  rating: number
  reviewCount: number
  isVerified: boolean
  isFeatured: boolean
  isAvailable: boolean
  amenities: string[]
  createdAt: Date
}

import { categories } from "@/lib/categories-data"

// Helper to generate mock listings
const generateMockListings = (): Listing[] => {
  const generatedListings: Listing[] = []
  let idCounter = 1

  categories.forEach((category) => {
    category.subcategories.forEach((sub) => {
      // Generate 5 listings for each subcategory
      for (let i = 1; i <= 5; i++) {
        generatedListings.push({
          id: (idCounter++).toString(),
          title: `${sub.name} Item ${i}`,
          description: `High-quality ${sub.name.toLowerCase()} available for rent. Perfect for your needs. Well maintained and ready for use.`,
          category: category.id,
          subcategory: sub.name,
          pricePerDay: Math.floor(Math.random() * 10000) + 1000,
          pricePerWeek: Math.floor(Math.random() * 50000) + 5000,
          pricePerMonth: Math.floor(Math.random() * 200000) + 20000,
          location: "Nairobi, Kenya",
          city: "Nairobi",
          images: [sub.image || "/placeholder.svg"], // Use subcategory image as fallback
          ownerId: `owner-${Math.floor(Math.random() * 10) + 1}`,
          ownerName: "Verified Owner",
          ownerAvatar: "/placeholder-user.jpg",
          ownerRating: 4.8,
          ownerReviews: Math.floor(Math.random() * 100) + 10,
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 50) + 5,
          isVerified: true,
          isFeatured: Math.random() > 0.8,
          isAvailable: true,
          amenities: ["Verified", "Instant Booking", "Delivery Available"],
          createdAt: new Date(),
        })
      }
    })
  })

  return generatedListings
}


export const listings: Listing[] = [
  ...generateMockListings(),
]

export const getListingsByCategory = (categoryId: string) =>
  listings.filter((listing) => listing.category === categoryId)

export const getFeaturedListings = () => listings.filter((listing) => listing.isFeatured)

export const getListingById = (id: string) => listings.find((listing) => listing.id === id)

export const getListingsByCity = (city: string) => listings.filter((listing) => listing.city === city)

export const getListingsBySubcategory = (subcategory: string) =>
  listings.filter((listing) => listing.subcategory === subcategory)

export const getCities = () => [...new Set(listings.map((listing) => listing.city))]

export const getPriceRange = () => {
  const prices = listings.map((l) => l.pricePerDay)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

export const getAllListings = () => listings

export const searchListings = (
  query: string,
  category?: string,
  city?: string,
  minPrice?: number,
  maxPrice?: number,
  subcategory?: string,
) => {
  return listings.filter((listing) => {
    const matchesQuery =
      !query ||
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !category || listing.category === category
    const matchesCity = !city || listing.city === city
    const matchesMinPrice = !minPrice || listing.pricePerDay >= minPrice
    const matchesMaxPrice = !maxPrice || listing.pricePerDay <= maxPrice
    const matchesSubcategory = !subcategory || listing.subcategory === subcategory
    return matchesQuery && matchesCategory && matchesCity && matchesMinPrice && matchesMaxPrice && matchesSubcategory
  })
}
