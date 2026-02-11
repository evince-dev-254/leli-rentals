import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Star, Heart, ArrowLeft, SlidersHorizontal } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotifications } from '../../context/NotificationContext';

const SafeAreaView = styled(SafeAreaViewContext);

// Mock Data Generator
const generateMockProducts = (category: string) => {
    const images = [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1493238792015-fa094a327386?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1512918760513-95f1929c3d09?auto=format&fit=crop&w=400&q=80',
    ];

    return Array.from({ length: 8 }).map((_, i) => ({
        id: `prod-${i}`,
        title: `${category} Item ${i + 1}`,
        description: `High quality ${category} available for rent or sale. Great condition and best price.`,
        price: `$${(Math.random() * 500 + 50).toFixed(0)}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 100),
        location: 'Nairobi, Kenya',
        image: images[i % images.length],
        isFavorite: false,
    }));
};

export default function ListingScreen() {
    const { category } = useLocalSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addNotification } = useNotifications();

    useEffect(() => {
        if (category) {
            const catName = Array.isArray(category) ? category[0] : category;
            setTitle(catName);
            setProducts(generateMockProducts(catName));
        }
    }, [category]);

    const handleProductPress = (id: string) => {
        router.push(`/property/${id}`);
    };

    const handleToggleFavorite = async (item: any, e: any) => {
        e.stopPropagation();
        const liked = isFavorite(item.id);
        await toggleFavorite(item.id);
        addNotification({
            title: liked ? 'Removed' : 'Saved',
            description: liked ? 'Removed from favorites' : 'Saved to favorites',
            type: 'success',
            iconName: 'Heart',
        });
    };

    const renderItem = ({ item }: { item: any }) => {
        const liked = isFavorite(item.id);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleProductPress(item.id)}
                className="bg-white rounded-2xl mb-4 shadow-sm border border-slate-100 overflow-hidden"
            >
                <View className="h-48 w-full relative">
                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                    <View className="absolute top-3 right-3 flex-row gap-2">
                        <TouchableOpacity
                            onPress={(e) => handleToggleFavorite(item, e)}
                            className="w-8 h-8 bg-white/90 rounded-full items-center justify-center backdrop-blur-sm"
                        >
                            <Heart size={16} color={liked ? "#EF4444" : "#64748B"} fill={liked ? "#EF4444" : "transparent"} />
                        </TouchableOpacity>
                    </View>
                    <View className="absolute bottom-3 left-3 bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur-sm">
                        <Text className="text-white font-outfit-bold text-xs">{item.price}<Text className="text-slate-300 font-outfit-light">/day</Text></Text>
                    </View>
                </View>

                <View className="p-4">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-outfit-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
                        <View className="flex-row items-center bg-orange-50 px-1.5 py-0.5 rounded-md">
                            <Star size={10} color="#F97316" fill="#F97316" />
                            <Text className="text-xs font-outfit-bold text-orange-600 ml-1">{item.rating}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <MapPin size={12} color="#94A3B8" />
                        <Text className="text-xs font-outfit text-slate-500 ml-1">{item.location}</Text>
                    </View>

                    <View className="flex-row justify-between items-center pt-3 border-t border-slate-50">
                        <Text className="text-xs font-outfit text-slate-400">{item.reviews} reviews</Text>
                        <Text className="text-xs font-outfit-bold text-blue-600">View Details</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <ScreenBackground />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="px-6 pt-2 pb-4 flex-row items-center justify-between border-b border-slate-100 bg-white/80">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-white border border-slate-100 rounded-full items-center justify-center shadow-sm"
                    >
                        <ArrowLeft size={20} color="#1E293B" />
                    </TouchableOpacity>
                    <Text className="text-lg font-outfit-bold text-slate-900">{title}</Text>
                    <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-full items-center justify-center shadow-sm">
                        <SlidersHorizontal size={18} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Filter / Tabs (Optional) */}
                <View className="px-6 py-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
                        {['All', 'Popular', 'Newest', 'Price: Low to High'].map((filter, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`px-4 py-2 rounded-full mr-2 border ${index === 0 ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-200'}`}
                            >
                                <Text className={`font-outfit-medium text-xs ${index === 0 ? 'text-white' : 'text-slate-600'}`}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Product List */}
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <Text className="font-outfit text-slate-400">No items found in this category.</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
}
