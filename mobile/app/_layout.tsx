import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '../context/auth-context';
import { AppLoader } from '@/components/ui/app-loader';
import { UpdateBanner } from '@/components/ui/update-banner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaystackProvider } from 'react-native-paystack-webview';
import NetInfo from '@react-native-community/netinfo';
import { useState } from 'react';
import { ConnectivityScreen } from '@/components/ui/connectivity-screen';


import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_900Black
} from '@expo-google-fonts/outfit';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const borderlessHeaderOptions = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: 'transparent' },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (isConnected === false) {
    return <ConnectivityScreen onRetry={() => setIsConnected(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PaystackProvider
            publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
            currency="KES"
          >
            <RootLayoutNav />
          </PaystackProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <AppLoader fullscreen />;

  return (
    <NavThemeProvider value={DefaultTheme}>
      <UpdateBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="listings/[id]" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>

      {/* Robust Redirection: Handled inside the ThemeProvider (navigation context) but after Stack definition */}
      {user && !user.user_metadata?.role && <Redirect href="/auth/select-role" />}
    </NavThemeProvider>
  );
}
