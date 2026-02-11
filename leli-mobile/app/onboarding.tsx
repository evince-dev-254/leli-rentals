import { router } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions, Platform } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing
} from 'react-native-reanimated';
import ScreenBackground from '../components/ui/ScreenBackground';

const StyledSafeAreaView = styled(SafeAreaView);

const slides = [
    {
        id: '1',
        title: 'Premium Spaces',
        description: 'Discover luxury apartments, cozy homes, and professional workspaces tailored to your needs.',
        image: { uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop' },
    },
    {
        id: '2',
        title: 'Elite Vehicles',
        description: 'Rent top-tier luxury cars and SUVs for your next journey or business meeting.',
        image: { uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
    },
    {
        id: '3',
        title: 'Pro Equipment',
        description: 'Get the best cameras, drones, and professional gear delivered to your doorstep instantly.',
        image: { uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop' },
        isLast: true
    },
];

export default function OnboardingScreen() {
    const { width, height } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/login');
        }
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <StyledSafeAreaView className="flex-1">
                {/* Brand Header */}
                <Animated.View
                    entering={FadeInUp.delay(200).duration(800)}
                    className="flex-row justify-between items-center px-8 pt-4 mb-4"
                >
                    <Image
                        source={require('../assets/images/logo.png')}
                        className="h-10 w-32"
                        resizeMode="contain"
                    />
                    {!slides[currentIndex].isLast && (
                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/login')}
                            className="bg-slate-50/50 px-4 py-2 rounded-xl border border-slate-100"
                        >
                            <Text className="text-slate-500 font-outfit-bold text-xs uppercase tracking-wider">Skip</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                <FlatList
                    ref={flatListRef}
                    data={slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(index);
                    }}
                    renderItem={({ item, index: i }) => (
                        <View style={{ width }} className="flex-1 items-center justify-center px-10">
                            {/* Image Container with Float Effect */}
                            <Animated.View
                                entering={FadeInRight.delay(300).springify()}
                                className="mb-12 items-center justify-center"
                            >
                                <View className="w-72 h-72 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl relative">
                                    <Image
                                        source={item.image}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                    {/* Glass Overlay for depth */}
                                    <View className="absolute inset-x-0 bottom-0 h-1/3 bg-black/20 backdrop-blur-sm" />
                                </View>

                                {/* Geometric Accents */}
                                <View className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-orange-400/20 rounded-full blur-xl" />
                                <View className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(500).duration(800)}>
                                <Text className="text-[38px] font-outfit-bold text-center text-slate-900 mb-6 leading-[46px]">
                                    {item.title}
                                </Text>
                                <Text className="text-lg font-outfit text-center text-slate-500 px-2 leading-7">
                                    {item.description}
                                </Text>
                            </Animated.View>

                            {item.isLast && (
                                <Animated.View
                                    entering={FadeInUp.delay(800).springify()}
                                    className="w-full"
                                >
                                    <TouchableOpacity
                                        onPress={() => router.replace('/(auth)/login')}
                                        className="mt-12 bg-orange-500 w-full py-5 rounded-3xl shadow-xl shadow-orange-200 active:scale-95"
                                    >
                                        <Text className="text-center text-white font-outfit-bold text-xl uppercase tracking-wider">Get Started</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                        </View>
                    )}
                />

                {/* Footer Controls */}
                {!slides[currentIndex].isLast && (
                    <View className="h-44 items-center justify-start pt-6 px-10">
                        {/* Indicators */}
                        <View className="flex-row space-x-3 mb-12">
                            {slides.map((_, index) => {
                                const isActive = currentIndex === index;
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            width: isActive ? 32 : 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: isActive ? '#F97316' : '#E2E8F0',
                                        }}
                                        className="transition-all duration-300"
                                    />
                                );
                            })}
                        </View>

                        {/* Next Button with Circle Gradient Style */}
                        <TouchableOpacity
                            onPress={handleNext}
                            className="bg-slate-900 w-full py-5 rounded-3xl shadow-lg shadow-slate-200 active:scale-95 flex-row items-center justify-center"
                        >
                            <Text className="text-center text-white font-outfit-bold text-lg uppercase tracking-widest">Continue</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </StyledSafeAreaView>
        </View>
    );
}
