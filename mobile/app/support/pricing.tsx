import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Zap, Crown, Check } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PricingScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 backdrop-blur-md">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Pricing Plans</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                    <View className="mb-8 items-center">
                        <View className="bg-orange-500/10 px-4 py-1.5 rounded-full mb-4">
                            <Text className="text-orange-500 font-black text-xs uppercase tracking-widest">Simple Pricing</Text>
                        </View>
                        <Text className="text-3xl font-black text-slate-900 dark:text-white text-center mb-2">Transparent Plans</Text>
                        <Text className="text-slate-500 text-center font-bold">Start small or go big. Choose the plan that fits your needs.</Text>
                    </View>

                    {/* Weekly Plan */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 500 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 mb-6 shadow-sm"
                    >
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="bg-blue-500/10 p-3 rounded-2xl">
                                <Zap size={24} color="#3b82f6" fill="#3b82f6" />
                            </View>
                            <View className="bg-blue-500/10 px-3 py-1 rounded-full">
                                <Text className="text-blue-600 font-bold text-xs uppercase">Flexible</Text>
                            </View>
                        </View>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white mb-2">Weekly Plan</Text>
                        <View className="flex-row items-baseline mb-4">
                            <Text className="text-3xl font-black text-slate-900 dark:text-white">KES 500</Text>
                            <Text className="text-slate-500 font-bold ml-1">/ 7 days</Text>
                        </View>
                        <Text className="text-slate-500 text-sm mb-6 font-bold leading-5">Perfect for trying out the platform or short-term listing needs.</Text>

                        <View className="space-y-3 mb-6">
                            {[
                                "Up to 10 active listings",
                                "7-day active duration",
                                "Basic analytics",
                                "Standard support"
                            ].map((item, idx) => (
                                <View key={idx} className="flex-row items-center mb-3">
                                    <View className="bg-green-500/10 p-1 rounded-full mr-3">
                                        <Check size={12} color="#10b981" strokeWidth={3} />
                                    </View>
                                    <Text className="text-slate-600 dark:text-slate-400 font-bold text-sm">{item}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => router.push('/subscription')} className="w-full bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center">
                            <Text className="font-black text-slate-900 dark:text-white">Select Weekly</Text>
                        </TouchableOpacity>
                    </MotiView>

                    {/* Monthly Plan */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 500, delay: 100 }}
                        className="bg-slate-900 dark:bg-white rounded-[32px] p-6 mb-6 shadow-xl relative overflow-hidden"
                    >
                        <View className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-bl-2xl">
                            <Text className="text-white font-black text-[10px] uppercase tracking-widest">Most Popular</Text>
                        </View>

                        <View className="flex-row justify-between items-start mb-6 pt-4">
                            <View className="bg-orange-500/20 p-3 rounded-2xl">
                                <Crown size={24} color="#f97316" fill="#f97316" />
                            </View>
                        </View>
                        <Text className="text-2xl font-black text-white dark:text-slate-900 mb-2">Monthly Plan</Text>
                        <View className="flex-row items-baseline mb-4">
                            <Text className="text-3xl font-black text-white dark:text-slate-900">KES 1,000</Text>
                            <Text className="text-slate-400 dark:text-slate-500 font-bold ml-1">/ 30 days</Text>
                        </View>
                        <Text className="text-slate-400 dark:text-slate-500 text-sm mb-6 font-bold leading-5">For serious renters wanting maximum exposure and unlimited growth.</Text>

                        <View className="space-y-3 mb-6">
                            {[
                                "Unlimited active listings",
                                "30-day active duration",
                                "Advanced analytics",
                                "Priority verified status"
                            ].map((item, idx) => (
                                <View key={idx} className="flex-row items-center mb-3">
                                    <View className="bg-orange-500/20 p-1 rounded-full mr-3">
                                        <Check size={12} color="#f97316" strokeWidth={3} />
                                    </View>
                                    <Text className="text-slate-300 dark:text-slate-600 font-bold text-sm">{item}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => router.push('/subscription')} className="w-full bg-[#f97316] py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20">
                            <Text className="font-black text-white">Select Monthly</Text>
                        </TouchableOpacity>
                    </MotiView>

                    <View className="items-center mt-4">
                        <Text className="text-slate-400 font-bold mb-2">Questions?</Text>
                        <TouchableOpacity onPress={() => router.push('/support/contact')}>
                            <Text className="text-[#f97316] font-black">Contact Support</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
