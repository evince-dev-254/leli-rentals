import React, { useEffect } from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface PerspectiveViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    tiltEnabled?: boolean;
    floatEnabled?: boolean;
}

export const PerspectiveView: React.FC<PerspectiveViewProps> = ({
    children,
    style,
    tiltEnabled = true,
    floatEnabled = true
}) => {
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);
    const floatY = useSharedValue(0);

    // Initial floating animation
    useEffect(() => {
        if (floatEnabled) {
            floatY.value = withRepeat(
                withTiming(-10, { duration: 2500 }),
                -1,
                true
            );
        }
    }, [floatEnabled]);

    const gesture = Gesture.Pan()
        .enabled(tiltEnabled)
        .onUpdate((event) => {
            // Calculate tilt based on drag position relative to center
            // This is a simplified tilt for card-like behavior
            rotateY.value = (event.x / 100);
            rotateX.value = -(event.y / 100);
        })
        .onEnd(() => {
            rotateX.value = withSpring(0);
            rotateY.value = withSpring(0);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { perspective: 1000 },
                { translateY: floatY.value },
                { rotateX: `${rotateX.value}deg` },
                { rotateY: `${rotateY.value}deg` },
            ],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
};
