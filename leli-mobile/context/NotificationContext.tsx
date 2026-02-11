import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Home, Bell, Info, ShieldCheck, Star, Search, LayoutGrid, Heart, User, Settings, Pin, Smartphone } from 'lucide-react-native';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';


const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Helper to get notifications module dynamically
const getNotifications = () => {
    try {
        return require('expo-notifications');
    } catch (e) {
        return null;
    }
};

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: NotificationType;
    iconName: 'Home' | 'Bell' | 'Info' | 'ShieldCheck' | 'Star' | 'Search' | 'LayoutGrid' | 'Heart' | 'User' | 'Settings' | 'Pin' | 'Smartphone';
    unread: boolean;
    timestamp: number;
    data?: {
        targetPath?: string;
        id?: string;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const ICON_MAP = {
    Home,
    Bell,
    Info,
    ShieldCheck,
    Star,
    Search,
    LayoutGrid,
    Heart,
    User,
    Settings,
    Pin,
    Smartphone,
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        loadNotifications();

        if (isExpoGo) {
            console.log('System notifications are not supported in Expo Go (SDK 53+). Please use a development build.');
            return;
        }
        const Notifications = getNotifications();
        if (!Notifications) return;

        // Set up notification handler
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });

        const checkPermissions = async () => {
            try {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    console.warn('Failed to get notifications permissions!');
                }
            } catch (error) {
                console.log('Notifications permissions check failed:', error);
            }
        };

        checkPermissions();
    }, []);

    const loadNotifications = async () => {
        try {
            const saved = await AsyncStorage.getItem('notifications');
            if (saved) {
                setNotifications(JSON.parse(saved));
            } else {
                // Add mock notifications for better first-time UX
                const mockNotifs: Notification[] = [
                    {
                        id: 'mock-1',
                        title: 'Welcome to Leli Rentals!',
                        description: 'Discover your dream home and exotic workspaces with us.',
                        time: '1h ago',
                        type: 'info',
                        iconName: 'Home',
                        unread: true,
                        timestamp: Date.now() - 3600000,
                        data: { targetPath: '/(tabs)' }
                    },
                    {
                        id: 'mock-2',
                        title: 'Property Verified',
                        description: 'The Luxury Villa in Diani has been successfully verified.',
                        time: '3h ago',
                        type: 'success',
                        iconName: 'ShieldCheck',
                        unread: true,
                        timestamp: Date.now() - 10800000,
                        data: { targetPath: '/property/prod-0' }
                    },
                    {
                        id: 'mock-3',
                        title: 'New Message',
                        description: 'You have a new message from Support.',
                        time: '5h ago',
                        type: 'info',
                        iconName: 'Bell',
                        unread: false,
                        timestamp: Date.now() - 18000000,
                        data: { targetPath: '/messages' }
                    }
                ];
                setNotifications(mockNotifs);
                saveNotifications(mockNotifs);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const saveNotifications = async (newNotifs: Notification[]) => {
        try {
            await AsyncStorage.setItem('notifications', JSON.stringify(newNotifs));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    };


    const addNotification = useCallback(async (newNotif: Omit<Notification, 'id' | 'time' | 'unread' | 'timestamp'>) => {
        const id = Math.random().toString(36).substring(7);
        const timestamp = Date.now();
        const notification: Notification = {
            ...newNotif,
            id,
            time: 'Just now',
            unread: true,
            timestamp,
        };

        setNotifications(prev => {
            const next = [notification, ...prev];
            saveNotifications(next);
            return next;
        });

        // Trigger system notification
        if (isExpoGo) return;
        const Notifications = getNotifications();
        if (Notifications) {
            try {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: newNotif.title,
                        body: newNotif.description,
                        data: { id },
                    },
                    trigger: null, // show immediately
                });
            } catch (error) {
                console.log('Local notification failed:', error);
            }
        }
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => {
            const next = prev.map(n => n.id === id ? { ...n, unread: false } : n);
            saveNotifications(next);
            return next;
        });
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => {
            const next = prev.map(n => ({ ...n, unread: false }));
            saveNotifications(next);
            return next;
        });
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        saveNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
