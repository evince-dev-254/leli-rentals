import React from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, Share, Linking, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Star, Heart, Share2, ShieldCheck, MessageCircle, Phone, Send } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import BackButton from '../../components/ui/BackButton';
import { useNotifications } from '../../context/NotificationContext';
import { useFavorites } from '../../context/FavoritesContext';

export default function PropertyDetailsScreen() {
    const { id } = useLocalSearchParams();
    const propertyId = Array.isArray(id) ? id[0] : id;
    const { addNotification } = useNotifications();
    const { toggleFavorite, isFavorite } = useFavorites();
    const insets = useSafeAreaInsets();

    const liked = isFavorite(propertyId);

    // Mock data for the property - usually you'd fetch this using the ID
    const property = {
        id: propertyId,
        title: 'Luxury Villa in Diani',
        location: 'Diani Beach, Kenya',
        price: '$450',
        rating: 4.9,
        reviews: 24,
        description: 'Experience unparalleled luxury in this stunning beachfront villa. Featuring modern architecture, a private infinity pool, and breath-taking views of the Indian Ocean, this property offers the ultimate coastal living experience.',
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        ],
        owner: {
            name: 'Alex Johnson',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
            verified: true,
            joinDate: 'Joined Jan 2023',
            phone: '+254700000000'
        },
        amenities: ['Pool', 'WiFi', 'Kitchen', 'Free Parking', 'Air Conditioning', 'Beach Access']
    };

    const handleCall = () => {
        Linking.openURL(`tel:${property.owner.phone}`);
    };

    const handleMessage = () => {
        router.push(`/messages/${property.owner.name}` as any);
    };

    const handleAction = async (action: string) => {
        await addNotification({
            title: 'Action Initiated',
            description: `Starting ${action} process...`,
            type: 'info',
            iconName: 'Info',
        });
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this ${property.title} on Leli Rentals! ${property.location} - ${property.price}/month`,
                url: `https://leli-rentals.com/property/${propertyId}`,
                title: property.title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleToggleFavorite = async () => {
        await toggleFavorite(propertyId);
        addNotification({
            title: liked ? 'Removed from Favorites' : 'Saved to Favorites',
            description: liked ? `${property.title} removed.` : `${property.title} saved.`,
            type: 'success',
            iconName: 'Heart',
        });
    };

    return (
        <View className="flex-1 bg-white">
            <ScreenBackground />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: 130 }}>
                {/* Image Header */}
                <View className="h-[400px] w-full relative">
                    <Image source={{ uri: property.images[0] }} className="w-full h-full" resizeMode="cover" />

                    <View
                        style={{ paddingTop: insets.top + 10 }}
                        className="absolute top-0 left-0 right-0 px-6 pb-6 flex-row justify-between items-center bg-black/10"
                    >
                        <BackButton label="" />
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={handleShare}
                                className="w-10 h-10 bg-white/90 rounded-xl items-center justify-center border border-white"
                            >
                                <Share2 size={18} color="#1E293B" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleToggleFavorite}
                                className="w-10 h-10 bg-white/90 rounded-xl items-center justify-center border border-white"
                            >
                                <Heart size={18} color={liked ? "#EF4444" : "#1E293B"} fill={liked ? "#EF4444" : "none"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="px-6 -mt-10 bg-white rounded-t-[40px] pt-8 shadow-2xl">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 mr-4">
                            <Text className="text-3xl font-outfit-bold text-slate-900 mb-2">{property.title}</Text>
                            <View className="flex-row items-center">
                                <MapPin size={14} color="#F97316" />
                                <Text className="ml-1 font-outfit text-slate-500">{property.location}</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-3xl font-outfit-bold text-orange-500">{property.price}<Text className="text-slate-400 text-xs">/month</Text></Text>
                            <View className="flex-row items-center mt-1">
                                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                <Text className="ml-1 font-outfit-bold text-slate-800">{property.rating}</Text>
                                <Text className="ml-1 font-outfit text-slate-400 text-xs">({property.reviews} reviews)</Text>
                            </View>
                        </View>
                    </View>

                    <View className="h-[1px] bg-slate-100 w-full my-6" />

                    {/* Owner Card */}
                    <View className="flex-row items-center bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-6">
                        <View className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden">
                            <Image source={{ uri: property.owner.avatar }} className="w-full h-full" />
                        </View>
                        <View className="ml-4 flex-1">
                            <View className="flex-row items-center">
                                <Text className="font-outfit-bold text-slate-800 text-base mr-2">{property.owner.name}</Text>
                                {property.owner.verified && <ShieldCheck size={14} color="#3B82F6" />}
                            </View>
                            <Text className="text-slate-500 font-outfit text-xs">{property.owner.joinDate}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleMessage}
                            className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-200"
                        >
                            <MessageCircle size={18} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xl font-outfit-bold text-slate-900 mb-3">About this Property</Text>
                    <Text className="text-slate-600 font-outfit text-base leading-relaxed mb-8">
                        {property.description}
                    </Text>

                    <Text className="text-xl font-outfit-bold text-slate-900 mb-4">What this place offers</Text>
                    <View className="flex-row flex-wrap gap-3 mb-8">
                        {property.amenities.map((amenity, index) => (
                            <View key={index} className="bg-orange-50 px-4 py-2.5 rounded-2xl border border-orange-100">
                                <Text className="text-orange-700 font-outfit-medium text-sm">{amenity}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Sticky Action */}
            <View
                style={{ paddingBottom: Math.max(insets.bottom, 24), paddingTop: 16 }}
                className="absolute bottom-0 left-0 right-0 bg-white px-6 border-t border-slate-100 shadow-2xl flex-row gap-3"
            >
                <TouchableOpacity
                    onPress={handleCall}
                    className="w-14 h-14 bg-slate-100 rounded-2xl items-center justify-center"
                >
                    <Phone size={22} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleMessage}
                    className="flex-1 bg-blue-600 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
                >
                    <MessageCircle size={20} color="white" />
                    <Text className="text-white font-outfit-bold text-base">Message Owner</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push(`/booking/${propertyId}` as any)}
                    className="flex-1 bg-slate-900 rounded-2xl items-center justify-center shadow-lg"
                >
                    <Text className="text-white font-outfit-bold text-base">Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
