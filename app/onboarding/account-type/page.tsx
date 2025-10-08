'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Home, 
  ArrowRight, 
  CheckCircle,
  Building,
  Calendar,
  MessageSquare,
  CreditCard,
  BarChart3,
  Shield,
  Star
} from 'lucide-react'

interface AccountType {
  type: 'renter' | 'owner'
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  benefits: string[]
  isRecommended?: boolean
}

const accountTypes: AccountType[] = [
  {
    type: 'renter',
    name: 'Renter Account',
    description: 'Find and book amazing places to stay',
    icon: <User className="h-8 w-8" />,
    features: [
      'Search and book accommodations',
      'Manage your bookings',
      'Message hosts',
      'Leave reviews',
      'Save favorite places',
      'Get booking confirmations'
    ],
    benefits: [
      'Access to thousands of properties',
      'Secure payment processing',
      '24/7 customer support',
      'Flexible booking options',
      'Instant booking confirmation'
    ],
    isRecommended: true
  },
  {
    type: 'owner',
    name: 'Owner Account',
    description: 'List your property and earn money',
    icon: <Home className="h-8 w-8" />,
    features: [
      'List your property',
      'Manage bookings',
      'Set pricing and availability',
      'Communicate with guests',
      'Track earnings',
      'Access analytics dashboard'
    ],
    benefits: [
      'Earn money from your property',
      'Flexible pricing control',
      'Professional listing tools',
      'Guest management system',
      'Revenue tracking and analytics'
    ]
  }
]

export default function AccountTypeSelection() {
  const { user, userProfile } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'renter' | 'owner' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Redirect if user is not new or not authenticated
    if (!user || !userProfile?.isNewUser) {
      router.push('/')
    }
  }, [user, userProfile, router])

  const handleSelectAccountType = async (accountType: 'renter' | 'owner') => {
    if (!user) return

    setIsLoading(true)
    try {
      // Update user profile with selected account type
      await updateDoc(doc(db, 'users', user.uid), {
        accountType,
        isNewUser: false,
        onboardingCompleted: true,
        updatedAt: new Date()
      })

      toast({
        title: "Success",
        description: `Welcome to Leli Rentals as a ${accountType}!`
      })

      // Redirect based on account type
      if (accountType === 'owner') {
        router.push('/dashboard')
      } else {
        router.push('/listings')
      }
    } catch (error) {
      console.error('Error updating account type:', error)
      toast({
        title: "Error",
        description: "Failed to set account type. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !userProfile?.isNewUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Leli Rentals!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose how you'd like to use our platform
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Account created successfully</span>
            </div>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {accountTypes.map((account) => (
              <Card 
                key={account.type} 
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedType === account.type 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedType(account.type)}
              >
                {account.isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-4 rounded-full mb-4 ${
                    selectedType === account.type 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {account.icon}
                  </div>
                  <CardTitle className="text-2xl">{account.name}</CardTitle>
                  <CardDescription className="text-lg">{account.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">What you can do:</h4>
                    <ul className="space-y-2">
                      {account.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Benefits:</h4>
                    <ul className="space-y-2">
                      {account.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection Indicator */}
                  {selectedType === account.type && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium">
                      <CheckCircle className="h-5 w-5" />
                      <span>Selected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <Button
              onClick={() => selectedType && handleSelectAccountType(selectedType)}
              disabled={!selectedType || isLoading}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up your account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            
            {!selectedType && (
              <p className="text-sm text-gray-500 mt-4">
                Please select an account type to continue
              </p>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-16 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">Need Help Choosing?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <Building className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h4 className="font-medium mb-2">Renter Account</h4>
                <p className="text-sm text-gray-600">
                  Perfect if you're looking for a place to stay. You can search, book, and manage your accommodations.
                </p>
              </div>
              <div className="text-center">
                <Home className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h4 className="font-medium mb-2">Owner Account</h4>
                <p className="text-sm text-gray-600">
                  Ideal if you have a property to rent out. You can list your space and earn money from bookings.
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't worry - you can always switch between account types later in your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
