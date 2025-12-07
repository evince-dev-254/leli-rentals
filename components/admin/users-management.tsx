"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Eye, Ban, CheckCircle, Mail, Download, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/types"

export function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true)

  // Filter users fetched from Supabase
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  useEffect(() => {
    let mounted = true

    async function loadUsers() {
      setLoadingUsers(true)
      try {
        const { data, error } = await supabase.from("user_profiles").select("*")
        if (error) {
          console.error("Error fetching user_profiles:", error)
          return
        }

        if (!mounted) return

        // Map DB fields to the User interface expected by this component
        const mapped: User[] = (data || []).map((u: any) => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name ?? "",
          phone: u.phone ?? "",
          avatarUrl: u.avatar_url ?? null,
          role: (u.role as any) ?? "renter",
          accountStatus: (u.account_status as any) ?? "active",
          verificationStatus: (u.verification_status as any) ?? "pending",
          verificationDeadline: u.verification_deadline ? new Date(u.verification_deadline) : null,
          verificationDocuments: [],
          subscriptionPlan: (u.subscription_plan as any) ?? null,
          subscriptionExpiresAt: u.subscription_expires_at ? new Date(u.subscription_expires_at) : null,
          createdAt: u.created_at ? new Date(u.created_at) : new Date(),
          updatedAt: u.updated_at ? new Date(u.updated_at) : new Date(),
          lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : null,
          affiliateCode: u.affiliate_code ?? null,
          referredBy: u.referred_by ?? null,
          totalReferrals: u.total_referrals ?? 0,
          totalEarnings: u.total_earnings ?? 0,
        }))

        setUsers(mapped)
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()

    return () => {
      mounted = false
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Active</Badge>
      case "pending_verification":
        return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Suspended</Badge>
      case "banned":
        return <Badge className="bg-gray-500/20 text-gray-600 border-gray-500/30">Banned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">Admin</Badge>
      case "owner":
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Owner</Badge>
      case "affiliate":
        return <Badge className="bg-pink-500/20 text-pink-600 border-pink-500/30">Affiliate</Badge>
      case "renter":
        return <Badge className="bg-teal-500/20 text-teal-600 border-teal-500/30">Renter</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="renter">Renter</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="affiliate">Affiliate</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_verification">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Complete list of registered users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.accountStatus)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.verificationStatus === "verified"
                          ? "default"
                          : user.verificationStatus === "submitted"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {user.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLoginAt?.toLocaleDateString() || "Never"}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.accountStatus === "suspended" ? (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reactivate Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about this user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {selectedUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.accountStatus)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <p className="font-medium capitalize">{selectedUser.verificationStatus}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{selectedUser.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{selectedUser.lastLoginAt?.toLocaleDateString() || "Never"}</p>
                </div>
                {selectedUser.role === "affiliate" && (
                  <>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Affiliate Code</p>
                      <p className="font-medium font-mono">{selectedUser.affiliateCode}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Total Referrals</p>
                      <p className="font-medium">{selectedUser.totalReferrals}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50 col-span-2">
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="font-medium text-lg">KSh {selectedUser.totalEarnings.toLocaleString()}</p>
                    </div>
                  </>
                )}
                {(selectedUser.role === "owner" || selectedUser.role === "affiliate") &&
                  selectedUser.verificationDeadline && (
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 col-span-2">
                      <p className="text-sm text-orange-600">Verification Deadline</p>
                      <p className="font-medium">{selectedUser.verificationDeadline.toLocaleDateString()}</p>
                    </div>
                  )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline">Send Email</Button>
                {selectedUser.accountStatus === "suspended" ? (
                  <Button className="bg-green-600 hover:bg-green-700">Reactivate Account</Button>
                ) : (
                  <Button variant="destructive">Suspend Account</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
