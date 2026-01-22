import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, LayoutDashboard, Grid, User, Bell } from 'lucide-react-native';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fb923c' : '#ed8936',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          // Adjust height based on insets and platform
          height: Platform.OS === 'ios' ? 88 + insets.bottom : 74 + insets.bottom,
          backgroundColor: 'transparent',
          paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 30 : 15),
          paddingTop: 12,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={95}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          marginTop: 4,
          marginBottom: 0,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 0,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home color={color} size={24} strokeWidth={focused ? 3 : 2} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: true,
          headerTitle: 'My Dashboard',
          headerTitleStyle: { fontWeight: '900', fontSize: 24 },
          headerRight: () => <ThemeSwitcher />,
          headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
          tabBarIcon: ({ color, focused }) => <LayoutDashboard color={color} size={24} strokeWidth={focused ? 3 : 2} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => <Grid color={color} size={24} strokeWidth={focused ? 3 : 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
          headerRight: () => <ThemeSwitcher />,
          headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
          tabBarIcon: ({ color, focused }) => <User color={color} size={24} strokeWidth={focused ? 3 : 2} />,
        }}
      />
      {/* Hiding tabs that should only be accessible via Hamburger Menu */}
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
