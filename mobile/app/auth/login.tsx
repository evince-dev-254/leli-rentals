import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '../../components/ui/branded-alert';

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
        showAlert('Google Sign-In', 'Connecting to Google services...', 'info');
        // Functional logic would go here with expo-auth-session
    };

    return (
        <View className="flex-1 bg-slate-950">
            <BrandedAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />

            {/* High-Fidelity Gradient Mesh Background */}
            <View className="absolute inset-0 overflow-hidden">
                <View
                    style={{
                        position: 'absolute',
                        top: -150,
                        right: -150,
                        width: 400,
                        height: 400,
                        borderRadius: 200,
                        backgroundColor: '#fb923c', // Orange (Primary)
                        opacity: 0.12,
                        transform: [{ scale: 1.5 }]
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: -100,
                        width: 300,
                        height: 300,
                        borderRadius: 150,
                        backgroundColor: '#a855f7', // Purple
                        opacity: 0.08,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        bottom: -100,
                        right: '10%',
                        width: 350,
                        height: 350,
                        borderRadius: 175,
                        backgroundColor: '#ec4899', // Pink
                        opacity: 0.06,
                    }}
                />
            </View>

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
                                <Text className="text-5xl font-black text-white leading-tight">Welcome{"\n"}Back</Text>
                                <Text className="text-slate-400 mt-4 text-lg font-medium">Log in to Kenya&apos;s gear ecosystem.</Text>
                            </MotiView>
                        </View>

                        <View className="space-y-4">
                            <View
                                style={{ borderRadius: 12 }}
                                className="flex-row items-center border border-white/10 px-4 bg-white/5 h-16"
                            >
                                <Mail color="#fb923c" size={20} />
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email Address"
                                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                    className="flex-1 ml-3 text-white font-semibold text-base"
                                    autoCapitalize="none"
                                />
                            </View>
                            <View
                                style={{ borderRadius: 12, marginTop: 16 }}
                                className="flex-row items-center border border-white/10 px-4 bg-white/5 h-16"
                            >
                                <Lock color="#fb923c" size={20} />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                    className="flex-1 ml-3 text-white font-semibold text-base"
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={{ backgroundColor: '#fb923c', borderRadius: 12 }}
                            className="h-16 items-center justify-center mt-12 shadow-2xl shadow-orange-500/40"
                        >
                            <Text className="text-white font-black text-lg uppercase tracking-widest">{loading ? 'Verifying...' : 'Sign In'}</Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center my-10">
                            <View className="flex-1 h-[1px] bg-white/10" />
                            <Text className="mx-6 text-white/30 font-bold text-xs uppercase tracking-[4px]">OR</Text>
                            <View className="flex-1 h-[1px] bg-white/10" />
                        </View>

                        <TouchableOpacity
                            onPress={handleGoogleLogin}
                            style={{ borderRadius: 12 }}
                            className="flex-row items-center justify-center h-16 border border-white/10 bg-white/5"
                        >
                            <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center mr-4">
                                <Text className="text-white text-[11px] font-black">G</Text>
                            </View>
                            <Text className="text-white font-bold text-base">Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/auth/signup')}
                            className="mt-10 items-center"
                        >
                            <Text className="text-slate-500 text-base">Don&apos;t have an account? <Text style={{ color: '#fb923c' }} className="font-black underline">Sign Up</Text></Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
