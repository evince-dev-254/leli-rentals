import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BackgroundGradient = () => {
    const isDark = useColorScheme() === 'dark';
    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#020617' : '#ffffff' }]} pointerEvents="none">
            {/* Purple Orb */}
            <View
                style={{
                    position: 'absolute',
                    top: -150,
                    right: -150,
                    width: 500,
                    height: 500,
                    borderRadius: 250,
                    backgroundColor: '#a78bfa', // Violet 400
                    opacity: isDark ? 0.12 : 0.2,
                }}
            />
            {/* Pink Orb */}
            <View
                style={{
                    position: 'absolute',
                    top: height * 0.3,
                    left: -150,
                    width: 400,
                    height: 400,
                    borderRadius: 200,
                    backgroundColor: '#f472b6', // Pink 400
                    opacity: isDark ? 0.1 : 0.18,
                }}
            />
            {/* Orange/Yellow Glow */}
            <View
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: -100,
                    width: 350,
                    height: 350,
                    borderRadius: 175,
                    backgroundColor: '#fbbf24', // Amber 400
                    opacity: isDark ? 0.08 : 0.15,
                }}
            />
            {/* Deep Violet Bottom Glow */}
            <View
                style={{
                    position: 'absolute',
                    bottom: -150,
                    left: '10%',
                    width: 450,
                    height: 450,
                    borderRadius: 225,
                    backgroundColor: '#8b5cf6', // Violet 500
                    opacity: isDark ? 0.08 : 0.15,
                }}
            />
        </View>
    );
};
