import { API_URL } from "@/config/api";
import { InternalChatResponse } from "@/types/message";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function useChatSocket(chatId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const socket = io(API_URL, { transports: ["websocket"] });
    socket.emit("join-chat", chatId);

    const handleNewMessage = (msg: any) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;

          const exists = old.pages.some((p) =>
            p.messages.some((m) => m.id === msg.id)
          );
          if (exists) return old;

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                messages: [
                  {
                    id: msg.id,
                    content: msg.content,
                    senderId: msg.senderId,
                    senderName: msg.sender.username,
                    avatar: msg.sender.avatar,
                    createdAt: msg.createdAt,
                  },
                  ...old.pages[0].messages,
                ],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.disconnect();
    };
  }, [chatId, queryClient]);
}
