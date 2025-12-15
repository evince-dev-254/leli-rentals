"use client"

import { useState, useEffect } from "react"
import { Check, Crown, Zap, AlertCircle, CreditCard, Loader2, Tag } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaystackPaymentButton } from "@/components/payment/paystack-button"
import { toast } from "sonner"

const plans = [
  {
    id: "weekly",
    name: "Weekly Plan",
    price: 500,
    duration: "7 days",
    listingLimit: 10,
    commitment: "Low, flexible",
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 1000,
    duration: "30 days",
    listingLimit: -1, // Unlimited
    commitment: "High value, stable",
  },
]

export function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listingsCount, setListingsCount] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setCurrentUser(user)

      // Fetch actual listings count
      const { count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      setListingsCount(count || 0)

      // Fetch subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('end_date', { ascending: false })
        .limit(1)
        .single()

      setSubscription(subData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const currentPlan = {
    name: subscription?.plan_type === 'monthly' ? "Monthly Plan" : "Weekly Plan",
    expiresAt: subscription?.end_date ? new Date(subscription.end_date) : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    listingsUsed: listingsCount,
    listingsLimit: subscription?.plan_type === 'monthly' ? -1 : 10,
  }

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    setShowPaymentDialog(true)
  }

  const handlePaymentSuccess = async (reference: any) => {
    setLoading(true)
    try {
      const plan = plans.find((p) => p.id === selectedPlan)
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: reference.reference,
          planId: selectedPlan,
          userId: currentUser?.id,
          email: currentUser?.email,
          amount: plan?.price
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Payment verification failed')

      toast.success("Subscription activated successfully!")
      setShowPaymentDialog(false)
      window.location.reload() // Reload to show active subscription
    } catch (error: any) {
      console.error("Payment error:", error)
      toast.error(error.message || "Failed to process payment")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const daysUntilExpiry = Math.ceil((currentPlan.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const listingsUsedPercentage = currentPlan.listingsLimit === -1 ? 0 : (currentPlan.listingsUsed / currentPlan.listingsLimit) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription plan and billing</p>
      </div>

      {/* Current Plan Status */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Current Plan
              </CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <Badge className="bg-primary">{currentPlan.name}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground mb-1">Expires In</p>
              <p className="text-2xl font-bold">{daysUntilExpiry} days</p>
              <p className="text-xs text-muted-foreground">{currentPlan.expiresAt.toLocaleDateString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground mb-1">Listings Used</p>
              <p className="text-2xl font-bold">
                {currentPlan.listingsUsed} / {currentPlan.listingsLimit === -1 ? '∞' : currentPlan.listingsLimit}
              </p>
              {currentPlan.listingsLimit !== -1 && (
                <Progress value={listingsUsedPercentage} className="h-2 mt-2" />
              )}
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground mb-1">Plan Price</p>
              <p className="text-2xl font-bold">KSh {subscription?.plan_type === 'monthly' ? '1000' : '500'}</p>
              <p className="text-xs text-muted-foreground">per {subscription?.plan_type === 'monthly' ? 'month' : 'week'}</p>
            </div>
          </div>

          {currentPlan.listingsLimit !== -1 && currentPlan.listingsUsed >= currentPlan.listingsLimit * 0.8 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-orange-600">Running low on listing slots</p>
                <p className="text-sm text-muted-foreground">Upgrade to Monthly for unlimited listings</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      {/* Plans Table */}
      <div className="rounded-xl border border-border bg-card/50 overflow-hidden glass-card">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5 text-orange-400" />
            Choose Your Listing Plan
          </h2>
        </div>

        <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-y divide-border/50">
          {/* Header Row */}
          <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-x divide-border/50 bg-muted/20">
            <div className="p-4 font-medium text-muted-foreground">Feature</div>
            <div className="p-4 font-medium text-center">Weekly Plan</div>
            <div className="p-4 font-medium text-center">Monthly Plan</div>
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-x divide-border/50 hover:bg-muted/10 transition-colors">
            <div className="p-4 font-medium">Price</div>
            <div className="p-4 text-center font-bold text-lg">Ksh 500</div>
            <div className="p-4 text-center font-bold text-lg">Ksh 1,000</div>
          </div>

          {/* Listing Limit Row */}
          <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-x divide-border/50 hover:bg-muted/10 transition-colors">
            <div className="p-4 font-medium">Listing Limit</div>
            <div className="p-4 text-center">Up to 10 listings</div>
            <div className="p-4 text-center font-bold text-primary">Unlimited listings</div>
          </div>

          {/* Duration Row */}
          <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-x divide-border/50 hover:bg-muted/10 transition-colors">
            <div className="p-4 font-medium">Duration</div>
            <div className="p-4 text-center">7 days</div>
            <div className="p-4 text-center">30 days</div>
          </div>

          {/* Commitment Row */}
          <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-x divide-border/50 hover:bg-muted/10 transition-colors">
            <div className="p-4 font-medium">Commitment</div>
            <div className="p-4 text-center text-muted-foreground">Low, flexible</div>
            <div className="p-4 text-center text-muted-foreground">High value, stable</div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-[1.5fr,1fr,1fr] divide-x divide-border/50 bg-muted/10">
            <div className="p-4"></div>
            <div className="p-4 text-center">
              <Button
                variant={currentPlan.name === 'Weekly Plan' ? "outline" : "default"}
                className={`w-full ${currentPlan.name === 'Weekly Plan' ? "border-primary/50" : ""}`}
                disabled={currentPlan.name === 'Weekly Plan'}
                onClick={() => handleSubscribe('weekly')}
              >
                {currentPlan.name === 'Weekly Plan' ? 'Active' : 'Select'}
              </Button>
            </div>
            <div className="p-4 text-center">
              <Button
                variant={currentPlan.name === 'Monthly Plan' ? "outline" : "default"}
                className={`w-full ${currentPlan.name !== 'Monthly Plan' ? "bg-primary text-primary-foreground" : "border-primary/50"}`}
                disabled={currentPlan.name === 'Monthly Plan'}
                onClick={() => handleSubscribe('monthly')}
              >
                {currentPlan.name === 'Monthly Plan' ? 'Active' : 'Select'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-3">
                {[
                  { type: "subscription", desc: "Weekly Plan", date: "Dec 1, 2025", amount: -500 },
                  { type: "payout", desc: "Earnings Payout", date: "Nov 30, 2025", amount: 45000 },
                  { type: "subscription", desc: "Weekly Plan", date: "Nov 24, 2025", amount: -500 },
                  { type: "payout", desc: "Earnings Payout", date: "Nov 15, 2025", amount: 32000 },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "subscription"
                          ? "bg-primary/10 text-primary"
                          : "bg-green-500/10 text-green-500"
                          }`}
                      >
                        {transaction.type === "subscription" ? (
                          <CreditCard className="h-4 w-4" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.desc}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${transaction.amount > 0 ? "text-green-500" : "text-foreground"}`}>
                      {transaction.amount > 0 ? "+" : ""}KSh {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="subscriptions" className="mt-4">
              <p className="text-muted-foreground text-center py-8">Subscription history will appear here</p>
            </TabsContent>
            <TabsContent value="payouts" className="mt-4">
              <p className="text-muted-foreground text-center py-8">Payout history will appear here</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Pay with Paystack to activate your subscription</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex justify-between mb-2">
                <span>Plan</span>
                <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-bold text-primary">
                  KSh {plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
                </span>
              </div>
            </div>

            {selectedPlan && (
              <PaystackPaymentButton
                amount={plans.find((p) => p.id === selectedPlan)?.price || 0}
                email={currentUser?.email || ""}
                metadata={{
                  planId: selectedPlan,
                  userId: currentUser?.id
                }}
                onSuccess={handlePaymentSuccess}
                onClose={() => setShowPaymentDialog(false)}
                text={`Pay KSh ${plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}`}
              />
            )}

            <p className="text-xs text-muted-foreground text-center">Secure payment powered by Paystack</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
