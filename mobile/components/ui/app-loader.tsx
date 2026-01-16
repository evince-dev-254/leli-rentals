import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolate
} from 'react-native-reanimated';
import { MotiView } from 'moti';

interface AppLoaderProps {
    variant?: "default" | "white" | "primary"
    fullscreen?: boolean
}

export function AppLoader({
    variant = "default",
    fullscreen = false
}: AppLoaderProps) {
    const pulseValue = useSharedValue(0.3);
    const scaleValue = useSharedValue(1);

    useEffect(() => {
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 1500 }),
                withTiming(0.3, { duration: 1500 })
            ),
            -1,
            true
        );
        scaleValue.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1500 }),
                withTiming(1, { duration: 1500 })
            ),
            -1,
            true
        );
    }, [pulseValue, scaleValue]);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: pulseValue.value,
        transform: [{ scale: scaleValue.value }]
    }));

    const logoStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(pulseValue.value, [0.3, 0.6], [0, -4]) }
        ]
    }));

    const loaderContent = (
        <View className="relative items-center justify-center p-4">
            {/* Soft Ambient Glow */}
            <Animated.View
                style={[
                    glowStyle,
                    {
                        position: 'absolute',
                        width: 150,
                        height: 150,
                        borderRadius: 75,
                        backgroundColor: variant === "white" ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.2)',
                    }
                ]}
            />

            {/* Pill-shaped Container */}
            {/* @ts-ignore */}
            <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                className={`
                    relative z-10 rounded-full border flex-row items-center justify-center overflow-hidden
                    ${variant === "white" ? "bg-white/10 border-white/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"}
                    px-8 py-4 h-16
                `}
            >
                {/* Logo Animation */}
                <Animated.View style={[logoStyle, { width: 120, height: 40 }]}>
                    <Image
                        source={require('../../assets/images/icon.png')}
                        accessibilityLabel="Leli Rentals Logo"
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                            tintColor: variant === "white" ? '#fff' : undefined
                        }}
                    />
                </Animated.View>

                {/* Subtle scanning light effect */}
                <MotiView
                    from={{ translateX: -100 }}
                    animate={{ translateX: 200 }}
                    transition={{
                        type: 'timing',
                        duration: 3000,
                        loop: true,
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        transform: [{ skewX: '45deg' }] as any
                    }}
                />
            </MotiView>
        </View>
    );

    if (fullscreen) {
        return (
            /* @ts-ignore */
            <View style={StyleSheet.absoluteFill} className="z-[9999] items-center justify-center bg-slate-50 dark:bg-slate-950">
                {loaderContent}
            </View>
        );
    }

    return loaderContent;
}
