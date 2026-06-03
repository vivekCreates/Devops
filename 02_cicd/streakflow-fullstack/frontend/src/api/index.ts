import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Vite
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if using cookies
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token && (!config.url?.includes("/signin") && !config.url?.includes("/signup"))) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;