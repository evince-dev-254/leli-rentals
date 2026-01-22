import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase, performNativeGoogleSignIn } from '@/lib/supabase';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
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

    const handleUrl = useCallback(async (url: string) => {
        if (url.includes('auth/callback')) {
            const parsed = Linking.parse(url);
            const { access_token, refresh_token, error, error_description } = parsed.queryParams as any;

            if (error || error_description) {
                showAlert('Auth Error', error_description || error, 'error');
                return;
            }

            if (access_token && refresh_token) {
                setLoading(true);
                const { data: { user }, error: sessionError } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });

                if (!sessionError && user) {
                    const role = user.user_metadata?.role;
                    if (!role) {
                        router.replace('/auth/select-role');
                    } else {
                        router.replace('/(tabs)');
                    }
                } else if (sessionError) {
                    showAlert('Session Error', sessionError.message, 'error');
                }
                setLoading(false);
            }
        }
    }, [router]);

    useEffect(() => {
        const handleDeepLink = (event: Linking.EventType) => {
            console.info('[DeepLink] Event received:', event.url);
            handleUrl(event.url);
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Check for initial URL if the app was opened via a link
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.info('[DeepLink] Initial URL:', url);
                handleUrl(url);
            }
        });

        return () => subscription.remove();
    }, [handleUrl]);

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
            // Force sign out first to ensure no stale sessions interfere
            await supabase.auth.signOut();

            console.info('[GoogleLogin] Starting native sign-in');
            const { data, error } = await performNativeGoogleSignIn();

            if (error) throw error;

            if (data?.user) {
                console.info('[GoogleLogin] Native success!');
                const role = data.user.user_metadata?.role;
                if (!role) {
                    router.replace('/auth/select-role');
                } else {
                    router.replace('/(tabs)');
                }
            }
        } catch (error: any) {
            if (error.code === '7' || error.message?.includes('Sign in action cancelled')) {
                console.info('[GoogleLogin] User cancelled');
            } else {
                console.error('[GoogleLogin] Error:', error);
                showAlert('Google Error', error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
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

                        <GoogleSigninButton
                            size={GoogleSigninButton.Size.Wide}
                            color={isDark ? GoogleSigninButton.Color.Dark : GoogleSigninButton.Color.Light}
                            onPress={handleGoogleLogin}
                            disabled={loading}
                            style={{ width: '100%', height: 60, marginBottom: 32 }}
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
