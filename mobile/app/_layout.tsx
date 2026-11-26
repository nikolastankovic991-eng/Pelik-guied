import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

const icon = (symbol: string) => () => <Text style={{ fontSize: 17 }}>{symbol}</Text>;

export default function RootLayout() {
  return <>
    <StatusBar style="light" backgroundColor="#073D34" />
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: "#073D34" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "700" },
      sceneStyle: { backgroundColor: "#F6F5EF" },
      tabBarActiveTintColor: "#073D34",
      tabBarInactiveTintColor: "#7A847D",
      tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#E6E8E1", height: 66, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: "700" }
    }}>
      <Tabs.Screen name="index" options={{ title: "Gozo Guide", tabBarLabel: "Home", tabBarIcon: icon("⌂") }} />
      <Tabs.Screen name="destinations" options={{ title: "Explore Gozo", tabBarLabel: "Explore", tabBarIcon: icon("⌖") }} />
      <Tabs.Screen name="businesses" options={{ title: "Local businesses", tabBarLabel: "Businesses", tabBarIcon: icon("▦") }} />
      <Tabs.Screen name="submit" options={{ title: "List your business", tabBarLabel: "List free", tabBarIcon: icon("＋") }} />
    </Tabs>
  </>;
}