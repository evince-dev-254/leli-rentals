import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, LayoutDashboard, Grid, User, Bell } from 'lucide-react-native';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

import Colors from '@/constants/Colors';
import { useTheme } from '@/components/theme-provider';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          height: 64,
          borderRadius: 32,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          paddingBottom: 0,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 8,
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
