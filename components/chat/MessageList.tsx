import { ChatBubble } from "@/components/chat/ChatBubble";
import { Message } from "@/types/message";
import { ActivityIndicator, FlatList, View } from "react-native";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  isLoading: boolean;
  hasNextPage?: boolean;
  onFetchNext: () => void;
  onDelete: (id: string) => void;
  onEdit: (msg: Message) => void;
  onAvatarPress: (userId: string) => void;
}

export const MessageList = ({
  messages,
  currentUserId,
  isLoading,
  hasNextPage,
  onFetchNext,
  onDelete,
  onEdit,
  onAvatarPress,
}: MessageListProps) => {
  if (isLoading && !messages.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      inverted
      onEndReached={() => hasNextPage && onFetchNext()}
      onEndReachedThreshold={0.3}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
      renderItem={({ item }) => (
        <ChatBubble
          item={item}
          isMine={item.senderId === currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
          onAvatarPress={onAvatarPress}
        />
      )}
    />
  );
};
