import type {
  AccountDTO,
  CreateAccountInput,
  CreateTransactionInput,
  MeDTO,
  TransactionDTO,
} from "./dto";
import type { ParsedTx } from "./parse";

async function jfetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  me: () => jfetch<MeDTO>("/api/me"),
  patchMe: (patch: Partial<MeDTO>) =>
    jfetch<MeDTO>("/api/me", { method: "PATCH", body: JSON.stringify(patch) }),

  listAccounts: () => jfetch<AccountDTO[]>("/api/accounts"),
  createAccount: (input: CreateAccountInput) =>
    jfetch<AccountDTO>("/api/accounts", { method: "POST", body: JSON.stringify(input) }),

  listTransactions: () => jfetch<TransactionDTO[]>("/api/transactions"),
  createTransaction: (input: CreateTransactionInput) =>
    jfetch<TransactionDTO>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteTransaction: (id: string) =>
    jfetch<{ ok: boolean }>(`/api/transactions/${id}`, { method: "DELETE" }),

  parseText: (text: string) =>
    jfetch<{ parsed: ParsedTx | null; model: string; latencyMs: number }>(
      "/api/ai/parse",
      { method: "POST", body: JSON.stringify({ text }) },
    ),
};

export const queryKeys = {
  me: ["me"] as const,
  accounts: ["accounts"] as const,
  transactions: ["transactions"] as const,
};
