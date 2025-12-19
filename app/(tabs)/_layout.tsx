import { Tabs } from "expo-router";
import { Home, Settings } from "lucide-react-native";
import { Text, View } from "react-native";

function TabIcon({ focused, IconComponent, title }: any) {
  if (focused) {
    return (
      <View className="flex-row items-center justify-center bg-primary px-4 py-2 rounded-full">
        <IconComponent size={20} color="#151312" strokeWidth={2.5} />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4">
      <IconComponent size={20} color="#A8B5DB" strokeWidth={2} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Settings}
              title="Settings"
            />
          ),
        }}
      />
    </Tabs>
  );
}
