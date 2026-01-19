import React, { useEffect, useCallback } from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
    interpolate,
    Easing
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useAuth } from '../context/auth-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';

const { width, height } = Dimensions.get('window');

export default function StartupScreen() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const logoScale = useSharedValue(0.5);
    const logoOpacity = useSharedValue(0);
    const backgroundScale = useSharedValue(1);
    const textOpacity = useSharedValue(0);

    const finishStartup = useCallback(() => {
        if (!loading) {
            if (user) {
                router.replace('/(tabs)');
            } else {
                router.replace('/auth/login');
            }
        }
    }, [loading, user, router]);

    useEffect(() => {
        // Animation Sequence
        logoScale.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.back(1.5))
        });
        logoOpacity.value = withTiming(1, { duration: 800 });

        textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));

        // Transition to next screen after delay
        const timeout = setTimeout(() => {
            logoScale.value = withTiming(1.2, { duration: 800 });
            logoOpacity.value = withTiming(0, { duration: 600 });
            backgroundScale.value = withTiming(1.5, { duration: 1000 }, () => {
                runOnJS(finishStartup)();
            });
        }, 2500);

        return () => clearTimeout(timeout);
    }, [loading, user, backgroundScale, finishStartup, logoOpacity, logoScale, textOpacity]);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }]
    }));

    const animatedBgStyle = useAnimatedStyle(() => ({
        transform: [{ scale: backgroundScale.value }]
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [10, 0]) }]
    }));

    return (
        <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center overflow-hidden">
            <Animated.View style={[StyleSheet.absoluteFill, animatedBgStyle]}>
                <BackgroundGradient />
            </Animated.View>

            <View className="items-center">
                <Animated.View style={[animatedLogoStyle, { width: 140, height: 140 }]}>
                    <Image
                        source={require('../assets/images/logo_white.png')}
                        accessibilityLabel="Leli Rentals Logo"
                        alt="Leli Rentals Logo"
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </Animated.View>

                <Animated.View style={[animatedTextStyle, { marginTop: 24 }]}>
                    <Text className="text-white text-3xl font-black tracking-tighter">Leli Rentals</Text>
                    <Text className="text-blue-500 text-xs font-bold uppercase tracking-[0.4em] text-center mt-2">
                        Premium Gear Ecosystem
                    </Text>
                </Animated.View>
            </View>

            {/* Loading Indicator at Bottom */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1000 }}
                className="absolute bottom-16"
            >
                <Text className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                    Verifying Secure Session...
                </Text>
            </MotiView>
        </View>
    );
}
