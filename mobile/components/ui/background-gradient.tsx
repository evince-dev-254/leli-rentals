import React, { useEffect } from 'react';
import { View, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withDelay,
    interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const FloatingOrb = ({ color, size, delay, initialX, initialY }: any) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        translateX.value = withDelay(delay, withRepeat(withTiming(width * 0.2, { duration: 10000 }), -1, true));
        translateY.value = withDelay(delay, withRepeat(withTiming(height * 0.15, { duration: 12000 }), -1, true));
        scale.value = withDelay(delay, withRepeat(withTiming(1.3, { duration: 8000 }), -1, true));
        opacity.value = withDelay(delay, withRepeat(withTiming(0.7, { duration: 9000 }), -1, true));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ],
        opacity: opacity.value
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    top: initialY,
                    left: initialX,
                    filter: 'blur(60px)', // For platforms supporting it
                },
                animatedStyle
            ]}
        />
    );
};

export const BackgroundGradient = () => {
    const isDark = useColorScheme() === 'dark';

    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#020617' : '#f8fafc', pointerEvents: 'none' }]}>
            {/* Purple Orb */}
            <FloatingOrb
                color={isDark ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0.08)"}
                size={width * 0.9}
                delay={0}
                initialX={-width * 0.2}
                initialY={height * 0.1}
            />

            {/* Orange Orb */}
            <FloatingOrb
                color={isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(249, 115, 22, 0.06)"}
                size={width * 1.1}
                delay={2000}
                initialX={width * 0.3}
                initialY={height * 0.5}
            />

            {/* Pink Orb */}
            <FloatingOrb
                color={isDark ? "rgba(236, 72, 153, 0.1)" : "rgba(236, 72, 153, 0.05)"}
                size={width * 0.8}
                delay={4000}
                initialX={-width * 0.1}
                initialY={height * 0.7}
            />
        </View>
    );
};
