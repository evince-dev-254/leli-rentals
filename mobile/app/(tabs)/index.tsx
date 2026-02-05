import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  MapPin,
  Bell,
  SlidersHorizontal,
  X,
  Star,
  Globe,
  Menu,
  Shield,
  Zap,
  Clock,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { MotiView } from 'moti';
import { useTheme } from '@/components/theme-provider';
import { useCategories, useListings, useSubcategories } from '@/lib/hooks/useData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getIcon } from '@/lib/icon-mapping';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { useAuth } from '../../context/auth-context';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { user } = useAuth();
  const activeRole = user?.user_metadata?.role || 'renter';

  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | undefined>();

  const scrollViewRef = React.useRef<ScrollView>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Data Hooks
  const { data: categories, isLoading: catsLoading, refetch: refetchCats } = useCategories();
  const { data: subcategories, isLoading: subsLoading } = useSubcategories(selectedCategory);
  const { data: listings, isLoading: listingsLoading, refetch: refetchListings } = useListings(selectedCategory, debouncedSearch, selectedSubcategory);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCats(), refetchListings()]);
    setRefreshing(false);
  }, [refetchCats, refetchListings]);

  return (
    <View style={{ flex: 1 }} className="bg-white dark:bg-slate-950">
      <BackgroundGradient />
      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} activeRole={activeRole} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
          }
        >
          {/* Header - Glassmorphic Upgrade */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
            <PerspectiveView tiltEnabled={false} floatEnabled={true}>
              <Image
                source={isDark ? require('../../assets/images/logo_white.png') : require('../../assets/images/logo_black.png')}
                style={{ width: 110, height: 28 }}
                resizeMode="contain"
                alt="Leli Rentals"
              />
            </PerspectiveView>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, overflow: 'hidden' }}
              >
                <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
                <Menu size={20} color={isDark ? "#ffffff" : "#0f172a"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/notifications')}
                style={{ height: 42, width: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, overflow: 'hidden' }}
              >
                <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
                <Bell size={20} color={isDark ? "#ffffff" : "#0f172a"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* HERO - 3D PERSPECTIVE REDESIGN */}
          <View style={{ height: 480, width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
            <PerspectiveView style={{ width: '100%', alignItems: 'center' }}>
              <MotiView
                from={{ opacity: 0, scale: 0.8, rotateZ: '-5deg' }}
                animate={{ opacity: 1, scale: 1, rotateZ: '0deg' }}
                transition={{ type: 'spring', damping: 12, delay: 200 }}
                style={{
                  width: width - 48,
                  height: 380,
                  borderRadius: 48,
                  overflow: 'hidden',
                  shadowColor: '#f97316',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.3,
                  shadowRadius: 30,
                  elevation: 20,
                }}
              >
                <Image
                  source={require('../../assets/images/leli-home-hero-corrected.jpg')}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(15, 23, 42, 0.2)', 'rgba(15, 23, 42, 0.8)']}
                  style={StyleSheet.absoluteFillObject}
                />

                <View style={{ position: 'absolute', bottom: 40, left: 32, right: 32 }}>
                  <MotiView
                    from={{ translateX: -20, opacity: 0 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    transition={{ delay: 500 }}
                  >
                    <Text className="text-4xl font-black text-white leading-tight">
                      Experience <Text className="text-orange-400">Premium</Text>
                    </Text>
                    <Text className="text-white/70 font-bold text-sm mt-2 max-w-[240px]">
                      Elevate your journey with Kenya's most trusted rental marketplace.
                    </Text>
                  </MotiView>
                </View>
              </MotiView>
            </PerspectiveView>

            {/* Search Bar - Absolute Overlay for 3D stack feel */}
            <MotiView
              animate={{
                scale: isSearchFocused ? 1.05 : 1,
                translateY: isSearchFocused ? -10 : 0
              }}
              style={{
                position: 'absolute',
                bottom: -28,
                width: '100%',
                paddingHorizontal: 24,
                zIndex: 100
              }}
            >
              <GlassView
                intensity={60}
                tint={isDark ? 'dark' : 'light'}
                style={{
                  height: 64,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.2,
                  shadowRadius: 15,
                  elevation: 10,
                  borderWidth: 2,
                  borderColor: isSearchFocused ? '#f97316' : 'rgba(255,255,255,0.1)'
                }}
              >
                <Search size={22} color={isSearchFocused ? "#f97316" : "#94a3b8"} strokeWidth={3} />
                <TextInput
                  placeholder="Find cars, gear, homes..."
                  placeholderTextColor="#94a3b8"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{ flex: 1, marginLeft: 12, color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 16 }}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={{ backgroundColor: '#f97316', padding: 10, borderRadius: 14 }}>
                  <SlidersHorizontal size={18} color="white" strokeWidth={3} />
                </TouchableOpacity>
              </GlassView>
            </MotiView>
          </View>

          {/* Browse by Category Section */}
          <View className="mt-16 px-6">
            <Text className="text-2xl font-black text-slate-900 dark:text-white mb-2">Browse by Category</Text>
            <Text className="text-slate-400 font-bold text-sm mb-6 leading-6">Find exactly what you're looking for across our diverse range.</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {catsLoading ? (
                <View style={{ width: '100%', paddingVertical: 40, alignItems: 'center' }}>
                  <ActivityIndicator color="#f97316" />
                </View>
              ) : (
                categories?.slice(0, 12).map((cat: any, index: number) => (
                  <MotiView
                    key={cat.id}
                    from={{ opacity: 0, translateY: 20, scale: 0.9 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ delay: index * 50 }}
                    style={{ width: (width - 64) / 2 }}
                  >
                    <TouchableOpacity
                      style={{ height: 192, borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? '#1e293b' : '#f1f5f9' }}
                      onPress={() => router.push(`/category/${cat.id}`)}
                    >
                      {cat.image_url ? (
                        <Image
                          source={{ uri: cat.image_url }}
                          style={StyleSheet.absoluteFillObject}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ flex: 1, backgroundColor: isDark ? '#1e293b' : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                          {(() => {
                            const CategoryIcon = getIcon(cat.icon);
                            return <CategoryIcon size={32} color="#f97316" />;
                          })()}
                        </View>
                      )}
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={{ position: 'absolute', bottom: 16, left: 16 }}>
                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>{cat.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Explore</Text>
                          <ChevronRight size={10} color="white" style={{ marginLeft: 4 }} strokeWidth={4} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </MotiView>
                ))
              )}
            </View>
          </View>

          {/* Trust Pillars */}
          <View style={{ marginTop: 64, paddingHorizontal: 24 }}>
            <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ padding: 32, borderRadius: 48 }}>
              <Text style={{ fontSize: 28, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 8 }}>Why Trust Leli?</Text>
              <Text style={{ color: '#94a3b8', fontWeight: '700', fontSize: 14, marginBottom: 32 }}>Your safety and satisfaction are our top priorities.</Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' }}>
                {[
                  { title: 'Verified', desc: 'Secure escrow', icon: Shield, color: '#10b981' },
                  { title: 'Instant', desc: 'Fast booking', icon: Zap, color: '#f97316' },
                  { title: 'Premium', desc: 'Best quality', icon: Star, color: '#3b82f6' },
                  { title: '24/7 Support', desc: 'Always here', icon: Clock, color: '#6366f1' },
                ].map((pillar) => (
                  <View key={pillar.title} style={{ width: '47%', padding: 20, borderRadius: 24, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <View style={{ height: 40, width: 40, borderRadius: 12, backgroundColor: `${pillar.color}20`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <pillar.icon size={20} color={pillar.color} />
                    </View>
                    <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 14 }}>{pillar.title}</Text>
                    <Text style={{ color: '#64748b', fontWeight: '700', fontSize: 10, textTransform: 'uppercase', marginTop: 2 }}>{pillar.desc}</Text>
                  </View>
                ))}
              </View>
            </GlassView>
          </View>

          {/* Featured Listings */}
          <View style={{ marginTop: 64, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 24 }}>Featured Listings</Text>
            {listingsLoading ? (
              <ActivityIndicator color="#f97316" />
            ) : (
              listings?.map((listing: any) => (
                <PerspectiveView key={listing.id} floatEnabled={false} style={{ marginBottom: 32 }}>
                  <TouchableOpacity
                    onPress={() => router.push(`/listings/${listing.id}`)}
                    style={{ borderRadius: 40, backgroundColor: isDark ? '#0f172a' : 'white', overflow: 'hidden', borderWidth: 1, borderColor: isDark ? '#1e293b' : '#f1f5f9 shadow-sm' }}
                  >
                    <View style={{ aspectRatio: 4 / 3, backgroundColor: '#f1f5f9' }}>
                      {listing.images?.[0] ? (
                        <Image
                          source={{ uri: listing.images[0].startsWith('http') ? listing.images[0] : `https://ixivvshatmsisntomvpx.supabase.co/storage/v1/object/public/listing-images/${listing.images[0]}` }}
                          style={StyleSheet.absoluteFillObject}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#94a3b8', fontWeight: '900', letterSpacing: 2 }}>PREMIUM RENTAL</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ padding: 24 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 24, fontWeight: '900', color: '#f97316' }}>KES {listing.price_per_day?.toLocaleString()}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1e293b' : '#f8fafc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Star size={12} color="#f59e0b" fill="#f59e0b" />
                          <Text style={{ marginLeft: 4, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>{listing.rating_average || '5.0'}</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 8 }}>{listing.title}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MapPin size={14} color="#64748b" />
                        <Text style={{ marginLeft: 4, color: '#64748b', fontWeight: '700' }}>{listing.location_name || 'Nairobi'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </PerspectiveView>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
