import { Footer } from "@/components/layout/footer"
import { ListingDetailContent } from "@/components/listings/listing-detail-content"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch listing from database
  const { data: listing, error } = await supabase
    .from("listings")
    .select(`
      *,
      owner:user_profiles!owner_id(id, full_name, avatar_url, email, phone, location, created_at),
      category:categories(name, slug)
    `)
    .eq("id", id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Transform Supabase data to match Listing interface
  const transformedListing: any = {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    pricePerDay: Number(listing.price_per_day),
    pricePerWeek: Number(listing.price_per_week || listing.price_per_day * 7),
    pricePerMonth: Number(listing.price_per_month || listing.price_per_day * 30),
    location: listing.location,
    latitude: Number(listing.latitude),
    longitude: Number(listing.longitude),
    images: listing.images || [],
    category: listing.category_id || "equipment", // Use category ID for lookup
    subcategory: listing.subcategory_id || "General",
    amenities: listing.amenities || [],
    rating: listing.rating_average || 0,
    reviewCount: listing.rating_count || 0,
    isFeatured: listing.is_featured,
    isVerified: listing.is_verified,
    ownerId: listing.owner_id,
    ownerName: listing.owner?.full_name || "Unknown Owner",
    ownerAvatar: listing.owner?.avatar_url,
    ownerRating: 5.0, // Default or fetch real owner rating
    ownerReviews: 0,
    availability: listing.availability_status
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ListingDetailContent listing={transformedListing} />
      </main>
      <Footer />
    </div>
  )
}
