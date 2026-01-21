import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Receipt, Calendar, CreditCard, ChevronDown, Download } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function PaymentsScreen() {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const { data: payments, isLoading, refetch } = useQuery({
        queryKey: ['my-payments', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id
    });

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Payment History</Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1 px-6 pt-4"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {isLoading ? (
                        <ActivityIndicator color="#3b82f6" className="mt-20" />
                    ) : payments?.length === 0 ? (
                        <View className="mt-20 items-center opacity-50">
                            <Receipt size={64} color="#94a3b8" />
                            <Text className="text-slate-900 dark:text-white text-lg font-black mt-4">No payments yet</Text>
                        </View>
                    ) : (
                        payments?.map((payment, idx) => (
                            <MotiView
                                key={payment.id}
                                from={{ opacity: 0, translateY: 10 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: idx * 100 }}
                                className="mb-4 bg-white/80 dark:bg-slate-900/80 p-5 rounded-[28px] border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                            >
                                <View className="flex-row justify-between mb-4">
                                    <View className="flex-row items-center">
                                        <View className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl items-center justify-center mr-3">
                                            <CreditCard size={18} color="#3b82f6" />
                                        </View>
                                        <View>
                                            <Text className="text-sm font-black text-slate-900 dark:text-white capitalize">
                                                {payment.transaction_type.replace('_', ' ')}
                                            </Text>
                                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-base font-black text-slate-900 dark:text-white">
                                            {payment.currency} {payment.amount.toLocaleString()}
                                        </Text>
                                        <View className={cn(
                                            "px-2 py-0.5 rounded-full mt-1",
                                            payment.status === 'completed' ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                                        )}>
                                            <Text className={cn(
                                                "text-[8px] font-black uppercase tracking-widest",
                                                payment.status === 'completed' ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                                            )}>{payment.status}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="pt-4 border-t border-slate-100 dark:border-slate-800 flex-row justify-between items-center">
                                    <Text className="text-xs text-slate-400 font-mono">{payment.id.substring(0, 8)}...</Text>
                                    <TouchableOpacity className="flex-row items-center">
                                        <Download size={14} color="#3b82f6" />
                                        <Text className="text-blue-600 font-bold text-xs ml-2">Receipt</Text>
                                    </TouchableOpacity>
                                </View>
                            </MotiView>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
