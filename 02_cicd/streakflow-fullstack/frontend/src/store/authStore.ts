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
  hasInitialized: boolean; // true after the first /auth/me check completes
  error: string | null;

  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

// ── Session cache helpers ──────────────────────────────────────────────
// Persist the authenticated user in sessionStorage so that page refreshes
// can hydrate instantly without waiting for a network round-trip.
const SESSION_KEY = "streakflow_user";

const persistUser = (user: User) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // Storage full or disabled — non-critical
  }
};

const loadCachedUser = (): User | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const clearCachedUser = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // non-critical
  }
};

// ── Hydrate initial state from cache ───────────────────────────────────
const cachedUser = loadCachedUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  // If we have a cached user, start as authenticated & initialized immediately
  // so the route guards never show a loader on refresh.
  user: cachedUser,
  isAuthenticated: !!cachedUser,
  isLoading: false,
  hasInitialized: !!cachedUser, // true if cache exists → no loader
  error: null,

  // ── Login ────────────────────────────────────────────────────────────
  // Returns true on success so the calling component can navigate.
  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await signInApi(payload);
      const { user } = data.data;

      persistUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasInitialized: true,
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

  // ── Register ─────────────────────────────────────────────────────────
  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await signUpApi(payload);
      const { user } = data.data;

      persistUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasInitialized: true,
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

  // ── Logout ───────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Server might be unreachable — still clear local state
      console.error("Logout API error:", error);
    } finally {
      clearCachedUser();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // ── Get current user (session check) ─────────────────────────────────
  // Called once on app mount to validate the cookie session.
  // If we already hydrated from cache, skip showing a loader —
  // just silently re-validate in the background.
  getCurrentUser: async () => {
    const state = get();

    // Already initialized with a live API call — nothing to do
    if (state.hasInitialized && state.user) return;

    // If we have a cached user, we're already showing the app (no loader).
    // Just validate silently in the background.
    const hasCachedUser = !!state.user;

    if (!hasCachedUser) {
      // No cache — we must show a loader while we check
      set({ isLoading: true });
    }

    try {
      const { data } = await getCurrentUserApi();
      const user = data.data;

      persistUser(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasInitialized: true,
      });
    } catch {
      // No valid session — clear everything
      clearCachedUser();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  // ── Clear error (call on page transitions) ───────────────────────────
  clearError: () => set({ error: null }),
}));