import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Clock, Calendar, ChevronRight, Package, MapPin, CheckCircle2, XCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function MyBookingsScreen() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['my-bookings', user?.id, activeTab],
        queryFn: async () => {
            const field = activeTab === 'renter' ? 'renter_id' : 'owner_id';
            const { data, error } = await supabase
                .from('bookings')
                .select('*, listings(*)')
                .eq(field, user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600', icon: CheckCircle2 };
            case 'pending': return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600', icon: Clock };
            case 'cancelled': return { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600', icon: XCircle };
            default: return { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600', icon: Package };
        }
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">My Bookings</Text>
                    </View>
                </View>

                {/* Tab Switcher */}
                <View className="px-8 mt-4">
                    <View className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[24px] flex-row">
                        <TouchableOpacity
                            onPress={() => setActiveTab('renter')}
                            className={cn("flex-1 py-3 rounded-[20px] items-center", activeTab === 'renter' ? "bg-white shadow-sm" : "")}
                        >
                            <Text className={cn("font-black text-xs", activeTab === 'renter' ? "text-slate-900" : "text-slate-500")}>As Renter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('owner')}
                            className={cn("flex-1 py-3 rounded-[20px] items-center", activeTab === 'owner' ? "bg-white shadow-sm" : "")}
                        >
                            <Text className={cn("font-black text-xs", activeTab === 'owner' ? "text-slate-900" : "text-slate-500")}>As Owner</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <ActivityIndicator color="#3b82f6" className="mt-20" />
                    ) : bookings?.length === 0 ? (
                        <View className="mt-20 items-center">
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="h-32 w-32 bg-slate-50 dark:bg-slate-900 rounded-full items-center justify-center mb-6"
                            >
                                <Calendar size={48} color="#94a3b8" />
                            </MotiView>
                            <Text className="text-slate-900 dark:text-white text-xl font-black mb-2">No bookings yet</Text>
                            <Text className="text-slate-500 font-bold text-center">Your rental history will appear here.</Text>
                        </View>
                    ) : (
                        bookings?.map((booking, idx) => {
                            const status = getStatusStyle(booking.status);
                            return (
                                <MotiView
                                    key={booking.id}
                                    from={{ opacity: 0, translateY: 20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ type: 'timing', duration: 500, delay: idx * 50 }}
                                    className="mb-6 bg-white/80 dark:bg-slate-900/80 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 overflow-hidden shadow-sm"
                                >
                                    <View className="p-6">
                                        <View className="flex-row items-center justify-between mb-4">
                                            <View className={cn("px-4 py-1.5 rounded-full flex-row items-center", status.bg)}>
                                                <status.icon size={12} color={status.text === 'text-emerald-600' ? '#10b981' : status.text === 'text-amber-600' ? '#f59e0b' : '#ef4444'} />
                                                <Text className={cn("ml-1.5 text-[10px] font-black uppercase tracking-wider", status.text)}>
                                                    {booking.status}
                                                </Text>
                                            </View>
                                            <Text className="text-xs text-slate-400 font-bold">#{booking.id.split('-')[0].toUpperCase()}</Text>
                                        </View>

                                        <View className="flex-row gap-4 mb-6">
                                            <View className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden">
                                                {booking.listings?.images?.[0] ? null : <Package size={24} color="#94a3b8" className="m-auto" />}
                                            </View>
                                            <View className="flex-1 justify-center">
                                                <Text className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1">{booking.listings?.title}</Text>
                                                <View className="flex-row items-center">
                                                    <Calendar size={12} color="#94a3b8" />
                                                    <Text className="text-xs text-slate-500 font-bold ml-1">
                                                        {format(new Date(booking.start_date), 'MMM d')} - {format(new Date(booking.end_date), 'MMM d, yyyy')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View className="h-px bg-slate-50 dark:bg-slate-800 mb-4" />

                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Amount</Text>
                                                <Text className="text-lg font-black text-slate-900 dark:text-white">KES {booking.total_price?.toLocaleString()}</Text>
                                            </View>
                                            <TouchableOpacity className="bg-slate-50 dark:bg-slate-800 h-12 w-12 rounded-2xl items-center justify-center">
                                                <ChevronRight size={20} color="#64748b" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </MotiView>
                            );
                        })
                    )}
                    <View className="h-32" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
