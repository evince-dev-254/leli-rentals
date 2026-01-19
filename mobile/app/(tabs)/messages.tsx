import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function MessagesScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1 items-center justify-center px-8">
                <MotiView
                    from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 1000, delay: 200 }}
                    className="items-center"
                >
                    <View className="h-40 w-40 rounded-[48px] bg-white/80 dark:bg-slate-900/80 items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-xl mb-8">
                        <MessageCircle size={64} color="#3b82f6" fill="#3b82f6" opacity={0.2} />
                        <MotiView
                            from={{ translateY: 0 }}
                            animate={{ translateY: -10 }}
                            transition={{ type: 'timing', duration: 2000, loop: true, repeatReverse: true }}
                            style={{ position: 'absolute' }}
                        >
                            <MessageCircle size={48} color="#3b82f6" fill="#3b82f6" />
                        </MotiView>
                    </View>

                    <Text className="text-3xl font-black text-slate-900 dark:text-white text-center mb-4">Quiet in Here...</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-center text-lg mb-10 font-bold leading-6">
                        Send a message to an owner to start your next adventure!
                    </Text>

                    <Button
                        title="Browse Gear"
                        onPress={() => router.push('/')}
                        className="w-full"
                    />
                </MotiView>
            </SafeAreaView>
        </View>
    );
}
