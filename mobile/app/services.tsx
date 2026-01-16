import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator, useColorScheme, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useCategories } from '@/lib/hooks/useData';
import { BlurView } from 'expo-blur';
import { BackgroundGradient } from '@/components/ui/background-gradient';

const { width } = Dimensions.get('window');

export default function ServicesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [searchQuery, setSearchQuery] = React.useState('');
    const { data: categories, isLoading } = useCategories();

    const filteredCategories = categories?.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
            <BackgroundGradient />
            <View className="flex-1" style={{ paddingTop: 40 }}>
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 items-center justify-center"
                    >
                        <ArrowLeft size={24} color={isDark ? '#fff' : '#0f172a'} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">All Services</Text>
                    <View className="w-10" />
                </View>

                {/* Search Bar */}
                <View className="px-6 pb-4">
                    <BlurView intensity={isDark ? 30 : 50} tint={isDark ? 'dark' : 'light'} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-2 flex-row items-center overflow-hidden">
                        <View className="flex-1 flex-row items-center px-2">
                            <Search size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Search services..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 ml-2 text-slate-900 dark:text-white h-10"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </BlurView>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    <Text className="text-slate-500 dark:text-slate-400 mb-6">
                        Browse our comprehensive list of equipment categories and rental services.
                    </Text>

                    {isLoading ? (
                        <View className="mt-20">
                            <ActivityIndicator size="large" color="#3b82f6" />
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between pb-10">
                            {filteredCategories?.length === 0 ? (
                                <View className="w-full mt-10 items-center">
                                    <Text className="text-slate-500">No services found for &quot;{searchQuery}&quot;</Text>
                                </View>
                            ) : (
                                filteredCategories?.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        className="w-[48%] mb-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 items-center shadow-sm"
                                        onPress={() => {
                                            router.push(`/(tabs)?category=${cat.id}`);
                                        }}
                                    >
                                        <View className="h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center mb-3">
                                            <Text className="text-2xl">{cat.icon || '🛠️'}</Text>
                                        </View>
                                        <Text className="font-bold text-slate-900 dark:text-white text-center mb-1">{cat.name}</Text>
                                        <Text className="text-xs text-slate-500 text-center" numberOfLines={2}>
                                            {cat.description || 'View equipment'}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
