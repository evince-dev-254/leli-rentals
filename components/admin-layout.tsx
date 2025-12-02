"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard, Users, Package, Calendar, CreditCard, Crown,
    FileCheck, MessageSquare, Ticket, Shield, Image, FileText,
    Settings, Menu, X, ChevronRight, Home
} from 'lucide-react'
import { useState } from 'react'

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/listings', label: 'Listings', icon: Package },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: Crown },
    { href: '/admin/verifications', label: 'Verifications', icon: FileCheck },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { href: '/admin/support', label: 'Support', icon: MessageSquare },
    { href: '/admin/manage-admins', label: 'Admins', icon: Shield },
    { href: '/admin/profile-images', label: 'Profile Images', icon: Image },
    { href: '/admin/verification-docs', label: 'Verification Docs', icon: FileText },
    { href: '/admin/listing-images', label: 'Listing Images', icon: Image },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { user } = useUser()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <h1 className="font-bold text-lg">Admin Panel</h1>
                    </div>
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <Home className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <Link href="/admin" className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-red-600" />
                            <span className="font-bold text-xl">Admin Panel</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Leli Rentals</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {user?.firstName?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-gray-500 truncate">Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="pt-16 lg:pt-0">
                    {children}
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}
