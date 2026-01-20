import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Mail, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';

export default function VerifyOtpScreen() {
    const { email: initialEmail } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        title: '',
        message: '',
        type: 'info'
    });
    const router = useRouter();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const handleVerify = async () => {
        if (!otp || otp.length < 4) { // Minimum length for OTP usually 4 or 6, but we'll allow flexible up to 8
            showAlert('Invalid Code', 'Please enter the verification code sent to your email.', 'error');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            email: initialEmail || '',
            token: otp,
            type: 'signup',
        });

        if (error) {
            showAlert('Verification Failed', error.message, 'error');
        } else {
            showAlert('Success!', 'Your email has been verified.', 'success');
            // Small delay to let the user see the success alert before redirecting
            setTimeout(() => {
                router.replace('/auth/select-role');
            }, 1500);
        }
        setLoading(false);
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        setIsResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: initialEmail || '',
        });

        if (error) {
            showAlert('Resend Failed', error.message, 'error');
        } else {
            showAlert('Code Sent', 'A new verification code has been sent to your email.', 'success');
            setResendTimer(60);
        }
        setIsResending(false);
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
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
                                className="items-center"
                            >
                                <View className="h-20 w-20 bg-orange-100 dark:bg-orange-900/20 rounded-[24px] items-center justify-center mb-6 shadow-sm">
                                    <ShieldCheck size={40} color="#f97316" />
                                </View>
                                <Text className="text-4xl font-black text-slate-900 dark:text-white text-center">Verify Email</Text>
                                <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-bold">
                                    Enter the verification code sent to{"\n"}
                                    <Text className="text-slate-900 dark:text-white">{initialEmail}</Text>
                                </Text>
                            </MotiView>
                        </View>

                        <View className="mb-8">
                            <Input
                                label="Verification Code"
                                placeholder="Enter code"
                                value={otp}
                                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 8))}
                                keyboardType="number-pad"
                                icon={<RefreshCw size={20} color="#f97316" />}
                            />
                        </View>

                        <Button
                            onPress={handleVerify}
                            title="Verify Code"
                            loading={loading}
                        />

                        <View className="mt-12 items-center">
                            <Text className="text-slate-500 font-bold">
                                Didn&apos;t receive a code?
                            </Text>
                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={resendTimer > 0 || isResending}
                                className="mt-2"
                            >
                                <Text className={`font-black text-lg ${resendTimer > 0 ? 'text-slate-300' : 'text-[#f97316]'}`}>
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Now'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
