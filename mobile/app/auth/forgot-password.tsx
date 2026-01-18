import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Mail } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';
import * as Linking from 'expo-linking';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        title: '',
        message: '',
        type: 'info'
    });
    const router = useRouter();

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const handleResetRequest = async () => {
        if (!email) {
            showAlert('Wait!', 'Please enter your email address.', 'info');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: Linking.createURL('auth/reset-password'),
        });

        if (error) {
            showAlert('Error', error.message, 'error');
        } else {
            showAlert('Email Sent', 'We have sent a password reset link to your email. \n\nPlease check your spam folder too. You can request again in 60 seconds if it doesn\'t arrive.', 'success');
        }
        setLoading(false);
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BrandedAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />

            <BackgroundGradient />

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="px-8 py-4">
                        <BackButton />
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="mt-8 mb-10 items-center">
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'timing', duration: 800 }}
                            >
                                <Text className="text-4xl font-black text-slate-900 dark:text-white text-center">Forgot Password?</Text>
                                <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-bold">
                                    No worries! Enter your email and we&apos;ll send you a link to reset it.
                                </Text>
                            </MotiView>
                        </View>

                        <Input
                            label="Email address"
                            placeholder="Enter your email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={<Mail size={20} color="#fb923c" />}
                        />

                        <Button
                            onPress={handleResetRequest}
                            title="Send Reset Link"
                            loading={loading}
                            className="mt-4"
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
