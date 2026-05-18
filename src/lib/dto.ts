export type TxType = "INCOME" | "EXPENSE" | "TRANSFER" | "SAVING";
export type AccountType = "CASH" | "BANK_CARD" | "INVESTMENT" | "ASSET";
export type Tier = "free" | "premium";

export interface MeDTO {
  id: string;
  email: string;
  displayName: string;
  tier: Tier;
  telegramId: string | null;
}

export interface AccountDTO {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}

export interface TransactionDTO {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  accountFromId: string;
  accountToId: string | null;
  date: string;
  notes: string | null;
  rawInput: string | null;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
}

export interface CreateTransactionInput {
  type: TxType;
  amount: number;
  category: string;
  accountFromId: string;
  accountToId?: string | null;
  date?: string;
  notes?: string | null;
  rawInput?: string | null;
}
