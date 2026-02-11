import { Tabs } from 'expo-router';
import React from 'react';
import { Home, PieChart, User, LayoutGrid, MessageSquare, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F97316', // Orange
        tabBarInactiveTintColor: '#94A3B8', // Slate-400
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 0,
          elevation: 10,
          position: 'absolute',
          bottom: Math.max(16, insets.bottom), // Strictly following safe area
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,
          paddingBottom: 0,
          paddingTop: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          height: 64,
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Outfit_500Medium',
          fontSize: 10,
          marginBottom: 6,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home size={24} color={color} fill={focused ? color : 'none'} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => <LayoutGrid size={24} color={color} fill={focused ? color : 'none'} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => <PieChart size={24} color={color} fill={focused ? color : 'none'} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => <Heart size={24} color={color} fill={focused ? color : 'none'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <User size={24} color={color} fill={focused ? color : 'none'} />,
        }}
      />
    </Tabs>
  );
}
