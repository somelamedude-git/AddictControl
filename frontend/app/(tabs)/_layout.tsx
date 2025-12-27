import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#209eaf",
        tabBarInactiveTintColor: "gray",

        // 🎯 TAB SWITCH ANIMATION
        animation: "shift",
        animationDuration: 300,
      }}
    >
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "clipboard" : "clipboard-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
