import ActionButton from "@/components/ActionButton";
import { ActionModal } from "@/components/ActionModal";
import TabIcon from "@/components/TabIcon";
import { useChatActions } from "@/hooks/useChatActions";
import { Tabs } from "expo-router";
import { Home, Plus, Settings, UserPlus, Users, X } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, TextInput, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"join" | "create" | null>(
    null
  );
  const {
    loading,
    inviteCode,
    setInviteCode,
    groupData,
    setGroupData,
    handleCreate,
    handleJoin,
  } = useChatActions();

  const closeModals = () => {
    setActiveModal(null);
    setMenuOpen(false);
  };

  return (
    <View className="flex-1 bg-background-900">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0B0F14",
            height: 60,
            position: "absolute",
            marginHorizontal: 20,
            marginBottom: 28,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#1F2937",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: (p) => <TabIcon {...p} IconComponent={Home} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: (p) => <TabIcon {...p} IconComponent={Settings} />,
            headerShown: false,
          }}
        />
      </Tabs>

      {/* FAB & Overlay */}
      {menuOpen && (
        <Pressable
          onPress={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/60 z-40"
        />
      )}

      <View className="absolute bottom-32 right-8 items-end z-50">
        {menuOpen && (
          <View className="mb-6 space-y-4">
            <ActionButton
              label="Create Group"
              Icon={Users}
              color="bg-primary-500/20"
              onPress={() => setActiveModal("create")}
            />
            <ActionButton
              label="Join Chat"
              Icon={UserPlus}
              color="bg-secondary-500/20"
              onPress={() => setActiveModal("join")}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => setMenuOpen(!menuOpen)}
          className={`w-16 h-16 rounded-2xl items-center justify-center shadow-2xl ${menuOpen ? "bg-background-700" : "bg-primary-500"}`}
        >
          {menuOpen ? (
            <X size={30} color="white" />
          ) : (
            <Plus size={30} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* Join Modal */}
      <ActionModal
        visible={activeModal === "join"}
        title="Join Chat"
        submitLabel="Join"
        submitColor="bg-secondary-500"
        loading={loading}
        onClose={closeModals}
        onSubmit={() => handleJoin(closeModals)}
      >
        <TextInput
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="Invite Code"
          placeholderTextColor="#64748B"
          className="bg-background-900 border border-background-600 text-text-50 p-4 rounded-xl"
        />
      </ActionModal>

      {/* Create Modal */}
      <ActionModal
        visible={activeModal === "create"}
        title="Create Group"
        submitLabel="Create"
        submitColor="bg-primary-500"
        loading={loading}
        onClose={closeModals}
        onSubmit={() => handleCreate(closeModals)}
      >
        <TextInput
          value={groupData.title}
          onChangeText={(t) => setGroupData({ ...groupData, title: t })}
          placeholder="Group Name"
          placeholderTextColor="#64748B"
          className="bg-background-900 border border-background-600 text-text-50 p-4 rounded-xl mb-4"
        />
        <TextInput
          value={groupData.desc}
          onChangeText={(t) => setGroupData({ ...groupData, desc: t })}
          placeholder="Description"
          placeholderTextColor="#64748B"
          multiline
          className="bg-background-900 border border-background-600 text-text-50 p-4 rounded-xl"
        />
      </ActionModal>
    </View>
  );
}

