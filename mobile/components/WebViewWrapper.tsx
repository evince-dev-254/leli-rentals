import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Text,
    BackHandler,
    Platform,
    Animated
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface WebViewWrapperProps {
    url: string;
    title?: string;
    showNavigationButtons?: boolean;
}

export const WebViewWrapper = ({ url, title, showNavigationButtons = true }: WebViewWrapperProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [canWebGoBack, setCanWebGoBack] = useState(false);
    const [canWebGoForward, setCanWebGoForward] = useState(false);
    const [pageTitle, setPageTitle] = useState(title);

    const webViewRef = useRef<WebView>(null);
    const router = useRouter();
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Handle progress animation
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [progress, progressAnim]);

    // Handle Android hardware back button
    useEffect(() => {
        const handleBackPress = () => {
            if (canWebGoBack && webViewRef.current) {
                webViewRef.current.goBack();
                return true;
            }
            return false; // Let Expo Router handle it
        };

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, [canWebGoBack]);

    const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
        setCanWebGoBack(navState.canGoBack);
        setCanWebGoForward(navState.canGoForward);
        if (navState.title && !title) {
            setPageTitle(navState.title);
        }
    }, [title]);

    const goBack = () => {
        if (canWebGoBack) {
            webViewRef.current?.goBack();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBack} style={styles.headerButton}>
                        <ChevronLeft color="#0f172a" size={28} />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {pageTitle || 'Leli Rentals'}
                        </Text>
                        <Text style={styles.urlSubtitle} numberOfLines={1}>
                            {url.replace(/^https?:\/\//, '')}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.headerButton}>
                        <RefreshCw color="#64748b" size={20} />
                    </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                {isLoading && (
                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    })
                                }
                            ]}
                        />
                    </View>
                )}
            </SafeAreaView>

            <View style={styles.webViewContainer}>
                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    onLoadStart={() => {
                        setIsLoading(true);
                        setProgress(0);
                    }}
                    onLoadProgress={({ nativeEvent }) => {
                        setProgress(nativeEvent.progress);
                    }}
                    onLoadEnd={() => {
                        setIsLoading(false);
                        setProgress(1);
                    }}
                    onNavigationStateChange={handleNavigationStateChange}
                    style={styles.webView}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    allowsBackForwardNavigationGestures={true} // iOS swipe gestures
                    scalesPageToFit={true}
                    renderLoading={() => (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#f97316" />
                        </View>
                    )}
                />

                {/* Optional Bottom Navigation Bar for WebView */}
                {showNavigationButtons && (canWebGoBack || canWebGoForward) && (
                    <View style={styles.bottomNav}>
                        <TouchableOpacity
                            onPress={() => webViewRef.current?.goBack()}
                            disabled={!canWebGoBack}
                            style={[styles.navButton, !canWebGoBack && styles.disabledButton]}
                        >
                            <ChevronLeft color={canWebGoBack ? "#0f172a" : "#cbd5e1"} size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => webViewRef.current?.goForward()}
                            disabled={!canWebGoForward}
                            style={[styles.navButton, !canWebGoForward && styles.disabledButton]}
                        >
                            <ChevronRight color={canWebGoForward ? "#0f172a" : "#cbd5e1"} size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
                            <X color="#ef4444" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    safeArea: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    urlSubtitle: {
        fontSize: 11,
        color: '#64748b',
        marginTop: -2,
    },
    progressContainer: {
        height: 3,
        width: '100%',
        backgroundColor: '#f1f5f9',
        position: 'absolute',
        bottom: 0,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#f97316',
    },
    webViewContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        zIndex: 10,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 20,
        left: '20%',
        right: '20%',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 5,
        borderWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    navButton: {
        padding: 10,
    },
    disabledButton: {
        opacity: 0.3,
    },
});
