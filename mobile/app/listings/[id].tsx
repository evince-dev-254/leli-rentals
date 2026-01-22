import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Share, Heart, MapPin, ShieldCheck, Clock, Star, MessageCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useListingDetail } from '../../lib/hooks/useData';
import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '@/lib/supabase';

import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { data: listing, isLoading } = useListingDetail(id as string);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'details' | 'features' | 'reviews'>('details');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
                <ActivityIndicator color="#3b82f6" />
            </View>
        );
    }

    if (!listing) return null;

    const nextImage = () => {
        if (listing.images && listing.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
        }
    };

    const prevImage = () => {
        if (listing.images && listing.images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
        }
    };

    const handleBookNow = () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please login to book this item',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => router.push('/auth/login') }
                ]
            );
        } else {
            // Navigate to booking screen with listing data
            router.push({
                pathname: '/bookings/create',
                params: {
                    listingId: listing.id,
                    listingTitle: listing.title,
                    pricePerDay: listing.price_per_day,
                    ownerId: listing.owner_id
                }
            });
        }
    };

    const handleContactOwner = () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please login to contact the owner',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => router.push('/auth/login') }
                ]
            );
        } else {
            setIsChatOpen(true);
        }
    };

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        try {
            // Create or get conversation
            const { data: conversation, error: convError } = await supabase
                .from('conversations')
                .insert({
                    participant_1_id: user.id,
                    participant_2_id: listing.owner_id,
                    listing_id: listing.id
                })
                .select()
                .single();

            if (convError && convError.code !== '23505') { // Ignore duplicate error
                throw convError;
            }

            // Get the conversation if it already exists
            let activeConversationId = conversation?.id;
            if (!activeConversationId) {
                const { data: existingConv } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('participant_1_id', user.id)
                    .eq('participant_2_id', listing.owner_id)
                    .eq('listing_id', listing.id)
                    .single();
                activeConversationId = existingConv?.id;
            }

            if (!activeConversationId) throw new Error('Could not find or create conversation');

            // Send message
            const { error: msgError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: activeConversationId,
                    sender_id: user.id,
                    receiver_id: listing.owner_id,
                    content: chatMessage
                });

            if (msgError) throw msgError;

            setChatMessage('');
            setIsChatOpen(false);
            Alert.alert('Success', 'Message sent to owner!');
            router.push('/(tabs)/messages');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <View className="mt-6">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">About this gear</Text>
                        <Text className="text-slate-500 leading-relaxed">
                            {listing.description}
                        </Text>
                    </View>
                );

            case 'features':
                return (
                    <View className="mt-6">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Features & Amenities</Text>
                        <View className="gap-3">
                            {(listing.amenities || ['Verified', 'Instant Booking', '24/7 Support']).map((amenity: string, index: number) => (
                                <View key={index} className="flex-row items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <ShieldCheck size={20} color="#f97316" />
                                    <Text className="text-sm font-medium text-slate-900 dark:text-white ml-3">{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );

            case 'reviews':
                return (
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-lg font-bold text-slate-900 dark:text-white">Guest Reviews</Text>
                                <View className="flex-row items-center mt-1">
                                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                                    <Text className="text-base font-bold ml-1 text-slate-900 dark:text-white">{listing.average_rating || '5.0'}</Text>
                                    <Text className="text-xs text-slate-400 ml-1">({listing.review_count || '0'} reviews)</Text>
                                </View>
                            </View>
                            {user && (
                                <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-full">
                                    <Text className="text-white font-bold text-xs">Leave Review</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Sample Reviews */}
                        {[1, 2, 3].map((i) => (
                            <View key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-4">
                                <View className="flex-row items-center mb-3">
                                    <View className="h-10 w-10 rounded-full bg-orange-100 items-center justify-center">
                                        <Text className="font-bold text-orange-500">U{i}</Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="font-bold text-slate-900 dark:text-white">Happy Renter</Text>
                                        <View className="flex-row items-center mt-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} size={12} color="#f59e0b" fill={idx < 4 ? "#f59e0b" : "transparent"} />
                                            ))}
                                            <Text className="text-xs text-slate-400 ml-2">2 weeks ago</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    &ldquo;Great experience! The item was exactly as described and the owner was very responsive.&rdquo;
                                </Text>
                            </View>
                        ))}
                    </View>
                );
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Image Section with Carousel */}
                <View className="h-[400px] bg-slate-200 dark:bg-slate-900 relative">
                    {/* Header Overlay */}
                    <SafeAreaView className="absolute top-0 left-0 right-0 z-10 px-6 pt-4 flex-row justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center bg-white/10 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-slate-800 px-4 py-2 rounded-full"
                        >
                            <ChevronLeft size={24} color={isDark ? 'white' : '#f97316'} strokeWidth={3} />
                            <Text className="ml-1 font-black text-white uppercase tracking-wider text-sm">
                                Back
                            </Text>
                        </TouchableOpacity>
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                                <Share color="white" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                                <Heart color="white" size={20} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    {/* Main Image */}
                    {listing.images?.[currentImageIndex] ? (
                        <Image
                            source={{ uri: listing.images[currentImageIndex].startsWith('http') ? listing.images[currentImageIndex] : `https://ixivvshatmsisntomvpx.supabase.co/storage/v1/object/public/listing-images/${listing.images[currentImageIndex]}` }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                            alt={listing.title}
                        />
                    ) : (
                        <View className="items-center justify-center h-full">
                            <Text className="text-white/40 font-black text-4xl uppercase tracking-[0.2em] transform -rotate-12">
                                Premium Gear
                            </Text>
                        </View>
                    )}

                    {/* Image Navigation - Only show if multiple images */}
                    {listing.images && listing.images.length > 1 && (
                        <>
                            <TouchableOpacity
                                onPress={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/60 backdrop-blur-md items-center justify-center"
                            >
                                <ChevronLeft size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/60 backdrop-blur-md items-center justify-center"
                            >
                                <ChevronRight size={24} color="#000" />
                            </TouchableOpacity>

                            {/* Dot Indicators */}
                            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                                {listing.images.map((_: string, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setCurrentImageIndex(index)}
                                        className={`h-2 rounded-full ${index === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                                    />
                                ))}
                            </View>

                            {/* Image Counter */}
                            <View className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full">
                                <Text className="text-white text-xs font-bold">
                                    {currentImageIndex + 1} / {listing.images.length}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Content Section */}
                <View className="-mt-12 bg-white dark:bg-slate-950 rounded-t-[48px] px-8 pt-10 pb-32">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                            <Text className="text-[10px] font-black text-[#f97316] uppercase tracking-widest">{listing.categories?.name || 'Equipment'}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Star size={14} color="#f59e0b" fill="#f59e0b" />
                            <Text className="text-sm font-bold ml-1 text-slate-900 dark:text-white">{listing.average_rating || '5.0'}</Text>
                            <Text className="text-xs text-slate-400 ml-1">({listing.review_count || '0'} reviews)</Text>
                        </View>
                    </View>

                    <Text className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{listing.title}</Text>

                    <View className="flex-row items-center mt-3">
                        <MapPin size={16} color="#f97316" />
                        <Text className="text-sm text-slate-500 ml-1">{listing.location_name || 'Nairobi, Kenya'}</Text>
                    </View>

                    {/* Spec Cards */}
                    <View className="flex-row gap-4 mt-8">
                        <View className="flex-1 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 items-center">
                            <ShieldCheck size={24} color="#f97316" />
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-2">Verified</Text>
                        </View>
                        <View className="flex-1 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 items-center">
                            <Clock size={24} color="#f97316" />
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-2">Instant</Text>
                        </View>
                        <View className="flex-1 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 items-center">
                            <MessageCircle size={24} color="#f97316" />
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-2">Support</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="mt-8">
                        <View className="flex-row bg-slate-100 dark:bg-slate-900 rounded-2xl p-1">
                            <TouchableOpacity
                                onPress={() => setActiveTab('details')}
                                className={`flex-1 py-3 rounded-xl ${activeTab === 'details' ? 'bg-white dark:bg-slate-800' : ''}`}
                            >
                                <Text className={`text-center text-sm font-bold ${activeTab === 'details' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActiveTab('features')}
                                className={`flex-1 py-3 rounded-xl ${activeTab === 'features' ? 'bg-white dark:bg-slate-800' : ''}`}
                            >
                                <Text className={`text-center text-sm font-bold ${activeTab === 'features' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Features</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActiveTab('reviews')}
                                className={`flex-1 py-3 rounded-xl ${activeTab === 'reviews' ? 'bg-white dark:bg-slate-800' : ''}`}
                            >
                                <Text className={`text-center text-sm font-bold ${activeTab === 'reviews' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Reviews</Text>
                            </TouchableOpacity>
                        </View>

                        {renderTabContent()}
                    </View>

                    {/* Owner Card */}
                    <View className="mt-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 flex-row items-center border border-slate-100 dark:border-slate-800">
                        <View className="h-12 w-12 rounded-full bg-orange-100 items-center justify-center">
                            <Text className="font-bold text-[#f97316]">{listing.owner?.full_name?.[0] || 'O'}</Text>
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-base font-bold text-slate-900 dark:text-white">{listing.owner?.full_name}</Text>
                            <Text className="text-xs text-slate-400">Verified Owner</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleContactOwner}
                            className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700"
                        >
                            <MessageCircle size={20} color="#f97316" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Booking Bar */}
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} className={`absolute bottom-0 left-0 right-0 px-8 py-6 pb-12 border-t border-slate-100 dark:border-slate-800 flex-row items-center justify-between`}>
                <View>
                    <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>KES {listing.price_per_day?.toLocaleString()}</Text>
                    <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">per day</Text>
                </View>
                <TouchableOpacity
                    onPress={handleBookNow}
                    className="bg-[#f97316] px-10 py-4 rounded-full shadow-lg shadow-orange-500/40"
                >
                    <Text className="text-white font-black text-base">Book Now</Text>
                </TouchableOpacity>
            </BlurView>

            {/* Chat Modal */}
            {isChatOpen && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center px-6">
                    <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md">
                        <Text className="text-2xl font-black text-slate-900 dark:text-white mb-2">Message Owner</Text>
                        <Text className="text-sm text-slate-500 mb-6">Send an inquiry about {listing.title}</Text>

                        <Input
                            placeholder="Hi, I'm interested in renting this..."
                            value={chatMessage}
                            onChangeText={setChatMessage}
                            className="mb-4"
                            multiline
                            numberOfLines={4}
                        />

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setIsChatOpen(false)}
                                className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800"
                            >
                                <Text className="text-center font-bold text-slate-900 dark:text-white">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                className="flex-1 py-4 rounded-2xl bg-[#f97316]"
                                disabled={!chatMessage.trim()}
                            >
                                <Text className="text-center font-bold text-white">Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
