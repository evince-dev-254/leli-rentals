/// <reference types="nativewind/types" />
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
                style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                className="bg-[#f97316] shadow-lg"
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 }}>
                    <View style={{ height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }} className="bg-white/20">
                        <RefreshCw size={20} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-black text-sm uppercase tracking-widest">Update Available</Text>
                        <Text className="text-white/80 text-xs font-bold">A new version of Leli Rentals is ready.</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handleUpdate}
                        style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8 }}
                    >
                        <Text style={{ color: '#f97316', fontWeight: '900', fontSize: 12 }}>RELOAD</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsVisible(false)}
                        style={{ padding: 8 }}
                    >
                        <X size={20} color="white" opacity={0.6} />
                    </TouchableOpacity>
                </View>
            </MotiView>
        </AnimatePresence>
    );
};
