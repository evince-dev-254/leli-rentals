import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, Zap, Shield, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { PaystackCheckout } from '@/components/payment/paystack-checkout';

export default function SubscriptionScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPaystack, setShowPaystack] = useState(false);

    // Fetch live subscription
    const { data: subscription, refetch: refetchSub } = useQuery({
        queryKey: ['user-subscription', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user?.id)
                .eq('status', 'active')
                .maybeSingle();
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });

    const currentPlan = subscription?.plan_type || 'basic';

    const handleUpgrade = async (response: any) => {
        setShowPaystack(false);
        setLoading(true);

        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);

            // 1. Update/Insert subscription
            const { error: subError } = await supabase
                .from('subscriptions')
                .upsert({
                    user_id: user?.id,
                    plan_type: 'premium', // Mapping Pro -> premium
                    status: 'active',
                    price: 2500,
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' }); // Assuming one active sub per user

            if (subError) throw subError;

            // 2. Ensure role is owner/affiliate if upgraded
            await supabase
                .from('user_profiles')
                .update({ role: 'owner' })
                .eq('id', user?.id)
                .is('role', 'renter');

            // 3. Log transaction
            await supabase
                .from('transactions')
                .insert({
                    user_id: user?.id,
                    transaction_type: 'subscription_payment',
                    amount: 2500,
                    payment_method: 'paystack',
                    provider_reference: response.transactionRef.reference,
                    status: 'completed',
                    metadata: { plan: 'premium', paystack_response: response }
                });

            refetchSub();
            alert('Congratulations! You are now a Pro Host.');
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('Payment was successful but we failed to update your subscription. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Subscription</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

                    {/* Current Plan Card */}
                    <View className="mb-8">
                        <View className={cn(
                            "p-8 rounded-[40px] shadow-xl relative overflow-hidden",
                            currentPlan === 'pro' ? "bg-purple-600" : "bg-slate-900 dark:bg-blue-600"
                        )}>
                            <View className="absolute top-0 right-0 p-6 opacity-10">
                                <Crown size={120} color="white" />
                            </View>
                            <Text className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2">Current Plan</Text>
                            <Text className="text-white text-3xl font-black mb-6">
                                {currentPlan === 'premium' ? 'Pro Host' : 'Basic Partner'}
                            </Text>
                            <View className="flex-row items-center">
                                <View className="bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30">
                                    <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Active</Text>
                                </View>
                                <Text className="text-white/40 ml-4 text-xs font-bold">
                                    {currentPlan === 'premium' ? 'Renewals Next Month' : 'Free Forever'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-center text-slate-900 dark:text-white font-black text-xl mb-6">Upgrade your Power</Text>

                    {/* Premium Plan */}
                    <TouchableOpacity
                        onPress={() => currentPlan !== 'premium' && setShowPaystack(true)}
                        disabled={currentPlan === 'premium'}
                        className={cn(
                            "mb-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 shadow-lg relative overflow-hidden",
                            currentPlan === 'premium' ? "border-purple-500/50 opacity-80" : "border-slate-100 dark:border-slate-800"
                        )}
                    >
                        <View className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-xl font-black text-slate-900 dark:text-white">Pro Host</Text>
                                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs mt-1">For serious businesses</Text>
                            </View>
                            <Text className="text-2xl font-black text-purple-600">KES 2,500<Text className="text-sm text-slate-400 font-bold">/mo</Text></Text>
                        </View>

                        <View className="space-y-3 mb-6">
                            {['Lower Commission (8%)', 'Priority Search Ranking', 'Verified Badge', 'Dedicated Support'].map((feat, i) => (
                                <View key={i} className="flex-row items-center">
                                    <View className="h-5 w-5 rounded-full bg-purple-100 items-center justify-center mr-3">
                                        <Check size={10} color="#9333ea" strokeWidth={4} />
                                    </View>
                                    <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm">{feat}</Text>
                                </View>
                            ))}
                        </View>

                        <View className={cn(
                            "py-4 rounded-2xl items-center",
                            currentPlan === 'premium' ? "bg-slate-100 dark:bg-slate-800" : "bg-slate-900"
                        )}>
                            <Text className={cn(
                                "font-black",
                                currentPlan === 'premium' ? "text-slate-400" : "text-white"
                            )}>
                                {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade Now'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Enterprise Plan */}
                    <TouchableOpacity className="mb-20 bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 opacity-60">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-xl font-black text-slate-900 dark:text-white">Enterprise</Text>
                                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs mt-1">For large fleets</Text>
                            </View>
                            <Text className="text-lg font-black text-slate-400">Custom</Text>
                        </View>

                        <View className="space-y-3 mb-6">
                            {['0% Commission', 'API Access', 'White-label Options'].map((feat, i) => (
                                <View key={i} className="flex-row items-center">
                                    <View className="h-5 w-5 rounded-full bg-slate-100 items-center justify-center mr-3">
                                        <Check size={10} color="#64748b" strokeWidth={4} />
                                    </View>
                                    <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm">{feat}</Text>
                                </View>
                            ))}
                        </View>

                        <View className="bg-slate-100 py-4 rounded-2xl items-center">
                            <Text className="text-slate-900 font-black">Contact Sales</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                {/* Paystack Modal */}
                <Modal visible={showPaystack} animationType="slide">
                    <View className="flex-1 bg-white dark:bg-slate-950">
                        <SafeAreaView className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <Text className="text-xl font-black text-slate-900 dark:text-white">Secure Upgrade</Text>
                            <TouchableOpacity onPress={() => setShowPaystack(false)}>
                                <X size={24} color="#f97316" />
                            </TouchableOpacity>
                        </SafeAreaView>
                        <PaystackCheckout
                            amount={2500 * 100} // KES 2,500 in cents
                            email={user?.email || ''}
                            billingName={user?.user_metadata?.full_name}
                            onSuccess={handleUpgrade}
                            onCancel={() => setShowPaystack(false)}
                        />
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}
