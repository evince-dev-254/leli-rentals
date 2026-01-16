import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/auth-context';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center px-6">
            <View className="mb-8 items-center">
                <View className="h-24 w-24 rounded-full bg-blue-100 dark:bg-slate-800 items-center justify-center mb-4">
                    <Text className="text-3xl font-black text-blue-600">
                        {user?.email?.[0].toUpperCase() ?? 'U'}
                    </Text>
                </View>
                <Text className="text-xl font-bold dark:text-white">{user?.email ?? 'User'}</Text>
            </View>

            <TouchableOpacity
                onPress={signOut}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 rounded-3xl items-center"
            >
                <Text className="text-red-500 font-bold">Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
