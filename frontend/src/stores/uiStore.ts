import { create } from "zustand";

interface UIState {
  // Mobile nav
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;

  // Theme (future expansion — currently always dark)
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Global loading overlay
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Search
  isSearchOpen: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  closeMobileNav: () => set({ isMobileNavOpen: false }),

  theme: "dark",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),

  isGlobalLoading: false,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

  isSearchOpen: false,
  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
}));
