import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BackgroundGradient = () => {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Purple Orb */}
            <View
                style={{
                    position: 'absolute',
                    top: -150,
                    right: -150,
                    width: 400,
                    height: 400,
                    borderRadius: 200,
                    backgroundColor: '#a855f7', // Purple
                    opacity: 0.12,
                    transform: [{ scale: 1.5 }]
                }}
            />
            {/* Pink Orb */}
            <View
                style={{
                    position: 'absolute',
                    top: height * 0.2,
                    left: -100,
                    width: 300,
                    height: 300,
                    borderRadius: 150,
                    backgroundColor: '#ec4899', // Pink
                    opacity: 0.1,
                }}
            />
            {/* Deep Purple Glow */}
            <View
                style={{
                    position: 'absolute',
                    bottom: -100,
                    right: '10%',
                    width: 350,
                    height: 350,
                    borderRadius: 175,
                    backgroundColor: '#7e22ce', // Deep Purple
                    opacity: 0.08,
                }}
            />
        </View>
    );
};
