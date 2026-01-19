import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, MapPin, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useCategories, useSubcategories, useListings } from '@/lib/hooks/useData';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { getIcon } from '@/lib/icon-mapping';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

export default function CategoryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // State
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | undefined>();
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Data Hooks
    const { data: categories } = useCategories();
    const { data: subcategories, isLoading: subsLoading } = useSubcategories(id);
    const { data: listings, isLoading: listingsLoading } = useListings(id, debouncedSearch, selectedSubcategory);

    const currentCategory = categories?.find((c: any) => c.id === id);

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mr-4"
                    >
                        <ChevronLeft size={20} color={isDark ? "white" : "black"} />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-lg font-black text-slate-900 dark:text-white">
                            {currentCategory?.name || 'Category'}
                        </Text>
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Explore listings
                        </Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Search Bar */}
                    <View className="px-6 mt-6 mb-2">
                        <View className="bg-white/95 dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-row items-center px-5 h-14">
                            <Search size={20} color="#94a3b8" />
                            <TextInput
                                placeholder={`Search in ${currentCategory?.name || 'category'}...`}
                                placeholderTextColor="#94a3b8"
                                className="flex-1 ml-3 text-slate-900 dark:text-white font-bold text-sm h-full"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 ? (
                                <TouchableOpacity onPress={() => setSearchQuery('')} className="p-2">
                                    <X size={18} color="#94a3b8" />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>

                    {/* Subcategories Horizontal Scroll */}
                    <View className="mt-6 mb-2">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                        >
                            <TouchableOpacity
                                onPress={() => setSelectedSubcategory(undefined)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full border mb-4",
                                    !selectedSubcategory
                                        ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                )}
                            >
                                <Text className={cn(
                                    "font-bold text-xs uppercase tracking-wider",
                                    !selectedSubcategory
                                        ? "text-white dark:text-slate-900"
                                        : "text-slate-600 dark:text-slate-400"
                                )}>
                                    All
                                </Text>
                            </TouchableOpacity>

                            {subsLoading ? (
                                <ActivityIndicator size="small" color="#f97316" />
                            ) : (
                                subcategories?.map((sub: any) => (
                                    <TouchableOpacity
                                        key={sub.id}
                                        onPress={() => setSelectedSubcategory(sub.id === selectedSubcategory ? undefined : sub.id)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full border mb-4",
                                            selectedSubcategory === sub.id
                                                ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white"
                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        )}
                                    >
                                        <Text className={cn(
                                            "font-bold text-xs uppercase tracking-wider",
                                            selectedSubcategory === sub.id
                                                ? "text-white dark:text-slate-900"
                                                : "text-slate-600 dark:text-slate-400"
                                        )}>
                                            {sub.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>

                    {/* Listings Grid */}
                    <View className="px-6">
                        <Text className="text-xl font-black text-slate-900 dark:text-white mb-4">
                            {listings?.length || 0} Listings Found
                        </Text>

                        {listingsLoading ? (
                            <View className="py-20">
                                <ActivityIndicator size="large" color="#f97316" />
                            </View>
                        ) : listings && listings.length > 0 ? (
                            listings.map((listing: any) => (
                                <TouchableOpacity
                                    key={listing.id}
                                    onPress={() => router.push(`/listings/${listing.id}`)}
                                    className="mb-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
                                >
                                    <View className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 relative">
                                        {listing.images?.[0] ? (
                                            <Image
                                                source={{ uri: listing.images[0].startsWith('http') ? listing.images[0] : `https://ixivvshatmsisntomvpx.supabase.co/storage/v1/object/public/listing-images/${listing.images[0]}` }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                                alt={listing.title}
                                            />
                                        ) : (
                                            <View className="items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                                <Text className="text-slate-400 font-black tracking-widest uppercase text-lg">Leli Premium</Text>
                                            </View>
                                        )}

                                        {/* Overlay Badges */}
                                        <View className="absolute top-4 left-4 flex-row gap-2">
                                            {listing.is_verified && (
                                                <View className="bg-emerald-500 px-3 py-1.5 rounded-xl">
                                                    <Text className="text-[10px] font-black text-white uppercase tracking-widest">Verified</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View className="p-6">
                                        <View className="flex-row items-baseline justify-between mb-3">
                                            <View className="flex-row items-baseline">
                                                <Text className="text-xl font-black text-[#f97316]">KES {listing.price_per_day?.toLocaleString()}</Text>
                                                <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">/ day</Text>
                                            </View>
                                            <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                                <Star size={12} color="#f59e0b" fill="#f59e0b" />
                                                <Text className="text-xs font-black text-slate-900 dark:text-white ml-1">{listing.rating_average || '5.0'}</Text>
                                            </View>
                                        </View>

                                        <Text className="text-lg font-black text-slate-900 dark:text-white mb-2" numberOfLines={1}>{listing.title}</Text>

                                        <View className="flex-row items-center">
                                            <MapPin size={14} color="#64748b" />
                                            <Text className="text-sm text-slate-500 font-bold ml-1">{listing.location_name || 'Nairobi'}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View className="py-20 items-center justify-center">
                                <Text className="text-slate-400 font-bold text-center">No listings found in this category.</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
