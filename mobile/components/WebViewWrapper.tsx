import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface WebViewWrapperProps {
    url: string;
    title?: string;
    canGoBack?: boolean;
}

export const WebViewWrapper = ({ url, title, canGoBack = true }: WebViewWrapperProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const webViewRef = useRef<WebView>(null);
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SafeAreaView style={{ backgroundColor: '#fff' }} edges={['top']}>
                <View style={styles.header}>
                    {canGoBack ? (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <ArrowLeft color="#000" size={24} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 40 }} />
                    )}

                    <Text style={styles.headerTitle} numberOfLines={1}>{title || 'Leli Rentals'}</Text>

                    <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.headerButton}>
                        <RefreshCw color="#666" size={20} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <View style={{ flex: 1, position: 'relative' }}>
                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    style={{ flex: 1 }}
                    // Enable JS and Dom Storage for complex apps
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#f97316" />
                        </View>
                    )}
                />
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#f97316" />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    headerButton: {
        padding: 8,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        flex: 1,
        textAlign: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 10,
    },
});
