import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, Zap, Shield } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function SubscriptionScreen() {
    const { user } = useAuth();

    // Mock current plan or fetch
    const currentPlan = 'basic'; // Default

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Subscription</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

                    {/* Current Plan Card */}
                    <View className="mb-8">
                        <View className="bg-slate-900 dark:bg-blue-600 p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                            <View className="absolute top-0 right-0 p-6 opacity-10">
                                <Crown size={120} color="white" />
                            </View>
                            <Text className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2">Current Plan</Text>
                            <Text className="text-white text-3xl font-black mb-6">Basic Partner</Text>
                            <View className="flex-row items-center">
                                <View className="bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30">
                                    <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Active</Text>
                                </View>
                                <Text className="text-white/40 ml-4 text-xs font-bold">Free Forever</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-center text-slate-900 dark:text-white font-black text-xl mb-6">Upgrade your Power</Text>

                    {/* Premium Plan */}
                    <TouchableOpacity className="mb-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-lg relative overflow-hidden">
                        <View className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-xl font-black text-slate-900 dark:text-white">Pro Host</Text>
                                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs mt-1">For serious businesses</Text>
                            </View>
                            <Text className="text-2xl font-black text-purple-600">KES 2,500<Text className="text-sm text-slate-400 font-bold">/mo</Text></Text>
                        </View>

                        <View className="space-y-3 mb-6">
                            {['Lower Commission (8%)', 'Priority Search Ranking', 'Verified Badge', 'Dedicated Support'].map((feat, i) => (
                                <View key={i} className="flex-row items-center">
                                    <View className="h-5 w-5 rounded-full bg-purple-100 items-center justify-center mr-3">
                                        <Check size={10} color="#9333ea" strokeWidth={4} />
                                    </View>
                                    <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm">{feat}</Text>
                                </View>
                            ))}
                        </View>

                        <View className="bg-slate-900 py-4 rounded-2xl items-center">
                            <Text className="text-white font-black">Upgrade Now</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Enterprise Plan */}
                    <TouchableOpacity className="mb-20 bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 opacity-60">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-xl font-black text-slate-900 dark:text-white">Enterprise</Text>
                                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs mt-1">For large fleets</Text>
                            </View>
                            <Text className="text-lg font-black text-slate-400">Custom</Text>
                        </View>

                        <View className="space-y-3 mb-6">
                            {['0% Commission', 'API Access', 'White-label Options'].map((feat, i) => (
                                <View key={i} className="flex-row items-center">
                                    <View className="h-5 w-5 rounded-full bg-slate-100 items-center justify-center mr-3">
                                        <Check size={10} color="#64748b" strokeWidth={4} />
                                    </View>
                                    <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm">{feat}</Text>
                                </View>
                            ))}
                        </View>

                        <View className="bg-slate-100 py-4 rounded-2xl items-center">
                            <Text className="text-slate-900 font-black">Contact Sales</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
