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
                    <Text className="text-sm text-slate-400 font-bold mb-8 italic">Last Updated: January 2026</Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">1. Introduction</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Leli Rentals Limited (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our Platform.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">2. Information We Collect</Text>
                    <Text className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">2.1 Information You Provide</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-4">
                        • Account Info: Name, email, phone, password.{'\n'}
                        • Profile: Bio, photo, location.{'\n'}
                        • Verification: IDs, permits.{'\n'}
                        • Payment: Processed via Paystack.{'\n'}
                        • Listing: Item details, photos.
                    </Text>

                    <Text className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">2.2 Automatically Collected</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        • Device Info: IP, OS, browser type.{'\n'}
                        • Usage Data: Features used, time spent.{'\n'}
                        • Location: Approximate location directly or via IP.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">3. How We Use Your Information</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        • Provide Services: Manage accounts, process rentals.{'\n'}
                        • Improve Platform: Analytics, new features.{'\n'}
                        • Communication: Support, updates, marketing.{'\n'}
                        • Safety: Verify identities, prevent fraud.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">4. Sharing Information</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We do not sell your personal data. We share it with:{'\n'}
                        • Other Users: As needed for rentals.{'\n'}
                        • Service Providers: Paystack (payments), Supabase (db), ImageKit (images), Resend (email), Google Analytics.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">5. Data Security</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We use SSL encryption and secure storage. However, no internet transmission is 100% secure.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">6. Your Rights</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        You can access, update, or request deletion of your data. You can also opt-out of marketing emails.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">7. Contact Us</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Leli Rentals Limited - Data Protection Officer{'\n'}
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
