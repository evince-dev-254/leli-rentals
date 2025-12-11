"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOwnerData } from "@/lib/actions/dashboard-actions"
import { supabase } from "@/lib/supabase"

export function MyListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
          setRole(profile?.role || 'renter')

          const data = await getOwnerData(user.id)
          setListings(data || [])
        }
      } catch (error) {
        console.error("Error fetching listings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingLogo size={60} /></div>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your rental listings</p>
        </div>
        {role !== 'renter' && (
          <Button className="bg-primary text-primary-foreground" asChild>
            <Link href="/dashboard/listings/new">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="glass-card overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={listing.images?.[0] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-3 right-3 ${listing.status === "active"
                  ? "bg-green-500"
                  : listing.status === "paused"
                    ? "bg-orange-500"
                    : "bg-gray-500"
                  }`}
              >
                {listing.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    Listing
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    {role !== 'renter' && (
                      <>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {listing.status === "active" ? (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <ToggleRight className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 mr-1"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {listing.location || "Location not set"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                {listing.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3 pt-2 border-t border-border">
                <span>{listing.views_count || 0} views</span>
                <span>{listing.rating_count || 0} reviews</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">
                  KSh {listing.price_per_day?.toLocaleString()}
                  <span className="font-normal text-muted-foreground text-sm">/day</span>
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${listing.id}`}>View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No listings found</p>
            {role !== 'renter' && (
              <Button asChild>
                <Link href="/dashboard/listings/new">Create Your First Listing</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
