import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ActionModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  children: React.ReactNode;
  submitLabel: string;
  submitColor: string;
}

export const ActionModal = ({
  visible,
  title,
  onClose,
  onSubmit,
  loading,
  children,
  submitLabel,
  submitColor,
}: ActionModalProps) => (
  <Modal visible={visible} animationType="fade" transparent>
    <View className="flex-1 justify-center items-center bg-black/70 px-6">
      <View className="w-full bg-background-800 p-6 rounded-3xl border border-background-700">
        <Text className="text-text-50 text-2xl font-bold mb-4">{title}</Text>
        {children}
        <View className="flex-row space-x-3 mt-4">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 p-4 rounded-xl bg-background-700"
          >
            <Text className="text-text-200 text-center font-bold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading}
            className={`flex-1 p-4 rounded-xl ${submitColor}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold">
                {submitLabel}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
