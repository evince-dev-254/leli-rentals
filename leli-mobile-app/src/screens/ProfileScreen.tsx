import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../constants/theme';

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    verified: true,
    rating: 4.8,
    totalBookings: 24,
    totalListings: 8,
    memberSince: '2023',
  };

  const menuItems = [
    {
      id: 'bookings',
      title: 'My Bookings',
      subtitle: 'View and manage your bookings',
      icon: 'calendar-outline',
      color: colors.blue,
      onPress: () => navigation.navigate('Bookings' as never),
    },
    {
      id: 'listings',
      title: 'My Listings',
      subtitle: 'Manage your rental listings',
      icon: 'list-outline',
      color: colors.green,
      onPress: () => navigation.navigate('CreateListing' as never),
    },
    {
      id: 'favorites',
      title: 'Favorites',
      subtitle: 'Your saved listings',
      icon: 'heart-outline',
      color: colors.red,
      onPress: () => navigation.navigate('Favorites' as never),
    },
    {
      id: 'messages',
      title: 'Messages',
      subtitle: 'Chat with owners',
      icon: 'chatbubbles-outline',
      color: colors.purple,
      onPress: () => navigation.navigate('Messages' as never),
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      subtitle: 'Manage payment methods',
      icon: 'card-outline',
      color: colors.orange,
      onPress: () => Alert.alert('Payments', 'Payment management coming soon'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      icon: 'settings-outline',
      color: colors.gray[600],
      onPress: () => navigation.navigate('Settings' as never),
    },
  ];

  const renderProfileHeader = () => (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.profileHeader}
    >
      <View style={styles.profileInfo}>
        <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
        <View style={styles.profileDetails}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{user.name}</Text>
            {user.verified && (
              <Ionicons name="shield-checkmark" size={20} color="white" />
            )}
          </View>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="white" />
              <Text style={styles.statText}>{user.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={16} color="white" />
              <Text style={styles.statText}>{user.totalBookings} bookings</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="list" size={16} color="white" />
              <Text style={styles.statText}>{user.totalListings} listings</Text>
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editProfileButton}>
        <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
        <Text style={[styles.editProfileText, { color: theme.colors.primary }]}>Edit Profile</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderQuickActions = () => (
    <View style={[styles.quickActions, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => navigation.navigate('CreateListing' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="add" size={24} color="white" />
          </View>
          <Text style={[styles.quickActionText, { color: theme.colors.primary }]}>List Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: colors.green + '10' }]}
          onPress={() => navigation.navigate('Bookings' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.green }]}>
            <Ionicons name="calendar" size={24} color="white" />
          </View>
          <Text style={[styles.quickActionText, { color: colors.green }]}>My Bookings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: colors.blue + '10' }]}
          onPress={() => navigation.navigate('Messages' as never)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.blue }]}>
            <Ionicons name="chatbubbles" size={24} color="white" />
          </View>
          <Text style={[styles.quickActionText, { color: colors.blue }]}>Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: colors.purple + '10' }]}
          onPress={() => Alert.alert('Help', 'Help & Support coming soon')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.purple }]}>
            <Ionicons name="help-circle" size={24} color="white" />
          </View>
          <Text style={[styles.quickActionText, { color: colors.purple }]}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      onPress={item.onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: theme.colors.onSurface }]}>
          {item.title}
        </Text>
        <Text style={[styles.menuSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          {item.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );

  const renderSettingsSection = () => (
    <View style={[styles.settingsSection, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.onSurfaceVariant} />
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
              Push Notifications
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Receive updates about bookings and messages
            </Text>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.gray[300], true: theme.colors.primary + '40' }}
          thumbColor={notificationsEnabled ? theme.colors.primary : colors.gray[400]}
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="location-outline" size={24} color={theme.colors.onSurfaceVariant} />
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
              Location Services
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Find nearby rentals and services
            </Text>
          </View>
        </View>
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: colors.gray[300], true: theme.colors.primary + '40' }}
          thumbColor={locationEnabled ? theme.colors.primary : colors.gray[400]}
        />
      </View>
      
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons 
            name={isDark ? "moon" : "sunny"} 
            size={24} 
            color={theme.colors.onSurfaceVariant} 
          />
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
              {isDark ? 'Dark' : 'Light'} Theme
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Switch between light and dark mode
            </Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.gray[300], true: theme.colors.primary + '40' }}
          thumbColor={isDark ? theme.colors.primary : colors.gray[400]}
        />
      </TouchableOpacity>
    </View>
  );

  const renderAccountSection = () => (
    <View style={[styles.accountSection, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Account</Text>
      
      <TouchableOpacity style={styles.accountItem}>
        <Ionicons name="person-outline" size={24} color={theme.colors.onSurfaceVariant} />
        <Text style={[styles.accountText, { color: theme.colors.onSurface }]}>
          Personal Information
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.accountItem}>
        <Ionicons name="lock-closed-outline" size={24} color={theme.colors.onSurfaceVariant} />
        <Text style={[styles.accountText, { color: theme.colors.onSurface }]}>
          Privacy & Security
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.accountItem}>
        <Ionicons name="help-circle-outline" size={24} color={theme.colors.onSurfaceVariant} />
        <Text style={[styles.accountText, { color: theme.colors.onSurface }]}>
          Help & Support
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.accountItem}>
        <Ionicons name="information-circle-outline" size={24} color={theme.colors.onSurfaceVariant} />
        <Text style={[styles.accountText, { color: theme.colors.onSurface }]}>
          About Leli Rentals
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.signOutButton, { backgroundColor: colors.red + '10' }]}
        onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.red} />
        <Text style={[styles.signOutText, { color: colors.red }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderQuickActions()}
        
        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>
        
        {renderSettingsSection()}
        {renderAccountSection()}
        
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.lg,
  },
  profileDetails: {
    flex: 1,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: spacing.sm,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.sm,
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: 'white',
    marginLeft: spacing.xs,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  quickActions: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  settingsSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  accountSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  accountText: {
    fontSize: 16,
    marginLeft: spacing.md,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

export default ProfileScreen;