import { API_URL } from "@/config/api";
import { InternalChatResponse, Message, ServerMessage } from "@/types/message";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useChatSocket = (chatId: string) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(API_URL, { transports: ["websocket"] });
    const socket = socketRef.current;

    socket.emit("join-chat", chatId);

    socket.on("new-message", (msg: ServerMessage) => {
      const newMessage: Message = {
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.username,
        avatar: msg.sender.avatar,
        createdAt: msg.createdAt,
      };

      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          const exists = old.pages.some((p) =>
            p.messages.some((m) => m.id === newMessage.id)
          );
          if (exists) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [newMessage, ...newPages[0].messages],
          };
          return { ...old, pages: newPages };
        }
      );
    });

    socket.on("update-message", (updatedMsg: ServerMessage) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m.id === updatedMsg.id
                  ? { ...m, content: updatedMsg.content }
                  : m
              ),
            })),
          };
        }
      );
    });

    socket.on("delete-message", (data: { id: string }) => {
      queryClient.setQueryData<InfiniteData<InternalChatResponse>>(
        ["messages", chatId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m.id !== data.id),
            })),
          };
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId, queryClient]);

  return socketRef.current;
};
