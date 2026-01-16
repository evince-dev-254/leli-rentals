import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Palette, Shield, Zap, Crown, Clock } from 'lucide-react-native';

export default function StaffBrandingScreen() {
    const router = useRouter();

    const pillars = [
        { icon: Shield, label: "Secure", desc: "Verified & Safe" },
        { icon: Zap, label: "Instant", desc: "Fast & Precise" },
        { icon: Crown, label: "Premium", desc: "High Quality" },
        { icon: Clock, label: "24/7", desc: "Relentless Support" }
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen
                options={{
                    title: 'Brand Registry',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ChevronLeft color="#3b82f6" size={24} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 px-6 pt-4">
                <View className="mb-8">
                    <Text className="text-3xl font-black text-slate-900 dark:text-white">Brand Identity</Text>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">The soul and visual language of Leli Rentals.</p>
                </View>

                {/* Brand Pillars */}
                <View className="mb-8">
                    <Text className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-4 px-1">Brand Pillars</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {pillars.map((pillar, idx) => (
                            <View key={idx} className="w-[47%] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <pillar.icon color="#3b82f6" size={24} />
                                <Text className="text-sm font-bold text-slate-900 dark:text-white mt-3">{pillar.label}</Text>
                                <Text className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">{pillar.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Visual Tokens */}
                <View className="mb-8">
                    <Text className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-4 px-1">UI Visual Tokens</Text>
                    <View className="space-y-4">
                        <View className="p-6 rounded-[32px] bg-white border border-slate-200 items-center justify-center">
                            <View className="h-10 w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />
                            <Text className="text-[10px] font-mono text-slate-400 mt-4 uppercase tracking-[0.2em]">Primary Gradient Overlay</Text>
                        </View>

                        <View className="p-6 rounded-[32px] bg-slate-900 items-center justify-center">
                            <View className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-3xl border border-white/20 items-center justify-center">
                                <Text className="text-[8px] font-mono text-white opacity-50 text-center">GLASS{"\n"}3XL</Text>
                            </View>
                            <Text className="text-[10px] font-mono text-slate-500 mt-4 uppercase tracking-[0.2em]">Blur Effect Standard</Text>
                        </View>
                    </View>
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
