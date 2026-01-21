import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Copy, Users, TrendingUp, Gift, Wallet, Share2 } from 'lucide-react-native';
import { useAuth } from '@/context/auth-context';
import { useAffiliate } from '@/lib/hooks/useData';

export default function AffiliateTrackingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: affiliate } = useAffiliate(user?.id || '');

    const referralCode = affiliate?.referral_code || 'LOADING...';
    const referralLink = `https://leli.rentals/join?ref=${referralCode}`;

    const onShare = async () => {
        try {
            await Share.share({
                message: `Join Leli Rentals and get discounts on your first hire! Use my code: ${referralCode} or visit: ${referralLink}`,
                url: referralLink,
                title: 'Join Leli Rentals'
            });
        } catch (error) {
            console.log(error);
        }
    };

    const shareToSocial = async (platform: 'whatsapp' | 'twitter' | 'instagram' | 'tiktok') => {
        const message = `Check out Leli Rentals! Use my code ${referralCode} to join: ${referralLink}`;
        const encodedMsg = encodeURIComponent(message);
        let url = '';

        switch (platform) {
            case 'whatsapp':
                url = `whatsapp://send?text=${encodedMsg}`;
                break;
            case 'twitter': // X
                url = `https://twitter.com/intent/tweet?text=${encodedMsg}`;
                break;
            default:
                onShare(); // Fallback to system share
                return;
        }

        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            onShare();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
            <Stack.Screen
                options={{
                    title: 'Affiliate Hub',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ChevronLeft color="#3b82f6" size={24} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 px-6 pt-4">
                {/* Refer Card */}
                <View className="p-8 rounded-[40px] bg-purple-600 mb-8 relative overflow-hidden shadow-lg shadow-purple-500/30">
                    <View className="absolute top-0 right-0 h-40 w-40 bg-white rounded-full -mr-20 -mt-20 opacity-10" />
                    <Gift color="white" size={32} />
                    <Text className="text-white text-3xl font-black mt-4">Invite & Earn</Text>
                    <Text className="text-white/60 text-sm mt-1">Earn 5% on every booking made via your referral link.</Text>

                    <View className="mt-8 bg-white/10 p-4 rounded-2xl flex-row items-center justify-between border border-white/20">
                        <Text className="text-white font-mono font-bold text-lg">{referralCode}</Text>
                        <TouchableOpacity onPress={onShare} className="bg-white px-4 py-2 rounded-xl">
                            <Text className="text-purple-600 font-bold text-xs uppercase tracking-widest">Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Social Share Grid */}
                <View className="flex-row gap-3 mb-8">
                    <TouchableOpacity onPress={() => shareToSocial('whatsapp')} className="flex-1 bg-[#25D366] py-3 rounded-2xl items-center shadow-sm">
                        <Text className="text-white font-black text-xs">WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => shareToSocial('twitter')} className="flex-1 bg-[#000000] py-3 rounded-2xl items-center shadow-sm">
                        <Text className="text-white font-black text-xs">X / Twitter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onShare} className="flex-1 bg-pink-500 py-3 rounded-2xl items-center shadow-sm">
                        <Text className="text-white font-black text-xs">Instagram</Text>
                    </TouchableOpacity>
                </View>

                {/* Earnings Tracking */}
                <View className="mb-8">
                    <Text className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Performance Details</Text>
                    <View className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <Users color="#a855f7" size={20} />
                                <Text className="text-slate-900 dark:text-white font-bold ml-2">Total Referrals</Text>
                            </View>
                            <Text className="text-xl font-black text-slate-900 dark:text-white">{affiliate?.total_referrals || 0}</Text>
                        </View>
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <TrendingUp color="#10b981" size={20} />
                                <Text className="text-slate-900 dark:text-white font-bold ml-2">Total Earnings</Text>
                            </View>
                            <Text className="text-xl font-black text-slate-900 dark:text-white">KES {affiliate?.total_earnings || 0}</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                            <View className="flex-row items-center">
                                <Wallet color="#3b82f6" size={20} />
                                <Text className="text-slate-900 dark:text-white font-bold ml-2">Pending Payout</Text>
                            </View>
                            <Text className="text-2xl font-black text-blue-600">KES {affiliate?.pending_earnings || 0}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity className="bg-slate-900 py-5 rounded-3xl items-center shadow-lg mb-8">
                    <Text className="text-white font-black">Request Withdrawal</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
