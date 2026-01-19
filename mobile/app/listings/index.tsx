import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useOwnerListings } from '@/lib/hooks/useData';
import { useAuth } from '../../context/auth-context';
import { useRouter } from 'expo-router';
import { MapPin, Star, Plus } from 'lucide-react-native';

export default function MyListingsScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: listings, isLoading } = useOwnerListings(user?.id || '');

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <BackButton />
                    <Text className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">My Listings</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/listings/create')}
                        className="bg-orange-500 rounded-full h-8 w-8 items-center justify-center shadow-sm"
                    >
                        <Plus size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#f97316" />
                    </View>
                ) : (
                    <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 100 }}>
                        {listings?.length === 0 ? (
                            <View className="items-center justify-center py-20 opacity-70">
                                <Text className="text-slate-900 dark:text-white font-bold text-center">No listings yet.</Text>
                                <Text className="text-slate-500 dark:text-slate-400 text-xs text-center mt-2">Start earning by posting your gear!</Text>
                            </View>
                        ) : (
                            listings?.map((listing: any) => (
                                <TouchableOpacity
                                    key={listing.id}
                                    onPress={() => router.push(`/listings/${listing.id}`)}
                                    className="mb-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
                                >
                                    <View className="flex-row">
                                        <View className="w-32 h-32 bg-slate-200 dark:bg-slate-800">
                                            {listing.images?.[0] ? (
                                                <Image
                                                    source={{ uri: listing.images[0].startsWith('http') ? listing.images[0] : `https://ixivvshatmsisntomvpx.supabase.co/storage/v1/object/public/listing-images/${listing.images[0]}` }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="w-full h-full items-center justify-center">
                                                    <Text className="text-[10px] text-slate-400 font-bold uppercase">No Image</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="flex-1 p-4 justify-between">
                                            <View>
                                                <View className="flex-row justify-between items-start">
                                                    <Text className="text-sm font-black text-slate-900 dark:text-white flex-1 mr-2" numberOfLines={2}>{listing.title}</Text>
                                                    <View className={`px-2 py-0.5 rounded-full ${listing.status === 'active' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                                        <Text className={`text-[8px] font-black uppercase ${listing.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>{listing.status}</Text>
                                                    </View>
                                                </View>
                                                <View className="flex-row items-center mt-2">
                                                    <MapPin size={12} color="#94a3b8" />
                                                    <Text className="text-xs text-slate-500 ml-1" numberOfLines={1}>{listing.location_name || 'Nairobi'}</Text>
                                                </View>
                                            </View>

                                            <View className="flex-row items-center justify-between mt-2">
                                                <Text className="text-orange-500 font-black text-sm">KES {listing.price_per_day?.toLocaleString()}<Text className="text-slate-400 text-[10px] font-normal">/day</Text></Text>
                                                <View className="flex-row items-center">
                                                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                                                    <Text className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">{listing.rating_average || 'N/A'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
