import { API_URL } from "@/config/api";
import { getToken } from "@/lib/storage";

export const getCurrentUser = async () => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to fetch user");
  }

  return response.json();
};
