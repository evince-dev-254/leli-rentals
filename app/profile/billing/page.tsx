'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Plus, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Receipt,
  Banknote,
  Smartphone,
  Mail,
  Bell,
  Settings,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Crown,
  Check,
  Zap,
  Star
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'mobile'
  name: string
  last4: string
  isDefault: boolean
  expiryDate?: string
  bankName?: string
  phoneNumber?: string
  createdAt: Date
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  paidDate?: Date
  description: string
  items: InvoiceItem[]
  createdAt: Date
}

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface BillingHistory {
  id: string
  type: 'payment' | 'refund' | 'charge'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  date: Date
  paymentMethod: string
}

export default function BillingPage() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Get current subscription from user metadata
  const currentSubscription = (user?.unsafeMetadata?.subscriptionStatus as string) || 
                              (user?.publicMetadata?.subscriptionStatus as string) || 
                              'free'
  
  // Get account type
  const accountType = (user?.unsafeMetadata?.accountType as string) || 
                     (user?.publicMetadata?.accountType as string) || 
                     'renter'

  // Form states
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card' as 'card' | 'bank' | 'mobile',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    phoneNumber: ''
  })

  const [newInvoice, setNewInvoice] = useState({
    amount: '',
    description: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  })

  useEffect(() => {
    if (!user) return

    const fetchBillingData = async () => {
      try {
        // Firebase removed - using empty data
        setPaymentMethods([])
        setInvoices([])
        setBillingHistory([])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching billing data:', error)
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load billing information",
          variant: "destructive"
        })
      }
    }

    fetchBillingData()
  }, [user, toast])

  const handleAddPaymentMethod = async () => {
    if (!user) return

    try {
      const paymentData = {
        userId: user.id,
        type: newPaymentMethod.type,
        name: newPaymentMethod.name,
        last4: newPaymentMethod.type === 'card' 
          ? newPaymentMethod.cardNumber.slice(-4)
          : newPaymentMethod.type === 'bank'
          ? newPaymentMethod.accountNumber.slice(-4)
          : newPaymentMethod.phoneNumber.slice(-4),
        isDefault: paymentMethods.length === 0,
        expiryDate: newPaymentMethod.expiryDate,
        bankName: newPaymentMethod.bankName,
        phoneNumber: newPaymentMethod.phoneNumber,
        createdAt: new Date()
      }

      // Firebase removed - simulating payment method add
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Payment method added successfully"
      })
      
      setShowAddPayment(false)
      setNewPaymentMethod({
        type: 'card',
        name: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        bankName: '',
        accountNumber: '',
        phoneNumber: ''
      })
    } catch (error) {
      console.error('Error adding payment method:', error)
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive"
      })
    }
  }

  const handleCreateInvoice = async () => {
    if (!user) return

    try {
      const invoiceNumber = `INV-${Date.now()}`
      const items = newInvoice.items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      }))
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

      const invoiceData = {
        userId: user.id,
        invoiceNumber,
        amount: totalAmount,
        status: 'pending',
        dueDate: new Date(newInvoice.dueDate),
        description: newInvoice.description,
        items,
        createdAt: new Date()
      }

      // Firebase removed - simulating invoice creation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Invoice created successfully"
      })
      
      setShowAddInvoice(false)
      setNewInvoice({
        amount: '',
        description: '',
        dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }]
      })
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      })
    }
  }

  const handleSetDefaultPayment = async (paymentId: string) => {
    if (!user) return

    try {
      // Firebase removed - simulating default payment update
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Default payment method updated"
      })
    } catch (error) {
      console.error('Error updating default payment method:', error)
      toast({
        title: "Error",
        description: "Failed to update default payment method",
        variant: "destructive"
      })
    }
  }

  const handlePayInvoice = async (invoiceId: string) => {
    if (!user) return

    try {
      // Firebase removed - simulating invoice payment
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Invoice paid successfully"
      })
    } catch (error) {
      console.error('Error paying invoice:', error)
      toast({
        title: "Error",
        description: "Failed to pay invoice",
        variant: "destructive"
      })
    }
  }

  const handleSelectPlan = async (plan: string) => {
    if (!user) return

    try {
      setSelectedPlan(plan)
      
      // Update user metadata with selected subscription plan
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          subscriptionStatus: plan,
          subscriptionUpdatedAt: new Date().toISOString()
        }
      })
      
      toast({
        title: "Success!",
        description: `You've successfully subscribed to the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`,
      })
      
      setSelectedPlan(null)

      // Redirect owners to dashboard after selecting plan
      if (accountType === 'owner') {
        setTimeout(() => {
          router.push('/dashboard/owner')
        }, 1500)
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive"
      })
      setSelectedPlan(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'overdue':
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4 hover:bg-purple-100 dark:hover:bg-purple-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Billing & Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your payment methods, invoices, and billing history</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        {/* Subscription Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select the perfect plan for your rental business
            </p>
            {currentSubscription !== 'free' && (
              <div className="mt-4">
                <Badge className="bg-purple-100 text-purple-800">
                  <Crown className="h-3 w-3 mr-1" />
                  Current Plan: {currentSubscription.charAt(0).toUpperCase() + currentSubscription.slice(1)}
                </Badge>
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 ${accountType === 'owner' ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8 max-w-6xl mx-auto`}>
            {/* Free Plan - Only for Renters */}
            {accountType !== 'owner' && (
              <Card className={`relative ${currentSubscription === 'free' ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-2xl">Free</CardTitle>
                      <CardDescription>Perfect for trying out the platform</CardDescription>
                    </div>
                    <Zap className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Browse all listings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Basic support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Make bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Save favorites</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    variant={currentSubscription === 'free' ? 'outline' : 'default'}
                    onClick={() => handleSelectPlan('free')}
                    disabled={currentSubscription === 'free' || selectedPlan === 'free'}
                  >
                    {selectedPlan === 'free' ? 'Processing...' : currentSubscription === 'free' ? 'Current Plan' : 'Select Free'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Basic Plan - Owners start here */}
            <Card className={`relative ${currentSubscription === 'basic' ? 'ring-2 ring-blue-500' : ''}`}>
              {accountType === 'owner' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">
                    Starter Plan
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl">Basic</CardTitle>
                    <CardDescription>Perfect for getting started</CardDescription>
                  </div>
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$20</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 10 active listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Standard visibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">4% transaction fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic analytics</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  variant={currentSubscription === 'basic' ? 'outline' : 'default'}
                  onClick={() => handleSelectPlan('basic')}
                  disabled={currentSubscription === 'basic' || selectedPlan === 'basic'}
                >
                  {selectedPlan === 'basic' ? 'Processing...' : currentSubscription === 'basic' ? 'Current Plan' : 'Select Basic'}
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className={`relative ${currentSubscription === 'professional' ? 'ring-2 ring-orange-500' : ''}`}>
              {accountType === 'owner' && currentSubscription !== 'professional' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <CardDescription>For growing rental businesses</CardDescription>
                  </div>
                  <Star className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$70</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 50 active listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Enhanced visibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">2% transaction fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Featured listings (5/month)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Performance reports</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  variant={currentSubscription === 'professional' ? 'outline' : 'default'}
                  onClick={() => handleSelectPlan('professional')}
                  disabled={currentSubscription === 'professional' || selectedPlan === 'professional'}
                >
                  {selectedPlan === 'professional' ? 'Processing...' : currentSubscription === 'professional' ? 'Current Plan' : 'Select Professional'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className={`relative ${currentSubscription === 'premium' ? 'ring-2 ring-purple-500' : 'border-purple-200'}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl">Premium</CardTitle>
                    <CardDescription>For serious rental businesses</CardDescription>
                  </div>
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$150</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold">Unlimited listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 premium support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Maximum visibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold">0% transaction fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited featured listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Custom branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API access</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                  variant={currentSubscription === 'premium' ? 'outline' : 'default'}
                  onClick={() => handleSelectPlan('premium')}
                  disabled={currentSubscription === 'premium' || selectedPlan === 'premium'}
                >
                  {selectedPlan === 'premium' ? 'Processing...' : currentSubscription === 'premium' ? 'Current Plan' : 'Select Premium'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Crown className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold">Need a Custom Enterprise Plan?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  Get tailored solutions with custom pricing, dedicated support, and enterprise features
                </p>
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                  <Badge variant="outline" className="text-sm py-1">
                    <Check className="h-3 w-3 mr-1" />
                    Custom Features
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    <Check className="h-3 w-3 mr-1" />
                    Volume Discounts
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    <Check className="h-3 w-3 mr-1" />
                    White-Label Options
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1">
                    <Check className="h-3 w-3 mr-1" />
                    API Access
                  </Badge>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                  onClick={() => router.push('/custom-plans')}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Sales for Custom Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
                    .reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').length} pending invoices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentMethods.length}</div>
                <p className="text-xs text-muted-foreground">
                  {paymentMethods.filter(pm => pm.isDefault).length} default method
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${billingHistory
                    .filter(bh => 
                      bh.date.getMonth() === new Date().getMonth() && 
                      bh.date.getFullYear() === new Date().getFullYear() &&
                      bh.type === 'payment'
                    )
                    .reduce((sum, bh) => sum + bh.amount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total payments this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your latest invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">${invoice.amount.toFixed(2)}</p>
                      </div>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1">{invoice.status}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your latest payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-gray-600">
                          {payment.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${payment.amount.toFixed(2)}</p>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method to your account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Payment Type</Label>
                    <Select value={newPaymentMethod.type} onValueChange={(value: 'card' | 'bank' | 'mobile') => 
                      setNewPaymentMethod(prev => ({ ...prev, type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="mobile">Mobile Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Name on Card/Account</Label>
                    <Input
                      id="name"
                      value={newPaymentMethod.name}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>

                  {newPaymentMethod.type === 'card' && (
                    <>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={newPaymentMethod.expiryDate}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={newPaymentMethod.cvv}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {newPaymentMethod.type === 'bank' && (
                    <>
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={newPaymentMethod.bankName}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="Chase Bank"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={newPaymentMethod.accountNumber}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountNumber: e.target.value }))}
                          placeholder="1234567890"
                        />
                      </div>
                    </>
                  )}

                  {newPaymentMethod.type === 'mobile' && (
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={newPaymentMethod.phoneNumber}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  )}

                  <Button onClick={handleAddPaymentMethod} className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {method.type === 'card' && <CreditCard className="h-5 w-5" />}
                      {method.type === 'bank' && <Banknote className="h-5 w-5" />}
                      {method.type === 'mobile' && <Smartphone className="h-5 w-5" />}
                      <span className="font-medium capitalize">{method.type}</span>
                    </div>
                    {method.isDefault && (
                      <Badge variant="default">Default</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-600">
                      **** **** **** {method.last4}
                    </p>
                    {method.expiryDate && (
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryDate}
                      </p>
                    )}
                    {method.bankName && (
                      <p className="text-sm text-gray-600">{method.bankName}</p>
                    )}
                    {method.phoneNumber && (
                      <p className="text-sm text-gray-600">{method.phoneNumber}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    {!method.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetDefaultPayment(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <Dialog open={showAddInvoice} onOpenChange={setShowAddInvoice}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Create a new invoice for your services
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Service description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Invoice Items</Label>
                    <div className="space-y-2">
                      {newInvoice.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...newInvoice.items]
                              newItems[index].description = e.target.value
                              setNewInvoice(prev => ({ ...prev, items: newItems }))
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...newInvoice.items]
                              newItems[index].quantity = parseInt(e.target.value) || 1
                              setNewInvoice(prev => ({ ...prev, items: newItems }))
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newItems = [...newInvoice.items]
                              newItems[index].unitPrice = parseFloat(e.target.value) || 0
                              setNewInvoice(prev => ({ ...prev, items: newItems }))
                            }}
                          />
                          <div className="flex items-center">
                            <span className="text-sm font-medium">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewInvoice(prev => ({
                        ...prev,
                        items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
                      }))}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  <Button onClick={handleCreateInvoice} className="w-full">
                    Create Invoice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{invoice.description}</p>
                      <p className="text-sm text-gray-600">
                        Due: {invoice.dueDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-2xl font-bold">${invoice.amount.toFixed(2)}</p>
                      <div className="flex space-x-2">
                        {invoice.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayInvoice(invoice.id)}
                          >
                            Pay Now
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <h2 className="text-2xl font-bold">Billing History</h2>
          
          <div className="space-y-4">
            {billingHistory.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{payment.description}</h3>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {payment.date.toLocaleDateString()} • {payment.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {payment.type === 'refund' ? '-' : '+'}${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{payment.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



