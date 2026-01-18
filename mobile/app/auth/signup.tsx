import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, useColorScheme, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
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

    const handleSignup = async () => {
        if (!email || !password || !fullName || !phone) {
            showAlert('Wait!', 'Please fill in all fields.', 'info');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                }
            }
        });

        if (error) {
            showAlert('Signup Failed', error.message, 'error');
        } else {
            showAlert('Success!', 'Account created. Redirecting to verification...', 'success');
            setTimeout(() => {
                setAlertConfig(prev => ({ ...prev, visible: false }));
                router.push({
                    pathname: '/auth/verify',
                    params: { email }
                });
            }, 1500);
        }
        setLoading(false);
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
                                <Text className="text-5xl font-black text-slate-900 dark:text-white text-center">Sign Up</Text>
                                <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-bold">
                                    Join Kenya&apos;s gear ecosystem today
                                </Text>
                            </MotiView>
                        </View>

                        <View>
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChangeText={setFullName}
                                icon={<User size={20} color="#f97316" />}
                            />

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
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                icon={<Phone size={20} color="#f97316" />}
                            />

                            <Input
                                label="Password"
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                                icon={<Lock size={20} color="#f97316" />}
                            />
                        </View>

                        <Button
                            onPress={handleSignup}
                            title="Create Account"
                            loading={loading}
                            className="mt-6"
                        />

                        <TouchableOpacity
                            onPress={() => router.push('/auth/login')}
                            className="mt-12 items-center"
                        >
                            <Text className="text-slate-500 font-bold text-lg">
                                Already have an account? <Text className="text-[#f97316]">Log in.</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
