"use client";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { useApp, type AccountType } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { t } from "@/lib/i18n";
import { Banknote, Building2, LineChart, Plus, Wallet, type LucideIcon } from "lucide-react";
import clsx from "clsx";

const ICON: Record<AccountType, LucideIcon> = {
  CASH: Banknote,
  BANK_CARD: Building2,
  INVESTMENT: LineChart,
  ASSET: Wallet,
};

export default function AccountsPage() {
  const { accounts, user } = useApp();
  const addAccount = useApp((s) => s.addAccount);
  const locale = useApp((s) => s.settings.locale);
  const hide = useApp((s) => s.settings.hideAmounts);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("BANK_CARD");
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState("IDR");

  const free = user?.tier === "free";
  const investmentCount = accounts.filter((a) => a.type === "INVESTMENT").length;

  const save = () => {
    if (!name) return;
    addAccount({ name, type, balance, currency });
    setOpen(false);
    setName("");
    setBalance(0);
  };

  return (
    <>
      <Topbar title={t(locale, "accounts")} />
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Kelola akun kas, bank, dan investasi Anda.
          </p>
          <button className="btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Akun Baru
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => {
            const Icon = ICON[a.type];
            return (
              <div key={a.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{a.type}</div>
                    </div>
                  </div>
                  <span className="pill bg-slate-100 text-slate-600">{a.currency}</span>
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">
                  {formatCurrency(a.balance, a.currency, "id-ID", hide)}
                </div>
              </div>
            );
          })}
        </div>

        {free && investmentCount >= 1 && (
          <div className="card border-amber-300 bg-amber-50 text-amber-900">
            Free tier dibatasi 1 akun investasi. Upgrade Premium untuk unlimited.
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
            <div className="card w-full max-w-md">
              <h2 className="text-base font-semibold">Akun Baru</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="label">Nama</label>
                  <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="BCA, Cash, etc." />
                </div>
                <div>
                  <label className="label">Tipe</label>
                  <select className="input mt-1" value={type} onChange={(e) => setType(e.target.value as AccountType)}>
                    <option value="CASH">Cash</option>
                    <option value="BANK_CARD">Bank / Card</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="ASSET">Asset</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Saldo</label>
                    <input
                      className="input mt-1"
                      inputMode="numeric"
                      value={balance || ""}
                      onChange={(e) => setBalance(Number(e.target.value.replace(/\D/g, "")))}
                    />
                  </div>
                  <div>
                    <label className="label">Mata Uang</label>
                    <select className="input mt-1" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="IDR">IDR</option>
                      <option value="USD">USD</option>
                      <option value="JPY">JPY</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button className="btn-ghost" onClick={() => setOpen(false)}>Batal</button>
                <button
                  className={clsx("btn-primary", free && investmentCount >= 1 && type === "INVESTMENT" && "opacity-50")}
                  onClick={save}
                  disabled={!name || (free && investmentCount >= 1 && type === "INVESTMENT")}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
