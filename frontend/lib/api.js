import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired or unauthorized");
      const { logout } = useAuthStore.getState();
      await logout();
    }
    return Promise.reject(error);
  }
);
