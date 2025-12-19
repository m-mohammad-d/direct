import { API_URL } from "@/config/api";
import { getToken } from "@/lib/storage";

export const getAllUserChats = async () => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chats`, {
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

