import type { TxType } from "./store";

export interface ParsedTx {
  type: TxType;
  amount: number;
  category: string;
  notes?: string;
}

const multipliers: Record<string, number> = {
  rb: 1_000,
  ribu: 1_000,
  k: 1_000,
  jt: 1_000_000,
  juta: 1_000_000,
  m: 1_000_000_000,
};

const incomeKeywords = ["gaji", "bonus", "terima", "salary", "income", "honor"];
const transferKeywords = ["transfer", "kirim", "tf", "tarik"];
const savingKeywords = ["nabung", "saving", "tabung"];

export function parseNaturalText(input: string): ParsedTx | null {
  const text = input.trim().toLowerCase();
  if (!text) return null;

  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|jt|juta|k|m)?/i);
  if (!match) return null;

  const raw = parseFloat(match[1].replace(",", "."));
  const unit = (match[2] ?? "").toLowerCase();
  const amount = Math.round(raw * (multipliers[unit] ?? 1));

  let type: TxType = "EXPENSE";
  if (incomeKeywords.some((k) => text.includes(k))) type = "INCOME";
  else if (transferKeywords.some((k) => text.includes(k))) type = "TRANSFER";
  else if (savingKeywords.some((k) => text.includes(k))) type = "SAVING";

  const cleaned = text
    .replace(match[0], "")
    .replace(/(beli|bayar|untuk|buat)/g, "")
    .trim();
  const category = (cleaned.split(/\s+/)[0] || "Lainnya")
    .replace(/^\w/, (c) => c.toUpperCase());

  return { type, amount, category, notes: input };
}
