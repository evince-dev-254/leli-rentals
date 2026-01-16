import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: 'your-project-id' // Replace with actual project ID
        })).data;
        console.log(token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function savePushTokenToSupabase(userId: string, token: string) {
    const { error } = await supabase
        .from('profiles')
        .update({ expo_push_token: token })
        .eq('id', userId);

    if (error) {
        console.error('Error saving push token:', error);
    }
}
