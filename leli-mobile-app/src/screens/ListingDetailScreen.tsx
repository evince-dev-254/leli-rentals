import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  rating: number;
  reviews: number;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  features: string[];
  saved: boolean;
  liked: boolean;
}

const mockListing: Listing = {
  id: '1',
  title: 'Luxury BMW X5 SUV',
  description: 'Premium SUV perfect for family trips and business travel.',
  price: 15631,
  location: 'Eldoret, Kenya',
  images: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
  ],
  rating: 4.8,
  reviews: 124,
  owner: {
    name: 'John Mwangi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    verified: true,
  },
  features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Leather Seats'],
  saved: false,
  liked: false,
};

const ListingDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [listing, setListing] = useState<Listing>(mockListing);

  const toggleSave = () => {
    setListing(prev => ({ ...prev, saved: !prev.saved }));
  };

  const toggleLike = () => {
    setListing(prev => ({ ...prev, liked: !prev.liked }));
  };

  const handleBookNow = () => {
    Alert.alert('Booking', 'Booking functionality would be implemented here');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.images[0] }} style={styles.listingImage} />
          
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={toggleSave}>
                <Ionicons 
                  name={listing.saved ? "heart" : "heart-outline"} 
                  size={24} 
                  color={listing.saved ? colors.red : "white"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.listingTitle, { color: theme.colors.onSurface }]}>
            {listing.title}
          </Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.locationText, { color: theme.colors.onSurfaceVariant }]}>
              {listing.location}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.yellow} />
            <Text style={[styles.ratingText, { color: theme.colors.onSurface }]}>
              {listing.rating} ({listing.reviews} reviews)
            </Text>
            <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
              <Ionicons 
                name={listing.liked ? "thumbs-up" : "thumbs-up-outline"} 
                size={20} 
                color={listing.liked ? colors.blue : theme.colors.onSurfaceVariant} 
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.priceText, { color: theme.colors.primary }]}>
            KSh {listing.price.toLocaleString()}/day
          </Text>
        </View>

        {/* Owner Info */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Owner</Text>
          
          <View style={styles.ownerContainer}>
            <Image source={{ uri: listing.owner.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerDetails}>
              <View style={styles.ownerNameContainer}>
                <Text style={[styles.ownerName, { color: theme.colors.onSurface }]}>
                  {listing.owner.name}
                </Text>
                {listing.owner.verified && (
                  <Ionicons name="shield-checkmark" size={16} color={colors.success} />
                )}
              </View>
            </View>
            
            <TouchableOpacity style={styles.ownerActionButton}>
              <Ionicons name="call" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Features</Text>
          
          <View style={styles.featuresGrid}>
            {listing.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: theme.colors.onSurface }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Booking Button */}
      <View style={[styles.bookingContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.colors.onSurfaceVariant }]}>
            Price per day
          </Text>
          <Text style={[styles.priceAmount, { color: theme.colors.primary }]}>
            KSh {listing.price.toLocaleString()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  imageActions: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  listingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: spacing.xs,
    flex: 1,
  },
  likeButton: {
    padding: spacing.sm,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  ownerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  bookingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.md,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListingDetailScreen;
