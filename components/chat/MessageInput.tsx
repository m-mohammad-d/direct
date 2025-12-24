import { Message } from "@/types/message";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  editingMessage: Message | null;
  onCancelEdit: () => void;
  onOpenEmoji: () => void;
}

export const ChatInput = ({
  value,
  onChangeText,
  onSend,
  editingMessage,
  onCancelEdit,
  onOpenEmoji,
}: ChatInputProps) => {
  return (
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
          <TouchableOpacity onPress={onCancelEdit}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      )}

      <View
        className={`flex-row items-end bg-background-700 ${editingMessage ? "rounded-b-3xl" : "rounded-3xl"} px-4 py-2 border border-background-600`}
      >
        <TouchableOpacity onPress={onOpenEmoji} className="pr-2 pb-1">
          <Ionicons name="happy-outline" size={24} color="#94A3B8" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 text-text-50 text-[16px] max-h-32 py-1"
          placeholder="Message..."
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          multiline
        />

        <TouchableOpacity
          onPress={onSend}
          disabled={!value.trim()}
          className={`ml-2 w-10 h-10 items-center justify-center rounded-full ${value.trim() ? "bg-primary-500" : "bg-background-500"}`}
        >
          <Ionicons
            name={editingMessage ? "checkmark" : "arrow-up"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
