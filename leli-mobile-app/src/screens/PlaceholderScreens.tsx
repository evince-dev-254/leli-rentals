import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

// Placeholder screens with consistent structure
const createPlaceholderScreen = (title: string) => {
  return () => {
    const { theme } = useTheme();

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Coming Soon...
          </Text>
        </View>
      </SafeAreaView>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export const CategoriesScreen = createPlaceholderScreen('Categories');
export const ListingDetailScreen = createPlaceholderScreen('Listing Details');
export const CreateListingScreen = createPlaceholderScreen('Create Listing');
export const BookingsScreen = createPlaceholderScreen('My Bookings');
export const FavoritesScreen = createPlaceholderScreen('Favorites');
export const SettingsScreen = createPlaceholderScreen('Settings');
export const MessagesScreen = createPlaceholderScreen('Messages');
export const OnboardingScreen = createPlaceholderScreen('Onboarding');
