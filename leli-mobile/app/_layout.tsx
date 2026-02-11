import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';

import { Outfit_400Regular, Outfit_500Medium, Outfit_700Bold } from '@expo-google-fonts/outfit';

SplashScreen.preventAutoHideAsync();

import { NotificationProvider } from '../context/NotificationContext';
import { MessageProvider } from '../context/MessageContext';
import Toast from '../components/ui/Toast';

import { UserProvider } from '../context/UserContext';
import { FavoritesProvider } from '../context/FavoritesContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.warn(`Error fetching latest updates: ${error}`);
      }
    }

    if (loaded) {
      SplashScreen.hideAsync();
      // Skip updates in development mode as it's not supported in Expo Go
      if (!__DEV__) {
        onFetchUpdateAsync();
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <MessageProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="(user)" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                  <Stack.Screen name="messages/index" options={{ headerShown: false }} />
                  <Stack.Screen name="messages/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="property/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="listing/[category]" options={{ headerShown: false }} />
                  <Stack.Screen name="booking/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <Toast />
              </ThemeProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </MessageProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
