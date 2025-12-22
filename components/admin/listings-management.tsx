"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Package, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"

export function ListingsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [listings, setListings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const { data: ls, error: lsErr } = await supabase.from("listings").select("*")
        if (lsErr) {
          console.error("Error fetching listings:", lsErr)
          return
        }

        const ownerIds = Array.from(new Set((ls || []).map((l: any) => l.owner_id)))
        const { data: us, error: usErr } = await supabase.from("user_profiles").select("*").in("id", ownerIds.length ? ownerIds : ["null"])
        if (usErr) console.error("Error fetching listing owners:", usErr)

        if (!mounted) return

        setListings(ls || [])
        setUsers(us || [])
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const mappedListings = listings.map((l: any) => ({
    id: l.id,
    ownerId: l.owner_id,
    title: l.title,
    description: l.description,
    category: l.category ?? l.category_id ?? "",
    pricePerDay: Number(l.price_per_day || 0),
    images: l.images || [],
    location: l.location || "",
    isActive: l.is_active ?? true,
    isApproved: (l.status && l.status === "approved") || !!l.is_verified,
    createdAt: l.created_at ? new Date(l.created_at) : new Date(),
  }))

  const filteredListings = mappedListings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "approved" && listing.isApproved) || (statusFilter === "pending" && !listing.isApproved)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getOwner = (ownerId: string) => users.find((u) => u.id === ownerId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listings</h1>
          <p className="text-muted-foreground">Manage all rental listings on the platform</p>
        </div>
        <Button asChild className="bg-gradient-to-tr from-primary to-purple-600">
          <Link href="/dashboard/listings/new">
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mappedListings.length}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mappedListings.filter((l) => l.isApproved).length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/20">
                <XCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mappedListings.filter((l) => !l.isApproved).length}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="homes">Homes</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Listings ({filteredListings.length})</CardTitle>
          <CardDescription>Review and manage rental listings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => {
                const owner = getOwner(listing.ownerId)
                return (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images[0] || "/placeholder.svg"}
                          alt={listing.title}
                          className="h-12 w-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-muted-foreground">{listing.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{owner?.fullName}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {listing.category}
                      </Badge>
                    </TableCell>
                    <TableCell>KSh {listing.pricePerDay.toLocaleString()}</TableCell>
                    <TableCell>
                      {listing.isApproved ? (
                        <Badge className="bg-green-500/20 text-green-600">Approved</Badge>
                      ) : (
                        <Badge className="bg-orange-500/20 text-orange-600">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{listing.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {!listing.isApproved && (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
