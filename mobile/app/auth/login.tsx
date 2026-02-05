import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    useColorScheme,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase, performNativeGoogleSignIn } from '@/lib/supabase';
import { Mail, Lock } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import * as Linking from 'expo-linking';
import { useTheme } from '@/components/theme-provider';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
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
            handleUrl(event.url);
        };
        const subscription = Linking.addEventListener('url', handleDeepLink);
        Linking.getInitialURL().then((url) => {
            if (url) handleUrl(url);
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
                router.replace('/(tabs)');
            }
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { data, error } = await performNativeGoogleSignIn();
            if (error) throw error;
            if (data?.user) {
                let role = data.user.user_metadata?.role;
                if (!role) {
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();
                    role = profile?.role;
                }
                if (!role) {
                    router.replace('/auth/select-role');
                } else {
                    router.replace('/(tabs)');
                }
            }
        } catch (error: any) {
            if (error.code !== '7') {
                showAlert('Google Error', error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }} className="bg-white dark:bg-slate-950">
            <BrandedAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />

            <BackgroundGradient />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                        <BackButton />
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ marginTop: 20, marginBottom: 40, alignItems: 'center' }}>
                            <PerspectiveView floatEnabled={true}>
                                <Text style={{ fontSize: 56, fontWeight: '900', color: isDark ? 'white' : '#0f172a', textAlign: 'center' }}>
                                    Log In
                                </Text>
                            </PerspectiveView>
                            <Text style={{ color: '#94a3b8', fontWeight: '700', fontSize: 16, textAlign: 'center', marginTop: 8 }}>
                                Welcome back to the Premium Ecosystem.
                            </Text>
                        </View>

                        <GlassView
                            intensity={30}
                            tint={isDark ? 'dark' : 'light'}
                            style={{ padding: 32, borderRadius: 48, borderWidth: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                        >
                            {Platform.OS !== 'web' && (
                                <View style={{ marginBottom: 32 }}>
                                    <TouchableOpacity
                                        onPress={handleGoogleLogin}
                                        disabled={loading}
                                        style={{ height: 64, backgroundColor: isDark ? '#1e293b' : 'white', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? '#334155' : '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}
                                    >
                                        <Image
                                            source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                                            style={{ width: 24, height: 24, marginRight: 12 }}
                                        />
                                        <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>
                                            Continue with Google
                                        </Text>
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 32 }}>
                                        <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#334155' : '#e2e8f0' }} />
                                        <Text style={{ marginHorizontal: 16, color: '#94a3b8', fontWeight: '900', fontSize: 10, textTransform: 'uppercase' }}>OR</Text>
                                        <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#334155' : '#e2e8f0' }} />
                                    </View>
                                </View>
                            )}

                            <View style={{ gap: 24 }}>
                                <View>
                                    <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 12, marginBottom: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</Text>
                                    <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ height: 68, borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                        <Mail size={20} color="#f97316" strokeWidth={3} />
                                        <TextInput
                                            placeholder="you@example.com"
                                            placeholderTextColor="#64748b"
                                            value={email}
                                            onChangeText={setEmail}
                                            style={{ flex: 1, marginLeft: 16, color: isDark ? 'white' : '#0f172a', fontWeight: '800', fontSize: 16 }}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </GlassView>
                                </View>

                                <View>
                                    <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 12, marginBottom: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Password</Text>
                                    <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ height: 68, borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                        <Lock size={20} color="#f97316" strokeWidth={3} />
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#64748b"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                            style={{ flex: 1, marginLeft: 16, color: isDark ? 'white' : '#0f172a', fontWeight: '800', fontSize: 16 }}
                                        />
                                    </GlassView>
                                </View>
                            </View>

                            <Button
                                onPress={handleLogin}
                                title="Authenticate"
                                loading={loading}
                                className="mt-12 h-16 rounded-[24px]"
                            />

                            <TouchableOpacity
                                onPress={() => router.push('/auth/forgot-password')}
                                style={{ marginTop: 24, alignSelf: 'center' }}
                            >
                                <Text style={{ color: '#f97316', fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Forgot Security Key?</Text>
                            </TouchableOpacity>
                        </GlassView>

                        <TouchableOpacity
                            onPress={() => router.push('/auth/signup')}
                            style={{ marginTop: 40, alignSelf: 'center', padding: 20 }}
                        >
                            <Text style={{ color: '#94a3b8', fontWeight: '700', fontSize: 15 }}>
                                New to Premium? <Text style={{ color: '#f97316', fontWeight: '900' }}>Join Ecosystem.</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
