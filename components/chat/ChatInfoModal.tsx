import UserAvatar from "@/components/UserAvatar";
import { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatData: {
    displayName?: string;
    avatar?: string;
    description?: string;
    users?: User[];
  } | null;
  onLeaveChat: () => void;
  onMemberPress: (userId: string) => void;
}

export const ChatInfoModal = ({
  isOpen,
  onClose,
  chatData,
  onLeaveChat,
  onMemberPress,
}: ChatInfoModalProps) => {
  const handleLeavePress = () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: onLeaveChat },
    ]);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background-800 h-[80%] rounded-t-3xl overflow-hidden">
          {/* Header & Avatar */}
          <View className="items-center p-6 border-b border-background-700">
            <View className="w-12 h-1 bg-background-600 rounded-full mb-4" />
            <UserAvatar
              uri={chatData?.avatar || null}
              name={chatData?.displayName || "Chat"}
              size={80}
            />
            <Text className="text-text-50 text-xl font-bold mt-3">
              {chatData?.displayName}
            </Text>
            <Text className="text-text-400 mt-1">
              {chatData?.description || "No description"}
            </Text>
          </View>

          {/* Members List */}
          <ScrollView className="flex-1 p-4">
            <Text className="text-primary-500 font-bold mb-4 uppercase text-xs">
              Members
            </Text>
            {chatData?.users?.map((u) => (
              <TouchableOpacity
                key={u.id}
                className="flex-row items-center mb-4"
                onPress={() => onMemberPress(u.id)}
              >
                <UserAvatar uri={u.avatar} name={u.username} size={45} />
                <View className="ml-3">
                  <Text className="text-text-50 font-medium">
                    {u.displayName || u.username}
                  </Text>
                  <Text className="text-text-400 text-xs">@{u.username}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer Actions */}
          <View className="p-4 border-t border-background-700">
            <TouchableOpacity
              onPress={handleLeavePress}
              className="flex-row items-center justify-center py-4 rounded-2xl bg-red-500/10"
            >
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text className="text-red-500 font-bold ml-2">Leave Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="mt-2 py-4 items-center"
            >
              <Text className="text-text-400 font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
