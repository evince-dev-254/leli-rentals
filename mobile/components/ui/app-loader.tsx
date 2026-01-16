import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from './background-gradient';

interface AppLoaderProps {
    fullscreen?: boolean;
    message?: string;
}

export const AppLoader = ({ fullscreen = false, message = 'Loading...' }: AppLoaderProps) => {
    if (!fullscreen) {
        return (
            <View style={styles.inlineContainer}>
                <ActivityIndicator size="large" color="#e67e22" />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <BackgroundGradient />
            <View style={styles.fullscreenContainer}>
                <MotiView
                    from={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'timing',
                        duration: 1000,
                        loop: true,
                        repeatReverse: true,
                    }}
                    style={styles.logoContainer}
                >
                    <View style={styles.dotContainer}>
                        <View style={[styles.dot, { backgroundColor: '#e67e22' }]} />
                        <View style={[styles.dot, { backgroundColor: '#a855f7', marginHorizontal: 8 }]} />
                        <View style={[styles.dot, { backgroundColor: '#ec4899' }]} />
                    </View>
                </MotiView>
                <Text style={styles.fullscreenMessage}>{message}</Text>
                <ActivityIndicator size="large" color="#e67e22" style={{ marginTop: 24 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    message: {
        marginTop: 10,
        fontSize: 14,
        color: '#34495e',
        fontWeight: '600',
    },
    fullscreenMessage: {
        marginTop: 20,
        fontSize: 18,
        color: '#0f172a',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotContainer: {
        flexDirection: 'row',
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
});
