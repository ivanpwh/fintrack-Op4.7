"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale } from "./i18n";
import type { MeDTO, Tier } from "./dto";

export type { TxType, AccountType, Tier } from "./dto";
export type User = MeDTO;

interface Settings {
  darkMode: boolean;
  locale: Locale;
  hideAmounts: boolean;
  developerMode: boolean;
  customApiKey?: string;
  customEndpoint?: string;
}

interface UIState {
  txModalOpen: boolean;
  mobileNavOpen: boolean;
  maintenance: boolean;
  openTxModal: () => void;
  closeTxModal: () => void;
  setMobileNav: (open: boolean) => void;
  toggleMaintenance: () => void;
}

interface SessionState {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  setTier: (tier: Tier) => void;
  setTelegramId: (telegramId: string | null) => void;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
}

type AppState = UIState & SessionState & SettingsState;

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      settings: {
        darkMode: false,
        locale: "id",
        hideAmounts: false,
        developerMode: false,
      },
      txModalOpen: false,
      mobileNavOpen: false,
      maintenance: false,

      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      setTier: (tier) =>
        set((s) => (s.user ? { user: { ...s.user, tier } } : s)),
      setTelegramId: (telegramId) =>
        set((s) => (s.user ? { user: { ...s.user, telegramId } } : s)),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      openTxModal: () => set({ txModalOpen: true }),
      closeTxModal: () => set({ txModalOpen: false }),
      setMobileNav: (open) => set({ mobileNavOpen: open }),
      toggleMaintenance: () => set((s) => ({ maintenance: !s.maintenance })),
    }),
    {
      name: "fintrack-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        settings: s.settings,
        maintenance: s.maintenance,
      }),
    },
  ),
);
