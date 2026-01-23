import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/components/theme-provider';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { CreditCard, ChevronLeft, Plus, Trash2, ShieldCheck, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function SavedCardsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch cards from metadata or a dedicated table
    // For now, let's assume we store them in user_profiles.payment_info.saved_cards
    const { data: profile, isLoading, refetch } = useQuery({
        queryKey: ['user-cards', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('payment_info')
                .eq('id', user?.id)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });

    const savedCards = (profile?.payment_info as any)?.saved_cards || [];

    const handleDeleteCard = async (cardId: string) => {
        Alert.alert(
            "Remove Card",
            "Are you sure you want to remove this payment method?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        setDeletingId(cardId);
                        try {
                            const newCards = savedCards.filter((c: any) => c.id !== cardId);
                            const { error } = await supabase
                                .from('user_profiles')
                                .update({
                                    payment_info: {
                                        ...(profile?.payment_info as any),
                                        saved_cards: newCards
                                    }
                                })
                                .eq('id', user?.id);

                            if (error) throw error;
                            refetch();
                        } catch (error) {
                            console.error('Error deleting card:', error);
                            Alert.alert('Error', 'Failed to remove card.');
                        } finally {
                            setDeletingId(null);
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center">
                <ActivityIndicator size="large" color="#ec4899" />
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
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">Payment Methods</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6">
                    <View className="mt-8 mb-6">
                        <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 px-2">
                            Your Saved Cards
                        </Text>

                        {savedCards.length === 0 ? (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-50 dark:bg-slate-900 p-12 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800 items-center justify-center"
                            >
                                <CreditCard size={48} color="#94a3b8" strokeWidth={1} />
                                <Text className="text-slate-400 font-bold mt-4 text-center">No cards saved yet</Text>
                            </MotiView>
                        ) : (
                            savedCards.map((card: any, index: number) => (
                                <MotiView
                                    key={card.id}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ delay: index * 100 }}
                                    className={cn(
                                        "mb-6 p-6 rounded-[32px] relative overflow-hidden shadow-lg",
                                        card.type === 'visa' ? "bg-slate-900" : "bg-blue-600"
                                    )}
                                >
                                    <View className="flex-row justify-between items-start mb-10">
                                        <View>
                                            <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Card Holder</Text>
                                            <Text className="text-white font-bold">{card.holder}</Text>
                                        </View>
                                        <View className="flex-row gap-2">
                                            {card.is_default && (
                                                <View className="bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">
                                                    <Text className="text-emerald-400 text-[8px] font-black uppercase tracking-widest">Default</Text>
                                                </View>
                                            )}
                                            <TouchableOpacity
                                                onPress={() => handleDeleteCard(card.id)}
                                                disabled={deletingId === card.id}
                                            >
                                                <Trash2 size={18} color="rgba(255,255,255,0.4)" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <Text className="text-white text-2xl font-black mb-6 tracking-[0.2em]">
                                        ••••  ••••  ••••  {card.last4}
                                    </Text>

                                    <View className="flex-row justify-between items-end">
                                        <View>
                                            <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Expires</Text>
                                            <Text className="text-white font-bold">{card.expiry}</Text>
                                        </View>
                                        <Text className="text-white/60 font-black italic text-lg">{card.type.toUpperCase()}</Text>
                                    </View>

                                    <View className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/5 rounded-full" />
                                </MotiView>
                            ))
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => alert('New card integration will launch in the next update!')}
                        className="h-16 bg-white dark:bg-slate-900 rounded-[28px] border-2 border-slate-100 dark:border-slate-800 flex-row items-center justify-center shadow-sm"
                    >
                        <Plus size={20} color="#ec4899" className="mr-2" />
                        <Text className="text-slate-900 dark:text-white font-black ml-2">Add New Payment Method</Text>
                    </TouchableOpacity>

                    <View className="mt-12 p-6 rounded-[32px] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 flex-row items-center">
                        <View className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl items-center justify-center mr-4">
                            <ShieldCheck size={20} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-emerald-900 dark:text-emerald-100 font-black text-xs uppercase tracking-widest">Bank-Level Security</Text>
                            <Text className="text-emerald-600/80 dark:text-emerald-400/80 text-[10px] font-bold">Your payment data is encrypted and handled by Paystack.</Text>
                        </View>
                    </View>

                    <View className="h-20" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
