import { Message } from "@/types/message";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Text, View } from "react-native";
import UserAvatar from "./UserAvatar";

export const ChatBubble = React.memo(
  ({ item, isMine }: { item: Message; isMine: boolean }) => {
    return (
      <View
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
            {isMine && item.isOptimistic && (
              <Ionicons
                name="time-outline"
                size={10}
                color="#BBF7D0"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
);
