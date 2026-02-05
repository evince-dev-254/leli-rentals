import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, Clock, User, Tag } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { blogPosts, categories } from '../../lib/blog-data';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

export default function BlogScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const filteredPosts = blogPosts.filter((post: any) => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#020617' : 'white' }}>
            <BackgroundGradient />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
                    <BackButton />
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontSize: 24, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Leli Blog</Text>
                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Market Insights</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Search Bar */}
                    <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                        <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ height: 64, borderRadius: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Search size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Search articles..."
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={{ flex: 1, marginLeft: 12, color: isDark ? 'white' : '#0f172a', fontWeight: '700' }}
                            />
                        </GlassView>
                    </View>

                    {/* Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, marginBottom: 24 }}>
                        <TouchableOpacity onPress={() => setSelectedCategory(null)} style={{ marginRight: 12 }}>
                            <GlassView intensity={selectedCategory === null ? 30 : 10} tint={isDark ? 'dark' : 'light'} style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 }}>
                                <Text style={{ color: selectedCategory === null ? '#3b82f6' : '#94a3b8', fontWeight: '900', fontSize: 12 }}>ALL</Text>
                            </GlassView>
                        </TouchableOpacity>
                        {categories.map((cat, idx) => (
                            <TouchableOpacity key={idx} onPress={() => setSelectedCategory(cat)} style={{ marginRight: 12 }}>
                                <GlassView intensity={selectedCategory === cat ? 30 : 10} tint={isDark ? 'dark' : 'light'} style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 }}>
                                    <Text style={{ color: selectedCategory === cat ? '#3b82f6' : '#94a3b8', fontWeight: '900', fontSize: 12, textTransform: 'uppercase' }}>{cat}</Text>
                                </GlassView>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Posts List */}
                    <View style={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                        {filteredPosts.map((post, idx) => (
                            <MotiView
                                key={post.slug}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: idx * 100 }}
                                style={{ marginBottom: 24 }}
                            >
                                <TouchableOpacity>
                                    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 32, overflow: 'hidden' }}>
                                        <Image source={{ uri: post.coverImage }} style={{ width: '100%', height: 200 }} />
                                        <View style={{ padding: 24 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                                <View style={{ backgroundColor: '#3b82f620', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                                    <Text style={{ color: '#3b82f6', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}>{post.category}</Text>
                                                </View>
                                                <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '800', marginLeft: 12 }}>{post.readingTime}</Text>
                                            </View>
                                            <h3 style={{ fontSize: 20, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 8 }}>{post.title}</h3>
                                            <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '700', lineHeight: 20 }}>{post.excerpt}</Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: isDark ? '#ffffff10' : '#00000005' }}>
                                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                                    <User size={16} color="white" />
                                                </View>
                                                <View>
                                                    <Text style={{ color: isDark ? 'white' : '#0f172a', fontSize: 12, fontWeight: '900' }}>{post.author.name}</Text>
                                                    <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700' }}>{post.date}</Text>
                                                </View>
                                                <View style={{ flex: 1 }} />
                                                <ChevronRight size={16} color="#94a3b8" />
                                            </View>
                                        </View>
                                    </GlassView>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
