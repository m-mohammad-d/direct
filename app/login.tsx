import { signIn } from "@/service/auth";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill all fields");
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      {error ? (
        <Text className="text-danger-500 mb-4 text-center">{error}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-primary-500 py-3 rounded-lg mb-4 shadow-lg"
      >
        <Text className="text-background-800 text-center font-semibold text-lg">
          {loading ? "Logging in..." : "Login"}
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
