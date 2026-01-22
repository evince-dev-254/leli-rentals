import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';

export default function CookiesScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 backdrop-blur-md">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Cookie Policy</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    <Text className="text-sm text-slate-400 font-bold mb-8 italic">Last Updated: January 2026</Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">1. What Are Cookies?</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        Cookies are small data files placed on your device when you visit a website/app. They help our platform work efficiently and provide reporting information.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">2. Why We Use Cookies</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We use cookies to: {'\n'}
                        • Provide and maintain our service{'\n'}
                        • Understand how you interact with our app{'\n'}
                        • Improve your experience{'\n'}
                        • Ensure security
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">3. Types of Cookies</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        • Essential: Required for basic functionality (login, security){'\n'}
                        • Analytics: Help us measure performance (e.g., Google Analytics){'\n'}
                        • Functional: Remember your preferences{'\n'}
                        • Marketing: Deliver relevant ads
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">4. Third-Party Services</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        We use trusted third parties like Google Analytics, Cloudflare Turnstile, and Paystack, who may set their own cookies to provide their services.
                    </Text>

                    <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">5. Managing Cookies</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold leading-6 mb-8">
                        You can control cookies through your device or browser settings. Disabling cookies may limit some features of the platform.
                    </Text>

                    <View className="h-40" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
