import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingItem({
  label,
  value,
  onPress,
  icon,
  isLast,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`flex-row items-center justify-between p-6 ${!isLast ? "border-b border-background-700/30" : ""}`}
    >
      <View className="flex-row items-center flex-1">
        {icon && (
          <View className="mr-4 bg-background-900/50 p-2 rounded-xl">
            {icon}
          </View>
        )}
        <View>
          <Text className="text-text-50 text-lg font-semibold">{label}</Text>
          {value && (
            <Text className="text-text-500 text-sm mt-0.5">{value}</Text>
          )}
        </View>
      </View>
      <View className="bg-background-700/50 p-1.5 rounded-full">
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
