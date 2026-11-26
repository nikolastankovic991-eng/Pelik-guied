import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return <>
    <StatusBar style="light" />
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#073D34" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" }, contentStyle: { backgroundColor: "#F6F5EF" } }}>
      <Stack.Screen name="index" options={{ title: "Gozo Guide" }} />
      <Stack.Screen name="destinations" options={{ title: "Explore Gozo" }} />
      <Stack.Screen name="businesses" options={{ title: "Local businesses" }} />
      <Stack.Screen name="submit" options={{ title: "List your business" }} />
    </Stack>
  </>;
}
