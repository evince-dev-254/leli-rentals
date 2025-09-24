import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const categories = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    description: 'Cars, motorcycles, trucks & more',
    count: '1,800+ listings',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
    icon: 'car',
    color: '#3B82F6',
    popular: true,
  },
  {
    id: 'equipment',
    name: 'Equipment',
    description: 'Professional & DIY tools',
    count: '3,200+ listings',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    icon: 'construct',
    color: '#F97316',
    popular: true,
  },
  {
    id: 'homes',
    name: 'Homes & Apartments',
    description: 'Short-term rentals & vacation homes',
    count: '2,500+ listings',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    icon: 'home',
    color: '#10B981',
    popular: true,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets, computers & tech accessories',
    count: '950+ listings',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    icon: 'laptop',
    color: '#8B5CF6',
    popular: true,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing, jewelry & accessories',
    count: '1,200+ listings',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    icon: 'shirt',
    color: '#EC4899',
    popular: true,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Music, gaming & entertainment',
    count: '850+ listings',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    icon: 'musical-notes',
    color: '#6366F1',
    popular: true,
  },
];

const features = [
  {
    icon: 'search',
    title: 'Easy Search',
    description: 'Find exactly what you need with our powerful search and filtering system.',
  },
  {
    icon: 'checkmark-circle',
    title: 'Verified Listings',
    description: 'All our rentals are verified and quality-checked for your peace of mind.',
  },
  {
    icon: 'flash',
    title: 'Instant Booking',
    description: 'Book instantly with our streamlined reservation system.',
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search' as never, { query: searchQuery } as never);
    }
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Listings' as never, { category: category.id } as never);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    },
    heroSection: {
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    heroSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 30,
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    searchContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 15,
      padding: 15,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 10,
    },
    searchText: {
      flex: 1,
      fontSize: 16,
      color: '#374151',
      marginLeft: 10,
    },
    searchButton: {
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    searchButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      textAlign: 'center',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginBottom: 30,
    },
    featureCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      marginHorizontal: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    featureIcon: {
      width: 60,
      height: 60,
      backgroundColor: '#FFF7ED',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 8,
      textAlign: 'center',
    },
    featureDescription: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 20,
    },
    categoryCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 15,
      marginHorizontal: 8,
      width: (width - 60) / 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    categoryImage: {
      width: '100%',
      height: 120,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    categoryContent: {
      padding: 15,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      flex: 1,
    },
    popularBadge: {
      backgroundColor: '#FCD34D',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    popularText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 2,
    },
    categoryDescription: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    categoryCount: {
      fontSize: 12,
      color: '#FF6B35',
      fontWeight: '600',
    },
    ctaSection: {
      backgroundColor: '#FF6B35',
      marginHorizontal: 20,
      borderRadius: 20,
      padding: 30,
      alignItems: 'center',
      marginVertical: 30,
    },
    ctaTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 10,
    },
    ctaSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 25,
      opacity: 0.9,
    },
    ctaButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginBottom: 10,
      width: '100%',
      alignItems: 'center',
    },
    ctaButtonText: {
      color: '#FF6B35',
      fontSize: 16,
      fontWeight: '600',
    },
    sectionContainer: {
      paddingHorizontal: 20,
      paddingVertical: 30,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#FF6B35', '#F97316', '#EA580C']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.heroTitle}>Find Your Perfect Rental</Text>
          <Text style={styles.heroSubtitle}>
            Discover amazing rentals for every occasion.{'\n'}From cars to equipment, we've got you covered.
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Ionicons name="search" size={20} color="#6B7280" />
              <TextInput
                style={styles.searchText}
                placeholder="What are you looking for?"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Why Choose Us Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Why Choose Leli Rentals?</Text>
          <Text style={styles.sectionSubtitle}>
            Experience the future of rentals with our modern platform
          </Text>

          <FlatList
            data={features}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={item.icon as any} size={30} color="#FF6B35" />
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            )}
          />
        </View>

        {/* Popular Categories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <Text style={styles.sectionSubtitle}>
            Discover our most popular rental categories with thousands of verified listings
          </Text>

          <FlatList
            data={categories}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                <View style={styles.categoryContent}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{item.name}</Text>
                    {item.popular && (
                      <View style={styles.popularBadge}>
                        <Ionicons name="star" size={10} color="#FFFFFF" />
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.categoryDescription}>{item.description}</Text>
                  <Text style={styles.categoryCount}>{item.count}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Join the Sharing Economy?</Text>
          <Text style={styles.ctaSubtitle}>
            Whether you want to rent items or earn money by listing your own, we'll help you get started.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
