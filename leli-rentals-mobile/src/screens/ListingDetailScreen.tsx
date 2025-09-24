import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  
  const navigation = useNavigation();
  const route = useRoute();
  const { isDark } = useTheme();
  
  const listing = route.params?.listing || {
    id: '1',
    title: 'Luxury BMW X5',
    description: 'Premium SUV perfect for family trips and business travel. This beautiful vehicle comes with all the latest features including leather seats, navigation system, and premium sound system.',
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
      joinedDate: '2023-01-15',
    },
    features: [
      'Automatic Transmission',
      'Leather Seats',
      'Navigation System',
      'Premium Sound',
      'Air Conditioning',
      'Bluetooth Connectivity',
    ],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  };

  const images = [
    listing.image,
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
  ];

  const handleBookNow = () => {
    Alert.alert(
      'Book Now',
      'Booking functionality would be implemented here. This would open a booking flow.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Book now') },
      ]
    );
  };

  const handleContactOwner = () => {
    Alert.alert(
      'Contact Owner',
      'Contact functionality would be implemented here. This would open a chat or contact form.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact', onPress: () => console.log('Contact owner') },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingTop: 50,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      height: height * 0.4,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageIndicator: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: '#FFFFFF',
    },
    content: {
      flex: 1,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      marginTop: -25,
      paddingTop: 25,
    },
    scrollContent: {
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 8,
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    locationText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginLeft: 5,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    ratingText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginLeft: 5,
    },
    price: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FF6B35',
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 15,
    },
    description: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      lineHeight: 24,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    featureItem: {
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      marginBottom: 10,
    },
    featureText: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#374151',
    },
    ownerSection: {
      backgroundColor: isDark ? '#374151' : '#F8FAFC',
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
    },
    ownerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    ownerAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    ownerInfo: {
      flex: 1,
    },
    ownerName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 4,
    },
    ownerJoined: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    ownerRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    contactButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    availabilitySection: {
      marginBottom: 25,
    },
    availabilityGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    availabilityItem: {
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 15,
      marginRight: 10,
      marginBottom: 10,
    },
    availabilityText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    bottomActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    bookButton: {
      flex: 1,
      backgroundColor: '#FF6B35',
      borderRadius: 15,
      paddingVertical: 16,
      alignItems: 'center',
      marginRight: 10,
    },
    bookButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    favoriteButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[selectedImageIndex] }} style={styles.image} />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>

          {/* Image Indicators */}
          <View style={styles.imageIndicator}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Title and Basic Info */}
            <Text style={styles.title}>{listing.title}</Text>
            
            <View style={styles.location}>
              <Ionicons name="location-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={styles.locationText}>{listing.location}</Text>
            </View>

            <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                <Ionicons name="star" size={20} color="#FCD34D" />
                <Text style={styles.ratingText}>{listing.rating} ({listing.reviews} reviews)</Text>
              </View>
              <Text style={styles.price}>{listing.currency}{listing.price}/day</Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {listing.features.map((feature: string, index: number) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Owner Section */}
            <View style={styles.ownerSection}>
              <Text style={styles.sectionTitle}>Owner</Text>
              <View style={styles.ownerHeader}>
                <Image source={{ uri: listing.owner.avatar }} style={styles.ownerAvatar} />
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>{listing.owner.name}</Text>
                  <Text style={styles.ownerJoined}>
                    Joined {new Date(listing.owner.joinedDate).toLocaleDateString()}
                  </Text>
                  <View style={styles.ownerRating}>
                    <Ionicons name="star" size={16} color="#FCD34D" />
                    <Text style={styles.ratingText}>{listing.owner.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
                <Text style={styles.contactButtonText}>Contact Owner</Text>
              </TouchableOpacity>
            </View>

            {/* Availability */}
            <View style={styles.availabilitySection}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <View style={styles.availabilityGrid}>
                {listing.availability.map((day: string, index: number) => (
                  <View key={index} style={styles.availabilityItem}>
                    <Text style={styles.availabilityText}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#EF4444' : (isDark ? '#9CA3AF' : '#6B7280')}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
