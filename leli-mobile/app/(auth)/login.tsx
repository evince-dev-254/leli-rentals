import { Link, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScreenBackground from '../../components/ui/ScreenBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SafeAreaView = styled(SafeAreaViewContext);

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        loadRememberedEmail();
    }, []);

    const loadRememberedEmail = async () => {
        try {
            const savedEmail = await AsyncStorage.getItem('rememberedEmail');
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberMe(true);
            }
        } catch (error) {
            console.error('Error loading remembered email:', error);
        }
    };

    const handleLogin = async () => {
        try {
            if (rememberMe) {
                await AsyncStorage.setItem('rememberedEmail', email);
            } else {
                await AsyncStorage.removeItem('rememberedEmail');
            }
        } catch (error) {
            console.error('Error saving remember me preference:', error);
        }

        // TODO: Implement actual login logic (Supabase)
        console.log('Login with:', email, password);
        router.replace('/(auth)/role-selection');
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaViewContext className="flex-1 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mb-6 mt-4 flex-row items-center">
                    <ChevronLeft size={24} color="#1E293B" />
                    <Text className="font-outfit-bold ml-2 text-slate-800">BACK</Text>
                </TouchableOpacity>

                <View className="flex-1 justify-center -mt-10">
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800)}
                        className="items-center mb-10"
                    >
                        <Image
                            source={require('../../assets/images/logo.png')}
                            className="h-12 w-40 mb-6"
                            resizeMode="contain"
                        />
                        <Text className="text-3xl font-outfit-bold text-slate-900 mb-2">Welcome Back</Text>
                        <Text className="text-base font-outfit text-slate-500 text-center px-10">
                            Enter your credentials to access your account
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-slate-200 py-4 rounded-full mb-8 shadow-sm active:scale-95">
                            <View className="mr-3 w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                                <Text className="text-white text-xs font-bold">G</Text>
                            </View>
                            <Text className="font-outfit-bold text-slate-700">Continue with Google</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View className="space-y-4">
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

                        <View>
                            <Text className="text-sm font-outfit-bold text-slate-700 mb-2 ml-4">Password</Text>
                            <View className="flex-row items-center bg-white border border-slate-100 rounded-full px-6 py-4 shadow-sm">
                                <Lock size={20} color="#F97316" />
                                <TextInput
                                    placeholder="Enter your password"
                                    className="flex-1 ml-3 font-outfit text-slate-800"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between px-2 mt-2">
                            <TouchableOpacity
                                onPress={() => setRememberMe(!rememberMe)}
                                className="flex-row items-center"
                            >
                                {rememberMe ? (
                                    <CheckSquare size={20} color="#F97316" fill="#F97316" />
                                ) : (
                                    <View className="w-5 h-5 border border-slate-300 rounded" />
                                )}
                                <Text className="ml-2 font-outfit text-slate-600">Remember me</Text>
                            </TouchableOpacity>

                            <Link href="/(auth)/forgot-password" asChild>
                                <TouchableOpacity>
                                    <Text className="text-orange-500 font-outfit-bold text-sm">Forget Password?</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            className="bg-orange-500 py-4 rounded-full items-center shadow-lg shadow-orange-200 mt-6"
                        >
                            <Text className="text-white font-outfit-bold text-lg">LOG IN</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-8">
                            <Text className="text-slate-500 font-outfit">Don&apos;t have an account? </Text>
                            <Link href="/(auth)/signup" asChild>
                                <TouchableOpacity>
                                    <Text className="text-orange-500 font-outfit-bold">Sign up.</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </SafeAreaViewContext>
        </View>
    );
}
