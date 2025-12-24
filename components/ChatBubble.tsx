import { Message } from "@/types/message";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import UserAvatar from "./UserAvatar";

interface ChatBubbleProps {
  item: Message;
  isMine: boolean;
  onDelete: (id: string) => void;
  onEdit: (item: Message) => void;
}

export const ChatBubble = React.memo(
  ({ item, isMine, onDelete, onEdit }: ChatBubbleProps) => {
    // Handler for editing/deleting own messages
    const handleLongPress = () => {
      if (!isMine) return;

      Alert.alert("Message Options", "Choose an action", [
        { text: "Edit Message", onPress: () => onEdit(item) },
        {
          text: "Delete Message",
          onPress: () => onDelete(item.id),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]);
    };

    return (
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        className={`flex-row mb-4 ${isMine ? "justify-end" : "justify-start"}`}
      >
        {!isMine && (
          <View className="mr-2 self-end">
            <UserAvatar uri={item.avatar} name={item.senderName} size={32} />
          </View>
        )}

        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
            isMine
              ? "bg-primary-600 rounded-tr-none"
              : "bg-background-700 rounded-tl-none border border-background-600"
          }`}
        >
          {!isMine && (
            <Text className="text-accent-400 text-[11px] font-bold mb-1">
              {item.senderName}
            </Text>
          )}

          <Text className="text-text-50 text-[15px] leading-5">
            {item.content}
          </Text>

          <View className="flex-row items-center justify-end mt-1">
            <Text
              className={`text-[10px] ${isMine ? "text-primary-200" : "text-text-400"}`}
            >
              {dayjs(item.createdAt).format("HH:mm")}
            </Text>

            {isMine && (
              <View className="flex-row items-center ml-1">
                {item.isOptimistic ? (
                  <Ionicons name="time-outline" size={10} color="#BBF7D0" />
                ) : (
                  <Ionicons
                    name="checkmark-done-outline"
                    size={12}
                    color="#BBF7D0"
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
