import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, Phone } from 'lucide-react-native';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert('Check your email for confirmation!');
        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, justifyContent: 'center' }}>
                    <View className="mb-12">
                        <Text className="text-4xl font-black text-slate-900 dark:text-white">Create Account</Text>
                        <Text className="text-slate-500 mt-2">Start renting and earning today.</Text>
                    </View>

                    <View className="space-y-4">
                        <View className="flex-row items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 bg-slate-50 dark:bg-slate-900">
                            <User color="#94a3b8" size={20} />
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#94a3b8"
                                className="flex-1 h-14 ml-3 text-slate-900 dark:text-white"
                            />
                        </View>
                        <View className="flex-row items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 bg-slate-50 dark:bg-slate-900 mt-4">
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
                        onPress={handleSignup}
                        disabled={loading}
                        className="bg-blue-600 h-14 rounded-2xl items-center justify-center mt-10 shadow-lg shadow-blue-500/30"
                    >
                        <Text className="text-white font-black text-lg">{loading ? 'Creating...' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-6 items-center"
                    >
                        <Text className="text-slate-500">Already have an account? <Text className="text-blue-600 font-bold">Sign In</Text></Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
