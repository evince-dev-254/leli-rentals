import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, useColorScheme, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, Menu, Grid, Bell } from 'lucide-react-native';
import { useCategories } from '@/lib/hooks/useData';
import { BlurView } from 'expo-blur';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icon-mapping';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';

const { width } = Dimensions.get('window');

export default function CategoriesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const selectedCategory = params.category;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [searchQuery, setSearchQuery] = React.useState('');
    const [menuVisible, setMenuVisible] = React.useState(false);
    const { data: categories, isLoading } = useCategories();

    const filteredCategories = categories?.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
                    <View>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">Categories</Text>
                        <View className="flex-row items-center mt-1">
                            <Grid size={12} color="#94a3b8" />
                            <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Browse Services</Text>
                        </View>
                    </View>
                    <View className="flex-row gap-6">
                        <TouchableOpacity
                            onPress={() => setMenuVisible(true)}
                            className="h-12 w-12 items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 shadow-sm"
                        >
                            <Menu size={22} color={isDark ? "#ffffff" : "#0f172a"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/notifications')}
                            className="h-12 w-12 items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 shadow-sm"
                        >
                            <Bell size={22} color={isDark ? "#ffffff" : "#0f172a"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="px-6 pb-4">
                    <BlurView intensity={isDark ? 30 : 50} tint={isDark ? 'dark' : 'light'} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-2 flex-row items-center overflow-hidden">
                        <View className="flex-1 flex-row items-center px-2">
                            <Search size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Search all categories..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 ml-2 text-slate-900 dark:text-white h-10"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </BlurView>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    <View className="mb-6">
                        <Text className="text-slate-900 dark:text-white text-xl font-black mb-1">Pick a Category</Text>
                        <Text className="text-slate-500 dark:text-slate-400 font-bold">
                            Select a category below to browse premium equipment.
                        </Text>
                    </View>

                    {isLoading ? (
                        <View className="mt-20">
                            <ActivityIndicator size="large" color="#f97316" />
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between pb-32">
                            {filteredCategories?.length === 0 ? (
                                <View className="w-full mt-10 items-center">
                                    <Text className="text-slate-500">No categories found for &quot;{searchQuery}&quot;</Text>
                                </View>
                            ) : (
                                filteredCategories?.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        className="w-[48%] mb-4 bg-white dark:bg-slate-900 rounded-[32px] h-40 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                                        onPress={() => {
                                            router.push(`/category/${cat.id}`);
                                        }}
                                    >
                                        <View className="absolute inset-0">
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
                                                        return <CategoryIcon size={32} color={selectedCategory === cat.id ? "#ffffff" : "#f97316"} />;
                                                    })()}
                                                </View>
                                            )}
                                        </View>

                                        {/* Dark Overlay for readability - stronger on selected */}
                                        <View className={cn(
                                            "absolute inset-0",
                                            selectedCategory === cat.id ? "bg-orange-500/60" : "bg-black/30 dark:bg-black/40"
                                        )} />

                                        <View className="flex-1 items-center justify-center p-4">
                                            <Text className="font-black text-white text-center text-sm uppercase tracking-tighter drop-shadow-lg" numberOfLines={1}>
                                                {cat.name}
                                            </Text>
                                            <Text className="text-[10px] text-white/80 text-center font-bold mt-1 uppercase tracking-widest drop-shadow-md" numberOfLines={1}>
                                                Explore Gear
                                            </Text>
                                        </View>
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
