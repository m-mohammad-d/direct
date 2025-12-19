import { Tabs } from "expo-router";
import { Home, Settings } from "lucide-react-native";
import { View } from "react-native";

type TabIconProps = {
  focused: boolean;
  IconComponent: any;
};

function TabIcon({ focused, IconComponent }: TabIconProps) {
  return (
    <View className="items-center justify-center">
      <IconComponent
        size={22}
        strokeWidth={focused ? 2.5 : 2}
        color={
          focused
            ? "rgb(34 197 94)" // primary-500
            : "rgb(148 163 184)" // text-300
        }
      />

      {focused && <View className="mt-1 h-1 w-5 rounded-full bg-primary-500" />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "rgb(11 15 20)", // background-800
          height: 56,
          position: "absolute",
          marginHorizontal: 20,
          marginBottom: 28,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgb(31 41 55)", // background-700
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Home} />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Settings} />
          ),
        }}
      />
    </Tabs>
  );
}
