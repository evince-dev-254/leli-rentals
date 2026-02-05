import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react-native';
import * as Updates from 'expo-updates';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MotiView } from 'moti';
import { useTheme } from '@/components/theme-provider';
import Toast from 'react-native-toast-message';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

interface UpdateManifest {
    id: string;
    createdAt: string;
    runtimeVersion: string;
}

export default function UpdatesScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [checking, setChecking] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [status, setStatus] = useState<string>('Ready to check');
    const [manifest, setManifest] = useState<UpdateManifest | null>(null);

    const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        Toast.show({
            type,
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 4000,
        });
    };

    const onCheckForUpdates = async () => {
        if (isExpoGo) {
            showNotification("Expo Go", "Updates are not supported in Expo Go.", "info");
            return;
        }
        if (!Updates.isEnabled) {
            showNotification("Updates Disabled", "OTA updates are not enabled.", "error");
            return;
        }

        setChecking(true);
        setStatus('Checking for updates...');

        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                setUpdateAvailable(true);
                setManifest(update.manifest as unknown as UpdateManifest);
                setStatus('New update available!');
                showNotification("Update Found", "A new version of Leli Rentals is available.", "info");
            } else {
                setUpdateAvailable(false);
                setStatus('App is up to date');
                showNotification("System Up to Date", "You are using the latest version.", "success");
            }
        } catch (error: any) {
            console.error(error);
            setStatus('Error checking for updates');
            showNotification("Error", "Could not check for updates.", "error");
        } finally {
            setChecking(false);
        }
    };

    const onFetchUpdate = async () => {
        setChecking(true);
        setStatus('Downloading...');
        try {
            await Updates.fetchUpdateAsync();
            setStatus('Download complete');
            showNotification("Update Ready", "Successful. Restarting app...", "success");
            setTimeout(() => {
                Updates.reloadAsync();
            }, 1000);
        } catch (error: any) {
            console.error(error);
            setStatus('Download failed');
            showNotification("Error", "Could not download the update.", "error");
        } finally {
            setChecking(false);
        }
    };

    return (
        <View style={{ flex: 1 }} className="bg-slate-50 dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
                    <BackButton />
                    <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Software Updates</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <PerspectiveView style={{ marginBottom: 32 }}>
                        <GlassView
                            intensity={30}
                            tint={isDark ? 'dark' : 'light'}
                            style={{ padding: 40, borderRadius: 48, alignItems: 'center', borderWidth: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                        >
                            <PerspectiveView floatEnabled={true} style={{ marginBottom: 32 }}>
                                <View
                                    style={{ height: 120, width: 120, borderRadius: 40, alignItems: 'center', justifyContent: 'center', shadowColor: updateAvailable ? '#f97316' : '#10b981', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 25, elevation: 20 }}
                                    className={updateAvailable ? 'bg-orange-500' : 'bg-emerald-500'}
                                >
                                    {updateAvailable ? (
                                        <AlertCircle size={56} color="white" strokeWidth={2.5} />
                                    ) : (
                                        <CheckCircle2 size={56} color="white" strokeWidth={2.5} />
                                    )}
                                </View>
                            </PerspectiveView>

                            <Text style={{ textAlign: 'center' }} className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                                {updateAvailable ? "Update Ready" : "Leli is Secure"}
                            </Text>
                            <Text style={{ textAlign: 'center' }} className="text-slate-500 dark:text-slate-400 font-bold mb-10 text-sm px-4">
                                {status}
                            </Text>

                            <Button
                                title={checking ? "Working..." : (updateAvailable ? "Install Upgrade" : "Check for Updates")}
                                onPress={updateAvailable ? onFetchUpdate : onCheckForUpdates}
                                loading={checking}
                                className="w-full h-16 rounded-[24px]"
                            />
                        </GlassView>
                    </PerspectiveView>

                    <Text className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[3px] mb-6 ml-4">System Details</Text>

                    <View style={{ gap: 16 }}>
                        <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 28 }}>
                            <View style={{ height: 48, width: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                <Info size={22} color="#f97316" strokeWidth={2.5} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Version</Text>
                                <Text className="text-lg text-slate-900 dark:text-white font-black">{Updates.runtimeVersion || '1.0.1'}</Text>
                            </View>
                        </GlassView>

                        <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 28 }}>
                            <View style={{ height: 48, width: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                <Clock size={22} color="#f97316" strokeWidth={2.5} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Channel</Text>
                                <Text className="text-lg text-slate-900 dark:text-white font-black">{Updates.channel || 'Production'}</Text>
                            </View>
                        </GlassView>

                        {manifest && (
                            <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 28 }}>
                                <View style={{ height: 48, width: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
                                    <RefreshCw size={22} color="#f97316" strokeWidth={2.5} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Internal ID</Text>
                                    <Text className="text-slate-900 dark:text-white font-black text-[10px]">{manifest.id}</Text>
                                </View>
                            </GlassView>
                        )}
                    </View>

                    <View style={{ marginTop: 48, marginBottom: 40, padding: 32 }}>
                        <Text style={{ textAlign: 'center' }} className="text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest leading-6">
                            Leli Rentals Premium Update Service • v{Updates.runtimeVersion || '1.0.1'}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
