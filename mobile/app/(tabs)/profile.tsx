import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Shield, Bell, HelpCircle, RefreshCw, Wallet, ChevronRight, MousePointerClick, Users, Heart, Moon, Landmark, CreditCard, ShoppingBag, Plus, Star } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stats, setStats] = useState({
        renter: { rentals: '0', saved: '0', rating: '0.0' },
        owner: { listings: '0', earnings: '0', rating: '0.0' },
        affiliate: { referrals: '0', earnings: '0', clicks: '0' }
    });

    useEffect(() => {
        if (!user?.id) return;

        async function fetchStats() {
            const userId = user?.id;
            if (!userId) return;

            const role = user?.user_metadata?.role || 'renter';

            if (role === 'renter') {
                const [bookings, favorites] = await Promise.all([
                    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('renter_id', userId),
                    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', userId)
                ]);
                setStats(prev => ({
                    ...prev,
                    renter: { rentals: String(bookings.count || 0), saved: String(favorites.count || 0), rating: '4.9' }
                }));
            } else if (role === 'owner') {
                const [listings, profile] = await Promise.all([
                    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('owner_id', userId),
                    supabase.from('user_profiles').select('rating_average').eq('id', userId).single()
                ]);
                setStats(prev => ({
                    ...prev,
                    owner: { listings: String(listings.count || 0), earnings: '0', rating: String(profile.data?.rating_average || '0.0') }
                }));
            } else if (role === 'affiliate') {
                const { data } = await supabase.from('affiliates').select('total_referrals, total_earnings').eq('user_id', userId).single();
                setStats(prev => ({
                    ...prev,
                    affiliate: {
                        referrals: String(data?.total_referrals || 0),
                        earnings: String(data?.total_earnings || 0),
                        clicks: '0'
                    }
                }));
            }
        }

        fetchStats();
    }, [user?.id, user?.user_metadata?.role]);

    const userRole = (user?.user_metadata?.role || 'renter') as 'renter' | 'owner' | 'affiliate';

    const getStatsData = () => {
        switch (userRole) {
            case 'owner':
                return [
                    { label: 'Listings', value: stats.owner.listings, icon: Plus, color: '#10b981' },
                    { label: 'Earnings', value: stats.owner.earnings, icon: Wallet, color: '#3b82f6' },
                    { label: 'Rating', value: stats.owner.rating, icon: Star, color: '#f59e0b' },
                ];
            case 'affiliate':
                return [
                    { label: 'Referrals', value: stats.affiliate.referrals, icon: Users, color: '#a855f7' },
                    { label: 'Earnings', value: stats.affiliate.earnings, icon: Wallet, color: '#10b981' },
                    { label: 'Clicks', value: stats.affiliate.clicks, icon: MousePointerClick, color: '#3b82f6' },
                ];
            default:
                return [
                    { label: 'Rentals', value: stats.renter.rentals, icon: ShoppingBag, color: '#f97316' },
                    { label: 'Saved', value: stats.renter.saved, icon: Heart, color: '#ec4899' },
                    { label: 'Rating', value: stats.renter.rating, icon: Star, color: '#f59e0b' },
                ];
        }
    };

    const accountItems = [
        { icon: User, label: 'Edit Profile', color: '#3b82f6', href: '/profile/edit' },
        { icon: ShoppingBag, label: 'My Bookings', color: '#f97316', href: '/bookings' },
        { icon: Plus, label: 'My Listings', color: '#10b981', href: '/listings' },
        { icon: CreditCard, label: 'Payment Methods', color: '#ec4899', href: '/settings/cards' },
        { icon: Wallet, label: 'Wallet', color: '#8b5cf6', href: '/financial' },
    ];

    const otherItems = [
        { icon: Moon, label: 'Appearance', color: '#8b5cf6', href: '/settings/theme' },
        { icon: Landmark, label: 'Payout Settings', color: '#10b981', href: '/settings/payout' },
        { icon: Bell, label: 'Notifications', color: '#f59e0b', href: '/notifications' },
        { icon: Shield, label: 'Security', color: '#6366f1', href: '/profile/security' },
        { icon: RefreshCw, label: 'Software Updates', color: '#f43f5e', href: '/settings/updates' },
        { icon: HelpCircle, label: 'Help Hub', color: '#64748b', href: '/support/faq' },
    ];

    const isStaff = user?.user_metadata?.is_staff === true || user?.user_metadata?.role === 'staff' || user?.user_metadata?.role === 'admin';

    const legalItems = [
        { label: 'Terms', href: '/legal/terms' },
        { label: 'Privacy', href: '/legal/privacy' },
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/auth/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <View style={{ flex: 1 }} className="bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 20 }} />

                    {/* High-Def 3D User Card */}
                    <PerspectiveView style={{ marginBottom: 40 }}>
                        <GlassView
                            intensity={40}
                            tint={isDark ? 'dark' : 'light'}
                            style={{ padding: 32, borderRadius: 56, alignItems: 'center', borderWidth: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(249, 115, 22, 0.1)' }}
                        >
                            <PerspectiveView floatEnabled={true} style={{ marginBottom: 20 }}>
                                <View style={{ height: 110, width: 110, borderRadius: 40, backgroundColor: '#f97316', padding: 4, shadowColor: '#f97316', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 }}>
                                    <View style={{ flex: 1, borderRadius: 36, backgroundColor: isDark ? '#0f172a' : 'white', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                                        {user?.user_metadata?.avatar_url ? (
                                            <Image source={{ uri: user.user_metadata.avatar_url }} style={{ width: '100%', height: '100%' }} />
                                        ) : (
                                            <User size={48} color="#f97316" strokeWidth={2.5} />
                                        )}
                                    </View>
                                </View>
                            </PerspectiveView>

                            <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? 'white' : '#0f172a', textAlign: 'center' }}>
                                {user?.user_metadata?.full_name?.split(' ')[0] || 'Leli Member'}
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                <View style={{ backgroundColor: '#f97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                        {user?.user_metadata?.role || 'Premium'}
                                    </Text>
                                </View>
                                <View style={{ marginLeft: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, flexDirection: 'row', alignItems: 'center' }}>
                                    <Shield size={12} color="#10b981" fill="#10b981" />
                                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#10b981', marginLeft: 4 }}>VERIFIED</Text>
                                </View>
                            </View>
                        </GlassView>
                    </PerspectiveView>

                    {/* Quick Stats Grid */}
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
                        {getStatsData().map((stat, idx) => (
                            <GlassView key={idx} intensity={15} tint={isDark ? 'dark' : 'light'} style={{ flex: 1, padding: 16, borderRadius: 28, alignItems: 'center' }}>
                                <stat.icon size={20} color="#f97316" strokeWidth={2.5} style={{ marginBottom: 8 }} />
                                <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>{stat.value}</Text>
                                <Text style={{ fontSize: 8, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{stat.label}</Text>
                            </GlassView>
                        ))}
                    </View>

                    {/* Settings Sections - Glass Hubs */}
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 3, marginLeft: 8, marginBottom: 16 }}>Authorized Modules</Text>
                    <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 40, overflow: 'hidden', marginBottom: 32 }}>
                        {accountItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => item.href && router.push(item.href as any)}
                                style={{ flexDirection: 'row', alignItems: 'center', padding: 24, borderBottomWidth: idx === accountItems.length - 1 ? 0 : 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            >
                                <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <item.icon size={22} color={item.color} strokeWidth={2.5} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>{item.label}</Text>
                                <ChevronRight size={18} color="#f97316" strokeWidth={3} />
                            </TouchableOpacity>
                        ))}
                    </GlassView>

                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 3, marginLeft: 8, marginBottom: 16 }}>Protocols & Tools</Text>
                    <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 40, overflow: 'hidden', marginBottom: 40 }}>
                        {otherItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => item.href && router.push(item.href as any)}
                                style={{ flexDirection: 'row', alignItems: 'center', padding: 24, borderBottomWidth: idx === otherItems.length - 1 ? 0 : 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            >
                                <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <item.icon size={22} color={item.color} strokeWidth={2.5} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>{item.label}</Text>
                                <ChevronRight size={18} color="#f97316" strokeWidth={3} />
                            </TouchableOpacity>
                        ))}
                    </GlassView>

                    {isStaff && (
                        <PerspectiveView style={{ marginBottom: 40 }}>
                            <GlassView intensity={40} tint="dark" style={{ padding: 24, borderRadius: 40, backgroundColor: '#3b82f620', borderWidth: 2, borderColor: '#3b82f640' }}>
                                <TouchableOpacity onPress={() => router.push('/staff')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 56, width: 56, borderRadius: 20, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                        <Shield size={24} color="white" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '900', color: 'white' }}>Staff Command Portal</Text>
                                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>System Monitoring Active</Text>
                                    </View>
                                    <ChevronRight size={22} color="#3b82f6" strokeWidth={3} />
                                </TouchableOpacity>
                            </GlassView>
                        </PerspectiveView>
                    )}

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 48 }}>
                        {legalItems.map((item, idx) => (
                            <TouchableOpacity key={idx} onPress={() => router.push(item.href as any)}>
                                <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 2 }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleSignOut}
                        style={{ height: 68, borderRadius: 30, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 120, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '900', color: '#ef4444', textTransform: 'uppercase', letterSpacing: 2 }}>Terminate Session</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
