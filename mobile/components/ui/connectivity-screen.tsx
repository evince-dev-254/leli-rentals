import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from './background-gradient';
import NetInfo from '@react-native-community/netinfo';

interface ConnectivityScreenProps {
    onRetry?: () => void;
}

export const ConnectivityScreen: React.FC<ConnectivityScreenProps> = ({ onRetry }) => {
    const handleRetry = () => {
        NetInfo.refresh().then(state => {
            if (state.isConnected && onRetry) {
                onRetry();
            }
        });
    };

    return (
        <View style={styles.container}>
            <BackgroundGradient />
            <SafeAreaView style={styles.content}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500 }}
                    style={styles.card}
                >
                    <View style={styles.iconContainer}>
                        <WifiOff size={48} color="#f43f5e" />
                    </View>

                    <Text style={styles.title}>Connection Lost</Text>
                    <Text style={styles.message}>
                        Oops! It looks like you're offline. Leli Rentals requires an active internet connection to function properly.
                    </Text>

                    <TouchableOpacity
                        onPress={handleRetry}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <RefreshCw size={20} color="white" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </MotiView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 40,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        width: '100%',
        maxWidth: 400,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 30,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#f97316',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 20,
        width: '100%',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
