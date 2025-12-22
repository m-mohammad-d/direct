import { Ionicons } from "@expo/vector-icons";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiPicker, { type EmojiType } from "rn-emoji-keyboard";
import { io, Socket } from "socket.io-client";

import { ChatBubble } from "@/components/ChatBubble";
import { API_URL } from "@/config/api";
import { useUser } from "@/hooks/useUser";
import GetMessageGroup, { SendMessageGroup } from "@/service/message";
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
  const socketRef = useRef<Socket | null>(null);

  // --- 1. Fetching Logic ---
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

  const allMessages = data?.pages.flatMap((page) => page.messages) || [];

  // --- 2. WebSocket Logic ---
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
      socket.off("new-message");
      socket.emit("leave-chat", chatId);
      socket.disconnect();
    };
  }, [chatId, queryClient]);

  // --- 3. Mutation ---
  const { mutate: sendMessage } = useMutation({
    mutationFn: (content: string) => SendMessageGroup(chatId, content),
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] });
      const previousMessages = queryClient.getQueryData(["messages", chatId]);

      const optimisticMsg: Message = {
        id: `temp-${Date.now()}`,
        content: newContent,
        senderId: user?.id || "me",
        senderName: user?.username || "Me",
        avatar: user?.avatar || null,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [optimisticMsg, ...newPages[0].messages],
          };
          return { ...old, pages: newPages };
        }
      );
      setInputText("");
      return { previousMessages };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["messages", chatId], context?.previousMessages);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
  };

  const handlePickEmoji = (emojiObject: EmojiType) => {
    setInputText((prev) => prev + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    Keyboard.dismiss();
    setIsEmojiPickerOpen(true);
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
              <ChatBubble item={item} isMine={item.senderId === user?.id} />
            )}
            keyExtractor={(item) => item.id}
            inverted
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            removeClippedSubviews
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator color="#22C55E" className="my-4" />
              ) : null
            }
          />
        )}
      </View>

      {/* Input Section */}
      <View className="px-4 pt-2 pb-6 bg-background-800 border-t border-background-700">
        <View className="flex-row items-end bg-background-700 rounded-3xl px-4 py-2 border border-background-600">
          {/* Emoji Button */}
          <TouchableOpacity
            onPress={toggleEmojiPicker}
            className="pr-2 pb-1"
            activeOpacity={0.7}
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
            <Ionicons name="arrow-up" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <EmojiPicker
        onEmojiSelected={handlePickEmoji}
        open={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        enableRecentlyUsed
        allowMultipleSelections
        enableSearchBar
        enableSearchAnimation
        theme={{
          backdrop: "#00000088",
          knob: "#22C55E",
          container: "#1E293B",
          header: "#F8FAFC",
          category: {
            icon: "#22C55E",
            iconActive: "#F8FAFC",
            container: "#0F172A",
            containerActive: "#22C55E",
          },
        }}
      />
    </KeyboardAvoidingView>
  );
}
