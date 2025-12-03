import { useAuth } from "@/hooks/useAuth";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/");
    else router.replace("/");
  }, [user]);

  return <Slot />;
}
