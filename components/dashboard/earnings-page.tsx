"use client"

import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Download, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOwnerStats, getEarnings } from "@/lib/actions/dashboard-actions"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

export function EarningsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [s, t] = await Promise.all([
          getOwnerStats(user.id),
          getEarnings(user.id)
        ])
        setStats(s)
        setTransactions(t)
      }
    }
    load()
  }, [])

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
                <p className="text-3xl font-bold">KSh {(stats?.totalEarnings || 0).toLocaleString()}</p>
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
                <p className="text-3xl font-bold">KSh 0</p>
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
                <p className="text-3xl font-bold">KSh 0</p>
                <div className="flex items-center text-blue-500 text-sm mt-1">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>3 withdrawals</span>
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
                Available balance: <span className="font-semibold text-foreground">KSh 0</span>
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground">Withdraw Funds</Button>
          </div>
        </CardContent>
      </Card>

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
