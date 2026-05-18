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
  Search,
  Inbox,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "@/lib/toast";

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
    return transactions
      .filter((tx) => {
        const okType = filter === "ALL" || tx.type === filter;
        const okQ =
          !q ||
          tx.category.toLowerCase().includes(q.toLowerCase()) ||
          (tx.notes ?? "").toLowerCase().includes(q.toLowerCase());
        return okType && okQ;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter, q]);

  const onDelete = (id: string) => {
    deleteTransaction(id);
    toast({ title: "Transaksi dihapus", variant: "default" });
  };

  return (
    <>
      <Topbar
        title={t(locale, "transactions")}
        subtitle={`${filtered.length} dari ${transactions.length} entri`}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={clsx(
                  "pill cursor-pointer transition-colors",
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
            <div className="relative md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="input pl-9"
                placeholder="Cari kategori / catatan…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button onClick={openTxModal} className="btn-primary">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-5 w-5" />
            </span>
            <div>
              <div className="text-base font-semibold">Belum ada transaksi</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {transactions.length === 0
                  ? "Mulai mencatat dengan menambahkan transaksi pertama Anda."
                  : "Tidak ada entri yang cocok dengan filter saat ini."}
              </p>
            </div>
            <button onClick={openTxModal} className="btn-primary">
              <Plus className="h-4 w-4" /> Tambah Transaksi
            </button>
          </div>
        ) : (
          <>
            <div className="card hidden overflow-hidden p-0 md:block">
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
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3"><TypeBadge type={tx.type} /></td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{tx.category}</div>
                        {tx.notes && (
                          <div className="text-xs text-muted-foreground">{tx.notes}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {accName(tx.accountFromId)}
                        {tx.accountToId && (
                          <span className="text-muted-foreground"> → {accName(tx.accountToId)}</span>
                        )}
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
                          onClick={() => onDelete(tx.id)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Hapus"
                          aria-label="Hapus transaksi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 md:hidden">
              {filtered.map((tx) => (
                <div key={tx.id} className="card flex items-start gap-3 p-3">
                  <TypeAvatar type={tx.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="truncate font-medium">{tx.category}</div>
                      <div
                        className={clsx(
                          "shrink-0 text-sm font-semibold",
                          tx.type === "INCOME" && "text-success",
                          tx.type === "EXPENSE" && "text-destructive",
                        )}
                      >
                        {tx.type === "EXPENSE" ? "-" : tx.type === "INCOME" ? "+" : ""}
                        {formatCurrency(tx.amount, "IDR", "id-ID", hide)}
                      </div>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {formatDate(tx.date)} · {accName(tx.accountFromId)}
                      {tx.accountToId && <> → {accName(tx.accountToId)}</>}
                    </div>
                    {tx.notes && (
                      <div className="mt-1 truncate text-xs text-muted-foreground">{tx.notes}</div>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

const TYPE_META = {
  INCOME: { label: "Income", icon: ArrowUpRight, cls: "bg-success/15 text-success" },
  EXPENSE: { label: "Expense", icon: ArrowDownRight, cls: "bg-destructive/15 text-destructive" },
  TRANSFER: { label: "Transfer", icon: ArrowLeftRight, cls: "bg-accent text-accent-foreground" },
  SAVING: { label: "Saving", icon: PiggyBank, cls: "bg-warning/15 text-warning" },
} as const;

function TypeBadge({ type }: { type: TxType }) {
  const { label, icon: Icon, cls } = TYPE_META[type];
  return (
    <span className={clsx("pill border-transparent", cls)}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function TypeAvatar({ type }: { type: TxType }) {
  const { icon: Icon, cls } = TYPE_META[type];
  return (
    <span className={clsx("grid h-9 w-9 shrink-0 place-items-center rounded-md", cls)}>
      <Icon className="h-4 w-4" />
    </span>
  );
}
