import React from "react";
import { Image, Text, View } from "react-native";

const UserAvatar = React.memo(
  ({
    uri,
    name,
    size = 32,
  }: {
    uri: string | null;
    name: string;
    size?: number;
  }) => {
    const firstLetter = name.charAt(0).toUpperCase();

    return (
      <View
        style={{ width: size, height: size }}
        className="rounded-full overflow-hidden items-center justify-center bg-background-500 border border-background-400"
      >
        {uri ? (
          <Image
            source={{ uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text
            className="text-text-50 font-bold"
            style={{ fontSize: size * 0.4 }}
          >
            {firstLetter}
          </Text>
        )}
      </View>
    );
  }
);

export default UserAvatar;
