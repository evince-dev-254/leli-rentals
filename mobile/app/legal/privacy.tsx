import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';

export default function PrivacyScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 backdrop-blur-md">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Privacy Policy</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    <Text className="text-sm text-slate-400 font-bold mb-8 italic">Last Updated: January 16, 2026</Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">1. Data Collection</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We collect information you provide directly to us when you create an account, list an item, or make a booking. This includes your name, email, phone number, and ID for verification.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">2. How we use your data</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Your data is used to provide, maintain, and improve our services, including processing transactions and verifying account authenticity.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">3. Data Security</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We take reasonable measures to protect your information from loss, theft, misuse, and unauthorized access. All payments are processed through secure, PCI-compliant providers.
                    </Text>

                    <View className="h-40" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
