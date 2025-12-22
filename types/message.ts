import { ApiResponseList } from "./api";

export interface ServerMessage {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

export type ChatAPIResponse = ApiResponseList<ServerMessage>;

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  avatar: string | null;
  createdAt: string;
  isOptimistic?: boolean;
}

export interface InternalChatResponse {
  messages: Message[];
  nextPage: number | null;
}
