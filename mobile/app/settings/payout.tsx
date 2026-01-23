import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/components/theme-provider';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Building2, Landmark, CreditCard, ChevronLeft, Save, ShieldCheck, Wallet } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function PayoutSettingsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        bank_name: '',
        account_number: '',
        account_name: '',
        payout_method: 'bank' as 'bank' | 'mobile_money',
    });

    const { data: profile, isLoading, refetch } = useQuery({
        queryKey: ['user-profile-payout', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('bank_name, account_number, account_name, payout_method')
                .eq('id', user?.id)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (profile) {
            setForm({
                bank_name: profile.bank_name || '',
                account_number: profile.account_number || '',
                account_name: profile.account_name || '',
                payout_method: (profile.payout_method as any) || 'bank',
            });
        }
    }, [profile]);

    const handleSave = async () => {
        if (!form.account_number || !form.account_name || !form.bank_name) {
            Alert.alert('Incomplete Info', 'Please fill in all payout details.');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    bank_name: form.bank_name,
                    account_number: form.account_number,
                    account_name: form.account_name,
                    payout_method: form.payout_method,
                })
                .eq('id', user?.id);

            if (error) throw error;

            Alert.alert('Success', 'Payout settings updated successfully.');
            refetch();
        } catch (error) {
            console.error('Error saving payout settings:', error);
            Alert.alert('Error', 'Failed to save payout settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                    >
                        <ChevronLeft size={24} color={theme === 'dark' ? '#f8fafc' : '#0f172a'} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">Payout Settings</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6">
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        className="mt-8 mb-8"
                    >
                        <View className="bg-blue-600 p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                            <View className="absolute top-0 right-0 p-6 opacity-10">
                                <Wallet size={120} color="white" />
                            </View>
                            <Text className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2">Linked Account</Text>
                            <Text className="text-white text-2xl font-black mb-4">
                                {form.bank_name || 'No Bank Linked'}
                            </Text>
                            <View className="flex-row items-center">
                                <ShieldCheck size={16} color="#10b981" />
                                <Text className="text-emerald-400 ml-2 text-xs font-bold uppercase tracking-wider">Secure Transfer Enabled</Text>
                            </View>
                        </View>
                    </MotiView>

                    <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
                        Method & Details
                    </Text>

                    <View className="space-y-4">
                        {/* Payout Method Toggle */}
                        <View className="flex-row gap-4 mb-4">
                            <TouchableOpacity
                                onPress={() => setForm(f => ({ ...f, payout_method: 'bank' }))}
                                className={`flex-1 p-4 rounded-3xl border-2 items-center ${form.payout_method === 'bank' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                            >
                                <Landmark size={24} color={form.payout_method === 'bank' ? '#3b82f6' : '#94a3b8'} />
                                <Text className={`mt-2 font-bold ${form.payout_method === 'bank' ? 'text-blue-600' : 'text-slate-400'}`}>Bank</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setForm(f => ({ ...f, payout_method: 'mobile_money' }))}
                                className={`flex-1 p-4 rounded-3xl border-2 items-center ${form.payout_method === 'mobile_money' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                            >
                                <CreditCard size={24} color={form.payout_method === 'mobile_money' ? '#3b82f6' : '#94a3b8'} />
                                <Text className={`mt-2 font-bold ${form.payout_method === 'mobile_money' ? 'text-blue-600' : 'text-slate-400'}`}>Mobile</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Fields */}
                        <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800">
                            <View className="mb-6">
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    {form.payout_method === 'bank' ? 'Bank Name' : 'Network (e.g. M-Pesa)'}
                                </Text>
                                <TextInput
                                    value={form.bank_name}
                                    onChangeText={text => setForm(f => ({ ...f, bank_name: text }))}
                                    placeholder={form.payout_method === 'bank' ? "e.g. Stanbic Bank" : "e.g. M-Pesa / MTN"}
                                    placeholderTextColor="#94a3b8"
                                    className="h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 font-bold"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    {form.payout_method === 'bank' ? 'Account Number' : 'Phone Number'}
                                </Text>
                                <TextInput
                                    value={form.account_number}
                                    onChangeText={text => setForm(f => ({ ...f, account_number: text }))}
                                    placeholder="0000000000"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="numeric"
                                    className="h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 font-bold"
                                />
                            </View>

                            <View className="mb-2">
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Holder Name</Text>
                                <TextInput
                                    value={form.account_name}
                                    onChangeText={text => setForm(f => ({ ...f, account_name: text }))}
                                    placeholder="e.g. John Doe"
                                    placeholderTextColor="#94a3b8"
                                    className="h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 font-bold"
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        className="mt-8 mb-12 h-16 bg-blue-600 rounded-[28px] flex-row items-center justify-center shadow-lg shadow-blue-500/20"
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Save size={20} color="white" className="mr-2" />
                                <Text className="text-white font-black text-lg ml-2">Update Payout Details</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View className="mb-20 p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                        <Text className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                            <Text className="font-black">Security Note:</Text> Payout details are used only to transfer your earnings. Ensure the name matches your official documents to avoid processing delays.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
