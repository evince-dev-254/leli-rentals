"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Check,
  Store,
  Users,
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  Percent,
  Gift,
} from "lucide-react"

const ownerBenefits = [
  { icon: DollarSign, title: "Earn Extra Income", description: "Turn your idle items into a steady revenue stream" },
  { icon: Shield, title: "Secure Payments", description: "Get paid safely via Paystack with buyer protection" },
  { icon: Users, title: "Large User Base", description: "Access our 50,000+ verified renters across Kenya" },
  { icon: TrendingUp, title: "Growth Tools", description: "Analytics dashboard to track and optimize your listings" },
  { icon: Clock, title: "Flexible Schedule", description: "Set your own availability and rental terms" },
  { icon: Award, title: "Top Owner Rewards", description: "Exclusive perks for high-performing owners" },
]

const affiliateBenefits = [
  { icon: Percent, title: "15% Commission", description: "Earn on every successful rental from your referrals" },
  { icon: Gift, title: "Referral Bonuses", description: "Extra rewards for bringing in new owners and renters" },
  { icon: TrendingUp, title: "Real-time Tracking", description: "Monitor your earnings and referrals live" },
  { icon: Users, title: "Unlimited Referrals", description: "No caps on how many people you can refer" },
  { icon: DollarSign, title: "Fast Payouts", description: "Weekly payouts directly to your M-Pesa or bank" },
  { icon: Award, title: "VIP Affiliate Tiers", description: "Unlock higher commissions as you grow" },
]

const ownerPlans = [
  {
    name: "Weekly Plan",
    price: "KSh 500",
    period: "/week",
    features: [
      "Up to 10 listings",
      "7 days duration",
      "Basic analytics",
      "Email support",
      "Standard visibility",
      "Low commitment",
    ],
    popular: false,
  },
  {
    name: "Monthly Plan",
    price: "KSh 1,000",
    period: "/month",
    features: [
      "Unlimited listings",
      "30 days duration",
      "Advanced analytics",
      "Priority support",
      "Featured visibility",
      "High value, stable",
    ],
    popular: true,
  },
]

const affiliateTiers = [
  { tier: "Starter", earnings: "KSh 0 - 10,000", commission: "10%" },
  { tier: "Bronze", earnings: "KSh 10,001 - 50,000", commission: "12%" },
  { tier: "Silver", earnings: "KSh 50,001 - 100,000", commission: "15%" },
  { tier: "Gold", earnings: "KSh 100,001+", commission: "20%" },
]

const steps = [
  { step: 1, title: "Sign Up", description: "Create your account in minutes" },
  { step: 2, title: "Get Verified", description: "Submit documents within 5 days" },
  { step: 3, title: "Choose Plan", description: "Select owner or affiliate path" },
  { step: 4, title: "Start Earning", description: "List items or share your code" },
]

export function BecomeOwnerContent() {
  const [selectedTab, setSelectedTab] = useState("owner")

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">Join 5,000+ successful owners and affiliates</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Earn Money with <span className="text-primary">leli rentals</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 text-pretty">
              Whether you want to rent out your items or earn commissions by referring others, we have the perfect
              opportunity for you.
            </p>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-2 glass-card">
                <TabsTrigger
                  value="owner"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Become Owner
                </TabsTrigger>
                <TabsTrigger
                  value="affiliate"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Become Affiliate
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {selectedTab === "owner" ? "Why Become an Owner?" : "Why Become an Affiliate?"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {selectedTab === "owner"
                ? "Turn your assets into income. List anything from vehicles to equipment and start earning."
                : "Earn passive income by sharing leli rentals with your network. No inventory needed."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedTab === "owner" ? ownerBenefits : affiliateBenefits).map((benefit, index) => (
              <Card key={index} className="glass-card border-border/50">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {selectedTab === "owner" ? "Choose Your Listing Plan" : "Affiliate Commission Tiers"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {selectedTab === "owner"
                ? "Select a plan that fits your needs. Upgrade or downgrade anytime."
                : "The more you earn, the higher your commission rate grows."}
            </p>
          </div>

          {selectedTab === "owner" ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {ownerPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`glass-card relative ${plan.popular ? "border-primary border-2" : "border-border/50"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup?type=owner">
                      <Button
                        className={`w-full ${plan.popular ? "bg-primary text-primary-foreground" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <Card className="glass-card border-border/50 overflow-hidden">
                <div className="grid grid-cols-3 bg-secondary/50 p-4 font-semibold">
                  <div>Tier</div>
                  <div>Total Earnings</div>
                  <div>Commission Rate</div>
                </div>
                {affiliateTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 p-4 border-t border-border/50 ${
                      index === affiliateTiers.length - 1 ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BadgeCheck
                        className={`h-5 w-5 ${
                          index === 0
                            ? "text-gray-400"
                            : index === 1
                              ? "text-amber-600"
                              : index === 2
                                ? "text-gray-300"
                                : "text-yellow-500"
                        }`}
                      />
                      <span className="font-medium">{tier.tier}</span>
                    </div>
                    <div className="text-muted-foreground">{tier.earnings}</div>
                    <div className="font-semibold text-primary">{tier.commission}</div>
                  </div>
                ))}
              </Card>
              <div className="text-center mt-8">
                <Link href="/signup?type=affiliate">
                  <Button size="lg" className="bg-primary text-primary-foreground">
                    Start as Affiliate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="glass-card border-border/50 text-center h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass-card border-primary/20 max-w-4xl mx-auto overflow-hidden">
            <div className="relative p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start {selectedTab === "owner" ? "Earning" : "Referring"}?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {selectedTab === "owner"
                    ? "Join thousands of owners who are already earning from their assets on leli rentals."
                    : "Share your unique affiliate link and earn commissions on every successful rental."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/signup?type=${selectedTab}`}>
                    <Button size="lg" className="bg-primary text-primary-foreground">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
