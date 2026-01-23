import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Key, TrendingUp, ClipboardList, Plus, ChevronRight, Zap, Target, ShieldCheck, Clock } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { cn } from '@/lib/utils';

const StatCard = ({ label, value, icon: Icon, color, role }: any) => (
    <View className="flex-1 p-5 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm items-center">
        <View className={cn("h-14 w-14 rounded-2xl items-center justify-center mb-4", color)}>
            <Icon size={28} color="#10b981" />
        </View>
        <Text className="text-slate-900 dark:text-white text-xl font-black mb-1">{value}</Text>
        <Text className="text-slate-400 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.1em] text-center leading-tight">{label}</Text>
    </View>
);

const WelcomeBanner = ({ name }: { name?: string }) => {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-[32px] flex-row items-center mb-6 bg-emerald-500/10"
        >
            <View className="flex-1">
                <Text className="text-2xl font-black mb-1 text-emerald-500">Welcome, {name || 'Host'}!</Text>
                <Text className="text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">Manage your assets and earnings.</Text>
            </View>
            <View className="h-14 w-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 items-center justify-center shadow-sm">
                <Key size={28} color="#10b981" />
            </View>
        </MotiView>
    );
};

export const OwnerDashboardView = ({ router, user, stats }: any) => {
    const isVerified = stats?.profile?.id_verified || false;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <WelcomeBanner name={user?.user_metadata?.full_name?.split(' ')[0]} />

            <View className="flex-row gap-4 mb-8">
                <StatCard label="Live Ads" value={stats?.listingCount || 0} icon={ClipboardList} color="bg-emerald-50" role="owner" />
                <StatCard label="Total Vol" value={`KSh ${stats?.totalEarnings || 0}`} icon={TrendingUp} color="bg-emerald-50" role="owner" />
            </View>

            {/* Verification Status */}
            <TouchableOpacity
                onPress={() => router.push('/dashboard/verification')}
                className={cn(
                    "p-6 rounded-[32px] mb-8 flex-row items-center border",
                    isVerified
                        ? "bg-slate-900 border-slate-700 shadow-xl"
                        : "bg-amber-50 border-amber-100"
                )}
            >
                <View className={cn(
                    "h-12 w-12 rounded-2xl items-center justify-center mr-4",
                    isVerified ? "bg-white/10" : "bg-amber-100"
                )}>
                    {isVerified ? <ShieldCheck size={24} color="#10b981" /> : <Clock size={24} color="#f59e0b" />}
                </View>
                <View className="flex-1">
                    <Text className={cn("font-black text-sm", isVerified ? "text-white" : "text-amber-900")}>
                        {isVerified ? "Trusted Seller Status" : "Verification in Progress"}
                    </Text>
                    <Text className={cn("text-[10px] font-bold uppercase tracking-widest", isVerified ? "text-slate-400" : "text-amber-700/60")}>
                        {isVerified ? "Leli verified host" : "Upload ID to activate full features"}
                    </Text>
                </View>
                {!isVerified && <ChevronRight size={16} color="#f59e0b" />}
            </TouchableOpacity>

            {/* Earnings Analytics Mock */}
            <TouchableOpacity
                onPress={() => router.push('/settings/payout')}
                className="bg-emerald-600 p-8 rounded-[40px] mb-8 shadow-xl shadow-emerald-500/20"
            >
                <View className="flex-row items-center justify-between mb-8">
                    <View>
                        <View className="flex-row items-center">
                            <Text className="text-white/80 font-black text-xs uppercase tracking-widest mb-1">Total Payouts</Text>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" className="ml-2" />
                        </View>
                        <Text className="text-white text-3xl font-black">KSh {stats?.totalEarnings || '0.00'}</Text>
                    </View>
                    <View className="h-14 w-14 bg-white/20 rounded-3xl items-center justify-center">
                        <TrendingUp size={28} color="white" />
                    </View>
                </View>

                <View className="flex-row gap-2 items-end justify-between h-20 px-2">
                    {[30, 50, 45, 80, 55, 100, 75, 60, 90, 110, 85, 120].map((h, i) => (
                        <MotiView
                            key={i}
                            from={{ height: 0 }}
                            animate={{ height: (h / 120) * 80 }}
                            transition={{ delay: i * 50, type: 'timing' }}
                            className="bg-white/40 flex-1 rounded-t-sm"
                            style={{ maxWidth: 6 }}
                        />
                    ))}
                </View>

                <TouchableOpacity className="bg-white/20 mt-6 py-4 rounded-2xl items-center border border-white/20">
                    <Text className="text-white font-black uppercase tracking-widest text-[10px]">View Financial Reports</Text>
                </TouchableOpacity>
            </TouchableOpacity>

            {/* Asset Management */}
            <View>
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Inventory Status</Text>
                    <TouchableOpacity onPress={() => router.push('/listings/manage')}>
                        <Text className="text-emerald-500 font-black text-xs">Manage All</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/listings/create')}
                    className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[40px] border border-dashed border-emerald-200 dark:border-emerald-800 items-center justify-center mb-4"
                >
                    <Plus size={32} color="#10b981" strokeWidth={3} className="mb-4" />
                    <Text className="text-emerald-700 dark:text-emerald-400 font-black text-sm uppercase tracking-widest">List New Equipment</Text>
                </TouchableOpacity>

                <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <TouchableOpacity className="p-5 border-b border-slate-50 dark:border-slate-800 flex-row items-center">
                        <View className="h-10 w-10 bg-blue-50 rounded-xl items-center justify-center mr-4">
                            <ClipboardList size={18} color="#3b82f6" />
                        </View>
                        <Text className="flex-1 text-slate-900 dark:text-white font-black text-sm">Active Listings</Text>
                        <Badge value={stats?.listingCount || 0} color="bg-blue-100" textColor="text-blue-700" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-5 flex-row items-center">
                        <View className="h-10 w-10 bg-purple-50 rounded-xl items-center justify-center mr-4">
                            <Zap size={18} color="#a855f7" />
                        </View>
                        <Text className="flex-1 text-slate-900 dark:text-white font-black text-sm">Boost Rankings</Text>
                        <ChevronRight size={16} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const Badge = ({ value, color, textColor }: any) => (
    <View className={cn("px-2 py-0.5 rounded-md", color)}>
        <Text className={cn("text-[10px] font-black", textColor)}>{value}</Text>
    </View>
);
