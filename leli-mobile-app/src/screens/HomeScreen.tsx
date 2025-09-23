import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'vehicles', name: 'Vehicles', icon: 'car-outline', color: '#3B82F6' },
    { id: 'homes', name: 'Homes', icon: 'home-outline', color: '#10B981' },
    { id: 'equipment', name: 'Equipment', icon: 'construct-outline', color: '#F59E0B' },
    { id: 'sports', name: 'Sports', icon: 'football-outline', color: '#EF4444' },
    { id: 'tech', name: 'Electronics', icon: 'phone-portrait-outline', color: '#8B5CF6' },
    { id: 'fashion', name: 'Fashion', icon: 'shirt-outline', color: '#EC4899' },
  ];

  const featuredListings = [
    {
      id: '1',
      title: 'Luxury Camera Collection',
      price: 45,
      location: 'Nairobi',
      image: 'https://via.placeholder.com/300x200',
      rating: 4.8,
      reviews: 124,
    },
    {
      id: '2',
      title: 'Modern Apartment',
      price: 120,
      location: 'Mombasa',
      image: 'https://via.placeholder.com/300x200',
      rating: 4.9,
      reviews: 89,
    },
    {
      id: '3',
      title: 'Professional Drone',
      price: 85,
      location: 'Kisumu',
      image: 'https://via.placeholder.com/300x200',
      rating: 4.7,
      reviews: 156,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Listings' as never, { 
        screen: 'ListingsMain',
        params: { search: searchQuery }
      } as never);
    }
  };

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('Listings' as never, { 
        screen: 'Categories',
        params: { category: category.id }
      } as never)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon as any} size={24} color={category.color} />
      </View>
      <Text style={[styles.categoryText, { color: theme.colors.onSurface }]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFeaturedListing = (listing: any) => (
    <TouchableOpacity
      key={listing.id}
      style={[styles.listingCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ListingDetail' as never, { id: listing.id } as never)}
    >
      <Image source={{ uri: listing.image }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={[styles.listingTitle, { color: theme.colors.onSurface }]}>
          {listing.title}
        </Text>
        <Text style={[styles.listingLocation, { color: theme.colors.onSurfaceVariant }]}>
          {listing.location}
        </Text>
        <View style={styles.listingFooter}>
          <Text style={[styles.listingPrice, { color: theme.colors.primary }]}>
            ${listing.price}/day
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
              {listing.rating} ({listing.reviews})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.appTitle}>Leli Rentals</Text>
              <Text style={styles.subtitle}>Find anything you need to rent</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.onSurface }]}
              placeholder="Search for items to rent..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Categories
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map(renderCategoryItem)}
          </View>
        </View>

        {/* Featured Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Featured Listings
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Listings' as never)}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.listingsContainer}>
              {featuredListings.map(renderFeaturedListing)}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (width - 60) / 3,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  listingsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  listingCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 160,
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default HomeScreen;
