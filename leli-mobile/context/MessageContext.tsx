import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Message {
    id: string;
    content: string;
    senderId: string;
    timestamp: number;
    senderName: string;
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar: string;
    lastMessage: string;
    lastMessageTime: number;
    unreadCount: number;
    messages: Message[];
}

interface MessageContextType {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    setActiveConversation: (conv: Conversation | null) => void;
    sendMessage: (conversationId: string, content: string) => Promise<void>;
    isLoading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Mock data to match website behavior for now
const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        participantId: 'support-1',
        participantName: 'Leli Support',
        participantAvatar: '',
        lastMessage: 'Your property has been approved!',
        lastMessageTime: Date.now() - 3600000,
        unreadCount: 1,
        messages: [
            { id: 'm1', content: 'Hello, how can we help you?', senderId: 'support-1', timestamp: Date.now() - 7200000, senderName: 'Leli Support' },
            { id: 'm2', content: 'I need to verify my ID.', senderId: 'user-1', timestamp: Date.now() - 5400000, senderName: 'Jane Doe' },
            { id: 'm3', content: 'Your property has been approved!', senderId: 'support-1', timestamp: Date.now() - 3600000, senderName: 'Leli Support' }
        ]
    },
    {
        id: '2',
        participantId: 'owner-1',
        participantName: 'John Smith',
        participantAvatar: '',
        lastMessage: 'Is the apartment still available?',
        lastMessageTime: Date.now() - 86400000,
        unreadCount: 0,
        messages: [
            { id: 'm4', content: 'Is the apartment still available?', senderId: 'owner-1', timestamp: Date.now() - 86400000, senderName: 'John Smith' }
        ]
    }
];

export function MessageProvider({ children }: { children: ReactNode }) {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (conversationId: string, content: string) => {
        // In a real app, this would hit Supabase
        const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            content,
            senderId: 'user-1', // Should be current user ID
            timestamp: Date.now(),
            senderName: 'Jane Doe'
        };

        setConversations(prev => prev.map(conv =>
            conv.id === conversationId
                ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: content, lastMessageTime: Date.now() }
                : conv
        ));

        if (activeConversation && activeConversation.id === conversationId) {
            setActiveConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
        }
    };

    return (
        <MessageContext.Provider value={{
            conversations,
            activeConversation,
            setActiveConversation,
            sendMessage,
            isLoading
        }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessages() {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
}
