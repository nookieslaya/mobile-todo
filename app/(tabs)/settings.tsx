import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const SettingsScreen = () => {
  const { toggleDarkMode, isDarkMode, colors } = useTheme();

  return (
    <View className="flex-1 px-4 pt-6" style={{ backgroundColor: colors.bg }}>
      <Text className="mb-4 text-lg" style={{ color: colors.text }}>
        Settings
      </Text>

      <TouchableOpacity
        onPress={toggleDarkMode}
        className="px-4 py-3 rounded mb-6 flex-row items-center justify-between"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ color: colors.text }}>Dark mode</Text>
        <View
          className="h-4 w-4 rounded-full"
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: isDarkMode ? colors.primary : colors.bg,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
