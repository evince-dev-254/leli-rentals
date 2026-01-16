import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function FinancialCenterScreen() {
    const { user } = useAuth();
    const [requestLoading, setRequestLoading] = useState(false);

    const { data: wallet, isLoading: walletLoading } = useQuery({
        queryKey: ['wallet', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_wallets')
                .select('*')
                .eq('user_id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data || { balance: 0, pending_payouts: 0, total_earned: 0 };
        },
        enabled: !!user?.id
    });

    const { data: payouts, isLoading: payoutsLoading } = useQuery({
        queryKey: ['payouts', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('payout_requests')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id
    });

    const handleRequestPayout = () => {
        if ((wallet?.balance || 0) < 500) {
            alert('Minimum payout amount is KES 500');
            return;
        }
        setRequestLoading(true);
        setTimeout(() => {
            setRequestLoading(false);
            alert('Success: Payout request submitted! Our team will process it within 24-48 hours.');
        }, 1500);
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Earnings</Text>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Balanced Card */}
                    <View className="px-8 py-6">
                        <MotiView
                            from={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'timing', duration: 800 }}
                            className="bg-slate-900 dark:bg-blue-600 rounded-[48px] p-10 overflow-hidden relative"
                        >
                            <View className="relative z-10">
                                <Text className="text-white/60 font-black uppercase tracking-widest text-[10px] mb-2">Available Balance</Text>
                                <Text className="text-white text-4xl font-black mb-8">KES {wallet?.balance?.toLocaleString() || '0'}</Text>

                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <Text className="text-white/40 font-black uppercase tracking-widest text-[8px] mb-1">Total Earned</Text>
                                        <Text className="text-white text-base font-black">KES {wallet?.total_earned?.toLocaleString() || '0'}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white/40 font-black uppercase tracking-widest text-[8px] mb-1">Pending</Text>
                                        <Text className="text-white text-base font-black">KES {wallet?.pending_payouts?.toLocaleString() || '0'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="absolute -right-10 -top-10 h-40 w-40 bg-white/5 rounded-full" />
                            <View className="absolute -left-10 -bottom-10 h-32 w-32 bg-white/5 rounded-full" />
                        </MotiView>

                        <Button
                            title="Request Payout"
                            className="mt-6 h-16 rounded-[28px]"
                            onPress={handleRequestPayout}
                            loading={requestLoading}
                            icon={<ArrowUpRight size={20} color="white" />}
                        />
                    </View>

                    {/* Stats */}
                    <View className="px-8 flex-row gap-4 mb-8">
                        <View className="flex-1 bg-white/80 dark:bg-slate-900/80 p-6 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 shadow-sm items-center">
                            <View className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl items-center justify-center mb-3">
                                <TrendingUp size={20} color="#10b981" />
                            </View>
                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Growth</Text>
                            <Text className="text-base font-black text-slate-900 dark:text-white">+12.5%</Text>
                        </View>
                        <View className="flex-1 bg-white/80 dark:bg-slate-900/80 p-6 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 shadow-sm items-center">
                            <View className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl items-center justify-center mb-3">
                                <History size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payouts</Text>
                            <Text className="text-base font-black text-slate-900 dark:text-white">{payouts?.length || 0} Total</Text>
                        </View>
                    </View>

                    {/* Recent Transactions */}
                    <View className="px-8 pb-32">
                        <Text className="text-xl font-black text-slate-900 dark:text-white mb-6">Recent History</Text>
                        {payoutsLoading ? (
                            <ActivityIndicator color="#3b82f6" />
                        ) : payouts?.length === 0 ? (
                            <View className="py-12 items-center bg-white/50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                <Text className="text-slate-400 font-bold">No payout history yet.</Text>
                            </View>
                        ) : (
                            payouts?.map((payout, idx) => (
                                <MotiView
                                    key={payout.id}
                                    from={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'timing', duration: 500, delay: idx * 100 }}
                                    className="mb-4 bg-white/80 dark:bg-slate-900/80 p-5 rounded-[28px] border-2 border-slate-50 dark:border-slate-800 shadow-sm flex-row items-center"
                                >
                                    <View className={cn(
                                        "h-12 w-12 rounded-2xl items-center justify-center mr-4",
                                        payout.status === 'completed' ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-amber-50 dark:bg-amber-900/20"
                                    )}>
                                        {payout.status === 'completed' ? <ArrowDownLeft size={20} color="#10b981" /> : <Clock size={20} color="#f59e0b" />}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-black text-slate-900 dark:text-white">
                                            {payout.status === 'completed' ? 'Payout Success' : 'Pending Request'}
                                        </Text>
                                        <Text className="text-xs text-slate-500 font-bold">
                                            {new Date(payout.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-base font-black text-slate-900 dark:text-white">KES {payout.amount?.toLocaleString()}</Text>
                                        <Text className={cn(
                                            "text-[8px] font-black uppercase tracking-widest",
                                            payout.status === 'completed' ? "text-emerald-500" : "text-amber-500"
                                        )}>{payout.status}</Text>
                                    </View>
                                </MotiView>
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
