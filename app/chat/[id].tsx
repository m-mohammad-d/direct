import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, View } from "react-native";
import EmojiPicker from "rn-emoji-keyboard";

// Components
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInfoModal } from "@/components/chat/ChatInfoModal";
import { ChatInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { UserProfileModal } from "@/components/chat/UserProfileModal";

// Hooks & Services
import { useChatSocket } from "@/hooks/useChatSocket";
import { useMessageActions } from "@/hooks/useMessageActions";
import { useUser } from "@/hooks/useUser";
import { getChatById } from "@/service/chats";
import GetMessageGroup from "@/service/message";
import { getUserById } from "@/service/user";
import { ChatAPIResponse, Message } from "@/types/message";

export default function ChatPage() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();

  const [inputText, setInputText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useChatSocket(chatId);
  const { sendMessage, updateMessage, deleteMessage, leaveChat } =
    useMessageActions(chatId);

  const { data: chatDetails } = useQuery({
    queryKey: ["chat-details", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  const { data: targetUser, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile", selectedUserId],
    queryFn: () => getUserById(selectedUserId!),
    enabled: !!selectedUserId,
  });

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: async ({ pageParam = 1 }) => {
      const res: ChatAPIResponse = await GetMessageGroup(
        chatId,
        pageParam as number
      );
      return {
        messages: res.data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.sender.username,
          avatar: msg.sender.avatar,
          createdAt: msg.createdAt,
        })),
        nextPage:
          res.pagination.page < res.pagination.totalPages
            ? res.pagination.page + 1
            : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  const allMessages = data?.pages.flatMap((page) => page.messages) || [];

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (editingMessage) {
      updateMessage({ id: editingMessage.id, content: inputText.trim() });
      setEditingMessage(null);
    } else {
      sendMessage(inputText.trim());
    }
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className="flex-1 bg-background-900"
    >
      <ChatHeader
        title={chatDetails?.data?.name}
        avatar={chatDetails?.data?.avatar}
        memberCount={chatDetails?.data?.users?.length}
        onBack={() => router.back()}
        onShowInfo={() => setIsInfoModalOpen(true)}
      />

      <View className="flex-1">
        <MessageList
          messages={allMessages}
          currentUserId={user?.id}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          onFetchNext={fetchNextPage}
          onDelete={deleteMessage}
          onEdit={(msg) => {
            setEditingMessage(msg);
            setInputText(msg.content);
          }}
          onAvatarPress={setSelectedUserId}
        />
      </View>

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        editingMessage={editingMessage}
        onCancelEdit={() => {
          setEditingMessage(null);
          setInputText("");
        }}
        onOpenEmoji={() => {
          Keyboard.dismiss();
          setIsEmojiPickerOpen(true);
        }}
      />

      <ChatInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        chatData={chatDetails?.data}
        onLeaveChat={leaveChat}
        onMemberPress={(userId) => {
          setIsInfoModalOpen(false);
          setSelectedUserId(userId);
        }}
      />

      <UserProfileModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userData={targetUser}
        isLoading={isLoadingProfile}
      />

      <EmojiPicker
        onEmojiSelected={(emoji) => setInputText((prev) => prev + emoji.emoji)}
        open={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        theme={{
          container: "#1E293B",
          backdrop: "#00000088",
          knob: "#22C55E",
          header: "#F8FAFC",
        }}
      />
    </KeyboardAvoidingView>
  );
}
