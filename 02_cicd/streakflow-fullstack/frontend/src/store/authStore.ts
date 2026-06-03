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
  streakFreezeCredits:string;
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
  error: string | null;
  accessToken: string;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

const storedToken = localStorage.getItem("accessToken");


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: storedToken || "",
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null,

  login: async (payload) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const { data} = await signInApi(payload);
      const { user,tokens } = data.data;


      localStorage.setItem("accessToken", tokens.accessToken);

      set({
        user: null,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (payload) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const { data } = await signUpApi(payload);
      const { user, tokens } = data.data;

      localStorage.setItem("accessToken", tokens.accessToken);

      set({
        user: null,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await logoutApi();

      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: "",
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error(error);
    }
  },

  getCurrentUser: async () => {
    try {
      set({
        isLoading: true,
      });

      const { data } = await getCurrentUserApi();
      const {user} = data.data;


      set({
        user:user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: "",
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));