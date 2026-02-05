import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassViewProps {
    children?: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    active?: boolean;
}

export const GlassView: React.FC<GlassViewProps> = ({
    children,
    style,
    intensity = 30, // Refined intensity for premium feel
    tint = 'default',
    active = true
}) => {
    return (
        <View style={[styles.outer, style]}>
            <BlurView
                intensity={intensity}
                tint={tint}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={tint === 'dark'
                    ? ['rgba(30, 41, 59, 0.3)', 'rgba(15, 23, 42, 0.5)']
                    : ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.2)']
                }
                style={StyleSheet.absoluteFill}
            />
            {/* Kejapin Premium Border: Double-layered look */}
            <View style={[
                styles.border,
                { borderColor: tint === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)' }
            ]} />
            <View style={[
                styles.innerBorder,
                { borderColor: tint === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)' }
            ]} />

            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outer: {
        overflow: 'hidden',
        borderRadius: 20, // Slightly more modern radius
        backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.08)' : 'transparent',
    },
    border: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderRadius: 20,
    },
    innerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 0.5,
        borderRadius: 20,
        margin: 1,
    },
    content: {
        zIndex: 1,
    }
});
