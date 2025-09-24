import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { colors, spacing, borderRadius } from '../constants/theme';

interface ChatSession {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantVerified?: boolean;
  participantRating?: number;
  lastMessage?: string;
  unreadCount: number;
  listingTitle?: string;
  updatedAt: Date;
}

const mockChatSessions: ChatSession[] = [
  {
    id: "chat1",
    participantName: "John Mwangi",
    participantAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    participantVerified: true,
    participantRating: 4.9,
    lastMessage: "Hi! I've confirmed your booking for the BMW X5.",
    unreadCount: 2,
    listingTitle: "Luxury BMW X5 SUV",
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "chat2",
    participantName: "Sarah Kimani",
    participantAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    participantVerified: true,
    participantRating: 4.8,
    lastMessage: "Thank you for the great stay!",
    unreadCount: 0,
    listingTitle: "Modern 2-Bedroom Apartment",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

const MessagesScreen = () => {
  const { theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredChats = chatSessions.filter(chat =>
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.listingTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => Alert.alert('Chat', `Opening chat with ${item.participantName}`)}
    >
      <Image source={{ uri: item.participantAvatar }} style={styles.chatAvatar} />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.chatNameContainer}>
            <Text style={[styles.chatName, { color: theme.colors.onSurface }]}>
              {item.participantName}
            </Text>
            {item.participantVerified && (
              <Ionicons name="shield-checkmark" size={12} color={colors.success} />
            )}
          </View>
          
          <View style={styles.chatMeta}>
            <Text style={[styles.chatTime, { color: theme.colors.onSurfaceVariant }]}>
              {formatTime(item.updatedAt)}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {item.listingTitle && (
          <Text style={[styles.listingTitle, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
            {item.listingTitle}
          </Text>
        )}

        {item.lastMessage && (
          <Text style={[styles.lastMessage, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        )}

        <View style={styles.chatFooter}>
          <View style={styles.ownerRating}>
            <Ionicons name="star" size={12} color={colors.yellow} />
            <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
              {item.participantRating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Messages</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {chatSessions.reduce((sum, chat) => sum + chat.unreadCount, 0)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={theme.colors.onSurfaceVariant} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Search conversations..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyStateText, { color: theme.colors.onSurfaceVariant }]}>
              No conversations found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerBadge: {
    backgroundColor: colors.red,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTime: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  unreadBadge: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listingTitle: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: spacing.md,
  },
});

export default MessagesScreen;