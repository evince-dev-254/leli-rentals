import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, Menu, Grid, Bell } from 'lucide-react-native';
import { useCategories } from '@/lib/hooks/useData';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { getIcon } from '@/lib/icon-mapping';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

const { width } = Dimensions.get('window');

export default function CategoriesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const selectedCategory = params.category;
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [searchQuery, setSearchQuery] = React.useState('');
    const [menuVisible, setMenuVisible] = React.useState(false);
    const { data: categories, isLoading } = useCategories();

    const filteredCategories = categories?.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={{ flex: 1 }} className="bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <HamburgerMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                activeRole="renter"
            />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header with Perspective Logo Area */}
                <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Explore</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Grid size={12} color="#f97316" strokeWidth={3} />
                            <Text style={{ fontSize: 10, fontWeight: '900', color: '#94a3b8', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 2 }}>Premium Ecosystem</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <TouchableOpacity onPress={() => setMenuVisible(true)}>
                            <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={{ height: 52, width: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Menu size={22} color={isDark ? "white" : "#0f172a"} strokeWidth={2.5} />
                            </GlassView>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/notifications')}>
                            <GlassView intensity={20} tint={isDark ? 'dark' : 'light'} style={{ height: 52, width: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={22} color={isDark ? "white" : "#0f172a"} strokeWidth={2.5} />
                            </GlassView>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3D Search Hero Area */}
                <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                    <PerspectiveView>
                        <GlassView intensity={30} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 24, padding: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                                <Search size={22} color="#f97316" strokeWidth={3} />
                                <TextInput
                                    placeholder="Analyze catalog..."
                                    placeholderTextColor="#64748b"
                                    style={{ flex: 1, marginLeft: 12, height: 48, fontSize: 16, fontWeight: '800', color: isDark ? 'white' : '#0f172a' }}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>
                        </GlassView>
                    </PerspectiveView>
                </View>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 14, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>System Selection</Text>
                    </View>

                    {isLoading ? (
                        <View style={{ marginTop: 60 }}>
                            <ActivityIndicator size="large" color="#f97316" />
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            {filteredCategories?.length === 0 ? (
                                <View style={{ width: '100%', marginTop: 40, alignItems: 'center' }}>
                                    <Text style={{ color: '#94a3b8', fontWeight: '800' }}>No modules found.</Text>
                                </View>
                            ) : (
                                filteredCategories?.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={{ width: (width - 64) / 2, height: 180 }}
                                        onPress={() => router.push(`/category/${cat.id}`)}
                                    >
                                        <PerspectiveView>
                                            <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ height: '100%', borderRadius: 36, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                                {cat.image_url ? (
                                                    <Image
                                                        source={{ uri: cat.image_url }}
                                                        style={StyleSheet.absoluteFillObject}
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.8)', alignItems: 'center', justifyContent: 'center' }]}>
                                                        {(() => {
                                                            const CategoryIcon = getIcon(cat.icon);
                                                            return <CategoryIcon size={40} color="#f97316" strokeWidth={1.5} />;
                                                        })()}
                                                    </View>
                                                )}

                                                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: selectedCategory === cat.id ? 'rgba(249, 115, 22, 0.4)' : 'rgba(0,0,0,0.3)' }]} />

                                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                                                    <Text numberOfLines={1} style={{ color: 'white', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
                                                        {cat.name}
                                                    </Text>
                                                    <View style={{ marginTop: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                                                        <Text style={{ color: 'white', fontSize: 8, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }}>Live Sync</Text>
                                                    </View>
                                                </View>
                                            </GlassView>
                                        </PerspectiveView>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
