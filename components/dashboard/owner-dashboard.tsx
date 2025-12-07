"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getOwnerData, getOwnerStats, getBookings } from "@/lib/actions/dashboard-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CalendarCheck, DollarSign, BarChart3, PlusCircle, MessageCircle, Settings } from "lucide-react";
import { LoadingLogo } from "@/components/ui/loading-logo";

export default function OwnerDashboard() {
    const [user, setUser] = useState<any>(null);
    const [listings, setListings] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const [listingsData, statsData, bookingsData] = await Promise.all([
                    getOwnerData(user.id),
                    getOwnerStats(user.id),
                    getBookings(user.id, 'owner')
                ]);
                setListings(listingsData || []);
                setStats(statsData);
                setBookings(bookingsData || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!user) return <p className="text-center">Please sign in to view your dashboard.</p>;
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <LoadingLogo size={60} />
        </div>
    );

    // Real stats
    const statsCards = [
        { label: "Total Listings", value: stats?.listingsCount || 0, icon: Package, change: "Updated just now" },
        { label: "Active Bookings", value: stats?.activeBookingsCount || 0, icon: CalendarCheck, change: "In progress" },
        { label: "Total Earnings", value: `KSh ${(stats?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, change: "Lifetime earnings" },
        { label: "Total Views", value: (stats?.totalViews || 0).toLocaleString(), icon: BarChart3, change: "All time views" },
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Owner Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {user.email?.split('@')[0] || 'User'}. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, i) => (
                    <Card key={i} className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 lg:col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>Recent Listings</CardTitle>
                        <CardDescription>
                            You have {listings.length} total listings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {listings.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No listings yet</p>
                                <Button asChild>
                                    <Link href="/dashboard/listings/new">Create Listing</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {listings.slice(0, 5).map((l, i) => (
                                    <div key={l.id || i} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded bg-secondary/50 flex items-center justify-center">
                                                <Package className="h-5 w-5 opacity-50" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{l.title}</p>
                                                <p className="text-xs text-muted-foreground">Listing</p>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            KSh {l.price_per_day?.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-4 lg:col-span-3 glass-card">
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>Latest rental requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {bookings.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No bookings yet</p>
                        ) : (
                            <div className="space-y-4">
                                {bookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                        <div className={`p-2 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                                            <CalendarCheck className={`h-4 w-4 ${booking.status === 'confirmed' ? 'text-green-500' : 'text-orange-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{booking.listing?.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(booking.start_date).toLocaleDateString()} • {booking.renter?.full_name}</p>
                                        </div>
                                        <div className="text-sm font-semibold">
                                            KSh {booking.total_amount?.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button variant="link" asChild className="px-0 w-full mt-2">
                            <Link href="/dashboard/bookings">View All Bookings</Link>
                        </Button>
                    </CardContent>
                </Card>


                <Card className="col-span-3 lg:col-span-7 glass-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button asChild className="w-full justify-start" variant="outline">
                            <Link href="/dashboard/listings/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Listing
                            </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                            <Link href="/dashboard/messages">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                View Messages
                            </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
