import { signUp } from "@/service/auth";
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

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => signUp(username, email, password),
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error) => {
      alert(error.message || "Registration failed");
    },
  });

  const handleRegister = () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password too short");
      return;
    }

    registerMutation.mutate({ username, email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 px-6 justify-center bg-background-800"
    >
      <Text className="text-4xl font-bold text-text-200 mb-6 text-center">
        Create Account
      </Text>

      <View className="mb-4">
        <Text className="text-text-400 mb-1">Username</Text>
        <TextInput
          className="bg-background-700 text-text-200 px-4 py-3 rounded-lg border border-background-600"
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View className="mb-4">
        <Text className="text-text-400 mb-1">Email</Text>
        <TextInput
          className="bg-background-700 text-text-200 px-4 py-3 rounded-lg border border-background-600"
          placeholder="Email"
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
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="mb-4">
        <Text className="text-text-400 mb-1">Confirm Password</Text>
        <TextInput
          className="bg-background-700 text-text-200 px-4 py-3 rounded-lg border border-background-600"
          placeholder="Confirm"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={registerMutation.isPending}
        className="bg-primary-500 py-3 rounded-lg mb-4 shadow-lg"
      >
        <Text className="text-background-800 text-center font-semibold text-lg">
          {registerMutation.isPending ? "Registering..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-text-400">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-primary-500 font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
