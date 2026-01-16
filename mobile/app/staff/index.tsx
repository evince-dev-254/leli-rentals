import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ShieldCheck,
    Activity,
    Palette,
    Users,
    Bell,
    Settings,
    ArrowRight,
    ChevronRight
} from 'lucide-react-native';
import { AppLoader } from '../../components/ui/app-loader';

export default function StaffDashboard() {
    const router = useRouter();

    const menuItems = [
        {
            title: 'Verification Queue',
            desc: 'Review pending identity docs',
            icon: ShieldCheck,
            color: 'bg-blue-500',
            route: '/staff/verifications',
        },
        {
            title: 'Platform Pulse',
            desc: 'Real-time system health',
            icon: Activity,
            color: 'bg-emerald-500',
            route: '/staff/health',
        },
        {
            title: 'Brand Registry',
            desc: 'Assets and UI tokens',
            icon: Palette,
            color: 'bg-purple-500',
            route: '/staff/branding',
        },
        {
            title: 'User Management',
            desc: 'Search and moderate users',
            icon: Users,
            color: 'bg-pink-500',
            route: '/staff/users',
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen
                options={{
                    title: 'Staff Portal',
                    headerTitleStyle: { fontWeight: '900' },
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: 'transparent' },
                }}
            />
            <ScrollView className="flex-1 px-6 pt-4">
                {/* Header Section */}
                <View className="mb-8">
                    <Text className="text-3xl font-black text-slate-900 dark:text-white">
                        Operational Hub
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-1">
                        Secure management for Leli Rentals staff.
                    </Text>
                </View>

                {/* Quick Stats / Pulse (Simplified) */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 p-4 rounded-3xl bg-blue-600 shadow-lg shadow-blue-500/30">
                        <Activity color="white" size={24} />
                        <Text className="text-white/70 text-xs mt-2 uppercase font-bold tracking-widest">Active Now</Text>
                        <Text className="text-white text-2xl font-black">1.2k</Text>
                    </View>
                    <View className="flex-1 p-4 rounded-3xl bg-slate-900 dark:bg-slate-800 shadow-lg">
                        <ShieldCheck color="#3b82f6" size={24} />
                        <Text className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-widest">Pending IDs</Text>
                        <Text className="text-white text-2xl font-black">28</Text>
                    </View>
                </View>

                {/* Action Grid */}
                <View className="mb-8">
                    <Text className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-4 px-1">Management</Text>
                    <View className="space-y-4">
                        {menuItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => router.push(item.route as any)}
                                activeOpacity={0.7}
                                className="flex-row items-center p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                            >
                                <View className={`h-12 w-12 rounded-2xl ${item.color} items-center justify-center mr-4`}>
                                    <item.icon color="white" size={24} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-slate-900 dark:text-white">{item.title}</Text>
                                    <Text className="text-xs text-slate-500">{item.desc}</Text>
                                </View>
                                <ChevronRight color="#94a3b8" size={20} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Version Info */}
                <View className="items-center py-8 opacity-40">
                    <Text className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
                        Staff v1.0.4.m | Build 822
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
