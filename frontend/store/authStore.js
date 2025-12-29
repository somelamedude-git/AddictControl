import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { api } from "../lib/api";


export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  login: async (email, phone, password) => {
  set({ isLoading: true });

  try {
    if ((!email && !phone) || !password) {
      throw new Error("Email or phone and password required");
    }

    const body = { email, phone, password };

    const { data } = await api.post("/login", body);

    const decoded = jwtDecode(data.accessToken);

    const userData = {
      id: decoded.id,
      role: decoded.role,
    };

    await AsyncStorage.setItem("token", data.accessToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    set({
      token: data.accessToken,
      user: userData,
      isLoading: false,
    });
   console.log("JWT TOKEN:", data.accessToken);

    return { success: true, user: userData };
  } catch (err) {
    set({ isLoading: false });
    return {
      success: false,
      error: err.response?.data?.message || err.message,
    };
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

    if (!token || !userJson) {
      set({ token: null, user: null });
      return;
    }

    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      await AsyncStorage.multiRemove(["token", "user"]);
      set({ token: null, user: null });
      return;
    }

    set({
      token,
      user: JSON.parse(userJson),
    });
  } finally {
    set({ isCheckingAuth: false });
  }
},

}));

