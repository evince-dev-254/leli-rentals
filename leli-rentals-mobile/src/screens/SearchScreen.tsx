import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const mockListings = [
  {
    id: '1',
    title: 'Luxury BMW X5',
    description: 'Premium SUV perfect for family trips',
    price: 150,
    currency: '$',
    category: 'vehicles',
    location: 'Nairobi, Kenya',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    rating: 4.8,
    reviews: 24,
    isAvailable: true,
  },
  {
    id: '2',
    title: 'Professional Camera Kit',
    description: 'Complete photography setup for events',
    price: 80,
    currency: '$',
    category: 'photography',
    location: 'Mombasa, Kenya',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    rating: 4.9,
    reviews: 18,
    isAvailable: true,
  },
  {
    id: '3',
    title: 'Modern Apartment',
    description: '2-bedroom apartment in city center',
    price: 120,
    currency: '$',
    category: 'homes',
    location: 'Kisumu, Kenya',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    rating: 4.7,
    reviews: 31,
    isAvailable: true,
  },
  {
    id: '4',
    title: 'Construction Equipment',
    description: 'Heavy machinery for construction projects',
    price: 200,
    currency: '$',
    category: 'equipment',
    location: 'Eldoret, Kenya',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    rating: 4.6,
    reviews: 12,
    isAvailable: true,
  },
];

const popularSearches = [
  'BMW cars',
  'Camera equipment',
  'Apartments',
  'Construction tools',
  'Event spaces',
  'Fashion items',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockListings);
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search
      setTimeout(() => {
        setSearchResults(mockListings.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        setIsSearching(false);
      }, 1000);
    }
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    setSearchResults(mockListings.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleListingPress = (listing: any) => {
    navigation.navigate('ListingDetail' as never, { listing } as never);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    header: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginLeft: 10,
    },
    searchButton: {
      backgroundColor: '#FF6B35',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginTop: 20,
      marginBottom: 15,
    },
    popularSearchContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    popularSearchItem: {
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      marginBottom: 10,
    },
    popularSearchText: {
      color: isDark ? '#FFFFFF' : '#374151',
      fontSize: 14,
    },
    resultsCount: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 15,
    },
    listingCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    listingImage: {
      width: '100%',
      height: 200,
    },
    listingContent: {
      padding: 15,
    },
    listingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    listingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      flex: 1,
    },
    listingPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF6B35',
    },
    listingDescription: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 10,
      lineHeight: 20,
    },
    listingFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listingLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    locationText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginLeft: 4,
    },
    listingRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginLeft: 4,
    },
    noResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    noResultsText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginTop: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    loadingText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 15,
    },
  });

  const renderListing = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleListingPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle}>{item.title}</Text>
          <Text style={styles.listingPrice}>
            {item.currency}{item.price}/day
          </Text>
        </View>
        <Text style={styles.listingDescription}>{item.description}</Text>
        <View style={styles.listingFooter}>
          <View style={styles.listingLocation}>
            <Ionicons name="location-outline" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.listingRating}>
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviews} reviews)
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNoResults = () => (
    <View style={styles.noResults}>
      <Ionicons name="search-outline" size={64} color={isDark ? '#374151' : '#D1D5DB'} />
      <Text style={styles.noResultsText}>
        No results found for "{searchQuery}"
      </Text>
      <Text style={[styles.noResultsText, { marginTop: 8 }]}>
        Try searching with different keywords
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <Ionicons name="search" size={64} color="#FF6B35" />
      <Text style={styles.loadingText}>Searching...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rentals..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {!searchQuery ? (
          <>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.popularSearchContainer}>
              {popularSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularSearchItem}
                  onPress={() => handlePopularSearch(search)}
                >
                  <Text style={styles.popularSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {isSearching ? 'Searching...' : `${searchResults.length} results found`}
            </Text>
            
            {isSearching ? (
              renderLoading()
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderListing}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              renderNoResults()
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
