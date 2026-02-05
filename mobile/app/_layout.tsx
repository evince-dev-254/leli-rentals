import '../global.css';
import { View, Text, Platform, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_900Black } from '@expo-google-fonts/outfit';
import { Stack, Redirect, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaystackProvider } from 'react-native-paystack-webview';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '../context/auth-context';
import { AppLoader } from '@/components/ui/app-loader';
import { UpdateBanner } from '@/components/ui/update-banner';

import Toast from 'react-native-toast-message';
import { ConnectivityIndicator } from '@/components/ui/connectivity-indicator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { FavoritesProvider } from '../context/favorites-context';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Outfit: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitSemiBold: Outfit_600SemiBold,
    OutfitBold: Outfit_700Bold,
    OutfitBlack: Outfit_900Black,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <PaystackProvider
                publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
                currency="KES"
              >
                <RootLayoutNav />
                <Toast />
              </PaystackProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  if (loading) return <AppLoader fullscreen />;

  const isDark = theme === 'dark';

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
        <ConnectivityIndicator />
        <UpdateBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="listings/[id]" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>

        {/* Robust Redirection */}
        {user && !user.user_metadata?.role && <Redirect href="/auth/select-role" />}
      </View>
    </NavThemeProvider>
  );
}
