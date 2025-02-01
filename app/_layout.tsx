import { StackActions } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
  </Stack>;
}
