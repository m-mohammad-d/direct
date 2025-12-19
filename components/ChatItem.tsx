import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ChatItemProps {
  chat: {
    id: string;
    name: string;
    messages: { content: string; createdAt: string }[];
    avatar?: string;
  };
}

export default function ChatItem({ chat }: ChatItemProps) {
  const router = useRouter();
  // Get the most recent message
  const lastMessage =
    chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/chat/${chat.id}`)}
      className="flex-row items-center p-4 border-b border-background-700 bg-background-800 active:bg-background-600"
    >
      {/* Avatar Circle */}
      <View className="w-14 h-14 rounded-full bg-primary-500 justify-center items-center overflow-hidden">
        {chat.avatar ? (
          <Image source={{ uri: chat.avatar }} className="w-14 h-14" />
        ) : (
          <Text className="text-white font-bold text-xl">
            {chat.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      {/* Chat Details */}
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-text-50 font-bold text-lg" numberOfLines={1}>
            {chat.name}
          </Text>
          {lastMessage && (
            <Text className="text-text-400 text-xs">
              {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>

        <Text className="text-text-400 mt-1" numberOfLines={1}>
          {lastMessage ? lastMessage.content : "No messages yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
