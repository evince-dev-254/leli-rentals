"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@clerk/nextjs'
import { useAccountTypeRedirect, setUserAccountType } from "@/lib/account-type-utils"
import { automaticNotifications } from "@/lib/automatic-notifications"
import {
  User,
  Building2,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Heart,
  DollarSign,
  Sparkles,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"

const renterBenefits = [
  { icon: Shield, text: "Verified & secure listings" },
  { icon: Star, text: "Premium quality items" },
  { icon: Clock, text: "Instant booking available" },
  { icon: Heart, text: "Save your favorites" },
]

const ownerBenefits = [
  { icon: DollarSign, text: "Earn passive income" },
  { icon: Users, text: "Reach thousands of renters" },
  { icon: Shield, text: "Secure payment protection" },
  { icon: TrendingUp, text: "Analytics & insights" },
]

const affiliateBenefits = [
  { icon: DollarSign, text: "High commission rates" },
  { icon: Users, text: "Grow your network" },
  { icon: TrendingUp, text: "Performance bonuses" },
  { icon: Sparkles, text: "Exclusive marketing tools" },
]

export default function GetStartedPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const { selectAccountType } = useAccountTypeRedirect()
  const [selectedAccountType, setSelectedAccountType] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingAccountType, setIsCheckingAccountType] = useState(true)

  // Send welcome email and notification on first visit
  useEffect(() => {
    if (user) {
      const welcomeSent = localStorage.getItem(`welcome_sent_${user.id}`)

      if (!welcomeSent) {
        const userName = user.fullName || user.firstName || 'there'

        // Send welcome email
        fetch('/api/emails/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: user.emailAddresses[0]?.emailAddress,
            userName: user.firstName || 'there'
          })
        }).then(() => {
          console.log('✅ Welcome email sent')
        }).catch(err => console.error('Email error:', err))

        // Send welcome notification
        automaticNotifications.sendWelcomeNotification(user.id, userName)
          .then(() => console.log('✅ Welcome notification sent'))
          .catch(err => console.error('Notification error:', err))

        localStorage.setItem(`welcome_sent_${user.id}`, 'true')
      }
    }
  }, [user])

  // Check if user already has an account type and redirect them
  useEffect(() => {
    if (user && isLoaded) {
      const clerkAccountType = (user.publicMetadata?.accountType as string) ||
        (user.unsafeMetadata?.accountType as string)

      console.log('Checking account type for user:', user.id, 'Clerk account type:', clerkAccountType)

      if (clerkAccountType === 'renter' || clerkAccountType === 'owner' || clerkAccountType === 'affiliate') {
        console.log('User has account type in Clerk, redirecting to:', clerkAccountType)
        if (clerkAccountType === 'owner') {
          router.push('/dashboard/owner')
        } else if (clerkAccountType === 'affiliate') {
          router.push('/dashboard/affiliate')
        } else {
          router.push('/listings')
        }
      } else {
        console.log('User needs to select account type')
        localStorage.removeItem('userAccountType')
        setIsCheckingAccountType(false)
      }
    } else if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [user, isLoaded, router])

  const handleAccountTypeSelection = async (accountType: 'renter' | 'owner' | 'affiliate') => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          accountType: accountType,
        }
      })

      setUserAccountType(accountType)

      toast({
        title: "✅ Account Created!",
        description: `Welcome to Leli Rentals as a ${accountType}!`,
        duration: 3000,
      })

      if (accountType === 'owner') {
        router.push('/verification')
      } else {
        selectAccountType(accountType, user?.id)
      }

    } catch (error) {
      console.error('Error in account type selection:', error)
      setUserAccountType(accountType)

      toast({
        title: "⚠️ Account type set locally",
        description: "Your selection was saved. You can continue using the app.",
        duration: 3000,
      })

      if (accountType === 'owner') {
        router.push('/verification')
      } else {
        selectAccountType(accountType, user?.id)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking account type
  if (isCheckingAccountType) {
    return (
      <>
        <Header />
        <LoadingSpinner
          message="Setting up your account..."
          variant="default"
          fullScreen={true}
          showHeader={false}
        />
      </>
    )
  }

  if (!isLoaded || !user) {
    return (
      <>
        <Header />
        <LoadingSpinner
          message="Loading..."
          variant="default"
          fullScreen={true}
          showHeader={false}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Welcome to Leli Rentals
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Whether you're looking to rent or earn, we've got you covered
          </p>
        </motion.div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {/* Renter Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard
              hover
              gradient
              className={`p-8 cursor-pointer transition-all duration-300 ${selectedAccountType === 'renter'
                ? 'ring-4 ring-blue-500 dark:ring-blue-400'
                : ''
                }`}
              onClick={() => setSelectedAccountType('renter')}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                {selectedAccountType === 'renter' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-2 bg-blue-600 rounded-full"
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </div>

              <h2 className="font-heading text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                I want to Rent
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Access thousands of items from trusted owners
              </p>

              <div className="space-y-3 mb-6">
                {renterBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <benefit.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {benefit.text}
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => handleAccountTypeSelection('renter')}
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting && selectedAccountType === 'renter' ? (
                  "Setting up..."
                ) : (
                  <>
                    Start Renting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </GlassCard>
          </motion.div>

          {/* Owner Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard
              hover
              gradient
              className={`p-8 cursor-pointer transition-all duration-300 ${selectedAccountType === 'owner'
                ? 'ring-4 ring-purple-500 dark:ring-purple-400'
                : ''
                }`}
              onClick={() => setSelectedAccountType('owner')}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                  <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                {selectedAccountType === 'owner' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-2 bg-purple-600 rounded-full"
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </div>

              <h2 className="font-heading text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                I want to Earn
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                List your items and start earning passive income
              </p>

              <div className="space-y-3 mb-6">
                {ownerBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <benefit.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    {benefit.text}
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => handleAccountTypeSelection('owner')}
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting && selectedAccountType === 'owner' ? (
                  "Setting up..."
                ) : (
                  <>
                    Start Earning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </GlassCard>
          </motion.div>

          {/* Affiliate Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard
              hover
              gradient
              className={`p-8 cursor-pointer transition-all duration-300 ${selectedAccountType === 'affiliate'
                ? 'ring-4 ring-green-500 dark:ring-green-400'
                : ''
                }`}
              onClick={() => setSelectedAccountType('affiliate')}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                {selectedAccountType === 'affiliate' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-2 bg-green-600 rounded-full"
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </div>

              <h2 className="font-heading text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                I want to Promote
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join our affiliate program and earn commissions
              </p>

              <div className="space-y-3 mb-6">
                {affiliateBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <benefit.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    {benefit.text}
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => handleAccountTypeSelection('affiliate')}
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting && selectedAccountType === 'affiliate' ? (
                  "Setting up..."
                ) : (
                  <>
                    Start Promoting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </GlassCard>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>Instant verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span>10,000+ active users</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
