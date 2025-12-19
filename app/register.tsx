import { signUp } from "@/service/auth";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password too short");

    setLoading(true);
    try {
      await signUp(username, email, password);
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

      {error ? (
        <Text className="text-danger-500 mb-4 text-center">{error}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className="bg-primary-500 py-3 rounded-lg mb-4 shadow-lg"
      >
        <Text className="text-background-800 text-center font-semibold text-lg">
          {loading ? "Registering..." : "Sign Up"}
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
