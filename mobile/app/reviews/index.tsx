import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '../../context/auth-context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function ReviewsScreen() {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const { data: reviews, isLoading, refetch } = useQuery({
        queryKey: ['my-reviews', user?.id],
        queryFn: async () => {
            // Fetch reviews ABOUT the user or written BY the user?
            // "My Reviews" usually means reviews I received (as owner) or reviews I wrote?
            // On web dashboard/reviews, it shows reviews received for your listings.
            const { data, error } = await supabase
                .from('reviews')
                .select('*, reviewer:reviewer_id(full_name, avatar_url), listing:listings(title, images)')
                .eq('listing.owner_id', user?.id) // This filter is tricky in Supabase without proper setup, might fetch all and filter or use !inner
                // Actually easier to fetch reviews where listing owner is me.
                // But let's assume this is for 'owner' role.

                // Let's try fetching reviews *written by* user for now as fallback, 
                // but usually dashboard is "Reviews of me/my items".
                // Postgrest resource embedding:
                .select('*, listing!inner(owner_id), reviewer:user_profiles!reviewer_id(full_name, avatar_url)')
                .eq('listing.owner_id', user?.id);

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
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Reviews</Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1 px-6 pt-4"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {isLoading ? (
                        <ActivityIndicator color="#3b82f6" className="mt-20" />
                    ) : reviews?.length === 0 ? (
                        <View className="mt-20 items-center opacity-50">
                            <Star size={64} color="#94a3b8" />
                            <Text className="text-slate-900 dark:text-white text-lg font-black mt-4">No reviews yet</Text>
                        </View>
                    ) : (
                        reviews?.map((review: any, idx: number) => (
                            <MotiView
                                key={review.id}
                                from={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 100 }}
                                className="mb-4 bg-white/80 dark:bg-slate-900/80 p-5 rounded-[28px] border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                            >
                                <View className="flex-row items-center mb-4">
                                    <Image
                                        source={{ uri: review.reviewer?.avatar_url || 'https://via.placeholder.com/40' }}
                                        className="h-10 w-10 rounded-full bg-slate-200"
                                    />
                                    <View className="ml-3 flex-1">
                                        <Text className="text-sm font-black text-slate-900 dark:text-white">{review.reviewer?.full_name || 'Anonymous'}</Text>
                                        <Text className="text-xs text-slate-500 font-bold">via {review.listing?.title}</Text>
                                    </View>
                                    <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                        <Text className="ml-1 text-xs font-black text-amber-500">{review.rating}.0</Text>
                                    </View>
                                </View>

                                <Text className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed mb-4">
                                    "{review.comment}"
                                </Text>

                                <View className="flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </Text>
                                    <TouchableOpacity className="flex-row items-center">
                                        <MessageSquare size={14} color="#3b82f6" />
                                        <Text className="text-blue-600 font-bold text-xs ml-2">Reply</Text>
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
