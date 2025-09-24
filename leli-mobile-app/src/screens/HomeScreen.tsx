import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Categories matching website exactly
  const categories = [
    {
      id: 'vehicles',
      name: 'Vehicles',
      description: 'Cars, motorcycles, trucks & more',
      count: '1,800+ listings',
      icon: 'car-outline',
      color: colors.categoryColors.vehicles,
      bgColor: '#EBF8FF',
      image: 'https://images.unsplash.com/photo-1562141961-2d67d4d8a7e4?w=400&h=300&fit=crop',
      features: ['Insurance included', '24/7 support', 'Flexible pickup'],
    },
    {
      id: 'equipment',
      name: 'Equipment',
      description: 'Professional & DIY tools',
      count: '3,200+ listings',
      icon: 'construct-outline',
      color: colors.categoryColors.equipment,
      bgColor: '#FEF3C7',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      features: ['Professional grade', 'Delivery available', 'Training included'],
    },
    {
      id: 'homes',
      name: 'Homes & Apartments',
      description: 'Short-term rentals & vacation homes',
      count: '2,500+ listings',
      icon: 'home-outline',
      color: colors.categoryColors.homes,
      bgColor: '#D1FAE5',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      features: ['Fully furnished', 'Utilities included', 'Flexible terms'],
    },
    {
      id: 'tech',
      name: 'Electronics',
      description: 'Gadgets, computers & tech accessories',
      count: '950+ listings',
      icon: 'phone-portrait-outline',
      color: colors.categoryColors.tech,
      bgColor: '#F3E8FF',
      image: 'https://images.unsplash.com/photo-1498049794561-7780c7234c63?w=400&h=300&fit=crop',
      features: ['Latest models', 'Warranty included', 'Tech support'],
    },
    {
      id: 'fashion',
      name: 'Fashion',
      description: 'Clothing, jewelry & accessories',
      count: '1,200+ listings',
      icon: 'shirt-outline',
      color: colors.categoryColors.fashion,
      bgColor: '#FCE7F3',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      features: ['Designer brands', 'Size matching', 'Styling advice'],
    },
    {
      id: 'events',
      name: 'Entertainment',
      description: 'Music, gaming & entertainment',
      count: '850+ listings',
      icon: 'musical-notes-outline',
      color: colors.categoryColors.events,
      bgColor: '#E0E7FF',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      features: ['Professional setup', 'Delivery & setup', 'Expert guidance'],
    },
  ];

  const featuredListings = [
    {
      id: '1',
      title: 'Luxury BMW X5 SUV',
      price: 15631,
      location: 'Eldoret, Kenya',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      category: 'vehicles',
      owner: 'John Mwangi',
      verified: true,
    },
    {
      id: '2',
      title: 'Modern 2-Bedroom Apartment',
      price: 8500,
      location: 'Nairobi, Kenya',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      category: 'homes',
      owner: 'Sarah Kimani',
      verified: true,
    },
    {
      id: '3',
      title: 'Professional Camera Kit',
      price: 3200,
      location: 'Mombasa, Kenya',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      category: 'photography',
      owner: 'David Ochieng',
      verified: true,
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

  const renderHeroSection = () => (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.heroSection}
    >
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>Find Your Perfect Rental</Text>
        <Text style={styles.heroSubtitle}>
          Discover amazing rentals for every occasion.{'\n'}From cars to equipment, we've got you covered.
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.onSurface }]}
              placeholder="What are you looking for?"
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
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderWhyChooseSection = () => (
    <View style={styles.whyChooseSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Why Choose Leli Rentals?
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Experience the future of rentals with our modern platform
      </Text>
      
      <View style={styles.featuresGrid}>
        <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="search" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>Easy Search</Text>
          <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
            Find exactly what you need with our powerful search and filtering system.
          </Text>
        </View>

        <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>Verified Listings</Text>
          <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
            All our rentals are verified and quality-checked for your peace of mind.
          </Text>
        </View>

        <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="flash" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>Instant Booking</Text>
          <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
            Book instantly with our streamlined reservation system.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('Listings' as never, { 
        screen: 'Categories',
        params: { category: item.id }
      } as never)}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.categoryImageOverlay}
        />
        
        {/* Popular Badge */}
        <View style={styles.popularBadge}>
          <Ionicons name="star" size={12} color="white" />
          <Text style={styles.popularText}>Popular</Text>
        </View>
        
        {/* Category Icon */}
        <View style={[styles.categoryIconContainer, { backgroundColor: item.bgColor }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        
        {/* Category Info */}
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
          <View style={styles.categoryFooter}>
            <Text style={styles.categoryCount}>{item.count}</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </View>
        </View>
      </View>
      
      {/* Features */}
      <View style={styles.categoryFeatures}>
        {item.features.slice(0, 2).map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
            <Text style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedListing = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.listingCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ListingDetail' as never, { id: item.id } as never)}
    >
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={[styles.listingTitle, { color: theme.colors.onSurface }]}>
          {item.title}
        </Text>
        <Text style={[styles.listingLocation, { color: theme.colors.onSurfaceVariant }]}>
          <Ionicons name="location-outline" size={12} color={theme.colors.onSurfaceVariant} />
          {' '}{item.location}
        </Text>
        <View style={styles.listingFooter}>
          <Text style={[styles.listingPrice, { color: theme.colors.primary }]}>
            KSh {item.price.toLocaleString()}/day
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.yellow} />
            <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>
        <View style={styles.ownerInfo}>
          <Text style={[styles.ownerText, { color: theme.colors.onSurfaceVariant }]}>
            by {item.owner}
          </Text>
          {item.verified && (
            <Ionicons name="shield-checkmark" size={14} color={colors.success} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGetStartedSection = () => (
    <LinearGradient
      colors={[colors.blue, colors.purple]}
      style={styles.getStartedSection}
    >
      <Text style={styles.getStartedTitle}>Ready to Join the Sharing Economy?</Text>
      <Text style={styles.getStartedSubtitle}>
        Whether you want to rent items or earn money by listing your own,{'\n'}we'll help you get started with the perfect plan.
      </Text>
      
      <View style={styles.getStartedButtons}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Profile' as never, { 
            screen: 'CreateListing' 
          } as never)}
        >
          <View style={styles.getStartedButtonContent}>
            <View style={styles.getStartedButtonIcon}>
              <Ionicons name="person-add" size={24} color="white" />
            </View>
            <Text style={styles.getStartedButtonTitle}>Get Started</Text>
            <Text style={styles.getStartedButtonDescription}>
              Choose your path and set up your profile in minutes
            </Text>
            <Text style={styles.getStartedButtonAction}>Start Your Journey</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Listings' as never, { 
            screen: 'Categories' 
          } as never)}
        >
          <View style={styles.getStartedButtonContent}>
            <View style={styles.getStartedButtonIcon}>
              <Ionicons name="search" size={24} color="white" />
            </View>
            <Text style={styles.getStartedButtonTitle}>Browse Categories</Text>
            <Text style={styles.getStartedButtonDescription}>
              Explore thousands of items across all categories
            </Text>
            <Text style={styles.getStartedButtonAction}>Explore Now</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {renderHeroSection()}
        {renderWhyChooseSection()}
        
        {/* Popular Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
              <Ionicons name="star" size={16} color="white" />
              <Text style={styles.sectionBadgeText}>Most Popular</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Popular Categories
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Discover our most popular rental categories with thousands of verified listings
            </Text>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={colors.blue} />
              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                10,000+ Active Users
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color={colors.green} />
              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                8,000+ Items Available
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="shield-checkmark" size={16} color={colors.purple} />
              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                100% Secure
              </Text>
            </View>
          </View>
          
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.categoriesContainer}
          />
          
          <TouchableOpacity
            style={[styles.viewAllButton, { borderColor: colors.blue }]}
            onPress={() => navigation.navigate('Listings' as never, { 
              screen: 'Categories' 
            } as never)}
          >
            <Text style={[styles.viewAllButtonText, { color: colors.blue }]}>
              View All Categories
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.blue} />
          </TouchableOpacity>
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
          
          <FlatList
            data={featuredListings}
            renderItem={renderFeaturedListing}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listingsContainer}
          />
        </View>

        {renderGetStartedSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    minHeight: height * 0.6,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  searchButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.sm,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  whyChooseSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.gray[50],
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  sectionBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - spacing.lg * 3) / 3,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  categoriesContainer: {
    paddingBottom: spacing.lg,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - spacing.lg * 3) / 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImageContainer: {
    height: 160,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  popularBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  categoryIconContainer: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryFeatures: {
    padding: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  viewAllButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  listingsContainer: {
    paddingRight: spacing.lg,
  },
  listingCard: {
    width: width * 0.7,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
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
    padding: spacing.md,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  listingLocation: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
    marginLeft: spacing.xs,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownerText: {
    fontSize: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  getStartedSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  getStartedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  getStartedSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  getStartedButtons: {
    gap: spacing.md,
  },
  getStartedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backdropFilter: 'blur(10px)',
  },
  getStartedButtonContent: {
    alignItems: 'center',
  },
  getStartedButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  getStartedButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.xs,
  },
  getStartedButtonDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  getStartedButtonAction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
});

export default HomeScreen;