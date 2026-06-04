import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts running simultaneously
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

// ── Request interceptor: attach Bearer token if available ──
apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// ── Response interceptor: auto-refresh on 401 ──
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401 errors, and not for auth endpoints themselves
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint bypassing the interceptors to prevent loops
      const { data } = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = data.data.tokens.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Refresh failed — clear auth state and redirect to sign-in
      localStorage.removeItem("accessToken");

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;