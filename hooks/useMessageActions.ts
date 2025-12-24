import { leaveChatApi } from "@/service/chats";
import {
  deleteMessageGroup,
  SendMessageGroup,
  updateMessageGroup,
} from "@/service/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useMessageActions = (chatId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const sendMutation = useMutation({
    mutationFn: (content: string) => SendMessageGroup(chatId, content),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateMessageGroup(chatId, content, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMessageGroup(chatId, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] }),
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveChatApi(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.replace("/(tabs)");
    },
    onError: () => Alert.alert("Error", "Failed to leave the chat."),
  });

  return {
    sendMessage: sendMutation.mutate,
    updateMessage: updateMutation.mutate,
    deleteMessage: deleteMutation.mutate,
    leaveChat: leaveMutation.mutate,
  };
};
