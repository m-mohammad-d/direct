import UserAvatar from "@/components/UserAvatar";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  title?: string;
  avatar?: string;
  memberCount?: number;
  onBack: () => void;
  onShowInfo: () => void;
}

export const ChatHeader = ({
  title,
  avatar,
  memberCount,
  onBack,
  onShowInfo,
}: ChatHeaderProps) => (
  <View className="bg-background-800 pt-12 pb-3 px-4 flex-row items-center border-b border-background-700">
    <TouchableOpacity onPress={onBack} className="pr-3">
      <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onShowInfo}
      className="flex-1 flex-row items-center"
    >
      <UserAvatar uri={avatar || null} name={title || "Chat"} size={40} />
      <View className="ml-3">
        <Text className="text-text-50 font-bold text-base" numberOfLines={1}>
          {title || "Loading..."}
        </Text>
        <Text className="text-text-400 text-xs">
          {memberCount || 0} members
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={onShowInfo}>
      <Ionicons name="ellipsis-vertical" size={22} color="#94A3B8" />
    </TouchableOpacity>
  </View>
);
