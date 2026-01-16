import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function MessagesScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
            <Text className="text-xl font-bold dark:text-white">Messages Inbox</Text>
            <Text className="text-slate-500 mt-2">Your conversations will appear here.</Text>
        </SafeAreaView>
    );
}
