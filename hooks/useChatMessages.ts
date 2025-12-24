import GetMessageGroup from "@/service/message";
import {
  ChatAPIResponse,
  InternalChatResponse,
  Message,
} from "@/types/message";
import { useInfiniteQuery } from "@tanstack/react-query";

const mapServerMessage = (msg: any): Message => ({
  id: msg.id,
  content: msg.content,
  senderId: msg.senderId,
  senderName: msg.sender.username,
  avatar: msg.sender.avatar,
  createdAt: msg.createdAt,
});

export function useChatMessages(chatId: string) {
  return useInfiniteQuery<InternalChatResponse>({
    queryKey: ["messages", chatId],
    enabled: !!chatId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res: ChatAPIResponse = await GetMessageGroup(
        chatId,
        pageParam as number
      );

      return {
        messages: res.data.map(mapServerMessage),
        nextPage:
          res.pagination.page < res.pagination.totalPages
            ? res.pagination.page + 1
            : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
