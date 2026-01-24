import React, { useMemo } from 'react';
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
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

function isUuid(str: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

export default function CategoryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // State
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | undefined>();
    const debouncedSearch = useDebounce(searchQuery, 500);

    // 1. Fetch ALL categories fast
    const { data: categories, isLoading: catsLoading } = useCategories();

    // 2. Resolve the "real" UUID from the param (which could be 'vehicles' or a UUID)
    const currentCategory = useMemo(() => {
        if (!categories || !id) return null;

        // Try direct UUID match
        const directMatch = categories.find((c: any) => c.id === id);
        if (directMatch) return directMatch;

        // Try Slug/Name match (e.g. 'living-spaces', 'vehicles')
        const normalizedId = id.toLowerCase().trim();
        return categories.find((c: any) => {
            const name = c.name.toLowerCase();
            const slug = c.slug?.toLowerCase(); // if slug exists
            // Check exact name, or slug, or basic kebab-case match
            return (
                name === normalizedId ||
                slug === normalizedId ||
                name.replace(/\s+/g, '-').replace('&', 'and') === normalizedId ||
                name.replace(/\s+/g, '-').replace('&', '').replace('--', '-') === normalizedId || // Handle "Equipment & Tools" -> "equipment-tools" vs "equipment-and-tools"
                name.split(' ')[0] === normalizedId // Handle "Living Spaces" -> "living"
            );
        });
    }, [categories, id]);

    // If we resolved a category, use its ID. Otherwise, if the original param was a UUID, use that.
    const resolvedId = currentCategory?.id || (id && isUuid(id) ? id : undefined);

    // 3. Fetch subcategories and listings using the RESOLVED ID
    const { data: subcategories, isLoading: subsLoading } = useSubcategories(resolvedId);
    const { data: listings, isLoading: listingsLoading } = useListings(resolvedId, debouncedSearch, selectedSubcategory);

    // Loading state while resolving category
    if (catsLoading && !currentCategory) {
        return (
            <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center">
                <BackgroundGradient />
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-slate-500 mt-4 font-bold">Finding Category...</Text>
            </View>
        );
    }

    if (!resolvedId && !catsLoading) {
        return (
            <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center p-8">
                <BackgroundGradient />
                <Text className="text-xl font-black text-slate-900 dark:text-white mb-2">Category Not Found</Text>
                <Text className="text-slate-500 text-center mb-6">We couldn't find the category "{id}".</Text>
                <TouchableOpacity onPress={() => router.back()} className="bg-slate-900 dark:bg-white px-6 py-3 rounded-full">
                    <Text className="text-white dark:text-slate-900 font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                                className="mr-3 mb-4 items-center"
                                style={{ width: 100 }}
                            >
                                <View className={cn(
                                    "h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border mb-2 items-center justify-center",
                                    !selectedSubcategory
                                        ? "border-orange-500 border-2"
                                        : "border-slate-200 dark:border-slate-800"
                                )}>
                                    <View className={cn("h-10 w-10 rounded-full items-center justify-center", !selectedSubcategory ? "bg-orange-500" : "bg-slate-200 dark:bg-slate-700")}>
                                        <SlidersHorizontal size={18} color={!selectedSubcategory ? "white" : "#94a3b8"} />
                                    </View>
                                </View>
                                <Text className={cn(
                                    "text-center text-[10px] uppercase tracking-wider font-bold",
                                    !selectedSubcategory
                                        ? "text-orange-500"
                                        : "text-slate-600 dark:text-slate-400"
                                )}>
                                    All
                                </Text>
                            </TouchableOpacity>

                            {subsLoading ? (
                                <ActivityIndicator size="small" color="#f97316" />
                            ) : (
                                subcategories?.map((sub: any) => {
                                    const Icon = sub.icon ? getIcon(sub.icon) : null;

                                    return (
                                        <TouchableOpacity
                                            key={sub.id}
                                            onPress={() => setSelectedSubcategory(sub.id === selectedSubcategory ? undefined : sub.id)}
                                            className="mr-3 mb-4 items-center"
                                            style={{ width: 100 }}
                                        >
                                            <View className={cn(
                                                "h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border mb-2",
                                                selectedSubcategory === sub.id
                                                    ? "border-orange-500 border-2"
                                                    : "border-slate-200 dark:border-slate-800"
                                            )}>
                                                {sub.image_url ? (
                                                    <Image source={{ uri: sub.image_url }} className="w-full h-full" resizeMode="cover" />
                                                ) : (
                                                    <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
                                                        {Icon ? <Icon size={32} color={selectedSubcategory === sub.id ? "#f97316" : "#94a3b8"} /> : <Text className="text-slate-400">?</Text>}
                                                    </View>
                                                )}

                                                {/* Selected Overlay */}
                                                {selectedSubcategory === sub.id && (
                                                    <View className="absolute inset-0 bg-orange-500/20" />
                                                )}
                                            </View>
                                            <Text className={cn(
                                                "text-center text-[10px] uppercase tracking-wider font-bold h-8",
                                                selectedSubcategory === sub.id
                                                    ? "text-orange-500"
                                                    : "text-slate-600 dark:text-slate-400"
                                            )} numberOfLines={2}>
                                                {sub.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
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
                </ScrollView >
            </SafeAreaView >
        </View >
    );
}

