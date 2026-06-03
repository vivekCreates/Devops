import axios from "axios";



export const API_URL = import.meta.env.VITE_API_URL || 'http://13.60.170.161/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if using cookies
});

apiClient.interceptors.request.use((config) => {
  const publicRoutes = ["/", "/signin", "/signup"];

  if (!publicRoutes.includes(config.url || "")) {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const { data } = await apiClient.post(`${API_URL}/refresh`);

      localStorage.setItem("accessToken", data.accessToken);

      originalRequest.headers.Authorization =
        `Bearer ${data.accessToken}`;

      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);
export default apiClient;