import SettingItem from "@/components/SettingItem";
import { useUser } from "@/hooks/useUser";
import { removeToken } from "@/lib/storage";
import {
  PasswordForm,
  passwordSchema,
  ProfileForm,
  profileSchema,
} from "@/schema/userSchema";
import { uploadFile } from "@/service/upload";
import { updateUserPassowrd, updateUserProfile } from "@/service/user";
import { FileUploadPayload } from "@/types/File";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Camera,
  Eye,
  EyeOff,
  Info,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [modalField, setModalField] = useState<keyof ProfileForm | null>(null);
  const [passwordModal, setPasswordModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      username: "",
      bio: "",
    },
  });

  // Password Form
  const {
    control: pwdControl,
    handleSubmit: handlePwdSubmit,
    formState: { errors: pwdErrors },
    reset: resetPwd,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });
  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || "",
        username: user.username || "",
        bio: user.bio || "",
      });
      setAvatar(user.avatar);
    }
  }, [user]);
  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setModalField(null);
      Alert.alert("Success", "Profile updated successfully");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updateUserPassowrd,
    onSuccess: () => {
      setPasswordModal(false);
      resetPwd();
      Alert.alert("Success", "Password changed successfully");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to update password");
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      setLoadingAvatar(true);

      try {
        const fileName = uri.split("/").pop() || "avatar.jpg";
        const fileType = fileName.split(".").pop() || "jpeg";
        const file: FileUploadPayload = {
          uri,
          name: fileName,
          type: `image/${fileType}`,
        };
        const result = await uploadFile(file);

        updateProfileMutation.mutate({ avatar: result.data.url });
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setLoadingAvatar(false);
      }
    }
  };

  const onSubmitProfile = (data: ProfileForm) => {
    updateProfileMutation.mutate({ ...data, avatar: avatar || undefined });
  };
  const onLogOut = async () => {
    await removeToken();
    queryClient.clear();
    router.push("/login");
  };
  const onSubmitPassword = (data: PasswordForm) => {
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    updatePasswordMutation.mutate(payload);
  };

  return (
    <View className="flex-1 bg-background-900">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="items-center pt-14 pb-10">
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            className="relative"
          >
            <View className="w-36 h-36 rounded-full border-4 border-primary-500/20 p-1 shadow-xl">
              <View className="w-full h-full bg-background-800 rounded-full items-center justify-center overflow-hidden border border-background-700">
                {loadingAvatar ? (
                  <ActivityIndicator color="#22C55E" size="large" />
                ) : avatar ? (
                  <Image source={{ uri: avatar }} className="w-full h-full" />
                ) : (
                  <User size={60} color="#22C55E" />
                )}
              </View>
            </View>
            <View className="absolute bottom-1 right-1 bg-primary-500 p-2.5 rounded-full border-4 border-background-900">
              <Camera size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-text-50 text-3xl font-bold mt-6">
            {user?.displayName || "Anonymous"}
          </Text>
          <Text className="text-text-400 text-base mt-1">
            Manage your account and privacy
          </Text>
        </View>

        {/* Settings Groups */}
        <View className="space-y-10">
          {/* Personal Info Group */}
          <View>
            <View className="flex-row items-center mb-4 ml-2">
              <Info size={16} color="#6B7280" />
              <Text className="text-text-400 text-xs font-bold uppercase tracking-widest ml-2">
                Personal Information
              </Text>
            </View>
            <View className="bg-background-800 rounded-[32px] overflow-hidden border border-background-700/40">
              <SettingItem
                label="Display Name"
                value={user?.displayName || "Not set"}
                onPress={() => setModalField("displayName")}
              />
              <SettingItem
                label="Username"
                value={user?.username || "Not set"}
                onPress={() => setModalField("username")}
              />
              <SettingItem
                label="Bio"
                value={user?.bio || "Add a bio..."}
                isLast
                onPress={() => setModalField("bio")}
              />
            </View>
          </View>

          {/* Security Group */}
          <View>
            <View className="flex-row items-center mb-4 ml-2">
              <ShieldCheck size={16} color="#6B7280" />
              <Text className="text-text-400 text-xs font-bold uppercase tracking-widest ml-2">
                Security & Privacy
              </Text>
            </View>
            <View className="bg-background-800 rounded-[32px] overflow-hidden border border-background-700/40">
              <SettingItem
                label="Change Password"
                icon={<Lock size={20} color="#0EA5E9" />}
                isLast
                onPress={() => setPasswordModal(true)}
              />
            </View>
          </View>
        </View>

        {/* Log Out Button */}
        <View className="mt-12">
          <TouchableOpacity
            className="bg-red-500/10 py-5 rounded-[24px] flex-row justify-center items-center border border-red-500/20"
            activeOpacity={0.7}
            onPress={() => onLogOut()}
          >
            <LogOut color="#EF4444" size={22} />
            <Text className="text-red-500 text-lg font-bold ml-3">Log Out</Text>
          </TouchableOpacity>
          <Text className="text-text-500 text-center text-xs mt-6">
            App Version 2.0.4 (Build 42)
          </Text>
        </View>
      </ScrollView>

      {/* --- Edit Profile Modal --- */}

      <Modal visible={!!modalField} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 bg-black/60 justify-end"
        >
          <View className="bg-background-800 rounded-t-[48px] p-8 shadow-2xl border-t border-background-700">
            <View className="w-16 h-1.5 bg-background-700 self-center rounded-full mb-8" />
            <Text className="text-2xl font-bold text-text-50 mb-2">
              Edit {modalField === "displayName" ? "Display Name" : modalField}
            </Text>
            <Text className="text-text-400 mb-8 text-base">
              Enter the new information below.
            </Text>

            {modalField && (
              <>
                <Controller
                  control={control}
                  name={modalField}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder={`Your new ${modalField}`}
                      placeholderTextColor="#6B7280"
                      value={value}
                      onChangeText={onChange}
                      className="bg-background-700 text-text-50 p-6 rounded-3xl mb-4 border border-background-600 focus:border-primary-500 text-lg"
                      multiline={modalField === "bio"}
                      autoFocus
                    />
                  )}
                />
                {errors[modalField] && (
                  <Text className="text-red-500 ml-4 mb-6 font-medium">
                    {errors[modalField]?.message}
                  </Text>
                )}
              </>
            )}

            <View className="flex-row gap-x-4">
              <TouchableOpacity
                className="w-16 h-16 bg-background-700 rounded-2xl items-center justify-center border border-background-600"
                onPress={() => setModalField(null)}
              >
                <X color="#FFF" size={28} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary-500 h-16 rounded-2xl items-center justify-center shadow-lg shadow-primary-500/30"
                onPress={handleSubmit(onSubmitProfile)}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- Password Modal --- */}
      <Modal visible={passwordModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 bg-black/60 justify-end"
        >
          <View className="bg-background-800 rounded-t-[48px] p-8 shadow-2xl border-t border-background-700">
            <View className="w-16 h-1.5 bg-background-700 self-center rounded-full mb-8" />
            <View className="flex-row items-center mb-2">
              <Lock size={24} color="#0EA5E9" className="mr-3" />
              <Text className="text-2xl font-bold text-text-50 ml-2">
                Secure Update
              </Text>
            </View>
            <Text className="text-text-400 mb-8 text-base">
              Protect your account with a strong password.
            </Text>

            <View className="space-y-6">
              {/* Current Password */}
              <View>
                <Controller
                  control={pwdControl}
                  name="currentPassword"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Current Password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showPwd}
                      value={value}
                      onChangeText={onChange}
                      className="bg-background-700 text-text-50 p-6 rounded-3xl border border-background-600 focus:border-primary-500 text-lg my-4"
                    />
                  )}
                />
                {pwdErrors.currentPassword && (
                  <Text className="text-red-500 ml-4 mt-2">
                    {pwdErrors.currentPassword.message}
                  </Text>
                )}
              </View>

              {/* New Password */}
              <View>
                <Controller
                  control={pwdControl}
                  name="newPassword"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="New Password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showPwd}
                      value={value}
                      onChangeText={onChange}
                      className="bg-background-700 text-text-50 p-6 rounded-3xl border border-background-600 focus:border-primary-500 text-lg my-4"
                    />
                  )}
                />
                {pwdErrors.newPassword && (
                  <Text className="text-red-500 ml-4 mt-2">
                    {pwdErrors.newPassword.message}
                  </Text>
                )}
              </View>

              {/* Confirm New Password */}
              <View>
                <Controller
                  control={pwdControl}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Confirm New Password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showPwd}
                      value={value}
                      onChangeText={onChange}
                      className="bg-background-700 text-text-50 p-6 rounded-3xl border border-background-600 focus:border-primary-500 text-lg my-4"
                    />
                  )}
                />
                {pwdErrors.confirmPassword && (
                  <Text className="text-red-500 ml-4 mt-2">
                    {pwdErrors.confirmPassword.message}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowPwd(!showPwd)}
              className="flex-row items-center mt-4 mb-8 self-end pr-2"
            >
              {showPwd ? (
                <EyeOff size={18} color="#9CA3AF" />
              ) : (
                <Eye size={18} color="#9CA3AF" />
              )}
              <Text className="text-text-400 ml-2 font-medium">
                {showPwd ? "Hide Passwords" : "Show Passwords"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-x-4">
              <TouchableOpacity
                className="w-16 h-16 bg-background-700 rounded-2xl items-center justify-center border border-background-600"
                onPress={() => {
                  setPasswordModal(false);
                  resetPwd();
                }}
              >
                <X color="#FFF" size={28} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary-500 h-16 rounded-2xl items-center justify-center shadow-lg shadow-primary-500/30"
                onPress={handlePwdSubmit(onSubmitPassword)}
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Update Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
