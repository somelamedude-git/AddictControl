import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import SafeScreen from "@/components/SafeScreen";
import FontLoader from "@/components/FontLoader";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const hasRedirected = useRef(false);

  const { user, token, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
  if (isCheckingAuth) return;

  // Reset redirect flag if auth state changed
  if (!token || !user) {
    hasRedirected.current = false;
  }

  if (hasRedirected.current) return;

  const rootSegment = segments[0];

  if (!token || !user) {
    if (rootSegment !== "(auth)") {
      hasRedirected.current = true;
      router.replace("/(auth)"); // make sure login screen is first
    }
    return;
  }

  // Role-based routing
  if (user.role === "doctor") {
    hasRedirected.current = true;
    router.replace("/doctor");
    return;
  }

  if (user.role === "family") {
    hasRedirected.current = true;
    router.replace("/family");
    return;
  }

  if (rootSegment !== "(tabs)") {
    hasRedirected.current = true;
    router.replace("/(tabs)/test");
  }
}, [token, user, isCheckingAuth, segments]);

  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FontLoader>
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="doctor" />
          <Stack.Screen name="family" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
    </FontLoader>
  );
}
