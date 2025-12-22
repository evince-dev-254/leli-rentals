"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { categories } from "@/lib/categories-data"
import { LocationSearch } from "@/components/ui/location-search"
import { kenyaCounties } from "@/lib/kenya-counties"
import { ImageUpload } from "@/components/ui/image-upload"
import { supabase } from "@/lib/supabase"
import { createListing } from "@/lib/actions/dashboard-actions"
import { CANCELLATION_POLICIES } from "@/lib/policies-data"
import { getCategoryUUID } from "@/lib/category-uuid-map"

// ... existing imports

const libraries: ("places")[] = ["places"]

export function CreateListing() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [area, setArea] = useState("")
  const [cancellationPolicy, setCancellationPolicy] = useState("flexible")
  const [subscription, setSubscription] = useState<any>(null)
  const [listingsCount, setListingsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  const [coordinates, setCoordinates] = useState({ lat: -1.2921, lng: 36.8219 }) // Default Nairobi

  useEffect(() => {
    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      // Fetch active subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('end_date', { ascending: false })
        .limit(1)
        .single()

      setSubscription(subData)

      // Fetch profile for role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setUserRole(profile?.role || 'renter')

      // Fetch listing count
      const { count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      setListingsCount(count || 0)
      setIsLoading(false)
    }

    checkSubscription()
  }, [])


  /* REMOVED Map click handlers */

  /* REMOVED MAP IMPORTS */
  /* REMOVED Autocomplete/Map logic */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const formData = new FormData(e.target as HTMLFormElement)

      // Validation
      if (!selectedCategory) {
        alert('Please select a category')
        setIsSubmitting(false)
        return
      }

      if (!selectedCity) {
        alert('Please select a city/county')
        setIsSubmitting(false)
        return
      }

      if (images.length === 0) {
        alert('Please upload at least one image')
        setIsSubmitting(false)
        return
      }

      // Convert string category ID to UUID
      const categoryUUID = getCategoryUUID(selectedCategory)
      if (!categoryUUID) {
        alert('Invalid category selected')
        setIsSubmitting(false)
        return
      }

      const listingData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price_per_day: formData.get('pricePerDay'),
        price_per_week: formData.get('pricePerWeek'),
        price_per_month: formData.get('pricePerMonth'),
        location: `${formData.get('area') || area}, ${selectedCity}`,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        category_id: categoryUUID, // Use UUID instead of string
        subcategory_id: null,

        slug: (formData.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(7),
        images: images,
        features: {
          amenities,
          subcategory: selectedSubcategory,
          cancellation_policy: cancellationPolicy
        },
        availability_status: 'available',
        currency: 'KES'
      }

      await createListing(user.id, listingData)
      router.push("/dashboard/listings")
    } catch (e) {
      console.error("Error creating listing:", e)
      alert(`Failed to create listing: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* REMOVED Autocomplete handlers */

  /* REMOVED Map click handlers */

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity))
  }

  const subcategories = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.subcategories || []
    : []

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" asChild className="touch-target">
          <Link href="/dashboard/listings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Create Listing</h1>
          <p className="text-sm md:text-base text-muted-foreground">Add a new item for rent</p>
        </div>
      </div>



      {
        !isLoading && !subscription && userRole !== 'admin' ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 text-destructive font-bold text-xl">No Subscription Found</div>
              <p className="mb-6 text-muted-foreground">You need an active subscription to create listings.</p>
              <Button onClick={() => router.push('/dashboard/subscription')}>View Plans</Button>
            </CardContent>
          </Card>
        ) : !isLoading && subscription && subscription.plan_type === 'weekly' && listingsCount >= 10 && userRole !== 'admin' ? (
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 text-orange-600 font-bold text-xl">Listing Limit Reached</div>
              <p className="mb-6 text-muted-foreground w-2/3 mx-auto">
                You have reached the maximum of 10 listings allowed on the <strong>Weekly Plan</strong>.
                Please upgrade to the Monthly Plan for unlimited listings.
              </p>
              <Button onClick={() => router.push('/dashboard/subscription')} className="bg-orange-600 hover:bg-orange-700">Upgrade Plan</Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide details about your rental item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input name="title" id="title" placeholder="e.g., Toyota Land Cruiser V8 2023" required />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={!selectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.name} value={sub.name.toLowerCase()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea name="description" id="description" placeholder="Describe your item in detail..." rows={5} required />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload photos of your item (max 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-2">
                      <ImageUpload
                        folder="/listings"
                        onSuccess={(res) => setImages([...images, res.url])}
                        onError={(err) => console.error(err)}
                        className=""
                        buttonText="Add"
                        variant="ghost"
                        maxSizeMB={50}
                      />
                      <span className="text-xs text-muted-foreground mt-1">Max 50MB</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your rental rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price per Day (KSh)</Label>
                    <Input name="pricePerDay" id="pricePerDay" type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerWeek">Price per Week (KSh)</Label>
                    <Input name="pricePerWeek" id="pricePerWeek" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerMonth">Price per Month (KSh)</Label>
                    <Input name="pricePerMonth" id="pricePerMonth" type="number" placeholder="0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where is the item located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 mb-4">
                  <Label>Search Location (Auto-fill)</Label>
                  <LocationSearch
                    onLocationSelect={(data) => {
                      setCoordinates(data.coordinates)
                      if (data.city) setSelectedCity(data.city)
                      if (data.area) setArea(data.area)
                    }}
                    placeholder="Start typing address..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City / County</Label>
                    <Select required value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {kenyaCounties.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area/Neighborhood</Label>
                    <Input
                      name="area"
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g., Westlands, Karen"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Policies</CardTitle>
                <CardDescription>Set your cancellation rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-1">
                  {CANCELLATION_POLICIES.map((policy) => (
                    <div
                      key={policy.id}
                      className={`
                     relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none 
                     ${cancellationPolicy === policy.id ? 'border-primary ring-2 ring-primary' : 'border-border'}
                     hover:bg-accent/50
                   `}
                      onClick={() => setCancellationPolicy(policy.id)}
                    >
                      <div className="flex flex-1">
                        <div className="flex flex-col">
                          <span className="block text-sm font-medium text-foreground mb-1">
                            {policy.label}
                          </span>
                          <span className="block text-sm text-muted-foreground mb-2">
                            {policy.description}
                          </span>
                          <div className={`text-xs px-2 py-1 rounded inline-block w-fit ${policy.color || 'bg-secondary'}`}>
                            {policy.details}
                          </div>
                        </div>
                      </div>
                      <div className={`ml-4 h-4 w-4 rounded-full border flex items-center justify-center ${cancellationPolicy === policy.id ? 'border-primary' : 'border-muted-foreground'}`}>
                        {cancellationPolicy === policy.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
                <CardDescription>What does your item include?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an amenity..."
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" variant="outline" onClick={addAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="gap-1">
                      {amenity}
                      <button type="button" onClick={() => removeAmenity(amenity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent touch-target" asChild>
                <Link href="/dashboard/listings">Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground touch-target" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </div>
          </form>
        )
      }
    </div >
  )
}
