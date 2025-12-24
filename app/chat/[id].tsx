import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { io, Socket } from "socket.io-client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInfoModal } from "@/components/chat/ChatInfoModal";
import { ChatInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { UserProfileModal } from "@/components/chat/UserProfileModal";
import { API_URL } from "@/config/api";
import { useUser } from "@/hooks/useUser";
import { getChatById, leaveChatApi } from "@/service/chats";
import GetMessageGroup, {
  deleteMessageGroup,
  SendMessageGroup,
  updateMessageGroup,
} from "@/service/message";
import { getUserById } from "@/service/user";
import {
  ChatAPIResponse,
  InternalChatResponse,
  Message,
  ServerMessage,
} from "@/types/message";

export default function ChatPage() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  // States
  const [inputText, setInputText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const { data: chatDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["chat-details", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });
  // --- 1. Fetching Messages Logic ---
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<InternalChatResponse>({
      queryKey: ["messages", chatId],
      queryFn: async ({ pageParam = 1 }) => {
        const res: ChatAPIResponse = await GetMessageGroup(
          chatId,
          pageParam as number
        );
        const mapped: Message[] = res.data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.sender.username,
          avatar: msg.sender.avatar,
          createdAt: msg.createdAt,
        }));
        return {
          messages: mapped,
          nextPage:
            res.pagination.page < res.pagination.totalPages
              ? res.pagination.page + 1
              : null,
        };
      },
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
    });

  // --- 2. Fetching Target User Profile (Replaces manual targetUser state) ---
  const { data: targetUser, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile", selectedUserId],
    queryFn: () => getUserById(selectedUserId!),
    enabled: !!selectedUserId, // Only fetch when an ID is selected
  });

  const allMessages = data?.pages.flatMap((page) => page.messages) || [];

  // --- 3. WebSocket Logic ---
  useEffect(() => {
    socketRef.current = io(API_URL, { transports: ["websocket"] });
    const socket = socketRef.current;
    socket.emit("join-chat", chatId);

    socket.on("new-message", (msg: ServerMessage) => {
      const newMessage: Message = {
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.username,
        avatar: msg.sender.avatar,
        createdAt: msg.createdAt,
      };

      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          const exists = old.pages.some((p) =>
            p.messages.some((m) => m.id === newMessage.id)
          );
          if (exists) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [newMessage, ...newPages[0].messages],
          };
          return { ...old, pages: newPages };
        }
      );
    });

    socket.on("update-message", (updatedMsg: ServerMessage) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m.id === updatedMsg.id
                  ? { ...m, content: updatedMsg.content }
                  : m
              ),
            })),
          };
        }
      );
    });

    socket.on("delete-message", (data: { id: string }) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m.id !== data.id),
            })),
          };
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  // --- 4. Mutations ---
  const { mutate: sendMessage } = useMutation({
    mutationFn: (content: string) => SendMessageGroup(chatId, content),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] }),
  });

  const { mutate: updateMessage } = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateMessageGroup(chatId, content, id),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m.id === variables.id ? { ...m, content: variables.content } : m
              ),
            })),
          };
        }
      );
      setEditingMessage(null);
      setInputText("");
    },
  });
  const { mutate: leaveChat } = useMutation({
    mutationFn: () => leaveChatApi(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.replace("/(tabs)");
    },
    onError: () => Alert.alert("Error", "Failed to leave the chat."),
  });
  const { mutate: deleteMessage } = useMutation({
    mutationFn: (id: string) => deleteMessageGroup(chatId, id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m.id !== deletedId),
            })),
          };
        }
      );
    },
  });

  // --- 5. Handlers ---
  const handleSend = () => {
    if (!inputText.trim()) return;
    if (editingMessage) {
      updateMessage({ id: editingMessage.id, content: inputText.trim() });
    } else {
      sendMessage(inputText.trim());
      setInputText("");
    }
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
          onDelete={(id) => deleteMessage(id)}
          onEdit={(msg) => {
            setEditingMessage(msg);
            setInputText(msg.content);
          }}
          onAvatarPress={setSelectedUserId}
        />
      </View>

      {/* Input Section */}
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
        onLeaveChat={() => leaveChat()}
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
