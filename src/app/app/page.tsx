"use client";
import { useMemo } from "react";
import { Topbar } from "@/components/Topbar";
import { useApp } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
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
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const PIE_COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"];

export default function DashboardPage() {
  const { transactions, accounts } = useApp();
  const locale = useApp((s) => s.settings.locale);
  const hide = useApp((s) => s.settings.hideAmounts);

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const last30 = transactions.filter((tx) => {
      const diff = (Date.now() - new Date(tx.date).getTime()) / 86400000;
      return diff <= 30;
    });
    const income = last30.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = last30.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    const saving = last30
      .filter((t) => t.type === "SAVING" || t.type === "TRANSFER")
      .reduce((s, t) => s + t.amount, 0);

    const dailyMap = new Map<string, { date: string; income: number; expense: number }>();
    last30.forEach((tx) => {
      const key = new Date(tx.date).toISOString().slice(5, 10);
      const cur = dailyMap.get(key) ?? { date: key, income: 0, expense: 0 };
      if (tx.type === "INCOME") cur.income += tx.amount;
      if (tx.type === "EXPENSE") cur.expense += tx.amount;
      dailyMap.set(key, cur);
    });
    const series = [...dailyMap.values()].sort((a, b) => a.date.localeCompare(b.date));

    const catMap = new Map<string, number>();
    last30
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount));
    const categories = [...catMap.entries()].map(([name, value]) => ({ name, value }));

    return { totalBalance, income, expense, saving, series, categories };
  }, [transactions, accounts]);

  return (
    <>
      <Topbar title={t(locale, "dashboard")} />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label={t(locale, "balance")}
            value={formatCurrency(stats.totalBalance, "IDR", "id-ID", hide)}
            icon={Wallet}
          />
          <StatCard
            label={t(locale, "income") + " · 30d"}
            value={formatCurrency(stats.income, "IDR", "id-ID", hide)}
            icon={ArrowUpRight}
            tone="success"
          />
          <StatCard
            label={t(locale, "expense") + " · 30d"}
            value={formatCurrency(stats.expense, "IDR", "id-ID", hide)}
            icon={ArrowDownRight}
            tone="destructive"
          />
          <StatCard
            label={t(locale, "saving") + " · 30d"}
            value={formatCurrency(stats.saving, "IDR", "id-ID", hide)}
            icon={PiggyBank}
            tone="warning"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Cashflow</h2>
                <p className="text-xs text-muted-foreground">Pemasukan vs pengeluaran 30 hari</p>
              </div>
              <span className="pill-secondary">IDR</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.series}>
                  <defs>
                    <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}jt` : v >= 1e3 ? `${v / 1e3}rb` : v)}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#in)" name="Income" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#out)" name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-1 text-sm font-semibold">Kategori Pengeluaran</h2>
            <p className="mb-3 text-xs text-muted-foreground">30 hari terakhir</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.categories} dataKey="value" nameKey="name" outerRadius={90}>
                    {stats.categories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-3 text-sm font-semibold">{t(locale, "insights")}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Pengeluaran 30 hari turun jika rasio income/expense Anda sehat — terus pantau kategori top.</li>
            <li>• Aktifkan auto-saving rule di akun investasi untuk meningkatkan savings rate.</li>
            <li>• Upgrade ke Premium untuk AI Financial Advisor mingguan & OCR Scan struk.</li>
          </ul>
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
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "destructive" | "warning";
}) {
  const toneClass = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/15 text-destructive",
    warning: "bg-warning/15 text-warning",
  }[tone];
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`grid h-8 w-8 place-items-center rounded-md ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
