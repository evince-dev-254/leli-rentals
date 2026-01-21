"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase";
import { getOwnerData, getOwnerStats, getBookings, getVerifications } from "@/lib/actions/dashboard-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CalendarCheck, DollarSign, BarChart3, PlusCircle, MessageCircle, Settings, ChevronRight, ShieldCheck } from "lucide-react";
import { LoadingLogo } from "@/components/ui/loading-logo";
import { DashboardWelcomeHeader } from "./dashboard-welcome-header";
import { DashboardStatCard } from "./dashboard-stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardFAQ } from "./dashboard-faq";

import { WithdrawalModal } from "./withdrawal-modal";

export default function OwnerDashboard() {
    const [user, setUser] = useState<any>(null);
    const [listings, setListings] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [withdrawalOpen, setWithdrawalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch profile to get role/details
                const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
                const userWithProfile = { ...user, ...profile };
                setUser(userWithProfile);

                const [listingsData, statsData, bookingsData, verifications] = await Promise.all([
                    getOwnerData(user.id),
                    getOwnerStats(user.id),
                    getBookings(user.id, 'owner'),
                    getVerifications(user.id)
                ]);
                setListings(listingsData || []);
                setStats(statsData);
                setBookings(bookingsData || []);

                // Check if any verification document is approved
                const verified = verifications.some((v: any) => v.status === 'approved');
                setIsVerified(verified);

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    useEffect(() => {
        const calculateGracePeriod = () => {
            if (user && !isVerified) {
                const ownerAt = new Date(user.owner_at || user.created_at);
                const deadline = new Date(ownerAt);
                deadline.setDate(deadline.getDate() + 5);
                const now = new Date();
                const diffTime = deadline.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDaysRemaining(diffDays > 0 ? diffDays : 0);
            }
        };
        calculateGracePeriod();
    }, [user, isVerified]);

    if (!user && !loading) return <p className="text-center mt-10">Please sign in to view your dashboard.</p>;

    if (loading) return (
        <div className="flex items-center justify-center h-[80vh]">
            <LoadingLogo size={80} />
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Verification Reminder Banner */}
            {user && !isVerified && daysRemaining !== null && daysRemaining > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-purple-900 dark:text-purple-100">Action Required: Verify Your Identity</h4>
                            <p className="text-sm text-purple-700/80 dark:text-purple-300/80">
                                Please submit your verification documents within the next <span className="font-bold">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</span> to keep your owner account active.
                            </p>
                        </div>
                    </div>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 whitespace-nowrap">
                        <Link href="/dashboard/verification">Verify Now</Link>
                    </Button>
                </motion.div>
            )}

            {/* Unified Welcome Header */}
            <DashboardWelcomeHeader
                user={user}
                subtitle="Here's a summary of your rental business performance."
                role="Owner"
                isVerified={isVerified}
            />

            {/* Stats Grid */}
            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DashboardStatCard
                        title="Total Listings"
                        value={stats?.listingsCount || 0}
                        icon={Package}
                        color="indigo"
                        description="Active properties"
                    />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DashboardStatCard
                        title="Active Bookings"
                        value={stats?.activeBookingsCount || 0}
                        icon={CalendarCheck}
                        color="warm-blend"
                        description="Current & upcoming"
                    />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <div className="relative group h-full">
                        <DashboardStatCard
                            title="Total Earnings"
                            value={`KSh ${(stats?.totalEarnings || 0).toLocaleString()}`}
                            icon={DollarSign}
                            color="sunset"
                            description="Lifetime revenue"
                        />
                        {(stats?.availableBalance > 0) && (
                            <div className="absolute bottom-4 right-4">
                                <Button
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg border-0"
                                    onClick={() => setWithdrawalOpen(true)}
                                >
                                    Request Payout
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DashboardStatCard
                        title="Total Views"
                        value={(stats?.totalViews || 0).toLocaleString()}
                        icon={BarChart3}
                        color="teal"
                        description="Listing impressions"
                    />
                </motion.div>
            </motion.div>

            {/* Main Content Areas */}
            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >

                {/* Recent Listings */}
                <Card className="col-span-4 lg:col-span-4 glass-card border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Listings</CardTitle>
                                <CardDescription>Manage your property portfolio</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/listings">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {listings.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">No listings yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Start earning by adding your tools or equipment to our marketplace.</p>
                                <Button asChild className="rounded-full px-6">
                                    <Link href="/dashboard/listings/new">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create First Listing
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {listings.slice(0, 5).map((l, i) => (
                                    <div key={l.id || i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border relative">
                                                {l.images && l.images[0] ? (
                                                    <Image
                                                        src={l.images[0]}
                                                        alt={l.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                        onError={(e) => {
                                                            // For Next.js Image, you might need a local state
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                        <Package className="h-5 w-5 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold line-clamp-1 text-sm sm:text-base">{l.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${l.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-gray-100 text-gray-700'}`}>
                                                        {l.is_active ? 'Active' : 'Draft'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground truncate hidden sm:inline">• {l.category || "General"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-bold text-primary text-sm sm:text-base">KSh {l.price_per_day?.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">per day</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Bookings & Quick Actions */}
                <div className="col-span-4 lg:col-span-3 space-y-6">
                    <Card className="glass-card border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest rental requests</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            {bookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">No activity yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.slice(0, 5).map((booking) => (
                                        <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl bg-background/50 border border-border/50 shadow-sm hover:shadow-md transition-all">
                                            <div className={`p-3 rounded-full shrink-0 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : booking.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                                <CalendarCheck className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate text-sm">{booking.listing?.title}</p>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                    <span>{booking.renter?.full_name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="font-bold text-sm">
                                                KSh {booking.total_amount?.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button variant="ghost" className="w-full mt-4 text-xs group" asChild>
                                <Link href="/dashboard/bookings">
                                    View All Bookings <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none shadow-md bg-gradient-to-br from-primary/5 to-purple-500/5">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button asChild className="w-full justify-start h-auto py-3 px-4 bg-white dark:bg-white/10 text-foreground hover:bg-gray-50 dark:hover:bg-white/20 border border-border/50 shadow-sm transition-all">
                                <Link href="/dashboard/listings/new">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600 dark:bg-blue-900/30">
                                        <PlusCircle className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-sm">Post New Item</div>
                                        <div className="text-xs text-muted-foreground">Create a new listing</div>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start h-auto py-3 px-4 bg-white dark:bg-white/10 text-foreground hover:bg-gray-50 dark:hover:bg-white/20 border border-border/50 shadow-sm transition-all">
                                <Link href="/dashboard/messages">
                                    <div className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600 dark:bg-purple-900/30">
                                        <MessageCircle className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-sm">Messages</div>
                                        <div className="text-xs text-muted-foreground">Check your inbox</div>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start h-auto py-3 px-4 bg-white dark:bg-white/10 text-foreground hover:bg-gray-50 dark:hover:bg-white/20 border border-border/50 shadow-sm transition-all">
                                <Link href="/dashboard/settings">
                                    <div className="bg-gray-100 p-2 rounded-full mr-3 text-gray-600 dark:bg-gray-800">
                                        <Settings className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-sm">Settings</div>
                                        <div className="text-xs text-muted-foreground">Update preferences</div>
                                    </div>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
            <DashboardFAQ role="owner" />

            <WithdrawalModal
                open={withdrawalOpen}
                onOpenChange={setWithdrawalOpen}
                availableBalance={stats?.availableBalance || 0}
                userId={user?.id}
                onSuccess={() => { }} // No refresh needed for now or could refetch stats
                paymentInfo={user?.payment_info}
                role="owner"
            />
        </div>
    );
}
