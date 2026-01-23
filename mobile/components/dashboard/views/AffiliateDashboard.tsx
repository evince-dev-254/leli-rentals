import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Users, Wallet, BarChart3, Sparkles, Copy, Share2, Trophy, Target, ChevronRight, MousePointerClick } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { cn } from '@/lib/utils';

const StatCard = ({ label, value, icon: Icon, color, role }: any) => (
    <View className="flex-1 p-5 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm items-center">
        <View className={cn("h-14 w-14 rounded-2xl items-center justify-center mb-4", color)}>
            <Icon size={28} color="#a855f7" />
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
            className="p-6 rounded-[32px] flex-row items-center mb-6 bg-purple-500/10"
        >
            <View className="flex-1">
                <Text className="text-2xl font-black mb-1 text-purple-500">Hi, {name || 'Partner'}!</Text>
                <Text className="text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">Track your impact and rewards.</Text>
            </View>
            <View className="h-14 w-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 items-center justify-center shadow-sm">
                <Users size={28} color="#a855f7" />
            </View>
        </MotiView>
    );
};

export const AffiliateDashboardView = ({ router, user, stats }: any) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <WelcomeBanner name={user?.user_metadata?.full_name?.split(' ')[0]} />

            <View className="flex-row gap-4 mb-8">
                <StatCard label="Total Rev" value={`KSh ${stats?.affiliateEarnings || 0}`} icon={Trophy} color="bg-purple-50" role="affiliate" />
                <StatCard label="Network" value={stats?.referralCount || 0} icon={Users} color="bg-purple-50" role="affiliate" />
            </View>

            {/* Performance Analytics Mock */}
            <View className="bg-white dark:bg-slate-900 p-8 rounded-[40px] mb-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <View className="flex-row items-center justify-between mb-8 px-1">
                    <View>
                        <Text className="text-slate-900 dark:text-white font-black text-lg">Performance Metrics</Text>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Last 30 days</Text>
                    </View>
                    <BarChart3 size={20} color="#a855f7" />
                </View>

                <View className="flex-row justify-between mb-8">
                    <View className="items-center flex-1">
                        <Text className="text-slate-400 font-bold text-[10px] uppercase mb-1">Clicks</Text>
                        <Text className="text-slate-900 dark:text-white font-black text-xl">1.2k</Text>
                        <View className="h-1 w-8 bg-blue-500 rounded-full mt-2" />
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-slate-400 font-bold text-[10px] uppercase mb-1">Conv.</Text>
                        <Text className="text-slate-900 dark:text-white font-black text-xl">4.2%</Text>
                        <View className="h-1 w-8 bg-emerald-500 rounded-full mt-2" />
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-slate-400 font-bold text-[10px] uppercase mb-1">Earned</Text>
                        <Text className="text-slate-900 dark:text-white font-black text-xl">KSh 500</Text>
                        <View className="h-1 w-8 bg-purple-500 rounded-full mt-2" />
                    </View>
                </View>

                {/* Growth Path Mock */}
                <View className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase">Goal: Elite Partner</Text>
                        <Text className="text-slate-900 dark:text-white font-black text-[10px]">65%</Text>
                    </View>
                    <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <MotiView
                            from={{ width: '0%' }}
                            animate={{ width: '65%' }}
                            transition={{ type: 'timing', duration: 1000 }}
                            className="h-full bg-purple-500"
                        />
                    </View>
                </View>
            </View>

            {/* Marketing Kit */}
            <View className="mb-8">
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Marketing Kit</Text>
                    <Sparkles size={16} color="#a855f7" />
                </View>

                <View className="bg-slate-900 p-8 rounded-[40px] shadow-xl shadow-purple-500/10 overflow-hidden relative">
                    <View className="absolute top-[-20] right-[-20] rotate-12 opacity-10">
                        <Target size={120} color="white" />
                    </View>

                    <Text className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Master Referral Link</Text>
                    <View className="bg-white/10 px-6 py-5 rounded-2xl border border-white/10 flex-row items-center mb-8">
                        <Text className="flex-1 text-white font-bold text-xs" numberOfLines={1}>leli.shop/join?ref={user?.id?.substring(0, 8)}</Text>
                        <TouchableOpacity className="ml-3">
                            <Copy size={18} color="#a855f7" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className="bg-purple-600 h-16 rounded-[24px] items-center justify-center flex-row shadow-lg shadow-purple-600/30">
                        <Share2 size={20} color="white" />
                        <Text className="text-white font-black ml-3 uppercase tracking-widest text-xs">Share Referral Kit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Actions */}
            <View>
                <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <TouchableOpacity className="p-5 border-b border-slate-50 dark:border-slate-800 flex-row items-center">
                        <View className="h-10 w-10 bg-blue-50 rounded-xl items-center justify-center mr-4">
                            <MousePointerClick size={18} color="#3b82f6" />
                        </View>
                        <Text className="flex-1 text-slate-900 dark:text-white font-black text-sm">Campaign Manager</Text>
                        <ChevronRight size={16} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/settings/payout')}
                        className="p-5 flex-row items-center"
                    >
                        <View className="h-10 w-10 bg-emerald-50 rounded-xl items-center justify-center mr-4">
                            <Wallet size={18} color="#10b981" />
                        </View>
                        <Text className="flex-1 text-slate-900 dark:text-white font-black text-sm">Payout Settings</Text>
                        <ChevronRight size={16} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};
