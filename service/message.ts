import { API_URL } from "@/config/api";
import { getToken } from "@/lib/storage";

export default async function GetMessageGroup(
  chatid: string,
  page: number,
  limit: number = 20
) {
  const token = await getToken();
  const res = await fetch(
    `${API_URL}/api/chat/${chatid}/messages?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}

export async function SendMessageGroup(chatid: string, content: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/chat/${chatid}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function updateMessageGroup(
  chatid: string,
  content: string,
  messageId: string
) {
  const token = await getToken();
  const res = await fetch(
    `${API_URL}/api/chat/${chatid}/messages/${messageId}`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );
  return res.json();
}

export async function deleteMessageGroup(chatid: string, messageId: string) {
  const token = await getToken();
  const res = await fetch(
    `${API_URL}/api/chat/${chatid}/messages/${messageId}`,
    {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}
