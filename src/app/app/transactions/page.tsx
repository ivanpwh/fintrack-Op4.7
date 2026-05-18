"use client";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { useApp, type TxType } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  PiggyBank,
  Trash2,
  Plus,
} from "lucide-react";
import clsx from "clsx";

const TYPES: { value: TxType | "ALL"; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "SAVING", label: "Saving" },
];

export default function TransactionsPage() {
  const { transactions, accounts } = useApp();
  const deleteTransaction = useApp((s) => s.deleteTransaction);
  const openTxModal = useApp((s) => s.openTxModal);
  const locale = useApp((s) => s.settings.locale);
  const hide = useApp((s) => s.settings.hideAmounts);
  const [filter, setFilter] = useState<TxType | "ALL">("ALL");
  const [q, setQ] = useState("");

  const accName = (id?: string) => accounts.find((a) => a.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const okType = filter === "ALL" || tx.type === filter;
      const okQ =
        !q ||
        tx.category.toLowerCase().includes(q.toLowerCase()) ||
        (tx.notes ?? "").toLowerCase().includes(q.toLowerCase());
      return okType && okQ;
    });
  }, [transactions, filter, q]);

  return (
    <>
      <Topbar title={t(locale, "transactions")} />
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={clsx(
                  "pill cursor-pointer",
                  filter === opt.value
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input md:w-72"
              placeholder="Cari kategori / catatan…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button onClick={openTxModal} className="btn-primary">
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Akun</th>
                <th className="px-4 py-3 text-right font-medium">Nominal</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3"><TypeBadge type={tx.type} /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{tx.category}</div>
                    {tx.notes && <div className="text-xs text-muted-foreground">{tx.notes}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {accName(tx.accountFromId)}
                    {tx.accountToId && <span> → {accName(tx.accountToId)}</span>}
                  </td>
                  <td
                    className={clsx(
                      "px-4 py-3 text-right font-medium",
                      tx.type === "INCOME" && "text-success",
                      tx.type === "EXPENSE" && "text-destructive",
                    )}
                  >
                    {tx.type === "EXPENSE" ? "-" : tx.type === "INCOME" ? "+" : ""}
                    {formatCurrency(tx.amount, "IDR", "id-ID", hide)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TypeBadge({ type }: { type: TxType }) {
  const map = {
    INCOME: { label: "Income", icon: ArrowUpRight, cls: "bg-success/15 text-success" },
    EXPENSE: { label: "Expense", icon: ArrowDownRight, cls: "bg-destructive/15 text-destructive" },
    TRANSFER: { label: "Transfer", icon: ArrowLeftRight, cls: "bg-accent text-accent-foreground" },
    SAVING: { label: "Saving", icon: PiggyBank, cls: "bg-warning/15 text-warning" },
  } as const;
  const { label, icon: Icon, cls } = map[type];
  return (
    <span className={clsx("pill border-transparent", cls)}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
