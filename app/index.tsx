
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Text className="text-white text-3xl font-bold">
        NativeWind Test
      </Text>
      <Text className="text-yellow-300 text-lg mt-4">
        If you see colors, it's working!
      </Text>
    </View>
  );
}
