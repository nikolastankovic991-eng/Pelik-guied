import { Tabs } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return <>
    <StatusBar barStyle="light-content" backgroundColor="#073D34" />
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: "#073D34" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "700" },
      sceneStyle: { backgroundColor: "#F6F5EF" },
      tabBarActiveTintColor: "#073D34",
      tabBarInactiveTintColor: "#7A847D",
      tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#E6E8E1", height: 62, paddingBottom: 7, paddingTop: 5 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: "700" }
    }}>
      <Tabs.Screen name="index" options={{ title: "Gozo Guide", tabBarLabel: "Home", tabBarIcon: () => null }} />
      <Tabs.Screen name="destinations" options={{ title: "Explore Gozo", tabBarLabel: "Explore", tabBarIcon: () => null }} />
      <Tabs.Screen name="businesses" options={{ title: "Local businesses", tabBarLabel: "Businesses", tabBarIcon: () => null }} />
      <Tabs.Screen name="submit" options={{ title: "List your business", tabBarLabel: "List free", tabBarIcon: () => null }} />
    </Tabs>
  </>;
}
