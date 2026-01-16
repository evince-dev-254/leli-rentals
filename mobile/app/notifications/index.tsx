import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell, Info, CheckCircle2, AlertTriangle, ChevronRight, X, Trash2 } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function NotificationsScreen() {
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const { data: notifications, isLoading, refetch } = useQuery({
        queryKey: ['notifications', user?.id, filter],
        queryFn: async () => {
            let query = supabase
                .from('platform_notifications')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (filter === 'unread') {
                query = query.eq('status', 'unread');
            }

            const { data, error } = await query.limit(50);
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return { icon: CheckCircle2, color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
            case 'warning': return { icon: AlertTriangle, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20' };
            default: return { icon: Info, color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20' };
        }
    };

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('platform_notifications')
            .update({ status: 'read' })
            .eq('id', id);

        if (!error) refetch();
    };

    const deleteNotification = async (id: string) => {
        const { error } = await supabase
            .from('platform_notifications')
            .delete()
            .eq('id', id);

        if (!error) refetch();
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Notifications</Text>
                    </View>
                    <TouchableOpacity onPress={() => { }} className="h-10 w-10 bg-white/80 dark:bg-slate-900/80 rounded-2xl items-center justify-center border border-slate-50 dark:border-slate-800">
                        <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                {/* Filter */}
                <View className="px-8 mt-4 flex-row gap-2">
                    {['all', 'unread'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f as any)}
                            className={cn(
                                "px-6 py-2 rounded-full border-2",
                                filter === f ? "bg-slate-900 border-slate-900" : "bg-white/80 dark:bg-slate-900/80 border-slate-50 dark:border-slate-800"
                            )}
                        >
                            <Text className={cn("text-[10px] font-black uppercase tracking-widest", filter === f ? "text-white" : "text-slate-500")}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <ActivityIndicator color="#3b82f6" className="mt-20" />
                    ) : notifications?.length === 0 ? (
                        <View className="mt-20 items-center">
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="h-32 w-32 bg-slate-50 dark:bg-slate-900 rounded-full items-center justify-center mb-6"
                            >
                                <Bell size={48} color="#94a3b8" />
                            </MotiView>
                            <Text className="text-slate-900 dark:text-white text-xl font-black mb-2">All caught up!</Text>
                            <Text className="text-slate-500 font-bold text-center">No new notifications to show.</Text>
                        </View>
                    ) : (
                        <AnimatePresence>
                            {notifications?.map((item, idx) => {
                                const theme = getIcon(item.type);
                                return (
                                    <MotiView
                                        key={item.id}
                                        from={{ opacity: 0, translateX: -20 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ type: 'timing', duration: 400, delay: idx * 50 }}
                                        className={cn(
                                            "mb-4 bg-white/80 dark:bg-slate-900/80 p-5 rounded-[28px] border-2 shadow-sm flex-row items-start",
                                            item.status === 'unread' ? "border-blue-100 dark:border-blue-900/30" : "border-slate-50 dark:border-slate-800"
                                        )}
                                    >
                                        <View className={cn("h-12 w-12 rounded-2xl items-center justify-center mr-4", theme.bg)}>
                                            <theme.icon size={22} color={theme.color} />
                                        </View>
                                        <View className="flex-1">
                                            <View className="flex-row items-center justify-between mb-1">
                                                <Text className="text-xs font-black text-slate-900 dark:text-white leading-tight pr-4">
                                                    {item.title}
                                                </Text>
                                                {item.status === 'unread' && <View className="h-2 w-2 rounded-full bg-blue-500" />}
                                            </View>
                                            <Text className="text-[11px] text-slate-500 font-bold leading-4 mb-2">
                                                {item.message}
                                            </Text>
                                            <Text className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => item.status === 'unread' ? markAsRead(item.id) : deleteNotification(item.id)}
                                            className="ml-2 mt-2"
                                        >
                                            <X size={14} color="#94a3b8" />
                                        </TouchableOpacity>
                                    </MotiView>
                                );
                            })}
                        </AnimatePresence>
                    )}
                    <View className="h-32" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
