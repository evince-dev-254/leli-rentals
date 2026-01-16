import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Copy, Users, TrendingUp, Gift, Wallet } from 'lucide-react-native';

export default function AffiliateTrackingScreen() {
    const router = useRouter();
    const referralCode = "LELI-MOD-2026";
    const referralLink = "https://leli.rentals/signup?ref=LELI-MOD-2026";

    const onShare = async () => {
        try {
            await Share.share({
                message: `Join Leli Rentals and get discounts on your first hire! Use my code: ${referralCode} or visit: ${referralLink}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
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
                        <Text className="text-white font-mono font-bold">{referralCode}</Text>
                        <TouchableOpacity onPress={onShare} className="bg-white px-4 py-2 rounded-xl">
                            <Text className="text-purple-600 font-bold text-xs uppercase tracking-widest">Share</Text>
                        </TouchableOpacity>
                    </View>
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
                            <Text className="text-xl font-black text-slate-900 dark:text-white">128</Text>
                        </View>
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <TrendingUp color="#10b981" size={20} />
                                <Text className="text-slate-900 dark:text-white font-bold ml-2">Conversion Rate</Text>
                            </View>
                            <Text className="text-xl font-black text-slate-900 dark:text-white">14.2%</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                            <View className="flex-row items-center">
                                <Wallet color="#3b82f6" size={20} />
                                <Text className="text-slate-900 dark:text-white font-bold ml-2">Available Payout</Text>
                            </View>
                            <Text className="text-2xl font-black text-blue-600">KES 4,500</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity className="bg-slate-900 py-5 rounded-3xl items-center shadow-lg">
                    <Text className="text-white font-black">Request Withdrawal</Text>
                </TouchableOpacity>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
