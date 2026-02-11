import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Mail, Lock, User, Eye, EyeOff, Check, ChevronLeft } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SafeAreaView = styled(SafeAreaViewContext);

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSignup = () => {
        // TODO: Implement actual signup logic
        console.log('Signup with:', name, email, password);
        router.replace('/(auth)/role-selection');
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mb-6 mt-4 flex-row items-center">
                    <ChevronLeft size={24} color="#1E293B" />
                    <Text className="font-outfit-bold ml-2 text-slate-800">BACK</Text>
                </TouchableOpacity>

                <Animated.View
                    entering={FadeInDown.delay(200).duration(800)}
                    className="mb-8 items-center"
                >
                    <Image
                        source={require('../../assets/images/logo.png')}
                        className="h-10 w-32 mb-6"
                        resizeMode="contain"
                    />
                    <Text className="text-3xl font-outfit-bold text-slate-800 mb-2">Create Account</Text>
                    <Text className="text-base font-outfit text-slate-500">
                        Join Leli Rentals today!
                    </Text>
                </Animated.View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-outfit-bold text-slate-700 mb-2 ml-4">Full Name</Text>
                        <View className="flex-row items-center bg-white border border-slate-100 rounded-full px-6 py-4 shadow-sm">
                            <User size={20} color="#F97316" />
                            <TextInput
                                placeholder="Enter your full name"
                                className="flex-1 ml-3 font-outfit text-slate-800"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

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

                    <TouchableOpacity
                        className="flex-row items-center mb-4 mt-2"
                        onPress={() => setAgreed(!agreed)}
                    >
                        <View className={`w-5 h-5 rounded border items-center justify-center mr-2 ${agreed ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                            {agreed && <Check size={14} color="white" />}
                        </View>
                        <Text className="text-slate-500 font-outfit text-sm">I agree with terms and conditions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSignup}
                        className="bg-orange-500 py-4 rounded-full items-center shadow-lg shadow-orange-200"
                    >
                        <Text className="text-white font-outfit-bold text-lg">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-slate-500 font-outfit">Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-orange-500 font-outfit-bold">Log in.</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
