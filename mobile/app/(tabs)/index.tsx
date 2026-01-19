import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Image, ImageSourcePropType, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Bell, SlidersHorizontal, X, Star, Globe, Menu, Shield, Car, Home, HardHat, Smartphone, Shirt, Music, Building2, Zap, Clock, Mail, ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { useColorScheme } from '@/components/useColorScheme';
import { useCategories, useListings, useSubcategories } from '@/lib/hooks/useData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getIcon } from '@/lib/icon-mapping';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';

const { width } = Dimensions.get('window');

// Define asset sources directly for consistency
const LOGO_BLACK = require('../../assets/images/logo_black.png');
const LOGO_WHITE = require('../../assets/images/logo_white.png');

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const listingsSectionRef = React.useRef<View>(null);
  const listingsLayoutY = React.useRef(0);

  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | undefined>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);

  // Update category when param changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: categories, isLoading: catsLoading, refetch: refetchCats } = useCategories();
  const { data: subcategories, isLoading: subsLoading } = useSubcategories(selectedCategory);
  const { data: listings, isLoading: listingsLoading, refetch: refetchListings } = useListings(selectedCategory, debouncedSearch, selectedSubcategory);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCats(), refetchListings()]);
    setRefreshing(false);
  }, [refetchCats, refetchListings]);

  const scrollToListings = () => {
    scrollViewRef.current?.scrollTo({ y: listingsLayoutY.current - 100, animated: true });
  };

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubcategory(undefined);
    scrollToListings();
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <BackgroundGradient />
      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
          }
        >
          {/* Header */}
          <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-black text-slate-900 dark:text-white">Leli Rentals</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={12} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Mauritius, MU</Text>
              </View>
            </View>
            <View className="flex-row gap-6">
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                className="h-10 w-10 items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800"
              >
                <Menu size={20} color={isDark ? "#ffffff" : "#0f172a"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/notifications')} className="h-10 w-10 items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800">
                <Bell size={20} color={isDark ? "#ffffff" : "#0f172a"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Section - Aligned with Website */}
          <View className="relative h-[420px] w-full items-center justify-center overflow-hidden bg-slate-900">
            {/* Animated Hero Background */}
            <MotiView
              from={{ scale: 1.1, opacity: 0.5 }}
              animate={{ scale: 1.1, opacity: 0.7 }}
              transition={{
                type: 'timing',
                duration: 25000,
                loop: true,
                repeatReverse: true,
              }}
              style={StyleSheet.absoluteFillObject}
            >
              <Image
                source={require('../../assets/images/leli-home-hero-corrected.png')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
                alt="Leli Rentals Hero"
              />
            </MotiView>

            {/* Mesh Gradient / Vibrant Overlay */}
            <View className="absolute inset-0 bg-gradient-to-br from-orange-600/40 via-purple-600/40 to-pink-500/30 opacity-90" />
            <View className="absolute inset-0 bg-black/40" />

            <View className="px-6 items-center">
              <Text className="text-4xl sm:text-5xl font-black text-white text-center leading-tight drop-shadow-xl">
                Experience <Text className="text-orange-400">Premium</Text> Rentals
              </Text>
              <Text className="text-white/80 text-center mt-4 max-w-[320px] font-bold text-sm leading-6">
                The premier destination for all your rental needs. Experience seamless booking, verified listings, and premium support.
              </Text>

              {/* Integrated Search Bar */}
              <MotiView
                from={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'timing', duration: 1000, delay: 400 }}
                className="mt-10 w-full max-w-[340px]"
              >
                <View className="bg-white/95 dark:bg-slate-900 rounded-[24px] shadow-2xl shadow-black/20 overflow-hidden flex-row items-center px-5 h-16 border-2 border-white/50 dark:border-slate-800">
                  <Search size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="Search equipment, cars, homes..."
                    placeholderTextColor="#94a3b8"
                    className="flex-1 ml-3 text-slate-900 dark:text-white font-bold text-base h-full"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')} className="p-2">
                      <X size={18} color="#94a3b8" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity className="bg-orange-500 p-2.5 rounded-xl">
                      <SlidersHorizontal size={18} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                  )}
                </View>
              </MotiView>
            </View>
          </View>

          {/* Browse by Category Section */}
          <View className="mt-12 px-6">
            <Text className="text-2xl font-black text-slate-900 dark:text-white mb-2">Browse by Category</Text>
            <Text className="text-slate-400 font-bold text-sm mb-6 leading-6">Find exactly what you&apos;re looking for across our diverse range.</Text>

            <View className="flex-row flex-wrap gap-4">
              {catsLoading ? (
                <View className="w-full py-10 items-center">
                  <ActivityIndicator color="#f97316" />
                </View>
              ) : (
                categories?.slice(0, 12).map((cat: any) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={{ width: (width - 64) / 2 }}
                    className="bg-white dark:bg-slate-900 rounded-[32px] h-48 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                    onPress={() => router.push(`/category/${cat.id}`)}
                  >
                    {cat.image_url ? (
                      <Image
                        source={{ uri: cat.image_url }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                        alt={cat.name}
                      />
                    ) : (
                      <View className="absolute inset-0 bg-slate-50 dark:bg-slate-800 items-center justify-center">
                        {(() => {
                          const CategoryIcon = getIcon(cat.icon);
                          return <CategoryIcon size={32} color="#f97316" />;
                        })()}
                      </View>
                    )}
                    {/* Dark Gradient Overlay for text readability */}
                    <View className="absolute inset-0 bg-black/30 dark:bg-black/40" />

                    <View className="p-5 justify-end h-full">
                      <Text className="text-white font-black text-base mb-1 drop-shadow-lg">{cat.name}</Text>
                      <Text className="text-white/80 font-bold text-[10px] uppercase tracking-widest drop-shadow-md">Explore gear</Text>
                      <View className="flex-row items-center mt-3">
                        <Text className="text-white font-black text-[10px] uppercase tracking-widest mr-1">Browse</Text>
                        <ChevronRight size={10} color="#ffffff" strokeWidth={4} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/categories')}
              className="mt-8 bg-slate-900 dark:bg-slate-800 py-5 rounded-[24px] items-center flex-row justify-center border border-slate-800"
            >
              <Text className="text-white font-black uppercase tracking-[0.2em] text-xs">View All Categories</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Pillars Section - Premium Redesign */}
          <View className="mt-16 px-6">
            <View className="bg-slate-900 rounded-[48px] p-8 overflow-hidden">
              <View className="absolute -top-20 -left-20 h-64 w-64 bg-orange-500/10 rounded-full blur-[80px]" />
              <View className="absolute -bottom-20 -right-20 h-64 w-64 bg-purple-500/10 rounded-full blur-[80px]" />

              <Text className="text-3xl font-black text-white mb-2">Why Trust Leli?</Text>
              <Text className="text-slate-400 font-bold text-sm mb-10 leading-6">Your safety and satisfaction are our top priorities.</Text>

              <View className="flex-row flex-wrap gap-4">
                {[
                  { title: 'Verified & Secure', desc: 'Secure escrow payments', icon: Shield, color: 'bg-emerald-500/10', iconColor: '#10b981' },
                  { title: 'Instant Booking', desc: 'No approvals needed', icon: Zap, color: 'bg-orange-500/10', iconColor: '#f97316' },
                  { title: 'Premium Items', desc: 'Only the best quality', icon: Star, color: 'bg-blue-500/10', iconColor: '#3b82f6' },
                  { title: '24/7 Support', desc: 'Always here for you', icon: Clock, color: 'bg-indigo-500/10', iconColor: '#6366f1' },
                ].map((pillar, idx) => (
                  <View
                    key={pillar.title}
                    style={{ width: (width - 110) / 2 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5"
                  >
                    <View className={cn("h-10 w-10 rounded-xl items-center justify-center mb-4", pillar.color)}>
                      <pillar.icon size={20} color={pillar.iconColor} />
                    </View>
                    <Text className="text-white font-black text-sm mb-1">{pillar.title}</Text>
                    <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">{pillar.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Featured Listings */}
          <View className="px-6 mt-16">
            <Text className="text-2xl font-black text-slate-900 dark:text-white mb-6">Featured Listings</Text>
            {listingsLoading ? (
              <ActivityIndicator color="#f97316" />
            ) : (
              listings?.map((listing: any) => (
                <TouchableOpacity
                  key={listing.id}
                  onPress={() => router.push(`/listings/${listing.id}`)}
                  className="mb-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
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
                      <View className="bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/20">
                        <Text className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{listing.categories?.name || 'Gear'}</Text>
                      </View>
                      {listing.is_verified && (
                        <View className="bg-emerald-500 px-3 py-1.5 rounded-xl">
                          <Text className="text-[10px] font-black text-white uppercase tracking-widest">Verified</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Content Detail */}
                  <View className="p-6">
                    {/* Price & Rating */}
                    <View className="flex-row items-baseline justify-between mb-3">
                      <View className="flex-row items-baseline">
                        <Text className="text-2xl font-black text-[#f97316]">KES {listing.price_per_day?.toLocaleString()}</Text>
                        <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">/ day</Text>
                      </View>
                      <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-xs font-black text-slate-900 dark:text-white ml-1">{listing.rating_average || '5.0'}</Text>
                      </View>
                    </View>

                    {/* Title */}
                    <Text className="text-lg font-black text-slate-900 dark:text-white mb-2" numberOfLines={1}>{listing.title}</Text>

                    {/* Location */}
                    <View className="flex-row items-center">
                      <MapPin size={14} color="#64748b" />
                      <Text className="text-sm text-slate-500 font-bold ml-1">{listing.location_name || 'Nairobi'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Newsletter Section */}
          <View className="mt-16 mx-6 bg-[#f97316] p-8 rounded-[40px] shadow-xl shadow-orange-500/30 overflow-hidden">
            <View className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full" />
            <Text className="text-white text-2xl font-black mb-2">Stay ahead of the curve</Text>
            <Text className="text-white/80 font-bold text-sm mb-8 leading-6">Join our newsletter for exclusive deals, new listings, and rental tips delivered straight to your inbox.</Text>

            <View className="bg-white/95 rounded-2xl flex-row items-center px-4 h-14 mb-4">
              <Mail size={18} color="#94a3b8" />
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-3 text-slate-900 font-bold text-sm"
              />
            </View>
            <TouchableOpacity
              onPress={() => alert('Thanks for subscribing!')}
              className="bg-slate-900 py-4 rounded-2xl items-center shadow-md"
            >
              <Text className="text-white font-black uppercase tracking-widest text-xs">Subscribe</Text>
            </TouchableOpacity>
            <Text className="text-white/60 text-[10px] font-bold text-center mt-6">We respect your privacy. Unsubscribe at any time.</Text>
          </View>

          {/* Comprehensive Footer */}
          <View className="mt-24 bg-white dark:bg-slate-900 p-8 border-t border-slate-100 dark:border-slate-800 pb-20">
            <View className="mb-12">
              <Text className="text-2xl font-black text-[#f97316] mb-4">leli rentals</Text>
              <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs leading-5">The premier destination for all your rental needs. Experience seamless booking, verified listings, and premium support.</Text>
            </View>

            <View className="flex-row flex-wrap gap-8 mb-12">
              <View className="w-[40%]">
                <Text className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-4">Platform</Text>
                {[
                  { label: 'Home', action: () => scrollViewRef.current?.scrollTo({ y: 0, animated: true }) },
                  { label: 'About Us', action: () => router.push('/support/about') },
                  { label: 'Pricing', action: () => router.push('/support/about') },
                  { label: 'Contact', action: () => router.push('/support/contact') },
                  { label: 'Privacy Policy', action: () => router.push('/legal/privacy') },
                ].map(link => (
                  <TouchableOpacity key={link.label} onPress={link.action} className="mb-3">
                    <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs">{link.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="w-[40%]">
                <Text className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-4">Categories</Text>
                {categories?.slice(0, 5).map((link: any) => (
                  <TouchableOpacity key={link.id} onPress={() => selectCategory(link.id)} className="mb-3">
                    <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs">{link.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-12">
              <Text className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-4">Contact Us</Text>
              <TouchableOpacity onPress={() => router.push('/support/contact')} className="flex-row items-start mb-4">
                <MapPin size={16} color="#94a3b8" />
                <Text className="flex-1 ml-3 text-slate-500 dark:text-slate-400 font-bold text-xs leading-5">Sarah Plaza 5th Floor, Meru County, Kenya</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert('Call us: +254785063461')} className="flex-row items-center mb-4">
                <Globe size={16} color="#94a3b8" />
                <Text className="ml-3 text-slate-500 dark:text-slate-400 font-bold text-xs ml-3">+254785063461</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/support/contact')} className="flex-row items-center">
                <Mail size={16} color="#94a3b8" />
                <Text className="ml-3 text-slate-500 dark:text-slate-400 font-bold text-xs ml-3">support@gurucrafts.agency</Text>
              </TouchableOpacity>
            </View>

            <View className="pt-8 border-t border-slate-100 dark:border-slate-800 pb-10">
              <View className="flex-row flex-wrap items-center justify-between mb-8">
                <View className="w-full mb-4">
                  <Text className="text-slate-900 dark:text-white font-black text-xs">
                    © 2026 Leli Rentals. All rights reserved. • <Text className="text-[#f97316]">A Product of GuruCrafts Agency</Text>
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-x-6 gap-y-3">
                  <TouchableOpacity onPress={() => router.push('/legal/privacy')}>
                    <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Privacy Policy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/legal/terms')}>
                    <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Terms</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/legal/terms')}>
                    <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Cookies</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
