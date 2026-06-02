import { create } from "zustand";

function getInitialTheme(): "dark" | "light" {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tagx-theme");
    if (stored === "dark" || stored === "light") return stored;
  }
  return "light";
}

function applyTheme(theme: "dark" | "light") {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("tagx-theme", theme);
}

interface UIState {
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;

  theme: "dark" | "light";
  toggleTheme: () => void;

  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  isSearchOpen: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => {
  const initialTheme = getInitialTheme();
  if (typeof window !== "undefined") applyTheme(initialTheme);

  return {
    isMobileNavOpen: false,
    toggleMobileNav: () =>
      set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
    closeMobileNav: () => set({ isMobileNavOpen: false }),

    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const next = state.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        return { theme: next };
      }),

    isGlobalLoading: false,
    setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

    isSearchOpen: false,
    toggleSearch: () =>
      set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    closeSearch: () => set({ isSearchOpen: false }),
  };
});
