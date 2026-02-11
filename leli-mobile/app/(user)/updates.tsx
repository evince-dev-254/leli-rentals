import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { RefreshCw, CheckCircle, Smartphone, Info, ChevronLeft } from 'lucide-react-native';
import * as Updates from 'expo-updates';
import Constants, { AppOwnership } from 'expo-constants';
import { router } from 'expo-router';
import ScreenBackground from '../../components/ui/ScreenBackground';
import { styled } from 'nativewind';

const SafeAreaView = styled(SafeAreaViewContext);

export default function UpdatesScreen() {
    const [checking, setChecking] = useState(false);
    const [updateInfo, setUpdateInfo] = useState({
        updateId: Updates.updateId || 'N/A',
        runtimeVersion: Updates.runtimeVersion || 'N/A',
        isEmbedded: Updates.isEmbeddedLaunch,
    });

    const onCheckForUpdates = async () => {
        if (__DEV__ || Constants.appOwnership === AppOwnership.Expo) {
            Alert.alert(
                'Not Supported',
                'Update checks are not supported in Expo Go. This feature is available in production builds.'
            );
            return;
        }

        setChecking(true);
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                Alert.alert(
                    'Update Available',
                    'A new version is available. Would you like to download and restart?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Update',
                            onPress: async () => {
                                await Updates.fetchUpdateAsync();
                                await Updates.reloadAsync();
                            }
                        },
                    ]
                );
            } else {
                Alert.alert('Up to Date', 'You are already running the latest version.');
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to check for updates. Please try again later.');
            console.error(e);
        } finally {
            setChecking(false);
        }
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center">
                    <ChevronLeft size={24} color="#1E293B" />
                    <Text className="font-outfit-bold ml-2 text-slate-800 uppercase">Back</Text>
                </TouchableOpacity>

                <View className="mb-8">
                    <Text className="text-3xl font-outfit-bold text-slate-900 mb-2">Software Updates</Text>
                    <Text className="text-slate-500 font-outfit">Keep your Leli app current with the latest features.</Text>
                </View>

                <View className="bg-white/80 rounded-[32px] p-8 border border-white shadow-sm mb-8 items-center">
                    <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-6">
                        <CheckCircle size={40} color="#22C55E" />
                    </View>
                    <Text className="text-xl font-outfit-bold text-slate-800 mb-1">Your app is up to date</Text>
                    <Text className="text-slate-500 font-outfit mb-6">Last checked: Just now</Text>

                    <TouchableOpacity
                        onPress={onCheckForUpdates}
                        disabled={checking}
                        className="bg-slate-900 px-8 py-4 rounded-full flex-row items-center shadow-lg"
                    >
                        {checking ? (
                            <ActivityIndicator color="white" className="mr-3" />
                        ) : (
                            <RefreshCw size={20} color="white" className="mr-3" />
                        )}
                        <Text className="text-white font-outfit-bold text-lg">
                            {checking ? 'Checking...' : 'Check for Updates'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-lg font-outfit-bold text-slate-800 mb-4 ml-2">Device Information</Text>
                <View className="bg-white/50 rounded-3xl p-6 border border-white space-y-4">
                    <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                        <View className="flex-row items-center">
                            <Smartphone size={18} color="#64748B" className="mr-3" />
                            <Text className="font-outfit-medium text-slate-600">Runtime Version</Text>
                        </View>
                        <Text className="font-outfit-bold text-slate-800">{updateInfo.runtimeVersion}</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                        <View className="flex-row items-center">
                            <Info size={18} color="#64748B" className="mr-3" />
                            <Text className="font-outfit-medium text-slate-600">Update ID</Text>
                        </View>
                        <Text className="font-outfit text-slate-800 text-xs w-24 text-right" numberOfLines={1}>{updateInfo.updateId}</Text>
                    </View>
                </View>

                <Text className="text-center text-slate-400 font-outfit text-xs mt-auto mb-6">
                    Leli Mobile v1.0.0
                </Text>
            </SafeAreaView>
        </View>
    );
}
