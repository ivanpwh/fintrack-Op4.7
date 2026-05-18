"use client";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { useApp, type AccountType } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  Banknote,
  Building2,
  LineChart,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";

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
  const blockInvestment = free && investmentCount >= 1 && type === "INVESTMENT";

  const reset = () => {
    setName("");
    setBalance(0);
    setType("BANK_CARD");
    setCurrency("IDR");
  };

  const save = () => {
    if (!name) return;
    addAccount({ name, type, balance, currency });
    setOpen(false);
    reset();
  };

  return (
    <>
      <Topbar title={t(locale, "accounts")} />
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Kelola akun kas, bank, dan investasi Anda.
          </p>
          <button className="btn-primary" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Akun Baru
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => {
            const Icon = ICON[a.type];
            return (
              <div key={a.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-secondary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.type}</div>
                    </div>
                  </div>
                  <span className="pill-outline">{a.currency}</span>
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">
                  {formatCurrency(a.balance, a.currency, "id-ID", hide)}
                </div>
              </div>
            );
          })}
        </div>

        {free && investmentCount >= 1 && (
          <div className="card border-warning/40 bg-warning/10 text-sm text-warning">
            Free tier dibatasi 1 akun investasi. Upgrade Premium untuk unlimited.
          </div>
        )}

        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
            reset();
          }}
          title="Akun Baru"
          description="Tambahkan akun kas, bank, atau investasi."
        >
          <div className="space-y-3">
            <Field label="Nama">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="BCA, Cash, etc."
              />
            </Field>
            <Field label="Tipe">
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
              >
                <option value="CASH">Cash</option>
                <option value="BANK_CARD">Bank / Card</option>
                <option value="INVESTMENT">Investment</option>
                <option value="ASSET">Asset</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Saldo">
                <input
                  className="input"
                  inputMode="numeric"
                  value={balance || ""}
                  onChange={(e) => setBalance(Number(e.target.value.replace(/\D/g, "")))}
                />
              </Field>
              <Field label="Mata Uang">
                <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                </select>
              </Field>
            </div>
            {blockInvestment && (
              <p className="text-xs text-warning">
                Free tier hanya mengizinkan 1 akun investasi.
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Batal
            </button>
            <button className="btn-primary" onClick={save} disabled={!name || blockInvestment}>
              Simpan
            </button>
          </div>
        </Dialog>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
