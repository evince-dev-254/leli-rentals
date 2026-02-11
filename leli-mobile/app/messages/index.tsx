import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, useWindowDimensions } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MessageCircle, MessageSquare, ChevronRight, Inbox, Shield } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useMessages, Conversation } from '../../context/MessageContext';
import { router } from 'expo-router';

const StyledSafeAreaView = styled(SafeAreaView);

export default function MessagesScreen() {
    const { width } = useWindowDimensions();
    const { conversations, setActiveConversation } = useMessages();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectConversation = (conv: Conversation) => {
        setActiveConversation(conv);
        // Navigate using the renamed path
        router.push({ pathname: '/messages/[id]', params: { id: conv.id } });
    };

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <StyledSafeAreaView className="flex-1 px-6 pt-4">
                {/* User requested: "remove it in hader" - removing the title prop */}
                <ScreenHeader title="Messages" />

                <View className="relative mt-4 mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 z-10" size={18} color="#94A3B8" />
                    <TextInput
                        className="bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 font-outfit text-slate-900"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    {filteredConversations.length === 0 ? (
                        <View className="items-center justify-center py-20">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <Inbox size={40} color="#CBD5E1" />
                            </View>
                            <Text className="text-lg font-outfit-bold text-slate-400">No messages yet</Text>
                            <Text className="text-sm font-outfit text-slate-400 text-center px-10 mt-2">
                                Start chatting with owners or agents to see your conversations here.
                            </Text>
                        </View>
                    ) : (
                        filteredConversations.map((conv) => (
                            <TouchableOpacity
                                key={conv.id}
                                onPress={() => handleSelectConversation(conv)}
                                className="flex-row items-center p-4 bg-white/60 rounded-3xl mb-3 border border-slate-50 shadow-sm"
                            >
                                <View className="relative">
                                    <View className="w-14 h-14 bg-slate-100 rounded-2xl items-center justify-center overflow-hidden">
                                        {conv.participantAvatar ? (
                                            <Image source={{ uri: conv.participantAvatar }} className="w-full h-full" />
                                        ) : (
                                            <Text className="text-slate-400 font-outfit-bold text-lg">
                                                {conv.participantName.charAt(0)}
                                            </Text>
                                        )}
                                    </View>
                                    {conv.unreadCount > 0 && (
                                        <View className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full items-center justify-center border-2 border-white">
                                            <Text className="text-white text-[10px] font-outfit-bold">{conv.unreadCount}</Text>
                                        </View>
                                    )}
                                </View>

                                <View className="flex-1 ml-4 mr-2">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <View className="flex-row items-center">
                                            {conv.participantName === 'Leli Support' && <Shield size={14} color="#A855F7" className="mr-1" />}
                                            <Text className={`font-outfit-bold ${conv.participantName === 'Leli Support' ? 'text-purple-600' : 'text-slate-800'} text-base`} numberOfLines={1}>
                                                {conv.participantName}
                                            </Text>
                                        </View>
                                        <Text className="text-xs font-outfit text-slate-400">
                                            {formatTime(conv.lastMessageTime)}
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-outfit text-slate-500" numberOfLines={1}>
                                        {conv.lastMessage}
                                    </Text>
                                </View>

                                <ChevronRight size={16} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </StyledSafeAreaView>
        </View>
    );
}
