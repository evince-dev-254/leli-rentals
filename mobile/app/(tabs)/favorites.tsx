import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['bottom']}>
                <View className="flex-1 items-center justify-center px-8">
                    <MotiView
                        from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 1000, delay: 200 }}
                        className="items-center"
                    >
                        <View className="h-40 w-40 rounded-[48px] bg-white/80 dark:bg-slate-900/80 items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-xl mb-8">
                            <Heart size={64} color="#f43f5e" fill="#f43f5e" opacity={0.2} />
                            <MotiView
                                from={{ scale: 0.8 }}
                                animate={{ scale: 1.1 }}
                                transition={{ type: 'timing', duration: 1500, loop: true, repeatReverse: true }}
                                style={{ position: 'absolute' }}
                            >
                                <Heart size={48} color="#f43f5e" fill="#f43f5e" />
                            </MotiView>
                        </View>

                        <Text className="text-3xl font-black text-slate-900 dark:text-white text-center mb-4">No Favorites Yet</Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-center text-lg mb-10 font-bold leading-6">
                            Explore Kenyas best gear and save your top choices for later!
                        </Text>

                        <Button
                            title="Start Exploring"
                            onPress={() => router.push('/')}
                            className="w-full"
                        />
                    </MotiView>
                </View>
            </SafeAreaView>
        </View>
    );
}
