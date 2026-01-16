import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
    ArrowRightLeft,
    ArrowRight,
    Gift
} from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';

const { width } = Dimensions.get('window');

type UserRole = 'renter' | 'owner' | 'affiliate';

export default function UnifiedDashboardScreen() {
    const [activeRole, setActiveRole] = useState<UserRole>('renter');
    const router = useRouter();

    const roles = [
        { id: 'renter', label: 'Rent', icon: ShoppingBag, color: 'blue' },
        { id: 'owner', label: 'Lend', icon: Key, color: 'emerald' },
        { id: 'affiliate', label: 'Earn', icon: Users, color: 'purple' },
    ];

    const stats = {
        renter: [
            { label: 'Active Rentals', value: '2', icon: ClipboardList },
            { label: 'Total Spent', value: 'KES 15.4k', icon: Wallet },
        ],
        owner: [
            { label: 'Total Earnings', value: 'KES 84k', icon: TrendingUp },
            { label: 'Active Bookings', value: '5', icon: Calendar },
        ],
        affiliate: [
            { label: 'Total Referrals', value: '84', icon: Users },
            { label: 'Commissions', value: 'KES 12k', icon: Wallet },
        ]
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <ScrollView className="flex-1 px-6 pt-6 pb-32" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-3xl font-black text-slate-900 dark:text-white">Dashboard</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-1">Manage your Leli Rentals ecosystem.</Text>
                </View>

                {/* Role Switcher */}
                <View className="bg-white dark:bg-slate-900 p-2 rounded-full border border-slate-200 dark:border-slate-800 flex-row mb-8">
                    {roles.map((role) => {
                        const isActive = activeRole === role.id;
                        return (
                            <TouchableOpacity
                                key={role.id}
                                onPress={() => setActiveRole(role.id as UserRole)}
                                className={`flex-1 flex-row items-center justify-center py-3 rounded-full ${isActive ? (role.id === 'renter' ? 'bg-blue-600' : role.id === 'owner' ? 'bg-emerald-600' : 'bg-purple-600') : ''}`}
                            >
                                <role.icon size={16} color={isActive ? 'white' : '#64748b'} strokeWidth={2} />
                                <Text className={`ml-2 text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{role.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Stats Cards */}
                <AnimatePresence>
                    <MotiView
                        key={activeRole}
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'timing', duration: 200 }}
                        className="flex-row gap-4 mb-8"
                    >
                        {stats[activeRole].map((stat, idx) => (
                            <View key={idx} className="flex-1 p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <View className={`h-10 w-10 rounded-2xl items-center justify-center mb-4 ${activeRole === 'renter' ? 'bg-blue-50' : activeRole === 'owner' ? 'bg-emerald-50' : 'bg-purple-50'}`}>
                                    <stat.icon size={20} color={activeRole === 'renter' ? '#2563eb' : activeRole === 'owner' ? '#10b981' : '#a855f7'} />
                                </View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</Text>
                                <Text className="text-xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</Text>
                            </View>
                        ))}
                    </MotiView>
                </AnimatePresence>

                {activeRole === 'affiliate' && (
                    <TouchableOpacity
                        onPress={() => router.push('/affiliate')}
                        className="mb-8 p-6 rounded-3xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center">
                            <Gift color="#a855f7" size={20} />
                            <Text className="ml-3 font-bold text-purple-700 dark:text-purple-300">View Detailed Tracking</Text>
                        </View>
                        <ArrowRight size={18} color="#a855f7" />
                    </TouchableOpacity>
                )}

                {/* Quick Actions / Recent Activity */}
                <View className="mb-8">
                    <Text className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Quick Actions</Text>
                    <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {[
                            { title: 'My Bookings', icon: ClipboardList, color: 'bg-blue-100', text: 'text-blue-600' },
                            { title: 'Payment History', icon: Wallet, color: 'bg-emerald-100', text: 'text-emerald-600' },
                            { title: 'Identity Verification', icon: ShieldAlert, color: 'bg-orange-100', text: 'text-orange-600' },
                        ].map((action, idx) => (
                            <TouchableOpacity key={idx} className={`flex-row items-center p-5 border-b border-slate-100 dark:border-slate-800 last:border-b-0`}>
                                <View className={`h-10 w-10 rounded-xl ${action.color} items-center justify-center mr-4`}>
                                    <action.icon size={18} color={action.text === 'text-blue-600' ? '#2563eb' : action.text === 'text-emerald-600' ? '#10b981' : '#ea580c'} />
                                </View>
                                <Text className="flex-1 text-base font-bold text-slate-900 dark:text-white">{action.title}</Text>
                                <ChevronRight color="#94a3b8" size={20} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Staff Link (Operational Hub) */}
                <TouchableOpacity
                    onPress={() => router.push('/staff')}
                    activeOpacity={0.8}
                    className="p-8 rounded-[40px] bg-slate-900 relative overflow-hidden"
                >
                    <View className="absolute top-0 right-0 h-40 w-40 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-30" />
                    <View className="relative z-10 flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-black">Staff Portal</Text>
                            <Text className="text-white/60 text-sm mt-1">Access operational hub and brand registry.</Text>
                        </View>
                        <View className="h-12 w-12 rounded-full bg-white/10 items-center justify-center">
                            <ArrowRightLeft color="white" size={20} />
                        </View>
                    </View>
                </TouchableOpacity>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
