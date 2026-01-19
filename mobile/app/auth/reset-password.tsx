import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Lock } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handleReset = async () => {
        if (!password || !confirmPassword) {
            showAlert('Wait!', 'Please fill in both password fields.', 'info');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Wait!', 'Passwords do not match.', 'info');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            showAlert('Error', error.message, 'error');
        } else {
            showAlert('Success!', 'Your password has been reset successfully.', 'success');
            setTimeout(() => {
                router.replace('/auth/login');
            }, 2000);
        }
        setLoading(false);
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
                            >
                                <Text className="text-4xl font-black text-slate-900 dark:text-white text-center">Reset Password</Text>
                                <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-bold">
                                    Create a new strong password for your account.
                                </Text>
                            </MotiView>
                        </View>

                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                            icon={<Lock size={20} color="#fb923c" />}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPassword
                            icon={<Lock size={20} color="#fb923c" />}
                        />

                        <Button
                            onPress={handleReset}
                            title="Reset Password"
                            loading={loading}
                            className="mt-4"
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
