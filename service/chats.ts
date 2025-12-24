import { API_URL } from "@/config/api";
import { getToken } from "@/lib/storage";

export const getAllUserChats = async () => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chat`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch chats");
  }

  const data = await res.json();
  return data;
};

// Create Group
export const createGroup = async (title: string, description: string) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
  return res.json();
};

export const joinChatApi = async (inviteCode: string) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chat/${inviteCode}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const leaveChatApi = async (chatId: string) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chat/${chatId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const getChatById = async (chatId: string) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chat/${chatId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
