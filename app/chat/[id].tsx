import { Ionicons } from "@expo/vector-icons";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { io, Socket } from "socket.io-client";

import { ChatBubble } from "@/components/ChatBubble";
import UserAvatar from "@/components/UserAvatar";
import { API_URL } from "@/config/api";
import { useUser } from "@/hooks/useUser";
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

  // States
  const [inputText, setInputText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

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
      <View className="flex-1">
        {isLoading && !allMessages.length ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : (
          <FlatList
            data={allMessages}
            renderItem={({ item }) => (
              <ChatBubble
                item={item}
                isMine={item.senderId === user?.id}
                onDelete={(id) => deleteMessage(id)}
                onEdit={(msg) => {
                  setEditingMessage(msg);
                  setInputText(msg.content);
                }}
                onAvatarPress={(userId) => setSelectedUserId(userId)}
              />
            )}
            keyExtractor={(item) => item.id}
            inverted
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
          />
        )}
      </View>

      {/* Input Section */}
      <View className="px-4 pt-2 pb-6 bg-background-800 border-t border-background-700">
        {editingMessage && (
          <View className="flex-row justify-between items-center bg-background-700 px-3 py-2 rounded-t-2xl border-l-4 border-primary-500 mb-0.5">
            <View className="flex-1 pr-4">
              <Text className="text-primary-500 text-[10px] font-bold uppercase">
                Editing Message
              </Text>
              <Text className="text-text-400 text-xs" numberOfLines={1}>
                {editingMessage.content}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setEditingMessage(null);
                setInputText("");
              }}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}

        <View
          className={`flex-row items-end bg-background-700 ${
            editingMessage ? "rounded-b-3xl" : "rounded-3xl"
          } px-4 py-2 border border-background-600`}
        >
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setIsEmojiPickerOpen(true);
            }}
            className="pr-2 pb-1"
          >
            <Ionicons name="happy-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>

          <TextInput
            className="flex-1 text-text-50 text-[16px] max-h-32 py-1"
            placeholder="Message..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`ml-2 w-10 h-10 items-center justify-center rounded-full ${
              inputText.trim() ? "bg-primary-500" : "bg-background-500"
            }`}
          >
            <Ionicons
              name={editingMessage ? "checkmark" : "arrow-up"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Profile Modal */}
      <Modal
        visible={!!selectedUserId}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedUserId(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-8">
          <View className="w-full bg-background-800 rounded-3xl p-6 border border-background-700 items-center shadow-2xl">
            {isLoadingProfile ? (
              <ActivityIndicator color="#22C55E" />
            ) : targetUser ? (
              <>
                <UserAvatar
                  uri={targetUser?.data?.avatar}
                  name={targetUser?.data?.username}
                  size={100}
                />
                <Text className="text-text-50 text-2xl font-bold mt-4">
                  {targetUser?.data.displayName || targetUser?.data.username}
                </Text>
                <Text className="text-primary-500 text-sm font-medium mb-4">
                  @{targetUser?.data.username?.toLowerCase()}
                </Text>

                <View className="w-full bg-background-700 rounded-2xl p-4 mb-6">
                  <Text className="text-text-400 text-xs uppercase font-bold mb-1">
                    Bio
                  </Text>
                  <Text className="text-text-100 text-[14px]">
                    {targetUser?.data.bio || "No bio available for this user."}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedUserId(null)}
                  className="bg-primary-600 w-full py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-lg">
                    Close Profile
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text className="text-text-200">User not found</Text>
            )}
          </View>
        </View>
      </Modal>

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
