"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, MapPin, Star, Heart, ArrowLeft, Grid3X3, List, SlidersHorizontal, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getCategoryById } from "@/lib/categories-data"
import { supabase } from "@/lib/supabase"
import { getCategoryUUID } from "@/lib/category-uuid-map"

interface CategoryDetailContentProps {
  categoryId: string
}

export function CategoryDetailContent({ categoryId }: CategoryDetailContentProps) {
  const category = getCategoryById(categoryId)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchListings() {
      if (!category) return

      setLoading(true)
      try {
        // 1. First fetch the category by slug to get its correct UUID from the DB
        // This avoids issues if the DB UUIDs don't match the hardcoded map
        const { data: dbCategory, error: catError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category.id) // category.id from categories-data acts as the slug
          .single()

        if (catError || !dbCategory) {
          console.error("Error fetching category from DB:", catError)
          setLoading(false)
          return
        }

        const categoryUUID = dbCategory.id

        // 2. Fetch listings using the actual DB UUID
        const { data, error } = await supabase
          .from("listings")
          .select(`
            *,
            owner:user_profiles!owner_id(full_name, avatar_url)
          `)
          .eq("category_id", categoryUUID)
          .eq("status", "approved")
          .in("availability_status", ["available", "rented"])

        if (error) {
          console.error("Error fetching listings:", error)
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
  }, [categoryId, category])

  if (!category) {
    return null
  }

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubcategory = selectedSubcategories.length === 0 ||
      (listing.features?.subcategory && selectedSubcategories.includes(listing.features.subcategory))
    return matchesSearch && matchesSubcategory
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
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
        return b.is_featured ? 1 : -1
    }
  })

  const FilterSidebar = () => (
    <div className="space-y-6">
      {selectedSubcategories.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Selected Subcategories</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSubcategories.map((sub) => (
              <Badge
                key={sub}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setSelectedSubcategories(selectedSubcategories.filter((s) => s !== sub))}
              >
                {sub} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => setSelectedSubcategories([])}
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="gradient-mesh min-h-screen">
      {/* Hero Section */}
      <section className={`py-12 px-4 bg-gradient-to-br ${category.color}`}>
        <div className="container mx-auto">
          <Link
            href="/categories"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <category.icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
                <p className="text-muted-foreground max-w-xl">{category.longDescription}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{listings.length}</p>
              <p className="text-muted-foreground">items available</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Browse Subcategories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {category.subcategories.slice(0, 12).map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => {
                    if (selectedSubcategories.includes(sub.name)) {
                      setSelectedSubcategories(selectedSubcategories.filter((s) => s !== sub.name))
                    } else {
                      setSelectedSubcategories([...selectedSubcategories, sub.name])
                    }
                  }}
                  className={`group relative rounded-xl overflow-hidden aspect-square transition-all ${selectedSubcategories.includes(sub.name)
                    ? "ring-2 ring-primary ring-offset-2"
                    : "hover:ring-2 hover:ring-primary/50"
                    }`}
                >
                  <img
                    src={sub.image || "/placeholder.svg"}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-white text-xs sm:text-sm font-medium truncate">
                    {sub.name}
                  </span>
                  {selectedSubcategories.includes(sub.name) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="sticky top-16 z-30 py-4 px-4 glass-card border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${category.name.toLowerCase()}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="glass-card rounded-2xl p-6 sticky top-36">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
                <FilterSidebar />
              </div>
            </aside>

            <div className="flex-1">
              <p className="text-muted-foreground mb-6">
                Showing <span className="font-semibold text-foreground">{sortedListings.length}</span> results
                {selectedSubcategories.length > 0 && (
                  <span className="ml-2">
                    in <span className="text-primary font-medium">{selectedSubcategories.join(", ")}</span>
                  </span>
                )}
              </p>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sortedListings.length === 0 ? (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <p className="text-xl font-semibold mb-2">No listings found</p>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedSubcategories.length > 0
                      ? "Try adjusting your filters or search query"
                      : "Be the first to list in this category!"}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedListings.map((listing) => (
                    <Link key={listing.id} href={`/listings/${listing.id}`} className="group">
                      <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {listing.images && listing.images[0] ? (
                            <Image
                              src={listing.images[0]}
                              alt={listing.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">No image</span>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          {listing.is_featured && <Badge className="absolute top-3 left-3 bg-primary">Featured</Badge>}
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                              {listing.title}
                            </h3>
                            {listing.is_verified && (
                              <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                                Verified
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.location}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-primary">
                                {listing.currency} {Number(listing.price_per_day).toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground">/day</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                              <span className="font-medium">{listing.rating_average || "New"}</span>
                              {listing.rating_count > 0 && (
                                <span className="text-muted-foreground text-sm ml-1">({listing.rating_count})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedListings.map((listing) => (
                    <Link key={listing.id} href={`/listings/${listing.id}`} className="group block">
                      <div className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                        <div className="flex gap-6">
                          <div className="w-48 h-36 rounded-xl overflow-hidden shrink-0 relative">
                            {listing.images && listing.images[0] ? (
                              <Image
                                src={listing.images[0]}
                                alt={listing.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">No image</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                  {listing.title}
                                </h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {listing.location}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {listing.is_featured && <Badge className="bg-primary">Featured</Badge>}
                                {listing.is_verified && <Badge variant="secondary">Verified</Badge>}
                              </div>
                            </div>

                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{listing.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                                  <span className="font-medium">{listing.rating_average || "New"}</span>
                                  {listing.rating_count > 0 && (
                                    <span className="text-muted-foreground text-sm ml-1">
                                      ({listing.rating_count} reviews)
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-bold text-primary">
                                  {listing.currency} {Number(listing.price_per_day).toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">/day</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
