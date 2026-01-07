"use client"

import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Download, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOwnerStats, getEarnings, getAffiliateData } from "@/lib/actions/dashboard-actions"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { WithdrawalModal } from "./withdrawal-modal"
import { LoadingLogo } from "@/components/ui/loading-logo"

export function EarningsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [withdrawalOpen, setWithdrawalOpen] = useState(false)

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)

      if (profile?.role === 'affiliate') {
        const affData = await getAffiliateData(user.id)
        setStats({
          totalEarnings: (affData?.pending_earnings || 0) + (affData?.paid_earnings || 0),
          availableBalance: affData?.pending_earnings || 0,
          totalWithdrawn: affData?.paid_earnings || 0,
          isAffiliate: true
        })
      } else {
        const s = await getOwnerStats(user.id)
        setStats(s)
      }

      const t = await getEarnings(user.id)
      setTransactions(t)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <div className="flex justify-center p-20"><LoadingLogo size={60} /></div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">Track your rental income and payouts</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold">KSh {(stats?.totalEarnings || 0).toLocaleString()}</p>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>18% from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">KSh {(stats?.availableBalance || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Ready for withdrawal</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">KSh {(stats?.pendingEarnings || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Processing</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/20">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                <p className="text-3xl font-bold">KSh {(stats?.totalWithdrawn || 0).toLocaleString()}</p>
                <div className="flex items-center text-blue-500 text-sm mt-1">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>Success payouts</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Request Withdrawal</h3>
              <p className="text-sm text-muted-foreground">
                Available balance: <span className="font-semibold text-foreground">KSh {(stats?.availableBalance || 0).toLocaleString()}</span>
              </p>
            </div>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={() => setWithdrawalOpen(true)}
            >
              Withdraw Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      <WithdrawalModal
        open={withdrawalOpen}
        onOpenChange={setWithdrawalOpen}
        availableBalance={stats?.availableBalance || 0}
        userId={user?.id}
        onSuccess={loadData}
        paymentInfo={profile?.payment_info}
        role={profile?.role === 'affiliate' ? 'affiliate' : 'owner'}
      />

      {/* Transactions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent earnings and payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? <p className="text-center py-4 text-muted-foreground">No earnings yet</p> :
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${tx.type === "earning" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
                        }`}
                    >
                      {tx.type === "earning" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.desc}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${tx.amount > 0 ? "text-green-500" : "text-foreground"}`}>
                    {tx.amount > 0 ? "+" : ""}KSh {Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
