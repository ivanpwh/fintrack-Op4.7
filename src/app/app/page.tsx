"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Topbar } from "@/components/Topbar";
import { useApp } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import { api, queryKeys } from "@/lib/api";
import type { TxType } from "@/lib/dto";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  PiggyBank,
  Wallet,
  TrendingDown,
  TrendingUp,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

const PIE_COLORS = [
  "hsl(160 84% 39%)",
  "hsl(217 91% 60%)",
  "hsl(32 95% 44%)",
  "hsl(0 84% 60%)",
  "hsl(271 91% 65%)",
  "hsl(199 89% 48%)",
];

export default function DashboardPage() {
  const { data: transactions = [] } = useQuery({
    queryKey: queryKeys.transactions,
    queryFn: api.listTransactions,
  });
  const { data: accounts = [] } = useQuery({
    queryKey: queryKeys.accounts,
    queryFn: api.listAccounts,
  });
  const locale = useApp((s) => s.settings.locale);
  const hide = useApp((s) => s.settings.hideAmounts);
  const user = useApp((s) => s.user);

  const stats = useMemo(() => {
    const now = Date.now();
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    const sumBy = (type: TxType, from: number, to: number) =>
      transactions
        .filter((tx) => {
          const ts = new Date(tx.date).getTime();
          return tx.type === type && ts > from && ts <= to;
        })
        .reduce((s, t) => s + t.amount, 0);

    const D30 = now - 30 * 86400000;
    const D60 = now - 60 * 86400000;

    const income = sumBy("INCOME", D30, now);
    const expense = sumBy("EXPENSE", D30, now);
    const saving = sumBy("SAVING", D30, now) + sumBy("TRANSFER", D30, now);

    const prevIncome = sumBy("INCOME", D60, D30);
    const prevExpense = sumBy("EXPENSE", D60, D30);
    const prevSaving = sumBy("SAVING", D60, D30) + sumBy("TRANSFER", D60, D30);

    const delta = (cur: number, prev: number) =>
      prev === 0 ? (cur === 0 ? 0 : 100) : Math.round(((cur - prev) / prev) * 100);

    const dailyMap = new Map<string, { date: string; income: number; expense: number }>();
    transactions
      .filter((tx) => new Date(tx.date).getTime() > D30)
      .forEach((tx) => {
        const key = new Date(tx.date).toISOString().slice(5, 10);
        const cur = dailyMap.get(key) ?? { date: key, income: 0, expense: 0 };
        if (tx.type === "INCOME") cur.income += tx.amount;
        if (tx.type === "EXPENSE") cur.expense += tx.amount;
        dailyMap.set(key, cur);
      });
    const series = [...dailyMap.values()].sort((a, b) => a.date.localeCompare(b.date));

    const catMap = new Map<string, number>();
    transactions
      .filter((tx) => tx.type === "EXPENSE" && new Date(tx.date).getTime() > D30)
      .forEach((t) => catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount));
    const categories = [...catMap.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recent = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalBalance,
      income,
      expense,
      saving,
      incomeDelta: delta(income, prevIncome),
      expenseDelta: delta(expense, prevExpense),
      savingDelta: delta(saving, prevSaving),
      series,
      categories,
      recent,
    };
  }, [transactions, accounts]);

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <>
      <Topbar
        title={`${t(locale, "welcome")}, ${firstName}`}
        subtitle="Ringkasan keuangan 30 hari terakhir"
      />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t(locale, "balance")}
            value={formatCurrency(stats.totalBalance, "IDR", "id-ID", hide)}
            icon={Wallet}
            hint={`${accounts.length} akun aktif`}
          />
          <StatCard
            label={`${t(locale, "income")} · 30d`}
            value={formatCurrency(stats.income, "IDR", "id-ID", hide)}
            icon={ArrowUpRight}
            tone="success"
            delta={stats.incomeDelta}
          />
          <StatCard
            label={`${t(locale, "expense")} · 30d`}
            value={formatCurrency(stats.expense, "IDR", "id-ID", hide)}
            icon={ArrowDownRight}
            tone="destructive"
            delta={stats.expenseDelta}
            deltaInverted
          />
          <StatCard
            label={`${t(locale, "saving")} · 30d`}
            value={formatCurrency(stats.saving, "IDR", "id-ID", hide)}
            icon={PiggyBank}
            tone="warning"
            delta={stats.savingDelta}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Cashflow</h2>
                <p className="text-xs text-muted-foreground">
                  Pemasukan vs pengeluaran 30 hari
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Legend2 color="hsl(var(--success))" label="Income" />
                <Legend2 color="hsl(var(--destructive))" label="Expense" />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.series} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    fontSize={11}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={11}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 1e6 ? `${v / 1e6}jt` : v >= 1e3 ? `${v / 1e3}rb` : v
                    }
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    cursor={{ stroke: "hsl(var(--border))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--success))"
                    strokeWidth={2.25}
                    fill="url(#in)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2.25}
                    fill="url(#out)"
                    name="Expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold">Kategori Pengeluaran</h2>
            <p className="mb-3 text-xs text-muted-foreground">Top 6 · 30 hari</p>
            {stats.categories.length === 0 ? (
              <div className="grid h-60 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">
                Belum ada pengeluaran.
              </div>
            ) : (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categories.slice(0, 6)}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={42}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {stats.categories.slice(0, 6).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="hsl(var(--card))" />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {stats.categories.slice(0, 5).map((c, i) => {
                    const total = stats.categories.reduce((s, x) => s + x.value, 0);
                    const pct = total ? Math.round((c.value / total) * 100) : 0;
                    return (
                      <li key={c.name} className="flex items-center gap-2 text-xs">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="flex-1 truncate">{c.name}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                        <span className="font-medium">{formatCurrency(c.value, "IDR", "id-ID", hide)}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Aktivitas Terbaru</h2>
              <Link
                href="/app/transactions"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Lihat semua →
              </Link>
            </div>
            {stats.recent.length === 0 ? (
              <EmptyHint label="Belum ada transaksi." />
            ) : (
              <ul className="-mx-2">
                {stats.recent.map((tx) => {
                  const acc = accounts.find((a) => a.id === tx.accountFromId)?.name ?? "—";
                  return (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted/60"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <TxIcon type={tx.type} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{tx.category}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {formatDate(tx.date)} · {acc}
                          </div>
                        </div>
                      </div>
                      <span
                        className={clsx(
                          "shrink-0 text-sm font-medium",
                          tx.type === "INCOME" && "text-success",
                          tx.type === "EXPENSE" && "text-destructive",
                        )}
                      >
                        {tx.type === "EXPENSE" ? "-" : tx.type === "INCOME" ? "+" : ""}
                        {formatCurrency(tx.amount, "IDR", "id-ID", hide)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> {t(locale, "insights")}
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              <Insight
                tone={stats.expense > stats.income ? "destructive" : "success"}
                title={
                  stats.expense > stats.income
                    ? "Pengeluaran > pemasukan"
                    : "Cashflow sehat"
                }
                desc={
                  stats.expense > stats.income
                    ? "Pertimbangkan kurangi kategori top atau tambah sumber pemasukan."
                    : "Pemasukan masih menutup pengeluaran. Pertahankan kebiasaan ini."
                }
              />
              <Insight
                tone="default"
                title="Auto-saving"
                desc="Aktifkan transfer rutin ke akun investasi untuk meningkatkan savings rate."
              />
              {user?.tier === "free" && (
                <Insight
                  tone="warning"
                  title="Coba Premium"
                  desc="OCR struk, AI advisor, dan multi-currency siap di tier Premium."
                />
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  delta,
  deltaInverted,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "destructive" | "warning";
  delta?: number;
  deltaInverted?: boolean;
  hint?: string;
}) {
  const toneClass = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/15 text-destructive",
    warning: "bg-warning/15 text-warning",
  }[tone];

  const showDelta = typeof delta === "number" && Number.isFinite(delta);
  const goodDirection = deltaInverted ? (delta ?? 0) < 0 : (delta ?? 0) > 0;
  const TrendIcon = (delta ?? 0) >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`grid h-8 w-8 place-items-center rounded-md ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {showDelta && (
          <span
            className={clsx(
              "inline-flex items-center gap-0.5 font-medium",
              goodDirection ? "text-success" : "text-destructive",
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {Math.abs(delta!)}%
          </span>
        )}
        <span className="text-muted-foreground">{hint ?? "vs 30 hari sebelumnya"}</span>
      </div>
    </div>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function TxIcon({ type }: { type: TxType }) {
  const map = {
    INCOME: { Icon: ArrowUpRight, cls: "bg-success/15 text-success" },
    EXPENSE: { Icon: ArrowDownRight, cls: "bg-destructive/15 text-destructive" },
    TRANSFER: { Icon: ArrowLeftRight, cls: "bg-accent text-accent-foreground" },
    SAVING: { Icon: PiggyBank, cls: "bg-warning/15 text-warning" },
  } as const;
  const { Icon, cls } = map[type];
  return (
    <span className={clsx("grid h-9 w-9 shrink-0 place-items-center rounded-md", cls)}>
      <Icon className="h-4 w-4" />
    </span>
  );
}

function EmptyHint({ label }: { label: string }) {
  return (
    <div className="grid h-32 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function Insight({
  tone,
  title,
  desc,
}: {
  tone: "default" | "success" | "destructive" | "warning";
  title: string;
  desc: string;
}) {
  const dot = {
    default: "bg-muted-foreground",
    success: "bg-success",
    destructive: "bg-destructive",
    warning: "bg-warning",
  }[tone];
  return (
    <li className="flex items-start gap-3">
      <span className={clsx("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </li>
  );
}
