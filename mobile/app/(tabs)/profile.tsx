import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Shield, Bell, HelpCircle, MessageCircle, ShoppingBag, Plus, Star, RefreshCw, Wallet, ChevronRight, MousePointerClick, Users, Heart } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { cn } from '@/lib/utils';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
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
                    { label: 'Listings', value: stats.owner.listings, icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Earnings', value: stats.owner.earnings, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Rating', value: stats.owner.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
                ];
            case 'affiliate':
                return [
                    { label: 'Referrals', value: stats.affiliate.referrals, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
                    { label: 'Earnings', value: stats.affiliate.earnings, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Clicks', value: stats.affiliate.clicks, icon: MousePointerClick, color: 'text-blue-600', bg: 'bg-blue-100' },
                ];
            default:
                return [
                    { label: 'Rentals', value: stats.renter.rentals, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
                    { label: 'Saved', value: stats.renter.saved, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
                    { label: 'Rating', value: stats.renter.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
                ];
        }
    };

    const accountItems = [
        { icon: User, label: 'Edit Profile', color: '#3b82f6', href: '/profile/edit' },
        { icon: ShoppingBag, label: 'My Bookings', color: '#f97316', href: '/bookings' },
        { icon: Plus, label: 'My Listings', color: '#10b981', href: '/listings' },
        { icon: Wallet, label: 'Wallet', color: '#8b5cf6', href: '/financial' },
    ];

    const otherItems = [
        { icon: Bell, label: 'Notifications', color: '#f59e0b', href: '/notifications' },
        { icon: Shield, label: 'Security', color: '#6366f1', href: '/profile/security' },
        { icon: RefreshCw, label: 'Software Updates', color: '#f43f5e', href: '/settings/updates' },
        { icon: HelpCircle, label: 'Help Hub', color: '#64748b', href: '/support/faq' },
    ];

    const legalItems = [
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Privacy Policy', href: '/legal/privacy' },
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
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['bottom']}>
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                    <View className="h-20" />
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="items-center mb-10"
                    >
                        <View className="h-24 w-24 rounded-[32px] bg-orange-100 items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm overflow-hidden mb-4">
                            {user?.user_metadata?.avatar_url ? (
                                <Image source={{ uri: user.user_metadata.avatar_url }} className="h-full w-full" />
                            ) : (
                                <User size={40} color="#f97316" strokeWidth={1.5} />
                            )}
                        </View>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">
                            {user?.user_metadata?.full_name || 'Leli Member'}
                        </Text>
                        <View className="bg-[#f97316] px-4 py-1 rounded-full mt-2">
                            <Text className="text-[10px] font-black text-white uppercase tracking-widest">
                                {user?.user_metadata?.role || 'Renter'}
                            </Text>
                        </View>
                    </MotiView>

                    <View className="flex-row gap-4 mb-10">
                        {getStatsData().map((stat, idx) => (
                            <View key={idx} className="flex-1 bg-white/60 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 items-center">
                                <View className={cn("h-10 w-10 rounded-2xl items-center justify-center mb-2", stat.bg)}>
                                    <stat.icon size={18} color={
                                        stat.color === 'text-orange-600' ? '#f97316' :
                                            stat.color === 'text-emerald-600' ? '#10b981' :
                                                stat.color === 'text-purple-600' ? '#a855f7' :
                                                    stat.color === 'text-blue-600' ? '#3b82f6' :
                                                        stat.color === 'text-pink-600' ? '#ec4899' :
                                                            '#f59e0b'} />
                                </View>
                                <Text className="text-sm font-black text-slate-900 dark:text-white">{stat.value}</Text>
                                <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-3">Account</Text>
                    <View className="bg-white/80 dark:bg-slate-900/80 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 overflow-hidden mb-8 shadow-sm">
                        {accountItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => item.href && router.push(item.href as any)}
                                className="flex-row items-center p-5 border-b-2 border-slate-50/50 dark:border-slate-800/50 last:border-b-0"
                            >
                                <View className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 items-center justify-center mr-4 shadow-sm">
                                    <item.icon size={20} color={item.color} />
                                </View>
                                <Text className="flex-1 text-base font-black text-slate-900 dark:text-white">{item.label}</Text>
                                <ChevronRight size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-3">Others</Text>
                    <View className="bg-white/80 dark:bg-slate-900/80 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 overflow-hidden mb-6 shadow-sm">
                        {otherItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => item.href && router.push(item.href as any)}
                                className="flex-row items-center p-5 border-b-2 border-slate-50/50 dark:border-slate-800/50 last:border-b-0"
                            >
                                <View className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 items-center justify-center mr-4 shadow-sm">
                                    <item.icon size={20} color={item.color} />
                                </View>
                                <Text className="flex-1 text-base font-black text-slate-900 dark:text-white">{item.label}</Text>
                                <ChevronRight size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row justify-center gap-6 mb-10">
                        {legalItems.map((item, idx) => (
                            <TouchableOpacity key={idx} onPress={() => router.push(item.href as any)}>
                                <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button
                        title="Sign Out"
                        variant="ghost"
                        onPress={handleSignOut}
                        className="mb-32"
                        textClassName="text-red-500"
                    />
                    <View className="h-12" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
