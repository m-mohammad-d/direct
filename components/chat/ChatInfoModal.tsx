import UserAvatar from "@/components/UserAvatar";
import { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Clipboard,
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
    inviteCode?: string;
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
  const copyToClipboard = () => {
    if (chatData?.inviteCode) {
      Clipboard.setString(chatData.inviteCode);
      Alert.alert("Copied", "Invite code copied to clipboard.");
    }
  };

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
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-background-900 h-[85%] rounded-t-[40px] overflow-hidden border-t border-white/10">
          <View className="items-center pt-4 pb-2">
            <View className="w-12 h-1.5 bg-background-700 rounded-full" />
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="items-center p-8 border-b border-white/5 bg-background-800/30">
              <View className="shadow-2xl shadow-black rounded-full p-1 border border-white/10">
                <UserAvatar
                  uri={chatData?.avatar || null}
                  name={chatData?.displayName || "Chat"}
                  size={110}
                />
              </View>
              <Text className="text-text-50 text-2xl font-black mt-4 tracking-tight">
                {chatData?.displayName}
              </Text>
              <Text className="text-text-400 mt-2 text-center px-8 leading-5 text-sm">
                {chatData?.description ||
                  "No description provided for this group."}
              </Text>
            </View>

            {/* --- Invite Section --- */}
            <View className="mt-6 px-6">
              <Text className="text-text-500 font-bold uppercase text-[10px] tracking-widest mb-3 ml-1">
                Group Invitation
              </Text>
              <View className="bg-primary-500/10 rounded-3xl p-5 border border-primary-500/20">
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-primary-400 font-bold text-sm">
                      Invite Code
                    </Text>
                    <Text className="text-text-500 text-[11px] mt-0.5">
                      Others can join using this unique code.
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    className="bg-primary-500 p-2.5 rounded-xl shadow-lg shadow-primary-500/40"
                  >
                    <Ionicons name="copy" size={18} color="white" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={copyToClipboard}
                  activeOpacity={0.8}
                  className="bg-black/30 py-4 rounded-2xl border border-white/5 items-center justify-center"
                >
                  <Text className="text-text-50 font-mono text-2xl tracking-[6px] font-bold">
                    {chatData?.inviteCode || "N/A"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* --- Members Section --- */}
            <View className="mt-8 px-6 mb-12">
              <View className="flex-row items-center justify-between mb-5 px-1">
                <Text className="text-text-50 font-black text-lg">Members</Text>
                <View className="bg-background-700 px-3 py-1 rounded-lg">
                  <Text className="text-text-400 font-bold text-xs uppercase">
                    {chatData?.users?.length || 0} Total
                  </Text>
                </View>
              </View>

              {chatData?.users?.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  activeOpacity={0.6}
                  className="flex-row items-center mb-3 bg-background-800/40 p-4 rounded-[22px] border border-white/5"
                  onPress={() => onMemberPress(u.id)}
                >
                  <UserAvatar uri={u.avatar} name={u.username} size={48} />
                  <View className="ml-4 flex-1">
                    <Text className="text-text-50 font-bold text-md">
                      {u.displayName || u.username}
                    </Text>
                    <Text className="text-text-500 text-xs mt-0.5">
                      @{u.username.toLowerCase()}
                    </Text>
                  </View>
                  <View className="bg-white/5 p-2 rounded-full">
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color="#64748b"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View className="p-6 bg-background-900 border-t border-white/5">
            <TouchableOpacity
              onPress={handleLeavePress}
              className="flex-row items-center justify-center py-4 rounded-2xl bg-red-500/10 mb-3"
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <Text className="text-red-500 font-black ml-2 text-md">
                Leave Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} className="py-2 items-center">
              <Text className="text-text-500 font-bold text-sm tracking-wide">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
