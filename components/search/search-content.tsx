"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Star, Heart, Grid3X3, List, SlidersHorizontal, Loader2, Filter } from "lucide-react"
import { FavoriteButton } from "@/components/listings/favorite-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { supabase } from "@/lib/supabase"
import { categories } from "@/lib/categories-data"
import { staggerContainer, fadeInUp, hoverScale } from "@/lib/animations"

function SearchResults() {
    const searchParams = useSearchParams()
    const [listings, setListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sortBy, setSortBy] = useState("newest")

    const query = searchParams.get("q") || ""
    const categoryId = searchParams.get("category") || "all"
    const city = searchParams.get("city") || "all"

    useEffect(() => {
        async function fetchListings() {
            setLoading(true)
            try {
                let supabaseQuery = supabase
                    .from("listings")
                    .select(`
            *,
            owner:user_profiles!owner_id(full_name, avatar_url),
            category:categories(name, slug)
          `)
                    .eq("status", "approved")
                    .in("availability_status", ["available", "rented"])

                if (query) {
                    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                }

                if (categoryId && categoryId !== "all") {
                    const { data: dbCategory, error: dbCatError } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('slug', categoryId)
                        .single()

                    if (dbCatError) {
                        console.error("Error fetching category ID:", dbCatError.message);
                    }

                    if (dbCategory) {
                        supabaseQuery = supabaseQuery.eq("category_id", dbCategory.id)
                    }
                }

                if (city && city !== "all") {
                    supabaseQuery = supabaseQuery.or(`city.eq."${city}",location.ilike.%${city}%`)
                }

                const { data, error } = await supabaseQuery

                if (error) {
                    console.error("Error fetching listings:", error.message, error.details, error.hint)
                } else {
                    setListings(data || [])
                }
            } catch (error) {
                console.error("Error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchListings()
    }, [query, categoryId, city])

    const sortedListings = [...listings].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return Number(a.price_per_day) - Number(b.price_per_day)
            case "price-high":
                return Number(b.price_per_day) - Number(a.price_per_day)
            case "rating":
                return (b.rating_average || 0) - (a.rating_average || 0)
            case "newest":
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            default:
                return 0
        }
    })

    return (
        <div className="flex flex-col gap-6">
            {/* Search Filters & Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 glass-card rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{sortedListings.length}</span> results
                    {query && (
                        <>
                            <span> for </span>
                            <span className="font-medium text-foreground">&quot;{query}&quot;</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-[180px] rounded-full border-white/10">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="rating">Top Rated</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center p-1 bg-muted/30 rounded-full border border-white/10 shrink-0">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "secondary" : "ghost"}
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Finding the best rentals for you...</p>
                </div>
            ) : sortedListings.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-3xl border border-white/10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No results found</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        We couldn&apos;t find any listings matching your search. Try adjusting your filters or search terms.
                    </p>
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            ) : viewMode === "grid" ? (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {sortedListings.map((listing) => (
                        <motion.div
                            key={listing.id}
                            variants={fadeInUp}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link href={`/listings/${listing.id}`} className="group block h-full">
                                <motion.div
                                    variants={hoverScale}
                                    className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500 h-full border border-white/10"
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        {listing.images && listing.images[0] ? (
                                            <Image
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground">No image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 z-10">
                                            <FavoriteButton listingId={listing.id} />
                                        </div>
                                        {listing.is_featured && (
                                            <Badge className="absolute top-3 left-3 bg-primary shadow-lg ring-1 ring-white/20">Featured</Badge>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                                {listing.category?.name || "Rental"}
                                            </span>
                                            <div className="flex items-center">
                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                                                <span className="text-xs font-bold">{listing.rating_average || "5.0"}</span>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                                            {listing.title}
                                        </h3>

                                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                                            <MapPin className="h-3 w-3 mr-1 shrink-0" />
                                            <span className="truncate">{listing.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                            <div>
                                                <span className="text-lg font-bold text-primary">
                                                    {listing.currency} {Number(listing.price_per_day).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-1">/day</span>
                                            </div>
                                            <Button size="sm" className="rounded-full px-4 h-8 text-xs font-bold">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                >
                    {sortedListings.map((listing) => (
                        <motion.div
                            key={listing.id}
                            variants={fadeInUp}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link href={`/listings/${listing.id}`} className="group block">
                                <motion.div
                                    variants={hoverScale}
                                    className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all duration-300 border border-white/10"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="w-full sm:w-64 h-48 rounded-xl overflow-hidden shrink-0 relative">
                                            {listing.images && listing.images[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 100vw, 256px"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <span className="text-muted-foreground">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1 block">
                                                            {listing.category?.name || "Rental"}
                                                        </span>
                                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-1">
                                                            {listing.title}
                                                        </h3>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                                            {listing.location}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {listing.is_featured && <Badge className="bg-primary">Featured</Badge>}
                                                        {listing.is_verified && <Badge variant="secondary">Verified</Badge>}
                                                    </div>
                                                </div>

                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                    {listing.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                                                        <span className="font-bold">{listing.rating_average || "5.0"}</span>
                                                        {listing.rating_count > 0 && (
                                                            <span className="text-muted-foreground text-sm ml-1">
                                                                ({listing.rating_count} reviews)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Image
                                                            src={listing.owner?.avatar_url || "/placeholder-user.jpg"}
                                                            alt={listing.owner?.full_name || "Owner"}
                                                            width={20}
                                                            height={20}
                                                            className="rounded-full mr-2"
                                                        />
                                                        {listing.owner?.full_name || "Verified Owner"}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>
                                                        <span className="text-2xl font-bold text-primary">
                                                            {listing.currency} {Number(listing.price_per_day).toLocaleString()}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground ml-1">/day</span>
                                                    </div>
                                                    <Button className="rounded-full px-6 mt-2">View Details</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

export function SearchContent() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
