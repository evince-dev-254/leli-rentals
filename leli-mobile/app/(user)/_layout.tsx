import { Stack } from 'expo-router';

export default function UserLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="subscription" />
            <Stack.Screen name="verification" />
            <Stack.Screen name="updates" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="support" />
        </Stack>
    );
}
