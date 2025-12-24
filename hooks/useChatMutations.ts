import { leaveChatApi } from "@/service/chats";
import {
  deleteMessageGroup,
  SendMessageGroup,
  updateMessageGroup,
} from "@/service/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChatMutations(chatId: string) {
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: (content: string) => SendMessageGroup(chatId, content),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] }),
  });

  const updateMessage = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateMessageGroup(chatId, content, id),
  });

  const deleteMessage = useMutation({
    mutationFn: (id: string) => deleteMessageGroup(chatId, id),
  });

  const leaveChat = useMutation({
    mutationFn: () => leaveChatApi(chatId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });

  return {
    sendMessage,
    updateMessage,
    deleteMessage,
    leaveChat,
  };
}
