import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-8 justify-center"
            >
                <View className="mb-12">
                    <Text className="text-4xl font-black text-slate-900 dark:text-white">Welcome Back</Text>
                    <Text className="text-slate-500 mt-2">Log in to Kenya's premier gear ecosystem.</Text>
                </View>

                <View className="space-y-4">
                    <View className="flex-row items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 bg-slate-50 dark:bg-slate-900">
                        <Mail color="#94a3b8" size={20} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email Address"
                            placeholderTextColor="#94a3b8"
                            className="flex-1 h-14 ml-3 text-slate-900 dark:text-white"
                            autoCapitalize="none"
                        />
                    </View>
                    <View className="flex-row items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 bg-slate-50 dark:bg-slate-900 mt-4">
                        <Lock color="#94a3b8" size={20} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#94a3b8"
                            className="flex-1 h-14 ml-3 text-slate-900 dark:text-white"
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className="bg-blue-600 h-14 rounded-2xl items-center justify-center mt-10 shadow-lg shadow-blue-500/30"
                >
                    <Text className="text-white font-black text-lg">{loading ? 'Verifying...' : 'Sign In'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/auth/signup')}
                    className="mt-6 items-center"
                >
                    <Text className="text-slate-500">Don't have an account? <Text className="text-blue-600 font-bold">Sign Up</Text></Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
