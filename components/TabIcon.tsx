import { View } from "react-native";

function TabIcon({ focused, IconComponent }: any) {
  return (
    <View className="items-center justify-center">
      <IconComponent
        size={22}
        strokeWidth={focused ? 2.5 : 2}
        color={focused ? "#22C55E" : "#94A3B8"}
      />
      {focused && <View className="mt-1 h-1 w-5 rounded-full bg-primary-500" />}
    </View>
  );
}

export default TabIcon;
