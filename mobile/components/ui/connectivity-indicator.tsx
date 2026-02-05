import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { MotiView, AnimatePresence } from 'moti';
import { WifiOff, Wifi } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ConnectivityIndicator = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [wasOffline, setWasOffline] = useState(false);
    const [showOnline, setShowOnline] = useState(false);
    const insets = useSafeAreaInsets() || { top: 0, bottom: 0, left: 0, right: 0 };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = !!state.isConnected;

            if (connected && !isConnected && wasOffline) {
                // Just came back online
                setShowOnline(true);
                setTimeout(() => setShowOnline(false), 3000);
            }

            if (!connected) {
                setWasOffline(true);
            }

            setIsConnected(connected);
        });

        return () => unsubscribe();
    }, [isConnected, wasOffline]);

    return (
        <AnimatePresence>
            {!isConnected && (
                <MotiView
                    from={{ translateY: -100, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    exit={{ translateY: -100, opacity: 0 }}
                    style={[styles.container, { top: insets.top + (Platform.OS === 'ios' ? 0 : 10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                    className="bg-red-500 mx-4 rounded-full px-4 py-2 border border-red-400 shadow-lg"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <WifiOff size={16} color="white" />
                        <Text className="text-white font-bold text-xs ml-2">No Internet Connection</Text>
                    </View>
                </MotiView>
            )}

            {showOnline && (
                <MotiView
                    from={{ translateY: -100, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    exit={{ translateY: -100, opacity: 0 }}
                    style={[styles.container, { top: insets.top + (Platform.OS === 'ios' ? 0 : 10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                    className="bg-emerald-500 mx-4 rounded-full px-4 py-2 border border-emerald-400 shadow-lg"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Wifi size={16} color="white" />
                        <Text className="text-white font-bold text-xs ml-2">Back Online</Text>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 10,
    },
});
