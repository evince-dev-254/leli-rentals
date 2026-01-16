import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator, Image, ImageSourcePropType } from 'react-native';
import { Search, MapPin, Bell, SlidersHorizontal, ArrowRight, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useColorScheme } from '@/components/useColorScheme';
import { useCategories, useListings } from '@/lib/hooks/useData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useDebounce } from '@/lib/hooks/useDebounce';

const { width } = Dimensions.get('window');

// Define asset sources directly for consistency
const LOGO_BLACK = require('../../assets/images/logo_black.png');
const LOGO_WHITE = require('../../assets/images/logo_white.png');

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(initialCategory);

  // Update category when param changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: listings, isLoading: listingsLoading } = useListings(selectedCategory, debouncedSearch);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <BackgroundGradient />
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        >
          {/* Header Section */}
          <View className="px-6 py-4 flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center">
                <MapPin size={14} color="#3b82f6" />
                <Text className="text-xs font-bold text-blue-600 ml-1 uppercase tracking-widest">Nairobi, Kenya</Text>
              </View>
              <Image
                source={isDark ? LOGO_WHITE : LOGO_BLACK}
                style={{ width: 120, height: 40, marginTop: 4 }}
                resizeMode="contain"
                alt="Leli Rentals Logo"
              />
            </View>
            <TouchableOpacity className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 items-center justify-center shadow-sm">
              <Bell size={20} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          <View className="px-6 pb-4">
            <BlurView intensity={isDark ? 30 : 50} tint={isDark ? 'dark' : 'light'} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-2 flex-row items-center overflow-hidden">
              <View className="flex-1 flex-row items-center px-2">
                <Search size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Search equipment..."
                  placeholderTextColor="#94a3b8"
                  className="flex-1 ml-2 text-slate-900 dark:text-white h-10"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                    <X size={16} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity className="bg-blue-600 h-10 w-10 rounded-xl items-center justify-center">
                <SlidersHorizontal size={18} color="white" />
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Categories */}
          <View className="mt-4">
            <View className="px-6 flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Categories</Text>
              <TouchableOpacity onPress={() => router.push('/services')}>
                <Text className="text-blue-600 text-sm font-bold">See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
              {catsLoading ? (
                <ActivityIndicator color="#3b82f6" />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(undefined)}
                    className="mr-4 items-center"
                  >
                    <View className={cn(
                      "h-16 w-16 rounded-3xl items-center justify-center shadow-sm border",
                      !selectedCategory ? "bg-blue-600 border-blue-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    )}>
                      <Text className={cn("text-2xl", !selectedCategory && "text-white")}>🌐</Text>
                    </View>
                    <Text className={cn(
                      "text-xs font-medium mt-2",
                      !selectedCategory ? "text-blue-600" : "text-slate-600 dark:text-slate-400"
                    )}>All</Text>
                  </TouchableOpacity>
                  {categories?.map((cat: any) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(prev => prev === cat.id ? undefined : cat.id)}
                      className="mr-4 items-center"
                    >
                      <View className={cn(
                        "h-16 w-16 rounded-3xl items-center justify-center shadow-sm border",
                        selectedCategory === cat.id ? "bg-blue-600 border-blue-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      )}>
                        <Text className="text-2xl">{cat.icon || '🛠️'}</Text>
                      </View>
                      <Text className={cn(
                        "text-xs font-medium mt-2",
                        selectedCategory === cat.id ? "text-blue-600" : "text-slate-600 dark:text-slate-400"
                      )}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              <View className="w-10" />
            </ScrollView>
          </View>

          {/* Hero Promotion */}
          <View className="px-6 mt-8">
            <View className="rounded-[32px] overflow-hidden relative">
              <View className="absolute inset-0 bg-blue-600" />
              <View className="p-8">
                <Text className="text-white text-3xl font-black leading-tight">Rent Anything,{"\n"}Anywhere.</Text>
                <Text className="text-white/70 text-sm mt-2 max-w-[200px]">Unlock the power of Kenya&apos;s largest peer-to-peer equipment marketplace.</Text>
                <TouchableOpacity className="mt-6 flex-row items-center bg-white self-start px-6 py-3 rounded-full">
                  <Text className="text-blue-600 font-bold mr-2">List Your Gear</Text>
                  <ArrowRight size={16} color="#2563eb" />
                </TouchableOpacity>
              </View>
              <MotiView
                from={{ scale: 1, opacity: 0.2 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ type: 'timing', duration: 3000, loop: true }}
                className="absolute -right-10 -bottom-10 h-40 w-40 bg-white rounded-full"
              />
            </View>
          </View>

          {/* Featured Listings */}
          <View className="px-6 mt-8 pb-32">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Featured Listings</Text>
            {listingsLoading ? (
              <ActivityIndicator color="#3b82f6" />
            ) : (
              listings?.map((listing: any) => (
                <TouchableOpacity
                  key={listing.id}
                  onPress={() => router.push(`/listings/${listing.id}`)}
                  className="mb-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                  <View className="h-48 bg-slate-200 dark:bg-slate-800 relative">
                    {listing.images?.[0] ? (
                      <Text className="m-auto text-slate-500">Image available</Text>
                    ) : (
                      <View className="items-center justify-center h-full">
                        <Text className="text-slate-500 font-mono tracking-widest uppercase">No Image</Text>
                      </View>
                    )}
                    <View className="absolute top-4 right-4 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full">
                      <Text className="text-xs font-bold text-slate-900">KES {listing.price_per_day?.toLocaleString()}/day</Text>
                    </View>
                  </View>
                  <View className="p-5">
                    <Text className="text-base font-bold text-slate-900 dark:text-white">{listing.title}</Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={12} color="#94a3b8" />
                      <Text className="text-xs text-slate-500 ml-1">{listing.location_name || 'Nairobi, Kenya'}</Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-4">
                      <View className="flex-row items-center">
                        <Text className="text-yellow-500 mr-1">⭐</Text>
                        <Text className="text-xs font-bold text-slate-900 dark:text-white">
                          {listing.average_rating || '5.0'}
                        </Text>
                        <Text className="text-xs text-slate-500 ml-1">({listing.review_count || '0'} reviews)</Text>
                      </View>
                      <View className="bg-slate-900 dark:bg-blue-600 px-4 py-2 rounded-xl">
                        <Text className="text-white text-xs font-bold">Book Now</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
