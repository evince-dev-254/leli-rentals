import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const mockListings = [
  {
    id: '1',
    title: 'Luxury BMW X5',
    description: 'Premium SUV perfect for family trips and business travel',
    price: 150,
    currency: '$',
    category: 'vehicles',
    location: 'Nairobi, Kenya',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    rating: 4.8,
    reviews: 24,
    isAvailable: true,
    owner: {
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.9,
    },
  },
  {
    id: '2',
    title: 'Professional Camera Kit',
    description: 'Complete photography setup for events and professional shoots',
    price: 80,
    currency: '$',
    category: 'photography',
    location: 'Mombasa, Kenya',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    rating: 4.9,
    reviews: 18,
    isAvailable: true,
    owner: {
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.8,
    },
  },
  {
    id: '3',
    title: 'Modern 2-Bedroom Apartment',
    description: 'Spacious apartment in city center with all amenities',
    price: 120,
    currency: '$',
    category: 'homes',
    location: 'Kisumu, Kenya',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    rating: 4.7,
    reviews: 31,
    isAvailable: true,
    owner: {
      name: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.7,
    },
  },
  {
    id: '4',
    title: 'Construction Equipment Set',
    description: 'Heavy machinery for construction and industrial projects',
    price: 200,
    currency: '$',
    category: 'equipment',
    location: 'Eldoret, Kenya',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    rating: 4.6,
    reviews: 12,
    isAvailable: true,
    owner: {
      name: 'Sarah Wilson',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.9,
    },
  },
  {
    id: '5',
    title: 'Designer Fashion Collection',
    description: 'Premium designer clothing and accessories for special events',
    price: 60,
    currency: '$',
    category: 'fashion',
    location: 'Nakuru, Kenya',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    rating: 4.8,
    reviews: 22,
    isAvailable: true,
    owner: {
      name: 'Emma Brown',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.8,
    },
  },
];

export default function ListingsScreen() {
  const [listings, setListings] = useState(mockListings);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const navigation = useNavigation();
  const route = useRoute();
  const { isDark } = useTheme();

  const filters = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'vehicles', label: 'Vehicles', icon: 'car-outline' },
    { id: 'homes', label: 'Homes', icon: 'home-outline' },
    { id: 'equipment', label: 'Equipment', icon: 'construct-outline' },
    { id: 'photography', label: 'Photography', icon: 'camera-outline' },
    { id: 'fashion', label: 'Fashion', icon: 'shirt-outline' },
  ];

  useEffect(() => {
    const category = route.params?.category;
    if (category && category !== 'all') {
      setSelectedFilter(category);
      filterListings(category, searchQuery);
    }
  }, [route.params]);

  useEffect(() => {
    filterListings(selectedFilter, searchQuery);
  }, [selectedFilter, searchQuery]);

  const filterListings = (filter: string, query: string) => {
    let filtered = listings;

    if (filter !== 'all') {
      filtered = filtered.filter(listing => listing.category === filter);
    }

    if (query.trim()) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        listing.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredListings(filtered);
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
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      flex: 1,
    },
    backButton: {
      padding: 5,
      marginRight: 10,
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
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    filterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
    },
    activeFilter: {
      backgroundColor: '#FF6B35',
    },
    filterText: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#374151',
      marginLeft: 5,
    },
    activeFilterText: {
      color: '#FFFFFF',
    },
    resultsContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
    },
    resultsCount: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#1F2937',
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sortText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginRight: 5,
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
    ownerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    ownerAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 8,
    },
    ownerName: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      flex: 1,
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
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>
        <View style={styles.ownerInfo}>
          <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} />
          <Text style={styles.ownerName}>by {item.owner.name}</Text>
          <View style={styles.listingRating}>
            <Ionicons name="star" size={12} color="#FCD34D" />
            <Text style={styles.ratingText}>{item.owner.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNoResults = () => (
    <View style={styles.noResults}>
      <Ionicons name="search-outline" size={64} color={isDark ? '#374151' : '#D1D5DB'} />
      <Text style={styles.noResultsText}>
        No listings found
      </Text>
      <Text style={[styles.noResultsText, { marginTop: 8 }]}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listings</Text>
          <View style={{ width: 34 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterItem,
                selectedFilter === item.id && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={
                  selectedFilter === item.id
                    ? '#FFFFFF'
                    : isDark
                    ? '#FFFFFF'
                    : '#374151'
                }
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item.id && styles.activeFilterText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredListings.length} listings found
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort</Text>
            <Ionicons name="chevron-down" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {filteredListings.length > 0 ? (
          <FlatList
            data={filteredListings}
            renderItem={renderListing}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          renderNoResults()
        )}
      </View>
    </SafeAreaView>
  );
}
