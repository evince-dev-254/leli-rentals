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
                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">{current.subtitle}</Text>
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
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] text-center leading-tight">{label}</Text>
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

const RenterDashboardView = ({ router, user, stats }: { router: any, user: any, stats: any }) => (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-8">
        <WelcomeBanner role="renter" name={user?.user_metadata?.full_name?.split(' ')[0]} />

        <View className="flex-row gap-4">
            <StatCard label="Bookings" value={stats?.bookingCount || 0} icon={Calendar} color="bg-orange-50" role="renter" />
            <StatCard label="Favorites" value={stats?.favoritesCount || 0} icon={Heart} color="bg-orange-50" role="renter" />
        </View>

        <View>
            <Text className="text-sm font-black uppercase tracking-[0.1em] text-slate-400 mb-4 px-1">Explorer&apos;s Tools</Text>
            <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <QuickAction title="Active Bookings" icon={Calendar} onPress={() => router.push('/bookings')} color="bg-orange-50" textColor="#f97316" />
                <QuickAction title="Payment Records" icon={Wallet} onPress={() => router.push('/financial')} color="bg-emerald-50" textColor="#10b981" />
                <QuickAction title="My Favorites" icon={Heart} onPress={() => router.push('/(tabs)/favorites')} color="bg-pink-50" textColor="#ec4899" />
                <QuickAction title="Search Gear" icon={Search} onPress={() => router.push('/(tabs)/index')} color="bg-blue-50" textColor="#3b82f6" />
            </View>
        </View>

        <MotiView
            from={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[40px] flex-row items-center border border-slate-700 shadow-xl"
        >
            <View className="flex-1">
                <Text className="text-white font-black text-xl mb-1">Leli Shield</Text>
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Every rental is protected by our global security team.</Text>
            </View>
            <View className="ml-4 h-16 w-16 bg-white/10 rounded-3xl items-center justify-center">
                <ShieldCheck size={32} color="#f97316" />
            </View>
        </MotiView>
    </MotiView>
);

const OwnerDashboardView = ({ router, user, stats }: { router: any, user: any, stats: any }) => {
    const isVerified = stats?.profile?.id_verified || false;
    const ownerAt = stats?.profile?.owner_at;

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
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-8">
            <WelcomeBanner role="owner" name={user?.user_metadata?.full_name?.split(' ')[0]} />

            {/* Verification Grace Period Banner */}
            {!isVerified && daysRemaining !== null && (
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-5 rounded-[32px] flex-row items-center mb-6"
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

            <View className="flex-row gap-4">
                <StatCard label="Equipment" value={stats?.listingCount || 0} icon={ClipboardList} color="bg-emerald-50" role="owner" />
                <StatCard label="Earnings" value={`KSh ${stats?.totalEarnings || 0}`} icon={TrendingUp} color="bg-emerald-50" role="owner" />
            </View>

            <View>
                <Text className="text-sm font-black uppercase tracking-[0.1em] text-slate-400 mb-4 px-1">Lender Central</Text>
                <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <QuickAction title="Add Inventory" icon={Plus} onPress={() => router.push('/listings/create')} color="bg-emerald-50" textColor="#10b981" />
                    <QuickAction title="Asset Manager" icon={ClipboardList} onPress={() => router.push('/listings/manage')} color="bg-blue-50" textColor="#3b82f6" />
                    <QuickAction title="Payouts" icon={Wallet} onPress={() => router.push('/financial')} color="bg-purple-50" textColor="#a855f7" />
                    <QuickAction title="Verification" icon={ShieldCheck} onPress={() => router.push('/dashboard/verification')} color="bg-amber-50" textColor="#f59e0b" />
                </View>
            </View>

            <View className="bg-emerald-600 p-8 rounded-[40px] shadow-xl shadow-emerald-600/20">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="h-14 w-14 bg-white/20 rounded-3xl items-center justify-center">
                        <Zap size={28} color="white" />
                    </View>
                    <Text className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em]">Growth</Text>
                </View>
                <Text className="text-white text-2xl font-black mb-2">Power Seller Program</Text>
                <Text className="text-white/80 font-bold mb-8 leading-relaxed text-sm">Become a certified Host and unlock lower commissions and priority listing status.</Text>
                <TouchableOpacity className="bg-white py-5 rounded-2xl items-center shadow-md">
                    <Text className="text-emerald-600 font-black uppercase tracking-widest text-xs">Learn More</Text>
                </TouchableOpacity>
            </View>
        </MotiView>
    );
};

const AffiliateDashboardView = ({ router, user, stats }: { router: any, user: any, stats: any }) => (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-8">
        <WelcomeBanner role="affiliate" name={user?.user_metadata?.full_name?.split(' ')[0]} />

        <View className="flex-row gap-4">
            <StatCard label="Revenue" value={`KSh ${stats?.affiliateEarnings || 0}`} icon={Trophy} color="bg-purple-50" role="affiliate" />
            <StatCard label="Network" value={stats?.referralCount || 0} icon={Users} color="bg-purple-50" role="affiliate" />
        </View>

        <View className="bg-white/95 dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-800 shadow-sm">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Referral ID</Text>
            <View className="bg-slate-50 dark:bg-slate-800 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex-row items-center mb-6">
                <Text className="flex-1 text-slate-600 dark:text-slate-400 font-bold text-xs" numberOfLines={1}>leli.shop/join?ref={user?.id?.substring(0, 8)}</Text>
                <TouchableOpacity className="ml-3">
                    <Copy size={16} color="#a855f7" />
                </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-purple-600 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-purple-600/20">
                    <Share2 size={18} color="white" />
                    <Text className="text-white font-black ml-2 uppercase tracking-widest text-xs">Blast to Network</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View>
            <Text className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Partner Portal</Text>
            <View className="bg-white/95 dark:bg-slate-900 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-sm">
                <QuickAction title="Commission Wallet" icon={Wallet} onPress={() => router.push('/financial')} color="bg-purple-50" textColor="#9333ea" />
                <QuickAction title="Network Explorer" icon={Users} onPress={() => router.push('/affiliate')} color="bg-blue-50" textColor="#2563eb" />
                <QuickAction title="Marketing Assets" icon={Sparkles} onPress={() => router.push('/support/about')} color="bg-amber-50" textColor="#d97706" />
            </View>
        </View>
    </MotiView>
);

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

    useEffect(() => {
        if (user?.user_metadata?.role) {
            setActiveRole(user.user_metadata.role);
        }
    }, [user?.user_metadata?.role]);

    const roles = [
        { id: 'renter', label: 'Rent', icon: ShoppingBag },
        { id: 'owner', label: 'Lend', icon: Key },
        { id: 'affiliate', label: 'Earn', icon: Users },
    ] as const;

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} activeRole={activeRole} />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Text className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Hub</Text>
                        <Text className="text-slate-400 dark:text-slate-500 font-bold text-xs mt-1">
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

                {/* Role Switcher */}
                <View className="px-6 mt-6 mb-6">
                    <View className="bg-white/80 dark:bg-slate-900 p-1.5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 flex-row gap-2">
                        {roles
                            .filter(role => {
                                // Staff can see everything
                                if (user?.user_metadata?.role === 'staff') return true;
                                // Everyone can see Renter
                                if (role.id === 'renter') return true;
                                // Only owners can see Owner dashboard
                                if (role.id === 'owner') return user?.user_metadata?.role === 'owner';
                                // Only affiliates can see Affiliate dashboard
                                if (role.id === 'affiliate') return user?.user_metadata?.role === 'affiliate';
                                return false;
                            })
                            .map((role) => {
                                const isActive = activeRole === role.id;
                                return (
                                    <TouchableOpacity
                                        key={role.id}
                                        onPress={() => setActiveRole(role.id)}
                                        className={cn(
                                            "flex-1 flex-row items-center justify-center py-3 rounded-[20px]",
                                            isActive && (role.id === 'renter' ? 'bg-orange-500 shadow-lg shadow-orange-500/20' : role.id === 'owner' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-purple-500 shadow-lg shadow-purple-500/20')
                                        )}
                                    >
                                        <role.icon size={16} color={isActive ? 'white' : '#94a3b8'} strokeWidth={2.5} />
                                        <Text className={cn("ml-2 text-[11px] font-black uppercase tracking-wider", isActive ? 'text-white' : 'text-slate-400')}>
                                            {role.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                </View>

                <ScrollView
                    className="flex-1 px-6"
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
