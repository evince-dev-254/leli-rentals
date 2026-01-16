import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, useColorScheme, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '../../components/ui/branded-alert';
import { BackgroundGradient } from '../../components/ui/background-gradient';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

const LOGO_BLACK = require('../../assets/images/logo_black.png');
const LOGO_WHITE = require('../../assets/images/logo_white.png');

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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            showAlert('Login Failed', error.message, 'error');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        // NOTE: Actual Google Sign In requires configuring Google Cloud Console
        // and adding client IDs to app.json. 
        // For now, we'll try the Supabase OAuth flow which handles the redirect.
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'leli-rentals://google-auth', // Deep link to app
            }
        });

        if (error) {
            showAlert('Google Error', error.message, 'error');
        } else if (data.url) {
            // Open browser for OAuth
            const result = await WebBrowser.openAuthSessionAsync(data.url, 'leli-rentals://google-auth');
            if (result.type === 'success' && result.url) {
                // Supabase handles session via the URL params usually
            }
        }
        setLoading(false);
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
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
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="mt-24 mb-10">
                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'timing', duration: 800 }}
                            >
                                <Image
                                    source={isDark ? LOGO_WHITE : LOGO_BLACK}
                                    style={{ width: 140, height: 45, marginBottom: 12 }}
                                    resizeMode="contain"
                                    accessibilityLabel="Leli Rentals Logo"
                                    alt="Leli Rentals Logo"
                                />
                                <Text className="text-5xl font-black text-slate-900 dark:text-white leading-tight">Welcome{"\n"}Back</Text>
                                <Text className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">Log in to Kenya&apos;s gear ecosystem.</Text>
                            </MotiView>
                        </View>

                        <View className="space-y-4">
                            <View
                                style={{ borderRadius: 12 }}
                                className="flex-row items-center border border-slate-200 dark:border-white/10 px-4 bg-white dark:bg-white/5 h-16 shadow-sm dark:shadow-none"
                            >
                                <Mail color="#fb923c" size={20} />
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email Address"
                                    placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.3)" : "#94a3b8"}
                                    className="flex-1 ml-3 text-slate-900 dark:text-white font-semibold text-base"
                                    autoCapitalize="none"
                                />
                            </View>
                            <View
                                style={{ borderRadius: 12, marginTop: 16 }}
                                className="flex-row items-center border border-slate-200 dark:border-white/10 px-4 bg-white dark:bg-white/5 h-16 shadow-sm dark:shadow-none"
                            >
                                <Lock color="#fb923c" size={20} />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.3)" : "#94a3b8"}
                                    className="flex-1 ml-3 text-slate-900 dark:text-white font-semibold text-base"
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={{ backgroundColor: '#a855f7', borderRadius: 12 }}
                            className="h-16 items-center justify-center mt-12 shadow-2xl shadow-purple-500/40"
                        >
                            <Text className="text-white font-black text-lg uppercase tracking-widest">{loading ? 'Verifying...' : 'Sign In'}</Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center my-10">
                            <View className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10" />
                            <Text className="mx-6 text-slate-400 dark:text-white/30 font-bold text-xs uppercase tracking-[4px]">OR</Text>
                            <View className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10" />
                        </View>

                        <TouchableOpacity
                            onPress={handleGoogleLogin}
                            style={{ borderRadius: 12 }}
                            className="flex-row items-center justify-center h-16 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none"
                        >
                            <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center mr-4">
                                <Text className="text-white text-[11px] font-black">G</Text>
                            </View>
                            <Text className="text-slate-900 dark:text-white font-bold text-base">Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/auth/signup')}
                            className="mt-10 items-center"
                        >
                            <Text className="text-slate-500 text-base">Don&apos;t have an account? <Text style={{ color: '#a855f7' }} className="font-black underline">Sign Up</Text></Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
