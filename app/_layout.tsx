import { useAuth } from "@/hooks/useAuth";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "./global.css";

export default function RootLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user === null) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [mounted, user]);

  return <Slot />;
}
