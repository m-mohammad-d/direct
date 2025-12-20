import { signIn } from "@/service/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // React Query Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error) => {
      alert(error.message || "Login failed");
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 px-6 justify-center bg-background-800"
    >
      <Text className="text-4xl font-bold text-text-200 mb-6 text-center">
        Welcome Back
      </Text>

      <View className="mb-4">
        <Text className="text-text-400 mb-1">Email</Text>
        <TextInput
          className="bg-background-700 text-text-200 px-4 py-3 rounded-lg border border-background-600"
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mb-4">
        <Text className="text-text-400 mb-1">Password</Text>
        <TextInput
          className="bg-background-700 text-text-200 px-4 py-3 rounded-lg border border-background-600"
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {loginMutation.isError && (
        <Text className="text-danger-500 mb-4 text-center">
          {(loginMutation.error as any)?.message || "Login failed"}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loginMutation.isPending}
        className="bg-primary-500 py-3 rounded-lg mb-4 shadow-lg"
      >
        <Text className="text-background-800 text-center font-semibold text-lg">
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-text-400">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-primary-500 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
