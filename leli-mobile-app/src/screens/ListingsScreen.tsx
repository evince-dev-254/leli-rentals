import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

const { width } = Dimensions.get('window');

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  features: string[];
  availability: string[];
  saved: boolean;
  liked: boolean;
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Luxury BMW X5 SUV',
    description: 'Premium SUV perfect for family trips and business travel. Fully equipped with latest technology.',
    price: 15631,
    location: 'Eldoret, Kenya',
    category: 'vehicles',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
    ],
    rating: 4.8,
    reviews: 124,
    owner: {
      name: 'John Mwangi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      verified: true,
    },
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Leather Seats'],
    availability: ['Available now', 'Weekend bookings'],
    saved: false,
    liked: false,
  },
  {
    id: '2',
    title: 'Modern 2-Bedroom Apartment',
    description: 'Beautiful modern apartment in the heart of Nairobi with stunning city views.',
    price: 8500,
    location: 'Nairobi, Kenya',
    category: 'homes',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    ],
    rating: 4.9,
    reviews: 89,
    owner: {
      name: 'Sarah Kimani',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      verified: true,
    },
    features: ['WiFi', 'Parking', 'Kitchen', 'Balcony'],
    availability: ['Available now', 'Monthly rentals'],
    saved: false,
    liked: false,
  },
  {
    id: '3',
    title: 'Professional Camera Kit',
    description: 'Complete photography kit with DSLR camera, lenses, and professional accessories.',
    price: 3200,
    location: 'Mombasa, Kenya',
    category: 'photography',
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    ],
    rating: 4.7,
    reviews: 156,
    owner: {
      name: 'David Ochieng',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      verified: true,
    },
    features: ['DSLR Camera', 'Multiple Lenses', 'Tripod', 'Memory Cards'],
    availability: ['Available now', 'Weekend shoots'],
    saved: false,
    liked: false,
  },
  {
    id: '4',
    title: 'Mountain Bike Collection',
    description: 'High-quality mountain bikes perfect for adventure and outdoor activities.',
    price: 1800,
    location: 'Kisumu, Kenya',
    category: 'sports',
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    ],
    rating: 4.6,
    reviews: 92,
    owner: {
      name: 'Grace Wanjiku',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      verified: true,
    },
    features: ['Full Suspension', 'Helmet Included', 'Maintenance Kit', 'Insurance'],
    availability: ['Available now', 'Daily rentals'],
    saved: false,
    liked: false,
  },
];

const categories = [
  { id: 'all', name: 'All Categories', icon: 'grid-outline' },
  { id: 'vehicles', name: 'Vehicles', icon: 'car-outline' },
  { id: 'homes', name: 'Homes', icon: 'home-outline' },
  { id: 'equipment', name: 'Equipment', icon: 'construct-outline' },
  { id: 'events', name: 'Events', icon: 'musical-notes-outline' },
  { id: 'fashion', name: 'Fashion', icon: 'shirt-outline' },
  { id: 'tech', name: 'Tech', icon: 'phone-portrait-outline' },
  { id: 'sports', name: 'Sports', icon: 'football-outline' },
];

const ListingsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(mockListings);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });

  // Get initial search from route params
  useEffect(() => {
    const params = route.params as any;
    if (params?.search) {
      setSearchQuery(params.search);
    }
    if (params?.category) {
      setSelectedCategory(params.category);
    }
  }, [route.params]);

  // Filter listings based on search and category
  useEffect(() => {
    let filtered = [...listings];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return 0; // Keep original order for newest
      }
    });

    setFilteredListings(filtered);
  }, [listings, selectedCategory, searchQuery, sortBy]);

  const handleSearch = () => {
    // Search is handled in useEffect
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleSave = (listingId: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, saved: !listing.saved }
        : listing
    ));
  };

  const toggleLike = (listingId: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, liked: !listing.liked }
        : listing
    ));
  };

  const handleShare = (listing: Listing) => {
    Alert.alert('Share', `Share ${listing.title} with friends!`);
  };

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        {
          backgroundColor: selectedCategory === category.id 
            ? theme.colors.primary 
            : theme.colors.surface,
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon as any}
        size={20}
        color={selectedCategory === category.id 
          ? 'white' 
          : theme.colors.onSurfaceVariant
        }
      />
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedCategory === category.id 
              ? 'white' 
              : theme.colors.onSurfaceVariant
          }
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderListingCard = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={[styles.listingCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ListingDetail' as never, { id: item.id } as never)}
    >
      <View style={styles.listingImageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
        
        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => toggleSave(item.id)}
        >
          <Ionicons
            name={item.saved ? 'heart' : 'heart-outline'}
            size={20}
            color={item.saved ? colors.red : 'white'}
          />
        </TouchableOpacity>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {categories.find(c => c.id === item.category)?.name}
          </Text>
        </View>
      </View>

      <View style={styles.listingContent}>
        <Text style={[styles.listingTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.listingLocation}>
          <Ionicons name="location-outline" size={14} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.locationText, { color: theme.colors.onSurfaceVariant }]}>
            {item.location}
          </Text>
        </View>

        <View style={styles.ownerInfo}>
          <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} />
          <View style={styles.ownerDetails}>
            <Text style={[styles.ownerName, { color: theme.colors.onSurface }]}>
              {item.owner.name}
            </Text>
            {item.owner.verified && (
              <Ionicons name="shield-checkmark" size={12} color={colors.success} />
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.yellow} />
            <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>

        <View style={styles.listingFooter}>
          <Text style={[styles.listingPrice, { color: theme.colors.primary }]}>
            KSh {item.price.toLocaleString()}/day
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => toggleLike(item.id)}
            >
              <Ionicons
                name={item.liked ? 'thumbs-up' : 'thumbs-up-outline'}
                size={16}
                color={item.liked ? colors.blue : theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => handleShare(item)}
            >
              <Ionicons name="share-outline" size={16} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <View style={[styles.filterModal, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.filterHeader}>
        <Text style={[styles.filterTitle, { color: theme.colors.onSurface }]}>Filters</Text>
        <TouchableOpacity onPress={() => setShowFilters(false)}>
          <Ionicons name="close" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.filterContent}>
        <View style={styles.filterSection}>
          <Text style={[styles.filterSectionTitle, { color: theme.colors.onSurface }]}>Sort By</Text>
          {[
            { value: 'newest', label: 'Newest First' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'rating', label: 'Highest Rated' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.filterOption}
              onPress={() => setSortBy(option.value)}
            >
              <Text style={[styles.filterOptionText, { color: theme.colors.onSurface }]}>
                {option.label}
              </Text>
              {sortBy === option.value && (
                <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.searchContainer}>
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
            style={[styles.filterButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid-outline" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list-outline" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, { color: theme.colors.onSurfaceVariant }]}>
          {filteredListings.length} listings found
        </Text>
      </View>

      {/* Listings */}
      <FlatList
        data={filteredListings}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.listingsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      {showFilters && renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  filterButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  viewModeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  viewModeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  categoryText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultsText: {
    fontSize: 14,
  },
  listingsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  listingCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImageContainer: {
    height: 160,
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  listingContent: {
    padding: spacing.md,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  ownerDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: spacing.xs,
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
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  filterSection: {
    paddingVertical: spacing.lg,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  filterOptionText: {
    fontSize: 16,
  },
});

export default ListingsScreen;