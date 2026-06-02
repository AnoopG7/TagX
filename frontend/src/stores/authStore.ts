import { create } from "zustand";
import type { User } from "../types/auth.types";
import api from "../lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, accessToken: string) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Silently fail
    } finally {
      localStorage.removeItem("accessToken");
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get("/auth/me");
      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUser: (userData) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...userData } });
    }
  },

  hydrate: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      set({ accessToken: token });
      await get().fetchMe();
    } else {
      set({ isLoading: false });
    }
  },
}));
