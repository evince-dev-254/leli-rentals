import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import {
    Home,
    Car,
    Smartphone,
    Hammer,
    Shirt,
    Music,
    PartyPopper,
    Camera,
    Dumbbell,
    Baby,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Search
} from 'lucide-react-native';
import { router } from 'expo-router';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';

// UIManager.setLayoutAnimationEnabledExperimental is a no-op in New Architecture
// and causes a warning when newArchEnabled is true in app.json.

const SafeAreaView = styled(SafeAreaViewContext);

const CATEGORIES = [
    {
        id: '1',
        name: 'Homes',
        icon: Home,
        color: '#3B82F6',
        bg: 'bg-blue-50',
        subCategories: ['Apartments', 'Villas', 'Cottages', 'Mansions', 'Bungalows']
    },
    {
        id: '2',
        name: 'Vehicles',
        icon: Car,
        color: '#F97316',
        bg: 'bg-orange-50',
        subCategories: ['Luxury Cars', 'SUVs', 'Sedans', 'Buses', 'Vans', 'Motorbikes']
    },
    {
        id: '3',
        name: 'Electronics',
        icon: Smartphone,
        color: '#A855F7',
        bg: 'bg-purple-50',
        subCategories: ['Phones', 'Laptops', 'Cameras', 'Audio', 'Accessories']
    },
    {
        id: '4',
        name: 'Equipment',
        icon: Hammer,
        color: '#EAB308',
        bg: 'bg-yellow-50',
        subCategories: ['Construction', 'Industrial', 'Farming', 'Power Tools']
    },
    {
        id: '5',
        name: 'Fashion',
        icon: Shirt,
        color: '#EC4899',
        bg: 'bg-pink-50',
        subCategories: ["Men's Wear", "Women's Wear", "Shoes", "Accessories", "Watches"]
    },
    {
        id: '6',
        name: 'Entertainment',
        icon: Music,
        color: '#6366F1',
        bg: 'bg-indigo-50',
        subCategories: ['DJ Gear', 'Sound Systems', 'Lighting', 'Gaming Consoles']
    },
    {
        id: '7',
        name: 'Events',
        icon: PartyPopper,
        color: '#F43F5E',
        bg: 'bg-rose-50',
        subCategories: ['Tents', 'Chairs', 'Decor', 'Venues', 'Catering Equipment']
    },
    {
        id: '8',
        name: 'Photography',
        icon: Camera,
        color: '#06B6D4',
        bg: 'bg-cyan-50',
        subCategories: ['Cameras', 'Lenses', 'Drones', 'Lighting', 'Tripods']
    },
    {
        id: '9',
        name: 'Fitness',
        icon: Dumbbell,
        color: '#22C55E',
        bg: 'bg-green-50',
        subCategories: ['Gym Equipment', 'Treadmills', 'Weights', 'Bicycles']
    },
    {
        id: '10',
        name: 'Baby',
        icon: Baby,
        color: '#14B8A6',
        bg: 'bg-teal-50',
        subCategories: ['Strollers', 'Cribs', 'Car Seats', 'Toys']
    }
];

export default function CategoriesScreen() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <ScreenHeader title="Categories" />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                >
                    <Text className="text-slate-500 font-outfit mb-6">
                        Explore our wide range of categories to find exactly what you need.
                    </Text>

                    <View className="pb-8">
                        {CATEGORIES.map((cat) => {
                            const isExpanded = expandedId === cat.id;
                            const Icon = cat.icon;

                            return (
                                <View key={cat.id} className="mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => toggleExpand(cat.id)}
                                        className="flex-row items-center p-4"
                                    >
                                        <View className={`w-12 h-12 rounded-xl items-center justify-center ${cat.bg}`}>
                                            <Icon size={24} color={cat.color} />
                                        </View>
                                        <View className="flex-1 ml-4">
                                            <Text className="text-lg font-outfit-bold text-slate-800">{cat.name}</Text>
                                            <Text className="text-xs font-outfit text-slate-400">
                                                {cat.subCategories.length} subcategories
                                            </Text>
                                        </View>
                                        <View className="w-8 h-8 bg-slate-50 rounded-full items-center justify-center">
                                            {isExpanded ? (
                                                <ChevronUp size={20} color="#94A3B8" />
                                            ) : (
                                                <ChevronDown size={20} color="#94A3B8" />
                                            )}
                                        </View>
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View className="bg-slate-50 px-4 pb-2">
                                            {cat.subCategories.map((sub, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => router.push({ pathname: '/listing/[category]', params: { category: sub } })}
                                                    className="flex-row items-center py-3 border-b border-slate-100 last:border-0"
                                                >
                                                    <View className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3" />
                                                    <Text className="flex-1 font-outfit-medium text-slate-600">{sub}</Text>
                                                    <ChevronRight size={14} color="#CBD5E1" />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
