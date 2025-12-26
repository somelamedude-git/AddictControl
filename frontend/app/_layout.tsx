import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { user, token, isCheckingAuth, checkAuth } = useAuthStore();

  // Run auth check once
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (isCheckingAuth) return;

    const inLoginScreen =
      segments[0] === "(auth)" && segments[1] === "login";

    // Not logged in → go to login
    if (!token || !user) {
      if (!inLoginScreen) {
        router.replace("/(auth)");
      }
      return;
    }

    // Logged in → role-based routing
    if (user.role === "doctor") {
      router.replace("/doctor");
    } else if (user.role === "family") {
      router.replace("/family");
    } else {
      router.replace("/(tabs)/profile");
    }
  }, [token, user, isCheckingAuth, segments]);

  // Loading screen while auth is being checked
  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth group */}
          <Stack.Screen name="(auth)" />

          {/* Tabs */}
          <Stack.Screen name="(tabs)" />
    

          {/* Role-based screens */}
          <Stack.Screen name="doctor" />
          <Stack.Screen name="family" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
