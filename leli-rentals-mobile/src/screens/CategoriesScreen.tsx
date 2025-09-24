import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
    features: ['Insurance included', '24/7 support', 'Flexible pickup'],
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
    features: ['Professional grade', 'Delivery available', 'Training included'],
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
    features: ['Fully furnished', 'Utilities included', 'Flexible terms'],
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
    features: ['Latest models', 'Warranty included', 'Tech support'],
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
    features: ['Designer brands', 'Size matching', 'Styling advice'],
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
    features: ['Professional setup', 'Delivery & setup', 'Expert guidance'],
    popular: true,
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Cameras, lighting & production gear',
    count: '600+ listings',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    icon: 'camera',
    color: '#06B6D4',
    features: ['Professional gear', 'Technical support', 'Insurance included'],
    popular: true,
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Professional & DIY tools',
    count: '900+ listings',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    icon: 'hammer',
    color: '#6B7280',
    features: ['Professional grade', 'Safety certified', 'Maintenance included'],
    popular: false,
  },
];

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Listings' as never, { category: category.id } as never);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      lineHeight: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF6B35',
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
    },
    categoryCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 15,
      marginHorizontal: 10,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    categoryImage: {
      width: '100%',
      height: 150,
    },
    categoryOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    categoryHeader: {
      position: 'absolute',
      top: 15,
      left: 15,
      right: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    categoryIcon: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    popularBadge: {
      backgroundColor: '#FCD34D',
      paddingHorizontal: 8,
      paddingVertical: 4,
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
    categoryInfo: {
      position: 'absolute',
      bottom: 15,
      left: 15,
      right: 15,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    categoryDescription: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: 8,
    },
    categoryCount: {
      fontSize: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      color: '#FFFFFF',
      alignSelf: 'flex-start',
    },
    categoryContent: {
      padding: 15,
    },
    featuresContainer: {
      marginBottom: 15,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    featureIcon: {
      marginRight: 8,
    },
    featureText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    actionButton: {
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 5,
    },
  });

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay} />
      
      <View style={styles.categoryHeader}>
        <View style={styles.categoryIcon}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        {item.popular && (
          <View style={styles.popularBadge}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>

      <View style={styles.categoryInfo}>
        <Text style={styles.categoryTitle}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.categoryCount}>{item.count}</Text>
      </View>

      <View style={styles.categoryContent}>
        <View style={styles.featuresContainer}>
          {item.features.slice(0, 2).map((feature: string, index: number) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons
                name="checkmark-circle"
                size={12}
                color="#10B981"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Browse Items</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>
          Explore thousands of items across all categories and find exactly what you need for your next rental.
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>10,000+</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8,000+</Text>
          <Text style={styles.statLabel}>Items Available</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Secure</Text>
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </SafeAreaView>
  );
}
