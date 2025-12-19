import { removeToken } from "@/lib/storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const handleLogout = async () => {
    removeToken();
    router.replace("/login");
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Text className="font-bold text-5xl text-orange-500 mb-8">
        Direct Apps
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 py-3 px-6 rounded-lg shadow-lg"
      >
        <Text className="text-white font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
