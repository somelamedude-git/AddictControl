import axios from "axios";
import { API_URL } from "../constants/api";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const requestTest = async (userId: string) => {
  const res = await api.post(`/test/request/${userId}`);
  return res.data; // creates Test document
};

export const fetchQuestions = async () => {
  const res = await api.post("/test/questions");
  return res.data;
};


export const submitAnswer = async ({question,answer,}: {
  question: any;
  answer: string;
}) => {
  const response = await api.post("/test/submit", {
    question,
    answer,
  });
  return response.data;
};
