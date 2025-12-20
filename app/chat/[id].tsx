import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ChatPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 justify-center items-center bg-background-900">
      <Text className="text-text-50">Chat Page</Text>
    </View>
  );
}
