import { useTheme } from "@/hooks/useTheme";
import { Text, TouchableOpacity, View } from "react-native";
import "./../global.css";

export default function Index() {
  const { toggleDarkMode } = useTheme();

  return (
    <View className="flex-1 items-center justify-center bg-red flex ">
      <Text>siema eniu</Text>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>toggle mode</Text>
      </TouchableOpacity>
    </View>
  );
}
