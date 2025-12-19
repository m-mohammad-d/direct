import ChatItem from "@/components/ChatItem";
import { getAllUserChats } from "@/service/chats";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await getAllUserChats();
      console.log(response);
      
      if (response.status === "success") {
        setChats(response.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-900">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-900">
      {/* Header */}
      <View className="p-6 bg-background-800 border-b border-background-700">
        <Text className="font-bold text-2xl text-primary-500">Messages</Text>
      </View>

      {/* List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem chat={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22C55E"
            colors={["#22C55E"]}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-32 px-10">
            <Text className="text-text-100 text-xl font-bold text-center">
              No chats found
            </Text>
            <Text className="text-text-400 text-center mt-2">
              You haven't joined any groups or started a conversation yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
