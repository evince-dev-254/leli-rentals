import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
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
    MousePointerClick
} from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useAuth } from '../../context/auth-context';
import { cn } from '@/lib/utils';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { useColorScheme } from '@/components/useColorScheme';

const { width } = Dimensions.get('window');

type UserRole = 'renter' | 'owner' | 'affiliate';

// --- Components ---

const RoleBadge = ({ role }: { role: UserRole }) => {
    const config = {
        renter: { label: 'Renter', color: 'bg-orange-100 text-orange-600 border-orange-200' },
        owner: { label: 'Owner', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
        affiliate: { label: 'Partner', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    };
    return (
        <View className={cn("px-3 py-1 rounded-full border", config[role].color)}>
            <Text className="text-[10px] font-black uppercase tracking-widest">{config[role].label}</Text>
        </View>
    );
};

const StatCard = ({ label, icon: Icon, color, role }: any) => (
    <View className="flex-1 p-5 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm items-center">
        <View className={cn("h-14 w-14 rounded-2xl items-center justify-center mb-4", color)}>
            <Icon size={28} color={role === 'renter' ? '#f97316' : role === 'owner' ? '#10b981' : '#a855f7'} />
        </View>
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] text-center leading-tight">{label}</Text>
    </View>
);

const QuickAction = ({ title, icon: Icon, href, color, textColor }: any) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push(href)}
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

const RenterDashboardView = () => (
    <MotiView from={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <View className="flex-row gap-4">
            <StatCard label="My Rentals" icon={ShoppingBag} color="bg-orange-50" role="renter" />
            <StatCard label="Wallet Bal" icon={Wallet} color="bg-orange-50" role="renter" />
        </View>

        <View>
            <Text className="text-sm font-black uppercase tracking-[0.1em] text-slate-400 mb-4 px-1">Renting Hub</Text>
            <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <QuickAction title="My Bookings" icon={Calendar} href="/bookings" color="bg-orange-50" textColor="#f97316" />
                <QuickAction title="Payment History" icon={Wallet} href="/financial" color="bg-emerald-50" textColor="#10b981" />
                <QuickAction title="Saved Favorites" icon={Heart} href="/(tabs)/favorites" color="bg-pink-50" textColor="#ec4899" />
            </View>
        </View>

        <MotiView
            from={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[40px] flex-row items-center border border-slate-700 shadow-xl"
        >
            <View className="flex-1">
                <Text className="text-white font-black text-xl mb-1">Rent with Confidence</Text>
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Leli Protection keeps your rentals safe & secure.</Text>
            </View>
            <View className="ml-4 h-16 w-16 bg-white/10 rounded-3xl items-center justify-center">
                <Shield size={32} color="#f97316" />
            </View>
        </MotiView>
    </MotiView>
);

const OwnerDashboardView = () => (
    <MotiView from={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <View className="flex-row gap-4">
            <StatCard label="Active Earnings" icon={TrendingUp} color="bg-emerald-50" role="owner" />
            <StatCard label="Total Items" icon={Key} color="bg-emerald-50" role="owner" />
        </View>

        <View>
            <Text className="text-sm font-black uppercase tracking-[0.1em] text-slate-400 mb-4 px-1">Inventory Control</Text>
            <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <QuickAction title="Post New Item" icon={Plus} href="/listings/create" color="bg-emerald-50" textColor="#10b981" />
                <QuickAction title="Manage My Gears" icon={ClipboardList} href="/listings/manage" color="bg-blue-50" textColor="#3b82f6" />
                <QuickAction title="Payout Wallet" icon={Wallet} href="/financial" color="bg-purple-50" textColor="#a855f7" />
            </View>
        </View>

        <View className="bg-emerald-600 p-8 rounded-[40px] shadow-xl shadow-emerald-600/20">
            <View className="flex-row items-center justify-between mb-4">
                <View className="h-14 w-14 bg-white/20 rounded-3xl items-center justify-center">
                    <Sparkles size={28} color="white" />
                </View>
                <Text className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em]">Partner Program</Text>
            </View>
            <Text className="text-white text-2xl font-black mb-2">Boost your reach.</Text>
            <Text className="text-white/80 font-bold mb-8 leading-relaxed text-sm">Upgrade to Premium to get 3x more visibility for your listings.</Text>
            <TouchableOpacity className="bg-white py-5 rounded-2xl items-center shadow-md">
                <Text className="text-emerald-600 font-black uppercase tracking-widest text-xs">Upgrade To Premium</Text>
            </TouchableOpacity>
        </View>
    </MotiView>
);

const AffiliateDashboardView = () => (
    <MotiView from={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <View className="flex-row gap-4">
            <StatCard label="Earnings" icon={Gift} color="bg-purple-50" role="affiliate" />
            <StatCard label="Clicks" icon={MousePointerClick} color="bg-purple-50" role="affiliate" />
        </View>

        <View className="bg-white/95 dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-800 shadow-sm">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Your Referral Link</Text>
            <View className="bg-slate-50 dark:bg-slate-800 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex-row items-center mb-6">
                <Text className="flex-1 text-slate-600 dark:text-slate-400 font-bold text-xs" numberOfLines={1}>leli.fun/ref/user_921</Text>
                <TouchableOpacity className="ml-3">
                    <Copy size={16} color="#a855f7" />
                </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-purple-600 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-purple-600/20">
                    <Share2 size={18} color="white" />
                    <Text className="text-white font-black ml-2 uppercase tracking-widest text-xs">Share Ref</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View>
            <Text className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Network Hub</Text>
            <View className="bg-white/95 dark:bg-slate-900 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-sm">
                <QuickAction title="Payout History" icon={Wallet} href="/financial" color="bg-purple-50" textColor="#9333ea" />
                <QuickAction title="My Network" icon={Users} href="/affiliate" color="bg-blue-50" textColor="#2563eb" />
                <QuickAction title="Referral Guide" icon={Sparkles} href="/support/about" color="bg-amber-50" textColor="#d97706" />
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

    useEffect(() => {
        if (user?.user_metadata?.role) {
            setActiveRole(user.user_metadata.role);
        }
    }, [user?.user_metadata?.role]);

    const roles = [
        { id: 'renter', label: 'Rent', icon: ShoppingBag },
        { id: 'owner', label: 'Lend', icon: Key },
        { id: 'affiliate', label: 'Earn', icon: Users },
    ];

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
            {/* Fix: Added explicit top edges and padding to prevent status bar overlap */}
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Text className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Workspace</Text>
                        <Text className="text-slate-400 dark:text-slate-500 font-bold text-xs mt-1">
                            {activeRole === 'renter' ? 'Manage your bookings & favorites' : activeRole === 'owner' ? 'Track your listings & performance' : 'Monitor your referrals & earnings'}
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
                    <View className="bg-white/80 dark:bg-slate-900 p-1.5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 flex-row">
                        {roles.map((role) => {
                            const isActive = activeRole === role.id;
                            return (
                                <TouchableOpacity
                                    key={role.id}
                                    onPress={() => setActiveRole(role.id as UserRole)}
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
                            refreshing={false} // Since we use React Query, we'll manually trigger refetch if needed, but for now simple mock or real integration
                            onRefresh={() => {
                                // Real refresh logic would go here, e.g. refetch stats
                            }}
                        />
                    }
                >
                    <AnimatePresence mode="wait">
                        {activeRole === 'renter' && <RenterDashboardView key="renter" />}
                        {activeRole === 'owner' && <OwnerDashboardView key="owner" />}
                        {activeRole === 'affiliate' && <AffiliateDashboardView key="affiliate" />}
                    </AnimatePresence>
                </ScrollView>

                {/* Switch to Admin Shortcut (if applicable) */}
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
