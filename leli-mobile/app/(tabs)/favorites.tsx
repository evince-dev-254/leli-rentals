import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { MapPin, Star, Heart, ArrowLeft, Trash2 } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotifications } from '../../context/NotificationContext';

const SafeAreaView = styled(SafeAreaViewContext);

// Mock Data (Consistent with listing/property screens)
const ALL_PROPERTIES = [
    {
        id: 'prod-0',
        title: 'Luxury Villa in Diani',
        location: 'Diani Beach, Kenya',
        price: '$450',
        rating: '4.9',
        reviews: 24,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'prod-1',
        title: 'Modern Apartment',
        location: 'Nairobi, Kenya',
        price: '$120',
        rating: '4.5',
        reviews: 15,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'prod-2',
        title: 'Beachfront Cottage',
        location: 'Malindi, Kenya',
        price: '$200',
        rating: '4.7',
        reviews: 32,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
    },
    // Add more if needed to match ID generations
];

export default function FavoritesScreen() {
    const router = useRouter();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const { addNotification } = useNotifications();
    const [favoriteItems, setFavoriteItems] = useState<any[]>([]);

    useEffect(() => {
        // Filter properties that are in favorites
        const items = ALL_PROPERTIES.filter(p => favorites.includes(p.id));
        setFavoriteItems(items);
    }, [favorites]);

    const handleProductPress = (id: string) => {
        router.push(`/property/${id}`);
    };

    const handleRemoveFavorite = async (id: string, title: string) => {
        await toggleFavorite(id);
        addNotification({
            title: 'Removed',
            description: `${title} removed from favorites.`,
            type: 'info',
            iconName: 'Heart',
        });
    };

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleProductPress(item.id)}
                className="bg-white rounded-2xl mb-4 shadow-sm border border-slate-100 overflow-hidden"
            >
                <View className="h-48 w-full relative">
                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                    <TouchableOpacity
                        onPress={() => handleRemoveFavorite(item.id, item.title)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full items-center justify-center backdrop-blur-sm shadow-sm"
                    >
                        <Heart size={16} color="#EF4444" fill="#EF4444" />
                    </TouchableOpacity>
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
                        <TouchableOpacity onPress={() => handleProductPress(item.id)}>
                            <Text className="text-xs font-outfit-bold text-blue-600">View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <ScreenHeader title="My Favorites" />

                <FlatList
                    data={favoriteItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center -mt-20">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <Heart size={32} color="#CBD5E1" />
                            </View>
                            <Text className="text-xl font-outfit-bold text-slate-800 mb-2">No favorites yet</Text>
                            <Text className="text-slate-400 font-outfit text-center px-10">
                                Tap the heart icon on any property to save it here for later.
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)')}
                                className="mt-8 bg-slate-900 px-8 py-3 rounded-2xl shadow-lg"
                            >
                                <Text className="text-white font-outfit-bold">Explore Properties</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
}
