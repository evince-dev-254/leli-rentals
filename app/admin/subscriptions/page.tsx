"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Crown, Search, Download, Filter, Calendar, Users, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react'

export default function SubscriptionsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (isLoaded) {
            const adminRole = (user?.publicMetadata?.role as string) || (user?.unsafeMetadata as any)?.role

            if (!user) {
                router.push('/sign-in?redirect=/admin')
                return
            }

            if (adminRole !== 'admin') {
                router.push('/')
                return
            }

            setIsAdmin(true)
            setIsChecking(false)
        }
    }, [user, isLoaded, router])

    if (isChecking || !isLoaded) {
        return <LoadingSpinner message="Verifying admin access..." variant="default" fullScreen={true} showHeader={false} />
    }

    if (!isAdmin) {
        return null
    }

    // Subscription Plans
    const plans = [
        {
            name: 'Weekly Plan',
            price: 500,
            currency: 'KSh',
            duration: '7 days',
            listingLimit: 10,
            features: ['Up to 10 listings', '7 days duration', 'Low, flexible'],
            color: 'blue',
            activeUsers: 89
        },
        {
            name: 'Monthly Plan',
            price: 1000,
            currency: 'KSh',
            duration: '30 days',
            listingLimit: 'Unlimited',
            features: ['Unlimited listings', '30 days duration', 'High value, stable'],
            color: 'purple',
            activeUsers: 145
        }
    ]

    // Mock subscription data
    const subscriptions = [
        { id: 1, user: 'John Doe', email: 'john@example.com', plan: 'Monthly Plan', status: 'active', startDate: '2025-11-15', endDate: '2025-12-15', amount: 1000 },
        { id: 2, user: 'Jane Smith', email: 'jane@example.com', plan: 'Weekly Plan', status: 'active', startDate: '2025-11-28', endDate: '2025-12-05', amount: 500 },
        { id: 3, user: 'Bob Johnson', email: 'bob@example.com', plan: 'Monthly Plan', status: 'expired', startDate: '2025-10-15', endDate: '2025-11-15', amount: 1000 },
        { id: 4, user: 'Alice Williams', email: 'alice@example.com', plan: 'Weekly Plan', status: 'active', startDate: '2025-11-30', endDate: '2025-12-07', amount: 500 },
        { id: 5, user: 'Charlie Brown', email: 'charlie@example.com', plan: 'Monthly Plan', status: 'cancelled', startDate: '2025-11-01', endDate: '2025-12-01', amount: 1000 },
    ]

    const stats = [
        { title: 'Total Subscriptions', value: '234', icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { title: 'Active Subscriptions', value: '189', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { title: 'Monthly Revenue', value: 'KSh 189,000', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { title: 'Growth Rate', value: '+23%', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    ]

    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Subscription Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage subscription plans and user subscriptions</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {stat.title}
                                        </CardTitle>
                                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                            <Icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Subscription Plans */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subscription Plans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan) => (
                            <Card key={plan.name} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                                            <CardDescription>{plan.duration}</CardDescription>
                                        </div>
                                        <Badge className={`${plan.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {plan.activeUsers} active
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {plan.currency} {plan.price.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500">per {plan.duration}</div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span>Listing Limit: <strong>{plan.listingLimit}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span>Duration: <strong>{plan.duration}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span>Commitment: <strong>{plan.features[2]}</strong></span>
                                        </div>
                                    </div>
                                    <Button className="w-full" variant="outline">Edit Plan</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* User Subscriptions */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>User Subscriptions</CardTitle>
                                <CardDescription>Manage all user subscriptions</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search subscriptions..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubscriptions.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{sub.user}</div>
                                                    <div className="text-sm text-gray-500">{sub.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{sub.plan}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    sub.status === 'active' ? 'default' :
                                                        sub.status === 'expired' ? 'secondary' :
                                                            'destructive'
                                                }>
                                                    {sub.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{sub.startDate}</TableCell>
                                            <TableCell>{sub.endDate}</TableCell>
                                            <TableCell>KSh {sub.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">View</Button>
                                                    {sub.status === 'active' && (
                                                        <Button size="sm" variant="destructive">Cancel</Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
