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
import { toast } from "sonner"
import dynamic from 'next/dynamic'

const PaystackPaymentButton = dynamic(
  () => import('@/components/payment/paystack-button').then(mod => mod.PaystackPaymentButton),
  { ssr: false }
)

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
  const [userPhone, setUserPhone] = useState<string>("")

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
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Fetch Profile for Phone
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('phone')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.phone) setUserPhone(profile.phone)

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
    type: subscription?.plan_type || 'weekly' // Default to weekly if no sub (should handle better but ok for now)
  }

  // If no subscription found but loading finished, assume no active plan, maybe show none?
  // Logic below handles "currentPlan" assuming it defaults to something or we handle null.
  // Ideally if no sub, currentPlan should reflect that.
  // But for now, let's just let it be.

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
  const isMonthly = currentPlan.name === 'Monthly Plan'
  const isWeekly = currentPlan.name === 'Weekly Plan' && subscription // Only true if actually subscribed

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription plan and billing</p>
      </div>

      {/* Current Plan Status */}
      {subscription && (
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <Badge className="bg-primary px-3 py-1 text-base">{currentPlan.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Expires In</p>
                <p className="text-2xl font-bold">{daysUntilExpiry} days</p>
                <p className="text-xs text-muted-foreground">{currentPlan.expiresAt.toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Listings Used</p>
                <div className="flex justify-between items-end">
                  <p className="text-2xl font-bold">
                    {currentPlan.listingsUsed} <span className="text-base font-normal text-muted-foreground">/ {currentPlan.listingsLimit === -1 ? '∞' : currentPlan.listingsLimit}</span>
                  </p>
                </div>
                {currentPlan.listingsLimit !== -1 && (
                  <Progress value={listingsUsedPercentage} className="h-2 mt-2" />
                )}
              </div>
              <div className="p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Plan Price</p>
                <p className="text-2xl font-bold">KSh {subscription?.plan_type === 'monthly' ? '1,000' : '500'}</p>
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
      )}

      {!subscription && (
        <div className="p-6 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">No Active Subscription</h3>
          <p className="text-orange-600/80 mb-4">Please select a plan below to start creating listings.</p>
        </div>
      )}

      {/* Plans Grid (Modern) */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Available Plans</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        {/* Weekly Plan */}
        <div className={`relative group ${isWeekly ? 'opacity-80 pointer-events-none grayscale' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
          <div className="relative h-full glass-card rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Flexible
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">Weekly Plan</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">KSh 500</span>
                <span className="text-muted-foreground">/ 7 days</span>
              </div>
              <p className="text-muted-foreground">Perfect for trying out the platform or short-term listing needs.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span><strong className="text-foreground">Up to 10</strong> active listings</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span>7-day active duration</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span>Basic analytics</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium"
              onClick={() => handleSubscribe('weekly')}
              disabled={isWeekly}
            >
              {isWeekly ? 'Current Plan' : 'Select Weekly'}
            </Button>
          </div>
        </div>

        {/* Monthly Plan */}
        <div className={`relative group ${isMonthly ? 'opacity-80 pointer-events-none' : ''}`}>
          <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-[25px] opacity-70 blur-sm group-hover:opacity-100 transition-opacity" />
          <div className="relative h-full bg-card rounded-3xl p-8 flex flex-col">
            <div className="absolute top-0 right-0 -mt-4 mr-8">
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 px-4 py-1.5 shadow-lg">
                Most Popular
              </Badge>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Best Value
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">KSh 1,000</span>
                <span className="text-muted-foreground">/ 30 days</span>
              </div>
              <p className="text-muted-foreground">For serious renters wanting maximum exposure and unlimited growth.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-primary/10 rounded-full">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span><strong className="text-primary">Unlimited</strong> active listings</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-primary/10 rounded-full">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>30-day active duration</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-primary/10 rounded-full">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Advanced analytics & insights</span>
              </li>
            </ul>

            <Button
              className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              onClick={() => handleSubscribe('monthly')}
              disabled={isMonthly}
            >
              {isMonthly ? 'Current Plan' : 'Select Monthly'}
            </Button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <Card className="glass-card mt-12">
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
              <>
                <PaystackPaymentButton
                  amount={plans.find((p) => p.id === selectedPlan)?.price || 0}
                  email={currentUser?.email || ""}
                  phone={userPhone}
                  metadata={{
                    planId: selectedPlan,
                    userId: currentUser?.id,
                    phone: userPhone,
                    custom_fields: [
                      {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: userPhone
                      }
                    ]
                  }}
                  onSuccess={handlePaymentSuccess}
                  onClose={() => setShowPaymentDialog(false)}
                  text={`Pay KSh ${plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}`}
                  subaccount={process.env.NEXT_PUBLIC_PAYSTACK_SUBACCOUNT_ID}
                />
                <div className="bg-yellow-500/10 p-3 rounded-md text-xs text-yellow-600 border border-yellow-500/20">
                  <p className="font-semibold mb-1">Payment Tip:</p>
                  <p>If paying via M-Pesa, ensure your phone number includes the country code. Ex: <span className="font-mono bg-yellow-500/20 px-1 rounded">+254712345678</span></p>
                </div>
              </>
            )}

            <p className="text-xs text-muted-foreground text-center">Secure payment powered by Paystack</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
