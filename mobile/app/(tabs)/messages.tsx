import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useConversations } from '@/lib/hooks/useData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Make sure this exists or remove if not needed for simple styles

export default function MessagesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: conversations, isLoading, refetch } = useConversations(user?.id || '');

    const renderItem = ({ item }: { item: any }) => {
        const otherUser = item.otherUser;
        const lastMsg = item.lastMessage;
        const time = lastMsg ? new Date(lastMsg.created_at) : new Date(item.created_at || new Date());

        // Formatting time: "10:30 AM" if today, "Jan 20" if older
        const timeString = format(time, 'MMM d, h:mm a');

        return (
            <TouchableOpacity
                onPress={() => router.push(`/chat/${item.id}`)}
                className="flex-row items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 mb-2 rounded-2xl mx-4"
            >
                {/* Avatar */}
                <View className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mr-4 items-center justify-center border border-slate-100 dark:border-slate-700">
                    {otherUser?.avatar_url ? (
                        <Image source={{ uri: otherUser.avatar_url }} className="h-full w-full" />
                    ) : (
                        <User size={24} color="#94a3b8" />
                    )}
                </View>

                {/* Content */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-bold text-slate-900 dark:text-white text-base" numberOfLines={1}>
                            {otherUser?.full_name || 'Unknown User'}
                        </Text>
                        <Text className="text-xs text-slate-400 font-medium">
                            {timeString}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Text className={cn(
                            "text-sm flex-1 mr-2",
                            lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user?.id
                                ? "font-bold text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                        )} numberOfLines={1}>
                            {lastMsg?.content || 'Started a conversation'}
                        </Text>
                        {lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user?.id && (
                            <View className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        )}
                    </View>

                    {/* Optional: Listing Title Context */}
                    {item.listing?.title && (
                        <Text className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                            {item.listing.title}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const EmptyState = () => (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 items-center justify-center py-20 px-8"
        >
            <View className="h-32 w-32 rounded-[40px] bg-white/80 dark:bg-slate-900/80 items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-xl mb-6">
                <MessageCircle size={48} color="#3b82f6" fill="#3b82f6" opacity={0.2} />
            </View>

            <Text className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">No Messages Yet</Text>
            <Text className="text-slate-400 text-center font-bold text-sm mb-8 leading-relaxed">
                Connect with owners or renters to discuss bookings and gear.
            </Text>

            <Button
                title="Browse Gear"
                onPress={() => router.push('/(tabs)/')}
                className="w-full"
            />
        </MotiView>
    );

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 py-4 border-b border-purple-500/10 mb-2">
                    <Text className="text-3xl font-black text-slate-900 dark:text-white">Messages</Text>
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <MotiView
                            from={{ rotate: '0deg' }}
                            animate={{ rotate: '360deg' }}
                            transition={{ loop: true, type: 'timing', duration: 1000 }}
                        >
                            <MessageCircle size={32} color="#3b82f6" />
                        </MotiView>
                    </View>
                ) : (
                    <FlatList
                        data={conversations || []}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        ListEmptyComponent={EmptyState}
                        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3b82f6" />
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
