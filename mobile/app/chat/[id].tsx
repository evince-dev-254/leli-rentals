
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useMessages, useConversations, sendMessage } from '@/lib/hooks/useData';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react-native';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Ensure utility exists or replace with inline styles

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const conversationId = id as string; // Ensure string type
    const router = useRouter();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    // Fetch Messages
    const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = useMessages(conversationId);

    // Fetch Conversation Details (to get receiver info)
    // Optimization: We could pass params via router, but fetching ensures freshness
    // We reuse useConversations but filter for this specific one. 
    // Ideally we should have useConversation(id) but this works for now.
    const { data: conversations } = useConversations(user?.id || '');
    const currentConversation = conversations?.find(c => c.id === conversationId);
    const otherUser = currentConversation?.otherUser;

    const flatListRef = useRef<FlatList>(null);

    // Scroll to bottom when messages load
    useEffect(() => {
        if (messages?.length) {
            // flatListRef.current?.scrollToEnd({ animated: true }); 
            // If inverted, no need to scroll to end initially?
        }
    }, [messages]);

    const handleSend = async () => {
        if (!user) {
            Alert.alert("Error", "You must be logged in to send messages.");
            return;
        }
        if (!newMessage.trim()) return;

        // Ensure we have the receiver ID. If looking up from conversation list failed,
        // we might need to fetch the conversation details specifically here.
        if (!otherUser) {
            Alert.alert("Error", "Could not identify the recipient. Please try refreshing.");
            return;
        }

        try {
            setSending(true);
            await sendMessage(conversationId, user.id, newMessage.trim(), otherUser.id);
            setNewMessage('');
            refetchMessages();
        } catch (error: any) {
            console.error("Failed to send message:", error);
            Alert.alert("Send Failed", error.message || "An unknown error occurred.");
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender_id === user?.id;
        return (
            <View className={cn("flex-row mb-3 px-4", isMe ? "justify-end" : "justify-start")}>
                {!isMe && (
                    <View className="h-8 w-8 rounded-full bg-slate-200 mr-2 overflow-hidden self-end mb-1">
                        {otherUser?.avatar_url && (
                            <Image source={{ uri: otherUser.avatar_url }} className="h-full w-full" />
                        )}
                    </View>
                )}
                <View
                    className={cn(
                        "max-w-[75%] p-3 rounded-2xl",
                        isMe ? "bg-blue-600 rounded-tr-sm" : "bg-slate-100 dark:bg-slate-800 rounded-tl-sm"
                    )}
                >
                    <Text className={cn("text-sm", isMe ? "text-white" : "text-slate-900 dark:text-white")}>
                        {item.content}
                    </Text>
                    <Text className={cn("text-[10px] mt-1 text-right", isMe ? "text-blue-200" : "text-slate-400")}>
                        {format(new Date(item.created_at), 'h:mm a')}
                    </Text>
                </View>
            </View>
        );
    };

    if (!conversationId) return <View className="flex-1 bg-white items-center justify-center"><Text>Error: No chat ID</Text></View>;

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex-row items-center bg-white dark:bg-slate-950 z-10">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <ArrowLeft size={24} color="#64748b" />
                    </TouchableOpacity>

                    <View className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mr-3">
                        {otherUser?.avatar_url && (
                            <Image source={{ uri: otherUser.avatar_url }} className="h-full w-full" />
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="font-bold text-slate-900 dark:text-white text-base">
                            {otherUser?.full_name || 'Chat'}
                        </Text>
                        {/*  <Text className="text-xs text-slate-500">
                             {currentConversation?.listing?.title || 'Details'}
                        </Text> */}
                    </View>
                </View>

                {/* Messages List - INVERTED for chat feel */}
                {/* Note: Inverted lists require data to be reversed visually vs internal order. 
                    If our API returns oldest first, and we use inverted, oldest will be at bottom? No.
                    Inverted means top is bottom. Element 0 is at bottom.
                    If API returns Oldest -> Newest (ASC),
                    Element 0 (Oldest) is at bottom? No.
                    Inverted list: Element 0 is visually at the BOTTOM.
                    So we want Newest first for inverted list.
                    Our API returns ASC (Oldest first).
                    So we should reverse it for the FlatList data prop if using inverted.
                    OR don't use inverted and stick to bottom on load.
                    Using Inverted + Reversed Data is best for chat scrolling.
                */}
                <FlatList
                    ref={flatListRef}
                    data={[...(messages || [])].reverse()} // Reverse so Newest is at index 0 (Bottom)
                    inverted
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    ListEmptyComponent={
                        messagesLoading ? (
                            <ActivityIndicator size="large" color="#3b82f6" className="mt-10" />
                        ) : (
                            <Text className="text-center text-slate-400 mt-10">Send a message to start chatting!</Text>
                        )
                    }
                />

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4"
                >
                    <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-full px-4 border border-slate-200 dark:border-slate-800">
                        <TextInput
                            className="flex-1 py-3 text-slate-900 dark:text-white max-h-24 font-medium"
                            placeholder="Type a message..."
                            placeholderTextColor="#94a3b8"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!newMessage.trim() || sending}
                            className={cn(
                                "ml-2 p-2 rounded-full",
                                newMessage.trim() ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            {sending ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Send size={18} color={newMessage.trim() ? "white" : "#94a3b8"} />
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
