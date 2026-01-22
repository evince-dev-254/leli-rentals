import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';

export default function TermsScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 backdrop-blur-md">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Terms of Service</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    <Text className="text-sm text-slate-400 font-bold mb-8 italic">Last Updated: January 2026</Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        By accessing and using Leli Rentals (&quot;the Platform&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use our Platform.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">2. User Accounts</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        To use certain features, you must register for an account. You agree to provide accurate information and maintain the security of your password. We may require identity verification for Owners and Affiliates.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">3. Listings and Rentals</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-4">
                        Owner Responsibilities: Provide accurate descriptions, fair prices, and maintain items in good condition.
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Renter Responsibilities: Use items responsibly, return them in the same condition, and pay all fees on time.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">4. Payments and Fees</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-4">
                        We charge service fees (5% for Renters, 10% for Owners) on transactions. All payments are processed securely through Paystack.
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Cancellations made 48+ hours before rental receive a refund minus fees. Less than 24 hours receive no refund.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">5. Liability</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Leli Rentals is a marketplace. We do not own the items listed and are not liable for disputes, damage, or quality issues. Owners are encouraged to maintain insurance.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">6. Contact Us</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Leli Rentals Limited{'\n'}
                        Email: lelirentalsmail@gmail.com{'\n'}
                        Phone: +254 112 081 866{'\n'}
                        Address: 123 Rental Street, Nairobi, Kenya
                    </Text>

                    <View className="h-40" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
