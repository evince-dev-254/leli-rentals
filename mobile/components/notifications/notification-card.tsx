import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Bell, MessageSquare, Wallet, Globe, Heart, Info, X } from 'lucide-react-native';
import { GlassView } from '../ui/glass-view';
import { useTheme } from '../theme-provider';
import { KejapinColors } from '@/constants/Colors';
import { router } from 'expo-router';

export type NotificationType = 'MESSAGE' | 'FINANCIAL' | 'SYSTEM' | 'FAVORITE' | 'MARKETPLACE';

interface NotificationCardProps {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    created_at: string;
    route?: string;
    metadata?: any;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    index: number;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    id,
    title,
    message,
    type,
    is_read,
    created_at,
    route,
    metadata,
    onMarkAsRead,
    onDelete,
    index
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getCategoryStyles = (type: NotificationType) => {
        switch (type) {
            case 'MESSAGE':
                return { icon: MessageSquare, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
            case 'FINANCIAL':
                return { icon: Wallet, color: KejapinColors.accent, bg: 'rgba(16, 185, 129, 0.1)' };
            case 'FAVORITE':
                return { icon: Heart, color: KejapinColors.error, bg: 'rgba(239, 68, 68, 0.1)' };
            case 'MARKETPLACE':
                return { icon: Globe, color: KejapinColors.secondary, bg: 'rgba(249, 115, 22, 0.1)' };
            case 'SYSTEM':
            default:
                return { icon: Info, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
        }
    };

    const config = getCategoryStyles(type);

    const handlePress = () => {
        if (!is_read) {
            onMarkAsRead(id);
        }
        if (route) {
            router.push({
                pathname: route as any,
                params: metadata
            });
        }
    };

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ delay: index * 100, type: 'timing', duration: 400 }}
            style={styles.container}
        >
            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                <GlassView
                    intensity={isDark ? 20 : 40}
                    tint={isDark ? 'dark' : 'light'}
                    style={{
                        ...styles.glass,
                        ...(!is_read ? { borderColor: KejapinColors.secondary, borderWidth: 1 } : {})
                    }}
                >
                    <View style={styles.content}>
                        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
                            <config.icon size={22} color={config.color} />
                        </View>

                        <View style={styles.textContainer}>
                            <View style={styles.headerRow}>
                                <Text
                                    style={[
                                        styles.title,
                                        { color: isDark ? '#f8fafc' : '#1e293b' }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {title}
                                </Text>
                                {!is_read && <View style={styles.unreadDot} />}
                            </View>

                            <Text
                                style={[
                                    styles.message,
                                    { color: isDark ? '#94a3b8' : '#64748b' }
                                ]}
                                numberOfLines={2}
                            >
                                {message}
                            </Text>

                            <Text style={styles.time}>
                                {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => onDelete(id)}
                            style={styles.deleteButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <X size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </GlassView>
            </TouchableOpacity>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    glass: {
        borderRadius: 24,
    },
    content: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: KejapinColors.secondary,
        marginLeft: 8,
    },
    message: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 6,
    },
    time: {
        fontSize: 10,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 'bold',
    },
    deleteButton: {
        marginLeft: 12,
        padding: 4,
    }
});
