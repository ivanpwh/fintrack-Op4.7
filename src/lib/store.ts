"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "./i18n";

export type TxType = "INCOME" | "EXPENSE" | "TRANSFER" | "SAVING";
export type AccountType = "CASH" | "BANK_CARD" | "INVESTMENT" | "ASSET";
export type Tier = "free" | "premium";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  accountFromId: string;
  accountToId?: string;
  date: string;
  notes?: string;
  rawInput?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  tier: Tier;
  telegramId?: string;
}

interface Settings {
  darkMode: boolean;
  locale: Locale;
  hideAmounts: boolean;
  developerMode: boolean;
  customApiKey?: string;
  customEndpoint?: string;
}

interface AppState {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  settings: Settings;
  maintenance: boolean;
  txModalOpen: boolean;
  mobileNavOpen: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  upgrade: () => void;
  bindTelegram: (telegramId: string) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (acc: Omit<Account, "id">) => void;
  updateSettings: (s: Partial<Settings>) => void;
  toggleMaintenance: () => void;
  openTxModal: () => void;
  closeTxModal: () => void;
  setMobileNav: (open: boolean) => void;
}

const seedAccounts: Account[] = [
  { id: "a1", name: "BCA", type: "BANK_CARD", balance: 12_450_000, currency: "IDR" },
  { id: "a2", name: "Cash", type: "CASH", balance: 850_000, currency: "IDR" },
  { id: "a3", name: "Reksadana", type: "INVESTMENT", balance: 25_000_000, currency: "IDR" },
];

const today = new Date();
const d = (offset: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() - offset);
  return x.toISOString();
};

const seedTx: Transaction[] = [
  { id: "t1", type: "INCOME", amount: 10_000_000, category: "Gaji", accountFromId: "a1", date: d(20), notes: "Gaji bulanan" },
  { id: "t2", type: "EXPENSE", amount: 25_000, category: "Kopi", accountFromId: "a2", date: d(18), rawInput: "Beli kopi 25rb" },
  { id: "t3", type: "EXPENSE", amount: 350_000, category: "Belanja", accountFromId: "a1", date: d(14) },
  { id: "t4", type: "TRANSFER", amount: 1_000_000, category: "Transfer", accountFromId: "a1", accountToId: "a3", date: d(10) },
  { id: "t5", type: "EXPENSE", amount: 75_000, category: "Transport", accountFromId: "a2", date: d(7) },
  { id: "t6", type: "EXPENSE", amount: 220_000, category: "Makan", accountFromId: "a1", date: d(5) },
  { id: "t7", type: "INCOME", amount: 500_000, category: "Bonus", accountFromId: "a1", date: d(3) },
  { id: "t8", type: "EXPENSE", amount: 45_000, category: "Kopi", accountFromId: "a2", date: d(1) },
];

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      accounts: seedAccounts,
      transactions: seedTx,
      settings: {
        darkMode: false,
        locale: "id",
        hideAmounts: false,
        developerMode: false,
      },
      maintenance: false,
      txModalOpen: false,
      mobileNavOpen: false,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      upgrade: () =>
        set((s) => (s.user ? { user: { ...s.user, tier: "premium" } } : s)),
      bindTelegram: (telegramId) =>
        set((s) => (s.user ? { user: { ...s.user, telegramId } } : s)),
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [{ ...tx, id: crypto.randomUUID() }, ...s.transactions],
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
      addAccount: (acc) =>
        set((s) => ({ accounts: [...s.accounts, { ...acc, id: crypto.randomUUID() }] })),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      toggleMaintenance: () => set((s) => ({ maintenance: !s.maintenance })),
      openTxModal: () => set({ txModalOpen: true }),
      closeTxModal: () => set({ txModalOpen: false }),
      setMobileNav: (open) => set({ mobileNavOpen: open }),
    }),
    { name: "fintrack-store" },
  ),
);
