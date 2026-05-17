"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { useApp, type TxType } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, PiggyBank, Trash2, Plus } from "lucide-react";
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
                  "pill border",
                  filter === opt.value ? "bg-brand-600 text-white border-brand-600" : "",
                )}
                style={filter !== opt.value ? { borderColor: "var(--border)" } : {}}
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
            <Link href="/app/transactions/new" className="btn-primary">
              <Plus size={16} /> Tambah
            </Link>
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--muted)" }}>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Akun</th>
                <th className="px-4 py-3 text-right">Nominal</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3"><TypeBadge type={tx.type} /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{tx.category}</div>
                    {tx.notes && <div className="text-xs" style={{ color: "var(--muted)" }}>{tx.notes}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {accName(tx.accountFromId)}
                    {tx.accountToId && <span> → {accName(tx.accountToId)}</span>}
                  </td>
                  <td className={clsx(
                    "px-4 py-3 text-right font-medium",
                    tx.type === "INCOME" && "text-emerald-600",
                    tx.type === "EXPENSE" && "text-rose-600",
                  )}>
                    {tx.type === "EXPENSE" ? "-" : tx.type === "INCOME" ? "+" : ""}
                    {formatCurrency(tx.amount, "IDR", "id-ID", hide)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
                  Belum ada transaksi.
                </td></tr>
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
    INCOME: { label: "Income", icon: ArrowUpRight, cls: "bg-emerald-100 text-emerald-700" },
    EXPENSE: { label: "Expense", icon: ArrowDownRight, cls: "bg-rose-100 text-rose-700" },
    TRANSFER: { label: "Transfer", icon: ArrowLeftRight, cls: "bg-sky-100 text-sky-700" },
    SAVING: { label: "Saving", icon: PiggyBank, cls: "bg-amber-100 text-amber-700" },
  } as const;
  const { label, icon: Icon, cls } = map[type];
  return (
    <span className={clsx("pill", cls)}>
      <Icon size={12} /> {label}
    </span>
  );
}
