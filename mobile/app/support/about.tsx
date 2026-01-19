import React from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Heart, Shield, Zap } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';

const { width } = Dimensions.get('window');

const values = [
    {
        icon: Target,
        title: "Our Mission",
        description: "To make renting accessible, affordable, and trustworthy for everyone in Kenya and beyond.",
        color: "#3b82f6"
    },
    {
        icon: Heart,
        title: "Community First",
        description: "We believe in building strong communities by connecting people with the things they need.",
        color: "#f43f5e"
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        description: "Every owner and affiliate is verified to ensure secure transactions for all users.",
        color: "#10b981"
    },
    {
        icon: Zap,
        title: "Innovation",
        description: "We continuously improve our platform to deliver the best rental experience possible.",
        color: "#fb923c"
    },
];

export default function AboutScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">About Leli</Text>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <View className="px-8 pt-6 pb-12 items-center">
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing', duration: 800 }}
                            className="w-full"
                        >
                            <View className="h-48 w-full rounded-[40px] bg-blue-600 overflow-hidden relative shadow-xl">
                                <View className="absolute inset-0 bg-black/20" />
                                <View className="p-8 justify-center h-full">
                                    <Text className="text-white text-3xl font-black">Modernizing the Sharing Economy</Text>
                                    <View className="h-1 w-12 bg-white/40 mt-4 rounded-full" />
                                </View>
                            </View>
                        </MotiView>
                    </View>

                    {/* Story Section */}
                    <View className="px-8 mb-12">
                        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-6">Our Story</Text>
                        <View className="bg-white/80 dark:bg-slate-900/80 p-8 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 shadow-sm">
                            <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-4">
                                Welcome to Leli Rentals, the premier modern, tech-inspired rental marketplace designed to simplify your search for the perfect item.
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-4">
                                Founded in December 2025, we recognized the growing need for a trusted, efficient, and streamlined platform to power the sharing economy in Kenya and beyond.
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6">
                                Whether you are looking to rent an item or earn money by listing your own, we are dedicated to making your experience secure, transparent, and effortlessly modern.
                            </Text>
                        </View>
                    </View>

                    {/* Values Section */}
                    <View className="px-8 mb-32">
                        <Text className="text-2xl font-black text-slate-900 dark:text-white mb-6">Our Values</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {values.map((value, idx) => (
                                <MotiView
                                    key={idx}
                                    from={{ opacity: 0, translateY: 20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'timing', duration: 500, delay: idx * 100 }}
                                    className="w-[48%] mb-4 bg-white/80 dark:bg-slate-900/80 p-6 rounded-[24px] border border-slate-50 dark:border-slate-800 shadow-sm items-center"
                                >
                                    <View style={{ backgroundColor: `${value.color}15` }} className="h-12 w-12 rounded-2xl items-center justify-center mb-4">
                                        <value.icon size={24} color={value.color} />
                                    </View>
                                    <Text className="text-sm font-black text-slate-900 dark:text-white text-center mb-2">{value.title}</Text>
                                    <Text className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-bold">{value.description}</Text>
                                </MotiView>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
