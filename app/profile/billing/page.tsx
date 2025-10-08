'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore'
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
  Trash2
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
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showAddInvoice, setShowAddInvoice] = useState(false)

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
        // Fetch payment methods
        const paymentMethodsQuery = query(
          collection(db, 'paymentMethods'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )

        const unsubscribePaymentMethods = onSnapshot(paymentMethodsQuery, (snapshot) => {
          const methods = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as PaymentMethod[]
          setPaymentMethods(methods)
        })

        // Fetch invoices
        const invoicesQuery = query(
          collection(db, 'invoices'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )

        const unsubscribeInvoices = onSnapshot(invoicesQuery, (snapshot) => {
          const invoiceData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate() || new Date(),
            paidDate: doc.data().paidDate?.toDate(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as Invoice[]
          setInvoices(invoiceData)
        })

        // Fetch billing history
        const billingHistoryQuery = query(
          collection(db, 'billingHistory'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        )

        const unsubscribeBillingHistory = onSnapshot(billingHistoryQuery, (snapshot) => {
          const historyData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date()
          })) as BillingHistory[]
          setBillingHistory(historyData)
        })

        setIsLoading(false)

        return () => {
          unsubscribePaymentMethods()
          unsubscribeInvoices()
          unsubscribeBillingHistory()
        }
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
        userId: user.uid,
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

      await addDoc(collection(db, 'paymentMethods'), paymentData)
      
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
        userId: user.uid,
        invoiceNumber,
        amount: totalAmount,
        status: 'pending',
        dueDate: new Date(newInvoice.dueDate),
        description: newInvoice.description,
        items,
        createdAt: new Date()
      }

      await addDoc(collection(db, 'invoices'), invoiceData)
      
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
      // Remove default from all payment methods
      const batch = paymentMethods.map(method => 
        updateDoc(doc(db, 'paymentMethods', method.id), { isDefault: false })
      )
      await Promise.all(batch)

      // Set new default
      await updateDoc(doc(db, 'paymentMethods', paymentId), { isDefault: true })
      
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
      await updateDoc(doc(db, 'invoices', invoiceId), {
        status: 'paid',
        paidDate: new Date()
      })

      // Add to billing history
      const invoice = invoices.find(inv => inv.id === invoiceId)
      if (invoice) {
        await addDoc(collection(db, 'billingHistory'), {
          userId: user.uid,
          type: 'payment',
          amount: invoice.amount,
          description: `Payment for invoice ${invoice.invoiceNumber}`,
          status: 'completed',
          date: new Date(),
          paymentMethod: 'Default Payment Method'
        })
      }
      
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-2">Manage your payment methods, invoices, and billing history</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

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