import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "green" }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
