import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Menu, Bell, LayoutDashboard } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useAuth } from '../../context/auth-context';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { useTheme } from '@/components/theme-provider';
import { useUserStats } from '@/lib/hooks/useData';

// Import new modular views
import { RenterDashboardView } from '@/components/dashboard/views/RenterDashboard';
import { OwnerDashboardView } from '@/components/dashboard/views/OwnerDashboard';
import { AffiliateDashboardView } from '@/components/dashboard/views/AffiliateDashboard';

import { GlassView } from '@/components/ui/glass-view';
import { PerspectiveView } from '@/components/ui/perspective-view';

type UserRole = 'renter' | 'owner' | 'affiliate';

export default function UnifiedDashboardScreen() {
    const { user } = useAuth();
    const [activeRole, setActiveRole] = useState<UserRole>('renter');
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Fetch real stats
    const { data: stats, refetch, isFetching } = useUserStats(user?.id || '');

    useEffect(() => {
        if (user?.user_metadata?.role) {
            setActiveRole(user.user_metadata.role);
        }
    }, [user?.user_metadata?.role]);

    const roles: { id: UserRole; label: string; color: string }[] = [
        { id: 'renter', label: 'Renter', color: '#f97316' },
        { id: 'owner', label: 'Owner', color: '#10b981' },
        { id: 'affiliate', label: 'Partner', color: '#a855f7' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#020617' : 'white' }}>
            <BackgroundGradient />
            <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} activeRole={activeRole} />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Premium Header */}
                <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <Image
                            source={isDark ? require('../../assets/images/logo_white.png') : require('../../assets/images/logo_black.png')}
                            style={{ width: 100, height: 32, marginBottom: 4 }}
                            resizeMode="contain"
                        />
                        <Text style={{ fontSize: 9, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>
                            {activeRole === 'renter' ? 'Protocol: RENTER_CORE' : activeRole === 'owner' ? 'Protocol: HOST_ACTIVE' : 'Protocol: NETWORK_PARTNER'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={() => setMenuVisible(true)}>
                            <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ height: 48, width: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Menu size={20} color={isDark ? "white" : "#0f172a"} strokeWidth={2.5} />
                            </GlassView>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/notifications')}>
                            <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ height: 48, width: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={20} color={isDark ? "white" : "#0f172a"} strokeWidth={2.5} />
                            </GlassView>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Role Switcher - Premium Segmented Control */}
                <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ height: 64, borderRadius: 24, padding: 6, flexDirection: 'row' }}>
                        {roles.map((role) => {
                            const isActive = activeRole === role.id;
                            return (
                                <TouchableOpacity
                                    key={role.id}
                                    onPress={() => setActiveRole(role.id)}
                                    style={{ flex: 1 }}
                                >
                                    <View style={{
                                        flex: 1,
                                        borderRadius: 18,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: isActive ? (isDark ? 'rgba(255,255,255,0.1)' : 'white') : 'transparent',
                                        shadowColor: isActive ? '#000' : 'transparent',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: isActive ? 4 : 0
                                    }}>
                                        <Text style={{
                                            fontSize: 11,
                                            fontWeight: '900',
                                            color: isActive ? role.color : '#94a3b8',
                                            textTransform: 'uppercase',
                                            letterSpacing: 1
                                        }}>
                                            {role.label}
                                        </Text>
                                        {isActive && (
                                            <MotiView
                                                from={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                style={{ height: 4, width: 4, borderRadius: 2, backgroundColor: role.color, marginTop: 4 }}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </GlassView>
                </View>

                {/* Main Content Area */}
                <View style={{ flex: 1, paddingHorizontal: 24 }}>
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
