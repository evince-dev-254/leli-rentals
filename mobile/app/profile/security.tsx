import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Shield } from 'lucide-react-native';
import { useAuth } from '../../context/auth-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SecurityScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });

    const handleUpdatePassword = async () => {
        if (!passwords.new || !passwords.confirm) {
            Alert.alert('Error', 'Please fill in both fields');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (passwords.new.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;

            Alert.alert('Success', 'Password updated successfully');
            setPasswords({ new: '', confirm: '' });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <BackButton />
                    <Text className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Security</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-3xl border border-orange-100 dark:border-orange-500/20 mb-8 flex-row items-center">
                        <Shield size={24} color="#f97316" />
                        <Text className="flex-1 ml-4 text-slate-700 dark:text-orange-100 text-xs font-bold leading-5">
                            Keep your account secure by using a strong password. We recommend combining letters, numbers, and symbols.
                        </Text>
                    </View>

                    <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">Change Password</Text>

                    <Input
                        label="New Password"
                        icon={<Lock size={20} color="#94a3b8" />}
                        value={passwords.new}
                        onChangeText={(text) => setPasswords({ ...passwords, new: text })}
                        isPassword
                        placeholder="Enter new password"
                    />

                    <Input
                        label="Confirm Password"
                        icon={<Lock size={20} color="#94a3b8" />}
                        value={passwords.confirm}
                        onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                        isPassword
                        placeholder="Confirm new password"
                    />

                    <Button
                        title="Update Password"
                        onPress={handleUpdatePassword}
                        isLoading={loading}
                        className="mt-4"
                    />

                    <View className="h-10" />

                    <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">Delete Account</Text>
                    <Button
                        title="Delete Account"
                        variant="ghost"
                        onPress={() => Alert.alert('Delete Account', 'Please contact support to delete your account permanently.')}
                        className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10"
                        textClassName="text-red-600 dark:text-red-400"
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
