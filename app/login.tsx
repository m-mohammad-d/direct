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
      className="flex-1 bg-gray-900 justify-center px-6"
    >
      <Text className="text-4xl font-bold text-white mb-6 text-center">
        Welcome Back
      </Text>

      <View className="mb-4">
        <Text className="text-gray-400 mb-1">Email</Text>
        <TextInput
          className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 mb-1">Password</Text>
        <TextInput
          className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? (
        <Text className="text-red-500 mb-4 text-center">{error}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-600 py-3 rounded-lg mb-4 shadow-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-400">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-blue-500 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
