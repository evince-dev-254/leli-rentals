import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { Send, Image as ImageIcon, Smile, Shield, MoreVertical, X, Paperclip } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ScreenBackground from '../../components/ui/ScreenBackground';
import BackButton from '../../components/ui/BackButton';
import { useMessages } from '../../context/MessageContext';
import { useLocalSearchParams } from 'expo-router';

const StyledSafeAreaView = styled(SafeAreaView);

const EMOJI_LIST = [
    '😀', '😂', '😍', '🥰', '😊', '🤗', '😎', '🤩',
    '👍', '👋', '🙏', '💪', '🎉', '🔥', '❤️', '💯',
    '✅', '🏠', '🏡', '🔑', '📍', '📞', '📧', '💰',
    '🤝', '👏', '😢', '😅', '🤔', '👀', '⭐', '🌟',
];

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const { conversations, sendMessage } = useMessages();
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    const conversation = conversations.find(c => c.id === id);

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 100);
    }, []);

    if (!conversation) return null;

    const handleSend = () => {
        if (!newMessage.trim() && !selectedImage) return;

        let content = newMessage.trim();
        if (selectedImage) {
            content = content ? `📷 ${content}` : '📷 Image sent';
        }

        sendMessage(conversation.id, content);
        setNewMessage('');
        setSelectedImage(null);
        setShowEmojiPicker(false);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
    };

    const handleImagePick = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library to send images.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                setShowEmojiPicker(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const handleDocumentPick = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your files.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                allowsMultipleSelection: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                setShowEmojiPicker(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick file. Please try again.');
        }
    };

    return (
        <View className="flex-1 bg-white">
            <ScreenBackground />
            <StyledSafeAreaView className="flex-1">
                {/* Chat Header */}
                <View className="px-6 pt-4 pb-2 border-b border-slate-100 bg-white/50">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <BackButton label="" />
                            <View className="ml-2 flex-row items-center">
                                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center overflow-hidden">
                                    <Text className="text-slate-400 font-outfit-bold">{conversation.participantName.charAt(0)}</Text>
                                </View>
                                <View className="ml-3">
                                    <View className="flex-row items-center">
                                        {conversation.participantName === 'Leli Support' && <Shield size={12} color="#A855F7" />}
                                        <Text className={`font-outfit-bold ${conversation.participantName === 'Leli Support' ? 'text-purple-600' : 'text-slate-800'}`}>
                                            {conversation.participantName}
                                        </Text>
                                    </View>
                                    <Text className="text-[10px] text-emerald-500 font-outfit-medium uppercase">Online Now</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity className="p-2">
                            <MoreVertical size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Messages List */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-6 pb-4"
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    <View className="py-6 items-center">
                        <Text className="text-[10px] font-outfit-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                            Conversation Started
                        </Text>
                    </View>

                    {conversation.messages.map((msg) => {
                        const isMe = msg.senderId === 'user-1';
                        return (
                            <View key={msg.id} className={`mb-4 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${isMe
                                    ? 'bg-orange-500 rounded-tr-none'
                                    : 'bg-white border border-slate-100 rounded-tl-none'
                                    } shadow-sm`}>
                                    <Text className={`font-outfit ${isMe ? 'text-white' : 'text-slate-800'} text-sm leading-relaxed`}>
                                        {msg.content}
                                    </Text>
                                    <Text className={`text-[9px] mt-1 ${isMe ? 'text-orange-100' : 'text-slate-400'} font-outfit text-right`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <View className="bg-white border-t border-slate-100 px-4 py-3">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-xs font-outfit-bold text-slate-400 uppercase tracking-wider">Emojis</Text>
                            <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                                <X size={18} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap">
                            {EMOJI_LIST.map((emoji, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleEmojiSelect(emoji)}
                                    className="w-10 h-10 items-center justify-center rounded-xl"
                                >
                                    <Text className="text-2xl">{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Selected Image Preview */}
                {selectedImage && (
                    <View className="bg-white border-t border-slate-100 px-4 py-3">
                        <View className="flex-row items-center">
                            <Image source={{ uri: selectedImage }} className="w-16 h-16 rounded-xl" />
                            <Text className="flex-1 ml-3 text-sm font-outfit text-slate-500">Image ready to send</Text>
                            <TouchableOpacity onPress={() => setSelectedImage(null)} className="p-2">
                                <X size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <View className="p-4 bg-white border-t border-slate-100 flex-row items-center">
                        <TouchableOpacity
                            onPress={() => { setShowEmojiPicker(!showEmojiPicker); }}
                            className="mx-1"
                        >
                            <Smile size={24} color={showEmojiPicker ? '#F97316' : '#94A3B8'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleImagePick} className="mx-1">
                            <ImageIcon size={24} color="#94A3B8" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDocumentPick} className="mx-1 mr-3">
                            <Paperclip size={22} color="#94A3B8" />
                        </TouchableOpacity>

                        <View className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 flex-row items-center border border-slate-100">
                            <TextInput
                                className="flex-1 font-outfit text-slate-900 py-0"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChangeText={setNewMessage}
                                multiline
                                style={{ maxHeight: 100 }}
                                onFocus={() => setShowEmojiPicker(false)}
                            />
                            {(newMessage.length > 0 || selectedImage) && (
                                <TouchableOpacity
                                    onPress={handleSend}
                                    className="bg-orange-500 w-8 h-8 rounded-full items-center justify-center ml-2"
                                >
                                    <Send size={14} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </StyledSafeAreaView>
        </View>
    );
}
