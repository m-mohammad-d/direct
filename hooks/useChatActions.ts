import { createGroup, joinChatApi } from "@/service/chats";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export function useChatActions() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [groupData, setGroupData] = useState({ title: "", desc: "" });

  const handleCreate = async (onSuccess: () => void) => {
    if (!groupData.title)
      return Alert.alert("Error", "Please enter a group name");
    setLoading(true);
    try {
      const res = await createGroup(groupData.title, groupData.desc);
      console.log(res);

      if (res.status === "success") {
        setGroupData({ title: "", desc: "" });
        onSuccess();
        router.replace({
          pathname: "/",
          params: { refresh: Date.now() },
        });
      }
    } catch (err) {
      console.log(err);

      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (onSuccess: () => void) => {
    if (!inviteCode) return Alert.alert("Error", "Please enter an invite code");
    setLoading(true);
    try {
      await joinChatApi(inviteCode);
      setInviteCode("");
      onSuccess();
      router.replace({
        pathname: "/",
        params: { refresh: Date.now() },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not join chat");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    inviteCode,
    setInviteCode,
    groupData,
    setGroupData,
    handleCreate,
    handleJoin,
  };
}
