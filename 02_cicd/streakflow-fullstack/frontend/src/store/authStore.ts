import { create } from "zustand";
import {
  getCurrentUserApi,
  logoutApi,
  signInApi,
  signUpApi,
} from "../api/auth";

interface User {
  id: string;
  fullName: string;
  email: string;
  streakFreezeCredits: number;
  createdAt: string;
  timezone: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string;
  error: string | null;

  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: localStorage.getItem("accessToken") || "",
  error: null,

  /* ================= LOGIN ================= */
  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await signInApi(payload);
      const { user, tokens } = data.data;

      localStorage.setItem("accessToken", tokens.accessToken);

      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  /* ================= REGISTER ================= */
  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await signUpApi(payload);
      const { user, tokens } = data.data;

      localStorage.setItem("accessToken", tokens.accessToken);

      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      return false;
    }
  },

  /* ================= LOGOUT ================= */
  logout: async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        isAuthenticated: false,
        accessToken: "",
        error: null,
      });
    }
  },

  /* ================= GET CURRENT USER ================= */
  getCurrentUser: async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        accessToken: "",
      });
      return;
    }

    set({ accessToken: token, isAuthenticated: true });

    try {
      const { data } = await getCurrentUserApi();

      // Update with the latest token in case it was refreshed
      const latestToken = localStorage.getItem("accessToken") || "";

      set({
        user: data.data,
        isAuthenticated: true,
        accessToken: latestToken,
      });
    } catch (error: any) {
      // If the token refresh also failed, localStorage will be cleared
      // by the response interceptor — reset auth state accordingly
      const stillHasToken = localStorage.getItem("accessToken");
      if (!stillHasToken) {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: "",
        });
      }
    }
  },

  /* ================= HYDRATE (on refresh) ================= */
  hydrateAuth: () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      set({
        accessToken: token,
        isAuthenticated: true,
      });
    }
  },
}));