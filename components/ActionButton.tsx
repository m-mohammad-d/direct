import { Text, TouchableOpacity, View } from "react-native";

const ActionButton = ({ label, Icon, color, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between my-2 bg-background-800 p-4 rounded-2xl border border-background-700"
  >
    <Text className="text-text-50 mr-4 font-bold text-md">{label}</Text>
    <View className={`${color} p-2 rounded-xl`}>
      <Icon
        size={24}
        color={color.includes("primary") ? "#22C55E" : "#0EA5E9"}
      />
    </View>
  </TouchableOpacity>
);
export default ActionButton;
