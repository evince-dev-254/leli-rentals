import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Trash2 } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationCard } from '@/components/notifications/notification-card';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KejapinColors } from '@/constants/Colors';
import { cn } from '@/lib/utils';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export default function NotificationsScreen() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [refreshing, setRefreshing] = useState(false);

    const { data: notifications, isLoading, refetch } = useQuery({
        queryKey: ['notifications', user?.id, filter],
        queryFn: async () => {
            let query = supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (filter === 'unread') {
                query = query.eq('is_read', false);
            }

            const { data, error } = await query.limit(50);
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id
    });

    // Supabase Realtime Subscription
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`user-notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    console.log('Notification change received:', payload);
                    queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    // Deep Linking Handling
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data?.route) {
                router.push({
                    pathname: data.route as any,
                    params: (data.metadata || {}) as any
                });
            }
        });

        return () => subscription.remove();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        // Optimistic update or refetch
        queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    };

    const deleteNotification = async (id: string) => {
        await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    };

    const clearAll = async () => {
        if (!user?.id) return;
        await supabase
            .from('notifications')
            .delete()
            .eq('user_id', user.id);

        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View style={styles.header}>
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-2xl font-black text-slate-900 dark:text-white">Inbox</Text>
                    </View>
                    <TouchableOpacity
                        onPress={clearAll}
                        style={styles.clearButton}
                    >
                        <Trash2 size={20} color={KejapinColors.error} />
                    </TouchableOpacity>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    {['all', 'unread'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f as any)}
                            style={[
                                styles.filterTab,
                                filter === f ? styles.filterTabActive : styles.filterTabInactive
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                filter === f ? styles.filterTextActive : styles.filterTextInactive
                            ]}>
                                {f}
                            </Text>
                            {f === 'unread' && notifications?.some(n => !n.is_read) && (
                                <View style={styles.unreadBadge} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={KejapinColors.secondary}
                        />
                    }
                >
                    {isLoading ? (
                        <ActivityIndicator color={KejapinColors.secondary} className="mt-20" />
                    ) : notifications?.length === 0 ? (
                        <View className="mt-20 items-center">
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={styles.emptyIconContainer}
                            >
                                <Bell size={48} color="#94a3b8" />
                            </MotiView>
                            <Text className="text-slate-900 dark:text-white text-xl font-black mb-2">Clean Slate!</Text>
                            <Text className="text-slate-500 font-bold text-center">No notifications found here.</Text>
                        </View>
                    ) : (
                        <AnimatePresence>
                            {notifications?.map((item, idx) => (
                                <NotificationCard
                                    key={item.id}
                                    index={idx}
                                    {...item}
                                    onMarkAsRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                    <View className="h-20" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 12,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    clearButton: {
        height: 44,
        width: 44,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 8,
        gap: 12,
    },
    filterTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
    },
    filterTabActive: {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
    },
    filterTabInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    filterText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    filterTextActive: {
        color: '#ffffff',
    },
    filterTextInactive: {
        color: '#64748b',
    },
    unreadBadge: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: KejapinColors.secondary,
        marginLeft: 8,
    },
    emptyIconContainer: {
        height: 120,
        width: 120,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    }
});
