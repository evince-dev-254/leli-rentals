import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react-native';
import * as Updates from 'expo-updates';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MotiView } from 'moti';
import { BrandedAlert } from '@/components/ui/branded-alert';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function UpdatesScreen() {
    const [checking, setChecking] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [status, setStatus] = useState<string>('Up to date');
    const [manifest, setManifest] = useState<any>(null);
    const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({
        visible: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    useEffect(() => {
        // Log current update info
        if (Updates.isEnabled && !isExpoGo) {
            console.log('Update Runtime Version:', Updates.runtimeVersion);
            console.log('Update Channel:', Updates.channel);
        }
    }, []);

    const onCheckForUpdates = async () => {
        if (isExpoGo) {
            showAlert(
                "Expo Go",
                "Over-the-air updates are not supported in Expo Go. Please use a development build or production build.",
                "info"
            );
            return;
        }

        if (!Updates.isEnabled) {
            showAlert("Updates Disabled", "Over-the-air updates are not enabled in this build.", "error");
            return;
        }

        setChecking(true);
        setStatus('Checking for updates...');

        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                setUpdateAvailable(true);
                setManifest(update.manifest);
                setStatus('New update available!');
            } else {
                setUpdateAvailable(false);
                setStatus('App is up to date');
                showAlert("System Up to Date", "You are already using the latest version of Leli Rentals.", "success");
            }
        } catch (error: any) {
            console.error(error);
            setStatus('Error checking for updates');
            showAlert("Error", "Could not check for updates. Please try again later.", "error");
        } finally {
            setChecking(false);
        }
    };

    const onFetchUpdate = async () => {
        setChecking(true);
        setStatus('Downloading update...');
        try {
            await Updates.fetchUpdateAsync();
            setStatus('Update downloaded');
            showAlert(
                "Update Ready",
                "The update has been downloaded. The app will now restart to apply changes.",
                "success"
            );
            // After success alert is closed, reload
            setTimeout(() => {
                Updates.reloadAsync();
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setStatus('Error downloading update');
            showAlert("Error", "Could not download the update.", "error");
        } finally {
            setChecking(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BrandedAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 pt-10 pb-4 flex-row items-center justify-between">
                    <BackButton />
                    <Text className="text-xl font-black text-slate-900 dark:text-white">Software Updates</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-8 pt-10" showsVerticalScrollIndicator={false}>
                    {/* Status Card */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 dark:bg-slate-900/80 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-800 items-center shadow-sm mb-10"
                    >
                        <View className={`h-20 w-20 rounded-3xl items-center justify-center mb-6 ${updateAvailable ? 'bg-orange-100' : 'bg-emerald-100'}`}>
                            {updateAvailable ? (
                                <AlertCircle size={40} color="#f97316" />
                            ) : (
                                <CheckCircle2 size={40} color="#10b981" />
                            )}
                        </View>

                        <Text className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">
                            {updateAvailable ? "Update Available" : "System Up to Date"}
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-center font-bold mb-8">
                            {status}
                        </Text>

                        <Button
                            title={checking ? "Working..." : (updateAvailable ? "Download & Install" : "Check for Updates")}
                            onPress={updateAvailable ? onFetchUpdate : onCheckForUpdates}
                            loading={checking}
                            className="w-full"
                        />
                    </MotiView>

                    {/* Version Info */}
                    <View className="space-y-4">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Build Information</Text>

                        <View className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex-row items-center">
                            <View className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mr-4">
                                <Info size={18} color="#94a3b8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-black text-slate-400 uppercase">Runtime Version</Text>
                                <Text className="text-slate-900 dark:text-white font-black">{Updates.runtimeVersion || '1.0.1'}</Text>
                            </View>
                        </View>

                        <View className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex-row items-center">
                            <View className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mr-4">
                                <Clock size={18} color="#94a3b8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-black text-slate-400 uppercase">Last Checked</Text>
                                <Text className="text-slate-900 dark:text-white font-black">Just now</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mt-10 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-3xl border border-orange-100 dark:border-orange-900/30">
                        <Text className="text-orange-800 dark:text-orange-200 text-xs font-bold leading-5">
                            Over-the-air (OTA) updates allow us to improve Leli Rentals and fix issues instantly without requiring a full store download.
                        </Text>
                    </View>

                    <View className="h-20" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
