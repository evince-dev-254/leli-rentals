import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Share, Heart, MapPin, ShieldCheck, Clock, Star, MessageCircle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useListingDetail } from '../../lib/hooks/useData';
import { useColorScheme } from '@/components/useColorScheme';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { data: listing, isLoading } = useListingDetail(id as string);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
                <ActivityIndicator color="#3b82f6" />
            </View>
        );
    }

    if (!listing) return null;

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Image Section */}
                <View className="h-[400px] bg-slate-200 dark:bg-slate-900 relative">
                    {/* Header Overlay */}
                    <SafeAreaView className="absolute top-0 left-0 right-0 z-10 px-6 pt-4 flex-row justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center"
                        >
                            <ChevronLeft color="white" size={24} />
                        </TouchableOpacity>
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                                <Share color="white" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                                <Heart color="white" size={20} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    {/* Image Placeholder */}
                    <View className="items-center justify-center h-full">
                        <Text className="text-white/40 font-black text-4xl uppercase tracking-[0.2em] transform -rotate-12">
                            Premium Gear
                        </Text>
                    </View>
                </View>

                {/* Content Section */}
                <View className="-mt-12 bg-white dark:bg-slate-950 rounded-t-[48px] px-8 pt-10 pb-32">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                            <Text className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{listing.categories?.name || 'Equipment'}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Star size={14} color="#f59e0b" fill="#f59e0b" />
                            <Text className="text-sm font-bold ml-1 text-slate-900 dark:text-white">{listing.average_rating || '5.0'}</Text>
                            <Text className="text-xs text-slate-400 ml-1">({listing.review_count || '0'} reviews)</Text>
                        </View>
                    </View>

                    <Text className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{listing.title}</Text>

                    <View className="flex-row items-center mt-3">
                        <MapPin size={16} color="#3b82f6" />
                        <Text className="text-sm text-slate-500 ml-1">{listing.location_name || 'Nairobi, Kenya'}</Text>
                    </View>

                    {/* Spec Cards */}
                    <View className="flex-row gap-4 mt-8">
                        <View className="flex-1 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 items-center">
                            <ShieldCheck size={24} color="#3b82f6" />
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-2">Verified</Text>
                        </View>
                        <View className="flex-1 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 items-center">
                            <Clock size={24} color="#3b82f6" />
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-2">Instant</Text>
                        </View>
                        <View className="flex-1 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 items-center">
                            <MessageCircle size={24} color="#3b82f6" />
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-2">Support</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mt-8">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">About this gear</Text>
                        <Text className="text-slate-500 leading-relaxed">
                            {listing.description}
                        </Text>
                    </View>

                    {/* Owner Card */}
                    <View className="mt-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 flex-row items-center border border-slate-100 dark:border-slate-800">
                        <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center">
                            <Text className="font-bold text-blue-600">{listing.owner?.full_name?.[0] || 'O'}</Text>
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-base font-bold text-slate-900 dark:text-white">{listing.owner?.full_name}</Text>
                            <Text className="text-xs text-slate-400">Verified Owner</Text>
                        </View>
                        <TouchableOpacity className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
                            <MessageCircle size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Booking Bar */}
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} className={`absolute bottom-0 left-0 right-0 px-8 py-6 pb-12 border-t border-slate-100 dark:border-slate-800 flex-row items-center justify-between`}>
                <View>
                    <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>KES {listing.price_per_day?.toLocaleString()}</Text>
                    <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">per day</Text>
                </View>
                <TouchableOpacity className="bg-blue-600 px-10 py-4 rounded-full shadow-lg shadow-blue-500/40">
                    <Text className="text-white font-black text-base">Book Now</Text>
                </TouchableOpacity>
            </BlurView>
        </View>
    );
}
