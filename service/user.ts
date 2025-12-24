import { API_URL } from "@/config/api";
import { getToken } from "@/lib/storage";

export const getCurrentUser = async () => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/users/me`, {
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

export const updateUserProfile = async (data: {
  displayName?: string;
  avatar?: string;
  bio?: string;
  showLastSeen?: boolean;
  showOnline?: boolean;
}) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/users`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();

    throw new Error(err.message || "Failed to update user profile");
  }

  const updatedUser = await response.json();
  console.log(data);

  console.log(updatedUser);

  return updatedUser;
};

export const updateUserPassowrd = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/users/change-password`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to update user password");
  }

  const updatedUser = await response.json();
  return updatedUser;
};
