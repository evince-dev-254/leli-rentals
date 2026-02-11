import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Mail, ChevronLeft, Send, Sparkles } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';

const SafeAreaView = styled(SafeAreaViewContext);

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = () => {
        // TODO: Implement Supabase password reset logic
        console.log('Reset password for:', email);
        setIsSent(true);
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mb-6 mt-4 flex-row items-center">
                    <ChevronLeft size={24} color="#1E293B" />
                    <Text className="font-outfit-bold ml-2 text-slate-800">BACK</Text>
                </TouchableOpacity>

                <View className="flex-1 justify-center -mt-20">
                    {!isSent ? (
                        <>
                            <View className="items-center mb-8">
                                <View className="w-20 h-20 bg-orange-100 rounded-3xl items-center justify-center mb-4">
                                    <Sparkles size={40} color="#F97316" />
                                </View>
                                <Text className="text-3xl font-outfit-bold text-slate-900 mb-2">Forgot Password?</Text>
                                <Text className="text-base font-outfit text-slate-500 text-center px-6">
                                    No worries! Enter your email and we&apos;ll send you reset instructions.
                                </Text>
                            </View>

                            <View className="space-y-6">
                                <View>
                                    <Text className="text-sm font-outfit-bold text-slate-700 mb-2 ml-4">Email Address</Text>
                                    <View className="flex-row items-center bg-white border border-slate-100 rounded-full px-6 py-4 shadow-sm">
                                        <Mail size={20} color="#F97316" />
                                        <TextInput
                                            placeholder="Enter your email address"
                                            className="flex-1 ml-3 font-outfit text-slate-800"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="bg-orange-500 py-4 rounded-full flex-row items-center justify-center shadow-lg shadow-orange-200 mt-4"
                                >
                                    <Text className="text-white font-outfit-bold text-lg mr-2">SEND RESET LINK</Text>
                                    <Send size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View className="items-center">
                            <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-6">
                                <Mail size={48} color="#10B981" />
                            </View>
                            <Text className="text-3xl font-outfit-bold text-slate-900 mb-4">Check Your Email</Text>
                            <Text className="text-base font-outfit text-slate-500 text-center px-10 mb-8">
                                We&apos;ve sent password reset instructions to {email}.
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.replace('/(auth)/login')}
                                className="bg-slate-900 px-10 py-4 rounded-full"
                            >
                                <Text className="text-white font-outfit-bold">BACK TO LOGIN</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}
