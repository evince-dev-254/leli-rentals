import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScreenBackground() {
    return (
        <View className="absolute inset-0 w-full h-full z-[-1] overflow-hidden bg-white">
            <LinearGradient
                colors={['#FDF2F8', '#F5F3FF', '#FFF7ED']} // Soft Pink -> Soft Purple -> Soft Orange background
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />

            <LinearGradient
                colors={['#A855F7', '#EC4899', '#F97316']} // Vibrant Purple -> Pink -> Orange
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.25 }}
            />

            {/* White glassmorphic-style overlay to keep text readable */}
            <View className="absolute inset-0 bg-white/40" />

            {/* Enhanced Blobs for depth */}
            <View
                className="absolute -top-20 -left-20 w-80 h-80 bg-purple-300 rounded-full opacity-20"
                style={{ transform: [{ scale: 1.5 }] }}
            />
            <View
                className="absolute top-1/2 -right-20 w-80 h-80 bg-orange-300 rounded-full opacity-20"
                style={{ transform: [{ scale: 1.2 }] }}
            />
            <View
                className="absolute -bottom-20 -left-10 w-96 h-96 bg-pink-300 rounded-full opacity-20"
                style={{ transform: [{ scale: 1.3 }] }}
            />
        </View>
    );
}
