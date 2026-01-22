import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ShoppingBag,
    Key,
    Users,
    ShieldAlert,
    TrendingUp,
    Calendar,
    ClipboardList,
    Wallet,
    ChevronRight,
    ArrowRight,
    Gift,
    Plus,
    LayoutDashboard,
    Search,
    Heart,
    Star,
    Sparkles,
    Copy,
    Share2,
    Menu,
    Bell,
    BarChart3,
    Shield,
    MousePointerClick,
    ShieldCheck,
    Clock,
    Zap,
    Trophy
} from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useAuth } from '../../context/auth-context';
import { cn } from '@/lib/utils';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { useColorScheme } from '@/components/useColorScheme';
import { useUserStats } from '@/lib/hooks/useData';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';

const { width } = Dimensions.get('window');

type UserRole = 'renter' | 'owner' | 'affiliate';

// --- Components ---

const WelcomeBanner = ({ role, name }: { role: UserRole, name?: string }) => {
    const config = {
        renter: {
            title: `Hello, ${name || 'Renter'}!`,
            subtitle: "Find your next adventure today.",
            icon: ShoppingBag,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        owner: {
            title: `Welcome, ${name || 'Host'}!`,
            subtitle: "Manage your assets and earnings.",
            icon: Key,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        affiliate: {
            title: `Hi, ${name || 'Partner'}!`,
            subtitle: "Track your impact and rewards.",
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    };

    const current = config[role];

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("p-6 rounded-[32px] flex-row items-center mb-6", current.bg)}
        >
            <View className="flex-1">
                <Text className={cn("text-2xl font-black mb-1", current.color)}>{current.title}</Text>
                <Text className="text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">{current.subtitle}</Text>
            </View>
            <View className="h-14 w-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 items-center justify-center shadow-sm">
                <current.icon size={28} color={role === 'renter' ? '#f97316' : role === 'owner' ? '#10b981' : '#a855f7'} />
            </View>
        </MotiView>
    );
};

const StatCard = ({ label, value, icon: Icon, color, role }: any) => (
    <View className="flex-1 p-5 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm items-center">
        <View className={cn("h-14 w-14 rounded-2xl items-center justify-center mb-4", color)}>
            <Icon size={28} color={role === 'renter' ? '#f97316' : role === 'owner' ? '#10b981' : '#a855f7'} />
        </View>
        <Text className="text-slate-900 dark:text-white text-xl font-black mb-1">{value}</Text>
        <Text className="text-slate-400 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.1em] text-center leading-tight">{label}</Text>
    </View>
);

const QuickAction = ({ title, icon: Icon, onPress, color, textColor }: any) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center p-5 border-b-2 border-slate-50 dark:border-slate-800 last:border-b-0"
        >
            <View className={cn("h-10 w-10 rounded-2xl items-center justify-center mr-4", color)}>
                <Icon size={18} color={textColor} />
            </View>
            <Text className="flex-1 text-base font-black text-slate-800 dark:text-white">{title}</Text>
            <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>
    );
};

// --- Role Dashboards ---

const RenterDashboardView = ({ router, user, stats }: { router: any, user: any, stats: any }) => {
    const [activeTab, setActiveTab] = useState('bookings');

    const tabs = [
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'payments', label: 'Payments', icon: Wallet }
    ];

    return (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-6">
            <WelcomeBanner role="renter" name={user?.user_metadata?.full_name?.split(' ')[0]} />

            <View className="flex-row gap-4 mb-2">
                <StatCard label="Active Orders" value={stats?.bookingCount || 0} icon={ShoppingBag} color="bg-orange-50" role="renter" />
                <StatCard label="Saved Gear" value={stats?.favoritesCount || 0} icon={Heart} color="bg-orange-50" role="renter" />
            </View>

            <DashboardTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeColor="#f97316"
            />

            <AnimatePresence>
                {activeTab === 'bookings' && (
                    <MotiView
                        key="bookings"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Current Rentals</Text>
                            <TouchableOpacity onPress={() => router.push('/bookings')}>
                                <Text className="text-orange-500 font-black text-xs">View All</Text>
                            </TouchableOpacity>
                        </View>

                        {(stats?.bookings?.length || 0) > 0 ? (
                            stats.bookings.map((booking: any) => (
                                <View key={booking.id} className="p-5 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex-row items-center">
                                    <View className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden mr-4">
                                        {/* Simplified listing thumb */}
                                        <View className="flex-1 bg-orange-500/10 items-center justify-center">
                                            <Calendar size={20} color="#f97316" />
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-slate-900 dark:text-white font-black text-sm" numberOfLines={1}>{booking.listing_title || 'Untitled'}</Text>
                                        <Text className="text-slate-400 text-[10px] font-bold uppercase">{booking.status}</Text>
                                    </View>
                                    <ChevronRight size={16} color="#94a3b8" />
                                </View>
                            ))
                        ) : (
                            <View className="p-10 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 items-center justify-center">
                                <ShoppingBag size={40} color="#cbd5e1" className="mb-4" />
                                <Text className="text-slate-400 font-bold text-center">No active bookings found.</Text>
                                <TouchableOpacity onPress={() => router.push('/(tabs)')} className="mt-4">
                                    <Text className="text-orange-500 font-black text-sm">Browse Gear</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </MotiView>
                )}

                {activeTab === 'favorites' && (
                    <MotiView
                        key="favorites"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Watchlist</Text>
                        </View>
                        <View className="p-10 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 items-center justify-center">
                            <Heart size={40} color="#ec4899" className="opacity-20 mb-4" />
                            <Text className="text-slate-400 font-bold text-center">Your favorites will appear here.</Text>
                        </View>
                    </MotiView>
                )}

                {activeTab === 'payments' && (
                    <MotiView
                        key="payments"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Statement</Text>
                            <TouchableOpacity onPress={() => router.push('/financial')}>
                                <Text className="text-emerald-500 font-black text-xs">Full History</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800">
                            <View className="flex-row justify-between mb-4">
                                <Text className="text-slate-500 font-bold">Total Spent</Text>
                                <Text className="text-slate-900 dark:text-white font-black">KSh 12,450</Text>
                            </View>
                            <View className="h-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                <View className="h-full bg-emerald-500 w-2/3" />
                            </View>
                        </View>
                    </MotiView>
                )}
            </AnimatePresence>

            <MotiView
                from={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[40px] flex-row items-center border border-slate-700 shadow-xl mt-4"
            >
                <View className="flex-1">
                    <Text className="text-white font-black text-xl mb-1">Leli Shield</Text>
                    <Text className="text-slate-400 dark:text-slate-300 font-bold text-xs uppercase tracking-widest leading-relaxed">Securing every transaction with ironclad protection.</Text>
                </View>
                <View className="ml-4 h-16 w-16 bg-white/10 rounded-3xl items-center justify-center">
                    <ShieldCheck size={32} color="#f97316" />
                </View>
            </MotiView>
        </MotiView>
    );
};

const OwnerDashboardView = ({ router, user, stats }: { router: any, user: any, stats: any }) => {
    const [activeTab, setActiveTab] = useState('listings');
    const isVerified = stats?.profile?.id_verified || false;
    const ownerAt = stats?.profile?.owner_at;

    const tabs = [
        { id: 'listings', label: 'My Gear', icon: ClipboardList },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'earnings', label: 'Earnings', icon: TrendingUp }
    ];

    const daysRemaining = useMemo(() => {
        if (!ownerAt || isVerified) return null;
        const deadline = new Date(ownerAt);
        deadline.setDate(deadline.getDate() + 5);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }, [ownerAt, isVerified]);

    return (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-6">
            <WelcomeBanner role="owner" name={user?.user_metadata?.full_name?.split(' ')[0]} />

            {/* Verification Grace Period Banner */}
            {!isVerified && daysRemaining !== null && (
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-5 rounded-[32px] flex-row items-center mb-2"
                >
                    <View className="h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-900/40 items-center justify-center mr-4">
                        <Clock size={24} color="#ef4444" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-red-600 dark:text-red-400 font-black text-sm mb-0.5">Identity Verification Required</Text>
                        <Text className="text-red-500/70 dark:text-red-400/60 font-bold text-[10px] uppercase tracking-widest">
                            {daysRemaining} Day{daysRemaining !== 1 ? 's' : ''} Left in Grace Period
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/dashboard/verification')}
                        className="bg-red-600 px-4 py-2 rounded-xl"
                    >
                        <Text className="text-white font-black text-[10px] uppercase tracking-widest">Verify</Text>
                    </TouchableOpacity>
                </MotiView>
            )}

            <View className="flex-row gap-4 mb-2">
                <StatCard label="Live Ads" value={stats?.listingCount || 0} icon={ClipboardList} color="bg-emerald-50" role="owner" />
                <StatCard label="Total Vol" value={`KSh ${stats?.totalEarnings || 0}`} icon={TrendingUp} color="bg-emerald-50" role="owner" />
            </View>

            <DashboardTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeColor="#10b981"
            />

            <AnimatePresence>
                {activeTab === 'listings' && (
                    <MotiView
                        key="listings"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Inventory Status</Text>
                            <TouchableOpacity onPress={() => router.push('/listings/manage')}>
                                <Text className="text-emerald-500 font-black text-xs">Manage All</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push('/listings/create')}
                            className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[32px] border border-dashed border-emerald-200 dark:border-emerald-800 items-center"
                        >
                            <Plus size={24} color="#10b981" className="mb-2" />
                            <Text className="text-emerald-600 dark:text-emerald-400 font-black text-sm">Add New Equipment</Text>
                        </TouchableOpacity>

                        <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2 shadow-sm">
                            <QuickAction title="Asset Manager" icon={ClipboardList} onPress={() => router.push('/listings/manage')} color="bg-blue-50" textColor="#3b82f6" />
                            <QuickAction title="Verification" icon={ShieldCheck} onPress={() => router.push('/dashboard/verification')} color="bg-amber-50" textColor="#f59e0b" />
                        </View>
                    </MotiView>
                )}

                {activeTab === 'bookings' && (
                    <MotiView
                        key="owner-bookings"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="p-10 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 items-center justify-center"
                    >
                        <Calendar size={40} color="#cbd5e1" className="mb-4" />
                        <Text className="text-slate-400 font-bold text-center">No equipment bookings yet.</Text>
                    </MotiView>
                )}

                {activeTab === 'earnings' && (
                    <MotiView
                        key="owner-earnings"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="bg-slate-900 p-8 rounded-[40px] shadow-xl shadow-emerald-600/10">
                            <View className="flex-row items-center justify-between mb-6">
                                <View className="h-10 w-10 bg-white/10 rounded-2xl items-center justify-center">
                                    <TrendingUp size={20} color="#10b981" />
                                </View>
                                <Text className="text-white/60 font-black text-[10px] uppercase tracking-widest">Growth Engine</Text>
                            </View>
                            <Text className="text-white text-3xl font-black mb-1">KSh 0.00</Text>
                            <Text className="text-slate-400 font-bold text-xs uppercase">Cumulative Earnings</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/financial')} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 flex-row items-center">
                            <View className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 items-center justify-center mr-4">
                                <Wallet size={18} color="#a855f7" />
                            </View>
                            <Text className="flex-1 font-black text-slate-800 dark:text-white">Withdrawal Settings</Text>
                            <ChevronRight size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    </MotiView>
                )}
            </AnimatePresence>

            <View className="bg-emerald-600 p-8 rounded-[40px] shadow-xl shadow-emerald-600/20 mt-4">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="h-14 w-14 bg-white/20 rounded-3xl items-center justify-center">
                        <Zap size={28} color="white" />
                    </View>
                    <Text className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em]">Partner Status</Text>
                </View>
                <Text className="text-white text-2xl font-black mb-2">Power Seller Program</Text>
                <Text className="text-white/80 font-bold mb-8 leading-relaxed text-sm">Elevate your listings and minimize platform fees by joining our elite tier.</Text>
                <TouchableOpacity className="bg-white py-5 rounded-2xl items-center shadow-md">
                    <Text className="text-emerald-600 font-black uppercase tracking-widest text-xs">Analyze Perks</Text>
                </TouchableOpacity>
            </View>
        </MotiView>
    );
};

const AffiliateDashboardView = ({ router, user, stats }: { router: any, user: any, stats: any }) => {
    const [activeTab, setActiveTab] = useState('performance');

    const tabs = [
        { id: 'performance', label: 'Stats', icon: BarChart3 },
        { id: 'marketing', label: 'Kit', icon: Sparkles },
        { id: 'payouts', label: 'Cashout', icon: Wallet }
    ];

    return (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-6">
            <WelcomeBanner role="affiliate" name={user?.user_metadata?.full_name?.split(' ')[0]} />

            <View className="flex-row gap-4 mb-2">
                <StatCard label="Total Rev" value={`KSh ${stats?.affiliateEarnings || 0}`} icon={Trophy} color="bg-purple-50" role="affiliate" />
                <StatCard label="Network" value={stats?.referralCount || 0} icon={Users} color="bg-purple-50" role="affiliate" />
            </View>

            <DashboardTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeColor="#a855f7"
            />

            <AnimatePresence>
                {activeTab === 'performance' && (
                    <MotiView
                        key="performance"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Growth Metrics</Text>
                        </View>
                        <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 flex-row justify-between shadow-sm">
                            <View className="items-center">
                                <Text className="text-slate-400 font-bold text-[10px] uppercase mb-1">Clicks</Text>
                                <Text className="text-slate-900 dark:text-white font-black text-lg">0</Text>
                            </View>
                            <View className="w-[1px] h-10 bg-slate-100 dark:bg-slate-800" />
                            <View className="items-center">
                                <Text className="text-slate-400 font-bold text-[10px] uppercase mb-1">Conversion</Text>
                                <Text className="text-slate-900 dark:text-white font-black text-lg">0%</Text>
                            </View>
                            <View className="w-[1px] h-10 bg-slate-100 dark:bg-slate-800" />
                            <View className="items-center">
                                <Text className="text-slate-400 font-bold text-[10px] uppercase mb-1">Pending</Text>
                                <Text className="text-slate-900 dark:text-white font-black text-lg">KSh 0</Text>
                            </View>
                        </View>
                    </MotiView>
                )}

                {activeTab === 'marketing' && (
                    <MotiView
                        key="marketing"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Referral ID</Text>
                            <View className="bg-slate-50 dark:bg-slate-800 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex-row items-center mb-6">
                                <Text className="flex-1 text-slate-600 dark:text-slate-400 font-bold text-xs" numberOfLines={1}>leli.shop/join?ref={user?.id?.substring(0, 8)}</Text>
                                <TouchableOpacity className="ml-3">
                                    <Copy size={16} color="#a855f7" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity className="bg-purple-600 h-16 rounded-[24px] items-center justify-center flex-row shadow-lg shadow-purple-600/20">
                                <Share2 size={18} color="white" />
                                <Text className="text-white font-black ml-2 uppercase tracking-widest text-xs">Share Referral Link</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                            <QuickAction title="Marketing Kit" icon={Sparkles} onPress={() => router.push('/support/about')} color="bg-amber-50" textColor="#d97706" />
                            <QuickAction title="Social Assets" icon={Image} onPress={() => { }} color="bg-blue-50" textColor="#3b82f6" />
                        </View>
                    </MotiView>
                )}

                {activeTab === 'payouts' && (
                    <MotiView
                        key="payouts"
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        exit={{ opacity: 0, translateX: 10 }}
                        className="space-y-4"
                    >
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Financial Records</Text>
                            <TouchableOpacity onPress={() => router.push('/financial')}>
                                <Text className="text-purple-500 font-black text-xs">Full Wallet</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-xl">
                            <Text className="text-white/60 font-black text-[10px] uppercase tracking-widest mb-2">Available for withdrawal</Text>
                            <Text className="text-white text-3xl font-black mb-6">KSh 0.00</Text>
                            <TouchableOpacity className="w-full bg-slate-800 py-4 rounded-2xl items-center border border-slate-700">
                                <Text className="text-white font-black uppercase tracking-widest text-xs">Request Cashout</Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                )}
            </AnimatePresence>

            <View className="h-20" />
        </MotiView>
    );
};

// --- Main Screen ---

export default function UnifiedDashboardScreen() {
    const { user } = useAuth();
    const [activeRole, setActiveRole] = useState<UserRole>('renter');
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Fetch real stats
    const { data: stats, refetch } = useUserStats(user?.id || '');

    // Default to 'renter' but if user has a specific role, use that.
    // Logic: If role switch is removed, we must strictly obey the metadata.
    // However, what if a user is an owner but WANTS to rent?
    // The web app has a 'Switch to Renter' button in the profile menu usually. 
    // Here we are hard-locking them. 
    // Ideally, the HamburgerMenu component should allow switching if they have multiple roles.
    // For now, we trust the `activeRole` state which defaults to metadata role on mount.

    useEffect(() => {
        if (user?.user_metadata?.role) {
            setActiveRole(user.user_metadata.role);
        }
    }, [user?.user_metadata?.role]);


    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} activeRole={activeRole} />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Image
                            source={isDark ? require('../../assets/images/logo_white.png') : require('../../assets/images/logo_black.png')}
                            className="w-32 h-10 mb-2"
                            resizeMode="contain"
                            alt="Leli Rentals"
                        />
                        <Text className="text-slate-400 dark:text-slate-300 font-bold text-xs">
                            {activeRole === 'renter' ? 'Browse & Manage Rentals' : activeRole === 'owner' ? 'Track Equipment & Revenue' : 'Scale Your Partner Network'}
                        </Text>
                    </View>
                    <View className="flex-row gap-6">
                        <TouchableOpacity
                            onPress={() => setMenuVisible(true)}
                            className="h-12 w-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                        >
                            <Menu size={22} color={isDark ? "#ffffff" : "#0f172a"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/notifications')}
                            className="h-12 w-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                        >
                            <Bell size={22} color={isDark ? "#ffffff" : "#0f172a"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Role Switcher Removed - Single Role View Enforced */}

                <ScrollView
                    className="flex-1 px-6 mt-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false} // Refetch occurs via useQuery internals if configured, or manual
                            onRefresh={() => refetch()}
                        />
                    }
                >
                    <AnimatePresence>
                        {activeRole === 'renter' && <RenterDashboardView key="renter" router={router} user={user} stats={stats} />}
                        {activeRole === 'owner' && <OwnerDashboardView key="owner" router={router} user={user} stats={stats} />}
                        {activeRole === 'affiliate' && <AffiliateDashboardView key="affiliate" router={router} user={user} stats={stats} />}
                    </AnimatePresence>
                </ScrollView>

                {/* Switch to Admin Shortcut */}
                {user?.user_metadata?.role === 'staff' && (
                    <TouchableOpacity
                        onPress={() => router.push('/staff')}
                        className="absolute bottom-32 left-8 right-8 bg-blue-600 h-16 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-blue-500/30"
                    >
                        <LayoutDashboard color="white" size={20} />
                        <Text className="text-white font-black ml-3">Switch to Staff Panel</Text>
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        </View>
    );
}
