"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, Calendar, CreditCard, Crown, FileCheck, Ticket, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'

interface Stats {
    users: number
    listings: number
    bookings: number
    revenue: number
    subscriptions: number
    verifications: number
    tickets: number
    growth: number
}

export default function AdminDashboard() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        if (isAdmin) {
            fetchStats()
        }
    }, [isAdmin])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/stats')
            const data = await response.json()

            if (data.stats) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (isChecking || !isLoaded) {
        return <LoadingSpinner message="Verifying admin access..." variant="default" fullScreen={true} showHeader={false} />
    }

    if (!isAdmin) {
        return null
    }

    const statsCards = [
        { title: 'Total Users', value: stats?.users || 0, change: '+12%', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', trend: 'up' },
        { title: 'Active Listings', value: stats?.listings || 0, change: '+8%', icon: Package, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20', trend: 'up' },
        { title: 'Total Bookings', value: stats?.bookings || 0, change: '+15%', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', trend: 'up' },
        { title: 'Revenue (KSh)', value: `${((stats?.revenue || 0) / 1000000).toFixed(1)}M`, change: '+23%', icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', trend: 'up' },
        { title: 'Subscriptions', value: stats?.subscriptions || 0, change: '+5%', icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', trend: 'up' },
        { title: 'Pending Verifications', value: stats?.verifications || 0, change: '-3%', icon: FileCheck, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20', trend: 'down' },
        { title: 'Open Tickets', value: stats?.tickets || 0, change: '-12%', icon: Ticket, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20', trend: 'down' },
        { title: 'Growth Rate', value: `${stats?.growth || 0}%`, change: '+2%', icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', trend: 'up' },
    ]

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.firstName}! Here's what's happening with your platform.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner message="Loading dashboard..." variant="default" fullScreen={false} showHeader={false} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsCards.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <Card key={stat.title} className="hover:shadow-lg transition-shadow">
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
                                        <div className="flex items-end justify-between">
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </div>
                                            <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                                {stat.change}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
