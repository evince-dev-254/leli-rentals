import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { WebViewWrapper } from '@/components/WebViewWrapper';

export default function WebDashboardScreen() {
    const { url, title } = useLocalSearchParams<{ url: string; title: string }>();

    // Default to the main site if no URL provided.
    // NOTE: For local testing on Android Emulator, 'localhost' won't work.
    // You would use 'http://10.0.2.2:3000/dashboard' or your LAN IP.
    // For now, we default to the production URL or a valid placeholder.
    const targetUrl = url || 'https://www.leli.rentals/dashboard';

    return <WebViewWrapper url={targetUrl} title={title || 'Dashboard'} />;
}
