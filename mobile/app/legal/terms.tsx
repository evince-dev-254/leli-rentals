import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';

export default function TermsScreen() {
    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 backdrop-blur-md">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Terms of Service</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    <Text className="text-sm text-slate-400 font-bold mb-8 italic">Last Updated: January 16, 2026</Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        By accessing or using the Leli Rentals marketplace, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">2. User Verification</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        To ensure community safety, all owners and affiliates must complete our verification process within 5 days of registration. Failure to do so will result in temporary account suspension.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">3. Rental Agreements</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Leli Rentals provides the platform to connect users but is not a party to the rental agreements entered into between renters and listers. Users are responsible for inspecting items and ensuring their suitability.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">4. Fees & Payments</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We use Paystack to process payments. Service fees apply to each transaction. Owners receive payouts 24 hours after a successful rental completion.
                    </Text>

                    <View className="h-40" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
