import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
  {
    id: 'bookings',
    title: 'My Bookings',
    icon: 'calendar-outline',
    description: 'View and manage your reservations',
  },
  {
    id: 'listings',
    title: 'My Listings',
    icon: 'list-outline',
    description: 'Manage your rental listings',
  },
  {
    id: 'favorites',
    title: 'Favorites',
    icon: 'heart-outline',
    description: 'Items you\'ve saved for later',
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: 'chatbubbles-outline',
    description: 'Chat with owners and renters',
  },
  {
    id: 'settings',
    title: 'Account Settings',
    icon: 'settings-outline',
    description: 'Update your profile and preferences',
  },
  {
    id: 'billing',
    title: 'Billing & Payments',
    icon: 'card-outline',
    description: 'Manage payments and billing',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'help-circle-outline',
    description: 'Get help and contact support',
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const handleMenuPress = (item: any) => {
    // Handle navigation to different sections
    console.log(`Navigate to ${item.id}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    header: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 15,
      backgroundColor: '#FF6B35',
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    accountType: {
      fontSize: 14,
      color: '#FF6B35',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FF6B35',
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
    },
    menuContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    menuItem: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    menuIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFF7ED',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 4,
    },
    menuDescription: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      lineHeight: 20,
    },
    menuArrow: {
      marginLeft: 10,
    },
    themeToggle: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    themeToggleContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeToggleIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFF7ED',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    themeToggleText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#1F2937',
    },
    logoutButton: {
      backgroundColor: '#EF4444',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      marginBottom: 30,
    },
    logoutButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {user?.name || 'Guest User'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || 'guest@example.com'}
            </Text>
            <Text style={styles.accountType}>
              {user?.accountType || 'Renter'}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {/* Theme Toggle */}
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <View style={styles.themeToggleContent}>
              <View style={styles.themeToggleIcon}>
                <Ionicons
                  name={isDark ? 'sunny-outline' : 'moon-outline'}
                  size={24}
                  color="#FF6B35"
                />
              </View>
              <Text style={styles.themeToggleText}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color="#FF6B35" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={styles.menuArrow}
              />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
