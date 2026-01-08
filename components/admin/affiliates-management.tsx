"use client"

import { UserPlus, DollarSign, Users, TrendingUp, Copy, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getAllAffiliates } from "@/lib/actions/affiliate-actions"

export function AffiliatesManagement() {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true



    async function loadAffiliates() {
      setLoading(true)
      try {
        const data = await getAllAffiliates()
        if (!mounted) return
        setAffiliates(data || [])
      } catch (error) {
        console.error("Error loading affiliates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAffiliates()

    return () => {
      mounted = false
    }
  }, [])

  const totalEarnings = affiliates.reduce((sum, a) => sum + (a.total_earnings ?? 0), 0)
  const totalReferrals = affiliates.reduce((sum, a) => sum + (a.total_referrals ?? 0), 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-600">Active</Badge>
      case "pending":
        return <Badge className="bg-orange-500/20 text-orange-600">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-500/20 text-red-600">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Affiliates</h1>
        <p className="text-muted-foreground">Manage affiliate partners and track referrals</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-pink-500/20">
                <UserPlus className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{affiliates.length}</p>
                <p className="text-sm text-muted-foreground">Total Affiliates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalReferrals}</p>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">KSh {totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Paid Out</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">10%</p>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliates Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Affiliates</CardTitle>
          <CardDescription>Manage affiliate partners and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affiliate</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.map((affiliate) => {
                const profile = affiliate.user_profiles || {};
                const fullName = profile.full_name || "Unknown";
                const email = profile.email || "No Email";
                const avatar = profile.avatar_url;

                return (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={avatar} />
                          <AvatarFallback>
                            {fullName === "Unknown" ? "U" : fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{fullName}</p>
                          <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 rounded bg-secondary font-mono text-sm">
                          {affiliate.invite_code || affiliate.referral_code || "N/A"}
                        </code>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{affiliate.total_referrals ?? 0}</TableCell>
                    <TableCell className="font-medium">KSh {(affiliate.total_earnings ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/admin/users?search=${email}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
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
