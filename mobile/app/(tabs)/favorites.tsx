import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Trash2, MapPin, Star, Calendar } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../context/favorites-context';
import { useListings } from '@/lib/hooks/useData';
import { blogPosts, categories } from '../../lib/blog-data';
import { GlassView } from '@/components/ui/glass-view';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { useTheme } from '@/components/theme-provider';

export default function FavoritesScreen() {
    const router = useRouter();
    const { favorites, toggleFavorite } = useFavorites();
    const { data: listings } = useListings();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const favoriteListings = listings?.filter(l => favorites.includes(l.id)) || [];

    if (favoriteListings.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: isDark ? '#020617' : 'white' }}>
                <BackgroundGradient />
                <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
                        <PerspectiveView>
                            <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={{ padding: 40, borderRadius: 48, alignItems: 'center' }}>
                                <View style={{ height: 120, width: 120, borderRadius: 40, backgroundColor: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                                    <Heart size={64} color="#f43f5e" fill="#f43f5e" />
                                </View>
                                <Text style={{ fontSize: 28, fontWeight: '900', color: isDark ? 'white' : '#0f172a', textAlign: 'center', marginBottom: 12 }}>Keep Dreaming</Text>
                                <Text style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 40 }}>Your wishlist is empty</Text>
                                <Button title="DISCOVER GEAR" onPress={() => router.push('/')} style={{ width: '100%' }} />
                            </GlassView>
                        </PerspectiveView>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#020617' : 'white' }}>
            <BackgroundGradient />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>My Hub</Text>
                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>{favoriteListings.length} Curated Items</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                    <AnimatePresence>
                        {favoriteListings.map((listing, index) => (
                            <MotiView
                                key={listing.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 100 }}
                                style={{ marginBottom: 24 }}
                            >
                                <PerspectiveView>
                                    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 40, overflow: 'hidden' }}>
                                        <View style={{ height: 240, width: '100%', position: 'relative' }}>
                                            <Image source={{ uri: listing.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' }} style={{ width: '100%', height: '100%' }} />
                                            <TouchableOpacity
                                                onPress={() => toggleFavorite(listing.id)}
                                                style={{ position: 'absolute', top: 20, right: 20 }}
                                            >
                                                <GlassView intensity={40} tint="dark" style={{ height: 48, width: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={20} color="#f43f5e" strokeWidth={2.5} />
                                                </GlassView>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ padding: 24 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                                <View style={{ backgroundColor: '#a855f7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 8 }}>
                                                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 9, textTransform: 'uppercase' }}>{listing.category}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                                    <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 12, marginLeft: 4 }}>{listing.rating}</Text>
                                                </View>
                                            </View>

                                            <Text style={{ fontSize: 20, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 8 }}>{listing.title}</Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                                <MapPin size={14} color="#94a3b8" />
                                                <Text style={{ color: '#94a3b8', fontWeight: '800', fontSize: 12, marginLeft: 4 }}>{listing.location}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text style={{ color: '#10b981', fontWeight: '900', fontSize: 24 }}>KSh {listing.price_per_day}</Text>
                                                    <Text style={{ color: '#94a3b8', fontWeight: '900', fontSize: 9, textTransform: 'uppercase' }}>Per Galactic Cycle</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => router.push(`/listings/${listing.id}`)}>
                                                    <View style={{ backgroundColor: '#10b981', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 10 }}>
                                                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>ENGAGE</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </GlassView>
                                </PerspectiveView>
                            </MotiView>
                        ))}
                    </AnimatePresence>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
