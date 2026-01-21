import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function CookiesPolicyScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl mr-4"
                    >
                        <ChevronLeft size={24} color="#64748b" />
                    </TouchableOpacity>
                    <Text className="text-xl font-black text-slate-900 dark:text-white">Cookie Policy</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
                        <Text className="text-slate-500 font-bold mb-8 leading-6">
                            Effective Date: January 1, 2026
                        </Text>

                        <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">1. What Are Cookies?</Text>
                        <Text className="text-slate-600 dark:text-slate-400 font-medium leading-6 mb-6">
                            Cookies are small text files that are stored on your device when you visit our website or use our app. They help us provide you with a better experience, analyze how you use our services, and deliver personalized content.
                        </Text>

                        <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">2. How We Use Cookies</Text>
                        <Text className="text-slate-600 dark:text-slate-400 font-medium leading-6 mb-6">
                            We use cookies for the following purposes:
                            {'\n\n'}• <Text className="font-bold">Essential Cookies:</Text> These are necessary for the app to function correctly (e.g., keeping you logged in).
                            {'\n'}• <Text className="font-bold">Performance Cookies:</Text> These help us understand how you use the app so we can improve it.
                            {'\n'}• <Text className="font-bold">Functional Cookies:</Text> These allow the app to remember your choices (e.g., language preferences).
                            {'\n'}• <Text className="font-bold">Marketing Cookies:</Text> These are used to deliver relevant ads and track ad performance.
                        </Text>

                        <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">3. Managing Cookies</Text>
                        <Text className="text-slate-600 dark:text-slate-400 font-medium leading-6 mb-6">
                            You can control and manage cookies through your device settings. However, please note that disabling certain cookies may affect the functionality of the app.
                        </Text>

                        <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">4. Updates to This Policy</Text>
                        <Text className="text-slate-600 dark:text-slate-400 font-medium leading-6 mb-6">
                            We may update this Cookie Policy from time to time. We encourage you to review it periodically to stay informed about how we use cookies.
                        </Text>

                        <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">5. Contact Us</Text>
                        <Text className="text-slate-600 dark:text-slate-400 font-medium leading-6 mb-6">
                            If you have any questions about this Cookie Policy, please contact us at support@leli.rentals.
                        </Text>
                    </MotiView>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
