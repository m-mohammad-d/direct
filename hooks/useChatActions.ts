import { createGroup, joinChatApi } from "@/service/chats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export function useChatActions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [inviteCode, setInviteCode] = useState("");
  const [groupData, setGroupData] = useState({ title: "", desc: "" });

  const createMutation = useMutation({
    mutationFn: () => createGroup(groupData.title, groupData.desc),
    onSuccess: (res) => {
      if (res.status === "success") {
        setGroupData({ title: "", desc: "" });
        queryClient.invalidateQueries({ queryKey: ["chats"] });

        router.replace("/");
      }
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Something went wrong");
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => joinChatApi(inviteCode),
    onSuccess: () => {
      setInviteCode("");
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.replace("/");
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Could not join chat");
    },
  });

  const handleCreate = (onSuccessCallback: () => void) => {
    if (!groupData.title)
      return Alert.alert("Error", "Please enter a group name");
    createMutation.mutate(undefined, {
      onSuccess: () => onSuccessCallback(),
    });
  };

  const handleJoin = (onSuccessCallback: () => void) => {
    if (!inviteCode) return Alert.alert("Error", "Please enter an invite code");
    joinMutation.mutate(undefined, {
      onSuccess: () => onSuccessCallback(),
    });
  };

  return {
    loading: createMutation.isPending || joinMutation.isPending,
    inviteCode,
    setInviteCode,
    groupData,
    setGroupData,
    handleCreate,
    handleJoin,
  };
}
