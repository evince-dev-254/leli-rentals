import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import {
  Search,
  MapPin,
  Star,
  LayoutGrid,
  Heart,
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
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotifications } from '../../context/NotificationContext';
import { useFavorites } from '../../context/FavoritesContext';

const SafeAreaView = styled(SafeAreaViewContext);

const CATEGORIES = [
  { id: '1', name: 'Homes', icon: Home, color: '#3B82F6', bg: 'bg-blue-50', subCategories: ['Apartments', 'Villas', 'Cottages', 'Mansions', 'Bungalows'] },
  { id: '2', name: 'Vehicles', icon: Car, color: '#F97316', bg: 'bg-orange-50', subCategories: ['Luxury Cars', 'SUVs', 'Sedans', 'Buses', 'Vans', 'Motorbikes'] },
  { id: '3', name: 'Electronics', icon: Smartphone, color: '#A855F7', bg: 'bg-purple-50', subCategories: ['Phones', 'Laptops', 'Cameras', 'Audio', 'Accessories'] },
  { id: '4', name: 'Equipment', icon: Hammer, color: '#EAB308', bg: 'bg-yellow-50', subCategories: ['Construction', 'Industrial', 'Farming', 'Power Tools'] },
  { id: '5', name: 'Fashion', icon: Shirt, color: '#EC4899', bg: 'bg-pink-50', subCategories: ["Men's Wear", "Women's Wear", "Shoes", "Accessories", "Watches"] },
  { id: '6', name: 'Entertainment', icon: Music, color: '#6366F1', bg: 'bg-indigo-50', subCategories: ['DJ Gear', 'Sound Systems', 'Lighting', 'Gaming Consoles'] },
  { id: '7', name: 'Events', icon: PartyPopper, color: '#F43F5E', bg: 'bg-rose-50', subCategories: ['Tents', 'Chairs', 'Decor', 'Venues', 'Catering Equipment'] },
  { id: '8', name: 'Photography', icon: Camera, color: '#06B6D4', bg: 'bg-cyan-50', subCategories: ['Cameras', 'Lenses', 'Drones', 'Lighting', 'Tripods'] },
  { id: '9', name: 'Fitness', icon: Dumbbell, color: '#22C55E', bg: 'bg-green-50', subCategories: ['Gym Equipment', 'Treadmills', 'Weights', 'Bicycles'] },
  { id: '10', name: 'Baby', icon: Baby, color: '#14B8A6', bg: 'bg-teal-50', subCategories: ['Strollers', 'Cribs', 'Car Seats', 'Toys'] }
];

const RECOMMENDATIONS = [
  {
    id: 'luxury-villa-diani',
    title: 'Luxury Villa in Diani',
    location: 'Diani Beach, Kenya',
    price: '$450',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    category: 'Homes',
  },
  {
    id: 'modern-apartment-westlands',
    title: 'Modern Apartment',
    location: 'Westlands, Nairobi',
    price: '$120',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    category: 'Homes',
  },
];

const TRENDING_VEHICLES = [
  {
    id: 'range-rover-sport',
    title: 'Range Rover Sport',
    location: 'Lavington, Nairobi',
    price: '$250',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1606148332115-568972879307?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mercedes-gle',
    title: 'Mercedes GLE 450',
    location: 'Kilimani, Nairobi',
    price: '$200',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
  },
];

const LATEST_GEAR = [
  {
    id: 'sony-a7iv',
    title: 'Sony A7 IV Camera',
    location: 'CBD, Nairobi',
    price: '$50',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'dji-mavic-3',
    title: 'DJI Mavic 3 Drone',
    location: 'Westlands, Nairobi',
    price: '$80',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=400&q=80',
  },
];

export default function HomeScreen() {
  const { addNotification } = useNotifications();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchValue, setSearchValue] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<string[]>([]);

  const handleCategoryPress = (category: any) => {
    // Navigate to categories tab but ideally could open specific category
    // For now, let's keep it simple or navigate to listing of first subcategory
    if (category.subCategories.length > 0) {
      router.push(`/listing/${category.subCategories[0]}` as any);
    } else {
      router.push('/(tabs)/categories');
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    if (text.trim().length > 1) {
      const results: string[] = [];
      CATEGORIES.forEach(cat => {
        cat.subCategories.forEach(sub => {
          if (sub.toLowerCase().includes(text.toLowerCase())) {
            results.push(sub);
          }
        });
      });
      setSearchResults(results.slice(0, 5)); // Limit to 5
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      // Deep search or listing page
      router.push(`/listing/${searchValue}` as any);
      setSearchValue('');
      setSearchResults([]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchValue('');
    setSearchResults([]);
    router.push(`/listing/${suggestion}` as any);
  };

  const handlePropertyPress = async (id: string, title: string) => {
    await addNotification({
      title: 'Property Details',
      description: `Viewing details for ${title}...`,
      type: 'info',
      iconName: 'Info',
    });
    router.push(`/property/${id}` as any);
  };

  const handleListProperty = async () => {
    await addNotification({
      title: 'Property Listing',
      description: 'Property listing feature coming soon! Thank you for your interest.',
      type: 'success',
      iconName: 'Home',
    });
  };

  const handleSaveRecommendation = async (item: any, e: any) => {
    e.stopPropagation();
    const liked = isFavorite(item.id);
    await toggleFavorite(item.id);
    await addNotification({
      title: liked ? 'Removed' : 'Saved',
      description: liked ? `${item.title} removed.` : `${item.title} saved.`,
      type: 'success',
      iconName: 'Heart',
    });
  };

  return (
    <View className="flex-1">
      <ScreenBackground />
      <SafeAreaView className="flex-1 px-6 pt-4">
        {/* Header */}
        <ScreenHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          {/* Hero Section */}
          <View className="mb-8 mt-2">
            <Text className="text-sm font-outfit-medium text-orange-500 uppercase tracking-widest mb-1">Explore Leli Universe</Text>
            <Text className="text-[34px] font-outfit-bold text-slate-900 leading-[42px]">Rent anything, anywhere in Kenya</Text>
          </View>

          {/* Search Bar - Floating Style */}
          <View className="z-50 mb-8 relative">
            <View className="flex-row items-center bg-white border border-slate-100 rounded-[24px] px-6 py-4 shadow-xl shadow-slate-100">
              <Search size={22} color="#94A3B8" />
              <TextInput
                placeholder="Search homes, cars, drones..."
                className="flex-1 ml-3 font-outfit text-slate-800 text-base"
                placeholderTextColor="#94A3B8"
                value={searchValue}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearchSubmit}
              />
              <TouchableOpacity
                onPress={handleSearchSubmit}
                className="w-10 h-10 bg-orange-500 rounded-2xl items-center justify-center shadow-lg shadow-orange-200"
              >
                <LayoutGrid size={18} color="white" />
              </TouchableOpacity>
            </View>

            {/* Search Suggestions */}
            {searchResults.length > 0 && (
              <View className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSuggestionPress(result)}
                    className="flex-row items-center p-3 border-b border-slate-50 last:border-0"
                  >
                    <Search size={14} color="#CBD5E1" className="mr-3" />
                    <Text className="flex-1 font-outfit text-slate-600">{result}</Text>
                    <ChevronRight size={14} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quick Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-2">
            {['All', 'Nearby', 'Luxury', 'Budget', 'Verified', 'Trending'].map((filter, i) => (
              <TouchableOpacity
                key={i}
                className={`mx-2 px-6 py-2.5 rounded-full border ${i === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <Text className={`font-outfit-medium text-sm ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Categories Horizontal */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-outfit-bold text-slate-900">Top Categories</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
                <Text className="text-orange-500 font-outfit-bold text-sm">See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => handleCategoryPress(cat)}
                    className="items-center mx-3"
                  >
                    <View className={`w-[72px] h-[72px] rounded-[28px] items-center justify-center mb-2 shadow-sm border border-white/50 ${cat.bg}`}>
                      <Icon size={30} color={cat.color} />
                    </View>
                    <Text className="font-outfit-bold text-slate-700 text-[11px]">{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Popular Homes - Horizontal Scroll */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-outfit-bold text-slate-900">Exclusive Stays</Text>
              <TouchableOpacity>
                <Text className="text-slate-400 font-outfit-medium text-sm">View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {RECOMMENDATIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePropertyPress(item.id, item.title)}
                  activeOpacity={0.9}
                  className="w-[280px] mx-3 bg-white rounded-[40px] shadow-xl shadow-slate-100 overflow-hidden border border-slate-50"
                >
                  <View className="h-44 w-full relative">
                    <Image source={{ uri: item.image }} className="w-full h-full" />
                    <View className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex-row items-center">
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text className="ml-1 font-outfit-bold text-slate-800 text-[10px]">{item.rating}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => handleSaveRecommendation(item, e)}
                      className="absolute top-4 left-4 w-9 h-9 bg-black/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20"
                    >
                      <Heart size={16} color={isFavorite(item.id) ? "#EF4444" : "white"} fill={isFavorite(item.id) ? "#EF4444" : "none"} />
                    </TouchableOpacity>
                  </View>
                  <View className="p-5">
                    <Text className="text-lg font-outfit-bold text-slate-900 mb-1" numberOfLines={1}>{item.title}</Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1 pr-2">
                        <MapPin size={12} color="#94A3B8" />
                        <Text className="ml-1 font-outfit text-slate-400 text-xs" numberOfLines={1}>{item.location}</Text>
                      </View>
                      <Text className="text-orange-500 font-outfit-bold text-base">{item.price}<Text className="text-slate-400 text-[10px] font-outfit">/d</Text></Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Latest Gear - Horizontal Scroll */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-outfit-bold text-slate-900">Latest Pro Gear</Text>
              <TouchableOpacity>
                <Text className="text-slate-400 font-outfit-medium text-sm">Explore</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {LATEST_GEAR.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePropertyPress(item.id, item.title)}
                  className="w-[220px] mx-3 bg-slate-50 rounded-[32px] overflow-hidden"
                >
                  <View className="h-32 w-full p-2">
                    <Image source={{ uri: item.image }} className="w-full h-full rounded-[24px]" />
                  </View>
                  <View className="p-4 pt-2">
                    <Text className="text-base font-outfit-bold text-slate-900 mb-1" numberOfLines={1}>{item.title}</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-slate-500 font-outfit text-xs">{item.price}<Text className="text-[10px]">/day</Text></Text>
                      <View className="flex-row items-center bg-white px-2 py-0.5 rounded-full border border-slate-100">
                        <Star size={10} color="#F59E0B" fill="#F59E0B" />
                        <Text className="ml-1 font-outfit-bold text-slate-700 text-[10px]">{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Trending Vehicles - Horizontal Scroll */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-outfit-bold text-slate-900">Elite Mobility</Text>
              <TouchableOpacity>
                <Text className="text-slate-400 font-outfit-medium text-sm">View Fleet</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {TRENDING_VEHICLES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePropertyPress(item.id, item.title)}
                  className="w-[300px] mx-3 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm"
                >
                  <View className="h-40 w-full relative">
                    <Image source={{ uri: item.image }} className="w-full h-full" />
                    <View className="absolute top-4 right-4 bg-orange-500 rounded-full px-3 py-1">
                      <Text className="text-white font-outfit-bold text-[10px]">VERIFIED</Text>
                    </View>
                  </View>
                  <View className="p-4 flex-row justify-between items-center">
                    <View>
                      <Text className="text-lg font-outfit-bold text-slate-900">{item.title}</Text>
                      <Text className="text-slate-400 font-outfit text-xs">{item.location}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-slate-900 font-outfit-bold text-lg">{item.price}</Text>
                      <Text className="text-slate-400 font-outfit text-[10px]">PER DAY</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* List Your Property Prompt */}
          <View className="bg-slate-900 p-8 rounded-[40px] flex-row items-center justify-between mb-6 overflow-hidden relative shadow-2xl">
            <View className="absolute top-[-20] right-[-20] w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
            <View className="absolute bottom-[-20] left-[-20] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <View className="flex-1 pr-6">
              <Text className="text-white text-2xl font-outfit-bold mb-2">Monetize Your Assets</Text>
              <Text className="text-slate-400 font-outfit text-sm">Join 10k+ owners earning with Leli Rentals.</Text>
            </View>
            <TouchableOpacity
              onPress={handleListProperty}
              className="w-16 h-16 bg-orange-500 rounded-3xl items-center justify-center shadow-lg shadow-orange-500/40"
            >
              <Text className="text-white text-3xl font-light">+</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
