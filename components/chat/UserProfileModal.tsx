import UserAvatar from "@/components/UserAvatar";
import { User } from "@/types/user";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfileModalProps {
  userId: string | null;
  onClose: () => void;
  userData: { data: User } | null;
  isLoading: boolean;
}

export const UserProfileModal = ({
  userId,
  onClose,
  userData,
  isLoading,
}: UserProfileModalProps) => {
  return (
    <Modal
      visible={!!userId}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-8">
        <View className="w-full bg-background-800 rounded-3xl p-6 border border-background-700 items-center shadow-2xl">
          {isLoading ? (
            <View className="py-10">
              <ActivityIndicator color="#22C55E" size="large" />
            </View>
          ) : userData ? (
            <>
              <UserAvatar
                uri={userData.data?.avatar}
                name={userData.data?.username}
                size={100}
              />
              <Text className="text-text-50 text-2xl font-bold mt-4">
                {userData.data?.displayName || userData.data?.username}
              </Text>
              <Text className="text-primary-500 text-sm font-medium mb-4">
                @{userData.data?.username?.toLowerCase()}
              </Text>

              <View className="w-full bg-background-700 rounded-2xl p-4 mb-6">
                <Text className="text-text-400 text-xs uppercase font-bold mb-1">
                  Bio
                </Text>
                <Text className="text-text-100 text-[14px]">
                  {userData.data?.bio || "No bio available for this user."}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="bg-primary-600 w-full py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-lg">
                  Close Profile
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center py-6">
              <Text className="text-text-200 mb-4">User not found</Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-primary-500">Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
