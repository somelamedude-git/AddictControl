import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  login: async (email, phone, password) => {
  set({ isLoading: true });

  try {
    if (!email || !phone || !password) {
      throw new Error("Please enter email, phone, and password");
    }

    const body = { email, phone, password };

    console.log("Sending login request:", body);

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("Response text:", text);
    const data = JSON.parse(text);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    await AsyncStorage.setItem("token", data.accesstoken);
    await AsyncStorage.setItem("user", JSON.stringify(data.userData));

    set({
      token: data.accesstoken,
      user: data.userData,
      isLoading: false,
    });

    return { success: true, user: data.userData };
  } catch (error) {
    set({ isLoading: false });
    return { success: false, error: error.message };
  }
},

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      set({
        token,
        user: userJson ? JSON.parse(userJson) : null,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

