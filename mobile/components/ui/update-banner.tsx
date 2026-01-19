import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MotiView, AnimatePresence } from 'moti';
import { RefreshCw, X } from 'lucide-react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const UpdateBanner = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (__DEV__ || isExpoGo) return; // Don't check in development or Expo Go

        async function checkUpdates() {
            try {
                setIsChecking(true);
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    setUpdateAvailable(true);
                }
            } catch (e) {
                console.log('Error checking for updates:', e);
            } finally {
                setIsChecking(false);
            }
        }

        checkUpdates();

        // Check every hour
        const interval = setInterval(checkUpdates, 3600000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = async () => {
        try {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        } catch (e) {
            console.log('Error applying update:', e);
            alert('Failed to update. Please restart the app.');
        }
    };

    if (!updateAvailable || !isVisible) return null;

    return (
        <AnimatePresence>
            <MotiView
                from={{ translateY: -100, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                exit={{ translateY: -100, opacity: 0 }}
                className="absolute top-0 left-0 right-0 z-[100] px-4 pt-12 pb-4 bg-[#f97316] shadow-lg"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-4">
                        <View className="h-10 w-10 bg-white/20 rounded-full items-center justify-center mr-3">
                            <RefreshCw size={20} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-black text-sm uppercase tracking-widest">Update Available</Text>
                            <Text className="text-white/80 text-xs font-bold">A new version of Leli Rentals is ready.</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={handleUpdate}
                            className="bg-white px-4 py-2 rounded-xl mr-2"
                        >
                            <Text className="text-[#f97316] font-black text-xs uppercase">Reload</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setIsVisible(false)}
                            className="p-2"
                        >
                            <X size={20} color="white" opacity={0.6} />
                        </TouchableOpacity>
                    </View>
                </View>
            </MotiView>
        </AnimatePresence>
    );
};
