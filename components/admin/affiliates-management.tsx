import { UserPlus, DollarSign, Users, TrendingUp, Copy, ExternalLink, List } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getAllAffiliates, getAffiliateReferralsAdmin } from "@/lib/actions/affiliate-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AffiliatesManagement() {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loadingReferrals, setLoadingReferrals] = useState(false)

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

  const handleViewReferrals = async (affiliate: any) => {
    setSelectedAffiliate(affiliate)
    setLoadingReferrals(true)
    try {
      const data = await getAffiliateReferralsAdmin(affiliate.id)
      setReferrals(data || [])
    } catch (error) {
      console.error("Error loading referrals:", error)
    } finally {
      setLoadingReferrals(false)
    }
  }

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
        {/* ... (Keep existing stats cards) */}
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReferrals(affiliate)}
                        >
                          <List className="h-4 w-4 mr-2" />
                          Referrals
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/admin/users?search=${email}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Referrals Dialog */}
      <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Referral History</DialogTitle>
            <DialogDescription>
              Referrals for {selectedAffiliate?.user_profiles?.full_name || "Affiliate"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loadingReferrals ? (
              <div className="text-center py-8">Loading referrals...</div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No referrals found for this affiliate.</div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referred User</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ref.referred_user?.avatar_url} />
                              <AvatarFallback>{ref.referred_user?.full_name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{ref.referred_user?.full_name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">{ref.referred_user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {ref.listing?.title || "N/A"}
                        </TableCell>
                        <TableCell>KSh {ref.commission_amount || 0}</TableCell>
                        <TableCell>
                          <Badge variant={ref.commission_status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                            {ref.commission_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(ref.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
