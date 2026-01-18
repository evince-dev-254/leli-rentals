import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Mail, Lock } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';


const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        title: '',
        message: '',
        type: 'info'
    });
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert('Wait!', 'Please enter both email and password.', 'info');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            showAlert('Login Failed', error.message, 'error');
            setLoading(false);
        } else if (data?.user) {
            const role = data.user.user_metadata?.role;
            const emailVerified = data.user.email_confirmed_at;

            if (!emailVerified) {
                showAlert('Verify Email', 'Please verify your email to continue.', 'info');
                setTimeout(() => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    router.push({
                        pathname: '/auth/verify',
                        params: { email }
                    });
                }, 1500);
            } else if (!role) {
                router.replace('/auth/select-role');
            } else {
                // Global redirection to tabs which handles internal dashboard state
                router.replace('/(tabs)');
            }
            setLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const redirectTo = Linking.createURL('auth/callback');

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                }
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

                if (result.type === 'success' && result.url) {
                    const { queryParams } = Linking.parse(result.url);
                    if (queryParams?.access_token) {
                        const { data: { user }, error: sessionError } = await supabase.auth.setSession({
                            access_token: queryParams.access_token as string,
                            refresh_token: queryParams.refresh_token as string,
                        });

                        if (!sessionError && user) {
                            const role = user.user_metadata?.role;
                            if (!role) {
                                router.replace('/auth/select-role');
                            } else {
                                router.replace('/(tabs)');
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
            showAlert('Google Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
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
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="mt-8 mb-10 items-center">
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'timing', duration: 800 }}
                            >
                                <Text className="text-5xl font-black text-slate-900 dark:text-white text-center">Log In</Text>
                                <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-bold">
                                    Enter your credentials to access your account
                                </Text>
                            </MotiView>
                        </View>

                        <Button
                            onPress={handleGoogleLogin}
                            title="Sign in with Google"
                            variant="secondary"
                            className="bg-white border-2 border-slate-100 h-16 mb-8"
                            textClassName="text-slate-900 normal-case"
                        />

                        <View>
                            <Input
                                label="Email address"
                                placeholder="Enter your email address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={<Mail size={20} color="#f97316" />}
                            />

                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                                icon={<Lock size={20} color="#f97316" />}
                            />
                        </View>

                        <Button
                            onPress={handleLogin}
                            title="Log In"
                            loading={loading}
                            className="mt-4"
                        />

                        <TouchableOpacity
                            onPress={() => router.push('/auth/forgot-password')}
                            className="mt-8 items-center"
                        >
                            <Text className="text-slate-500 font-bold underline">Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/auth/signup')}
                            className="mt-12 items-center"
                        >
                            <Text className="text-slate-500 font-bold text-lg">
                                Don&apos;t have an account? <Text className="text-[#f97316]">Sign up.</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
