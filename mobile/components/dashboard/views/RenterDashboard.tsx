import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ShoppingBag, Heart, Wallet, Calendar, ChevronRight, TrendingUp, Sparkles, Star } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { cn } from '@/lib/utils';

const StatCard = ({ label, value, icon: Icon, color, role }: any) => (
    <View className="flex-1 p-5 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm items-center">
        <View className={cn("h-14 w-14 rounded-2xl items-center justify-center mb-4", color)}>
            <Icon size={28} color="#f97316" />
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
            className="p-6 rounded-[32px] flex-row items-center mb-6 bg-orange-500/10"
        >
            <View className="flex-1">
                <Text className="text-2xl font-black mb-1 text-orange-500">Hello, {name || 'Renter'}!</Text>
                <Text className="text-slate-500 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">Find your next adventure today.</Text>
            </View>
            <View className="h-14 w-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 items-center justify-center shadow-sm">
                <ShoppingBag size={28} color="#f97316" />
            </View>
        </MotiView>
    );
};

export const RenterDashboardView = ({ router, user, stats }: any) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <WelcomeBanner name={user?.user_metadata?.full_name?.split(' ')[0]} />

            <View className="flex-row gap-4 mb-8">
                <StatCard label="Active Orders" value={stats?.bookingCount || 0} icon={ShoppingBag} color="bg-orange-50" role="renter" />
                <StatCard label="Saved Gear" value={stats?.favoritesCount || 0} icon={Heart} color="bg-orange-50" role="renter" />
            </View>

            {/* Premium Analytics Mock */}
            <View className="bg-slate-900 dark:bg-slate-800 p-6 rounded-[40px] mb-8 border border-slate-700 shadow-xl">
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-white font-black text-lg">Rental Insights</Text>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Usage this month</Text>
                    </View>
                    <View className="bg-white/10 px-3 py-1 rounded-full">
                        <Text className="text-orange-500 font-black text-[10px] uppercase">+12%</Text>
                    </View>
                </View>

                <View className="h-24 flex-row items-end justify-between px-2">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                        <MotiView
                            key={i}
                            from={{ height: 0 }}
                            animate={{ height: h }}
                            transition={{ delay: i * 100, type: 'timing' }}
                            className="w-4 bg-orange-500 rounded-t-lg"
                        />
                    ))}
                </View>
                <View className="flex-row justify-between mt-2 px-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                        <Text key={i} className="text-slate-500 font-bold text-[10px]">{d}</Text>
                    ))}
                </View>
            </View>

            {/* Recommendations */}
            <View className="mb-8">
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Personalized Picks</Text>
                    <Sparkles size={16} color="#f97316" />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
                    {[1, 2, 3].map((i) => (
                        <TouchableOpacity
                            key={i}
                            className="w-48 bg-white dark:bg-slate-900 rounded-[32px] p-4 border border-slate-100 dark:border-slate-800 shadow-sm"
                            onPress={() => router.push('/(tabs)')}
                        >
                            <View className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-3 items-center justify-center">
                                <ShoppingBag size={32} color="#cbd5e1" />
                            </View>
                            <Text className="text-slate-900 dark:text-white font-black text-sm mb-1" numberOfLines={1}>High Quality Gear {i}</Text>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-orange-500 font-black text-xs">KES 1,500/day</Text>
                                <View className="flex-row items-center">
                                    <Star size={10} color="#f59e0b" fill="#f59e0b" />
                                    <Text className="text-slate-400 font-black text-[10px] ml-1">4.9</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Recent Activity */}
            <View>
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text className="text-sm font-black uppercase tracking-widest text-slate-400">Recent Activity</Text>
                    <TouchableOpacity onPress={() => router.push('/bookings')}>
                        <Text className="text-orange-500 font-black text-xs">View All</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    {[1, 2].map((i) => (
                        <TouchableOpacity key={i} className="p-5 border-b border-slate-50 dark:border-slate-800 flex-row items-center">
                            <View className="h-10 w-10 bg-orange-50 rounded-xl items-center justify-center mr-4">
                                <Calendar size={18} color="#f97316" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-900 dark:text-white font-black text-sm">Booking Confirmed</Text>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase">2 days ago</Text>
                            </View>
                            <ChevronRight size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};
