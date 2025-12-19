import { API_URL } from "@/config/api";
import { setToken } from "@/lib/storage";

export async function signUp(
  username: string,
  email: string,
  password: string
) {
  const res = await fetch(`${API_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Sign up failed");
  if (data.data.token) await setToken(data.data.token);
  return data;
}

export async function signIn(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Sign in failed");

  if (data.data.token) await setToken(data.data.token);
  return data;
}
