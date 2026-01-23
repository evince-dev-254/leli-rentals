import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Menu, Bell, LayoutDashboard } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useAuth } from '../../context/auth-context';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { useColorScheme } from '@/components/useColorScheme';
import { useUserStats } from '@/lib/hooks/useData';

// Import new modular views
import { RenterDashboardView } from '@/components/dashboard/views/RenterDashboard';
import { OwnerDashboardView } from '@/components/dashboard/views/OwnerDashboard';
import { AffiliateDashboardView } from '@/components/dashboard/views/AffiliateDashboard';

type UserRole = 'renter' | 'owner' | 'affiliate';

export default function UnifiedDashboardScreen() {
    const { user } = useAuth();
    const [activeRole, setActiveRole] = useState<UserRole>('renter');
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Fetch real stats
    const { data: stats, refetch, isFetching } = useUserStats(user?.id || '');

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
                {/* Header Section */}
                <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <MotiView
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ type: 'timing', duration: 800 }}
                        >
                            <Image
                                source={isDark ? require('../../assets/images/logo_white.png') : require('../../assets/images/logo_black.png')}
                                className="w-32 h-10 mb-2"
                                resizeMode="contain"
                                alt="Leli Rentals"
                            />
                            <Text className="text-slate-400 dark:text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em]">
                                {activeRole === 'renter' ? 'Find & Rent Equipment' : activeRole === 'owner' ? 'Host & Earn Revenue' : 'Scale Partner Network'}
                            </Text>
                        </MotiView>
                    </View>
                    <View className="flex-row gap-5">
                        <TouchableOpacity
                            onPress={() => setMenuVisible(true)}
                            className="h-12 w-12 bg-white/80 dark:bg-slate-900/80 rounded-2xl items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                        >
                            <Menu size={20} color={isDark ? "#ffffff" : "#0f172a"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/notifications')}
                            className="h-12 w-12 bg-white/80 dark:bg-slate-900/80 rounded-2xl items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                        >
                            <Bell size={20} color={isDark ? "#ffffff" : "#0f172a"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content Areas */}
                <View className="flex-1 px-6 mt-4">
                    <AnimatePresence>
                        {activeRole === 'renter' && (
                            <MotiView
                                key="renter"
                                from={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ type: 'timing', duration: 400 }}
                                className="flex-1"
                            >
                                <RenterDashboardView
                                    router={router}
                                    user={user}
                                    stats={stats}
                                    refreshControl={
                                        <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#f97316" />
                                    }
                                />
                            </MotiView>
                        )}
                        {activeRole === 'owner' && (
                            <MotiView
                                key="owner"
                                from={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ type: 'timing', duration: 400 }}
                                className="flex-1"
                            >
                                <OwnerDashboardView
                                    router={router}
                                    user={user}
                                    stats={stats}
                                    refreshControl={
                                        <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#10b981" />
                                    }
                                />
                            </MotiView>
                        )}
                        {activeRole === 'affiliate' && (
                            <MotiView
                                key="affiliate"
                                from={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ type: 'timing', duration: 400 }}
                                className="flex-1"
                            >
                                <AffiliateDashboardView
                                    router={router}
                                    user={user}
                                    stats={stats}
                                    refreshControl={
                                        <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#a855f7" />
                                    }
                                />
                            </MotiView>
                        )}
                    </AnimatePresence>
                </View>

                {/* Staff Shortcut */}
                {user?.user_metadata?.role === 'staff' && (
                    <MotiView
                        from={{ translateY: 100 }}
                        animate={{ translateY: 0 }}
                        transition={{ delay: 1000 }}
                        className="absolute bottom-32 left-8 right-8"
                    >
                        <TouchableOpacity
                            onPress={() => router.push('/staff')}
                            className="bg-blue-600 h-16 rounded-[28px] flex-row items-center justify-center shadow-2xl shadow-blue-500/40 border border-blue-400/20"
                        >
                            <LayoutDashboard color="white" size={20} />
                            <Text className="text-white font-black ml-3 uppercase tracking-widest text-xs">Switch to Staff Portal</Text>
                        </TouchableOpacity>
                    </MotiView>
                )}
            </SafeAreaView>
        </View>
    );
}
