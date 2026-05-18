"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Topbar } from "@/components/Topbar";
import { useApp } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  Banknote,
  Building2,
  LineChart,
  Loader2,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { toast } from "@/lib/toast";
import { api, queryKeys } from "@/lib/api";
import type { AccountType } from "@/lib/dto";

const ICON: Record<AccountType, LucideIcon> = {
  CASH: Banknote,
  BANK_CARD: Building2,
  INVESTMENT: LineChart,
  ASSET: Wallet,
};

const TYPE_TONE: Record<AccountType, string> = {
  CASH: "bg-warning/15 text-warning",
  BANK_CARD: "bg-primary/10 text-primary",
  INVESTMENT: "bg-success/15 text-success",
  ASSET: "bg-accent text-accent-foreground",
};

const TYPE_LABEL: Record<AccountType, string> = {
  CASH: "Cash",
  BANK_CARD: "Bank / Card",
  INVESTMENT: "Investment",
  ASSET: "Asset",
};

export default function AccountsPage() {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: queryKeys.accounts,
    queryFn: api.listAccounts,
  });
  const qc = useQueryClient();
  const user = useApp((s) => s.user);
  const locale = useApp((s) => s.settings.locale);
  const hide = useApp((s) => s.settings.hideAmounts);

  const createAccount = useMutation({
    mutationFn: api.createAccount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("BANK_CARD");
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState("IDR");

  const free = user?.tier === "free";
  const investmentCount = accounts.filter((a) => a.type === "INVESTMENT").length;
  const blockInvestment = free && investmentCount >= 1 && type === "INVESTMENT";

  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const reset = () => {
    setName("");
    setBalance(0);
    setType("BANK_CARD");
    setCurrency("IDR");
  };

  const save = async () => {
    if (!name) return;
    try {
      await createAccount.mutateAsync({ name, type, balance, currency });
      toast({ title: "Akun ditambahkan", description: name, variant: "success" });
      setOpen(false);
      reset();
    } catch (e) {
      toast({
        title: "Gagal menambahkan akun",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Topbar title={t(locale, "accounts")} subtitle="Aset kas, bank, dan investasi" />
      <div className="space-y-4 p-4 md:p-6">
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total aset</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">
              {formatCurrency(total, "IDR", "id-ID", hide)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {accounts.length} akun aktif
            </div>
          </div>
          <button className="btn-primary self-start sm:self-auto" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Akun Baru
          </button>
        </div>

        {isLoading ? (
          <div className="card flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat akun…
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((a) => {
              const Icon = ICON[a.type];
              const pct = total ? Math.round((a.balance / total) * 100) : 0;
              return (
                <div key={a.id} className="card flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-md ${TYPE_TONE[a.type]}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{TYPE_LABEL[a.type]}</div>
                      </div>
                    </div>
                    <span className="pill-outline">{a.currency}</span>
                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-tight">
                    {formatCurrency(a.balance, a.currency, "id-ID", hide)}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Alokasi</span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setOpen(true)}
              className="grid min-h-[180px] place-items-center rounded-xl border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-md border bg-background">
                  <Plus className="h-4 w-4" />
                </span>
                Tambah akun baru
              </div>
            </button>
          </div>
        )}

        {free && investmentCount >= 1 && (
          <div className="card border-warning/40 bg-warning/10 text-sm text-warning">
            Free tier dibatasi 1 akun investasi. Upgrade Premium di Pengaturan untuk unlimited.
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
          footer={
            <>
              <button
                className="btn-ghost"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Batal
              </button>
              <button
                className="btn-primary"
                onClick={save}
                disabled={!name || blockInvestment || createAccount.isPending}
              >
                {createAccount.isPending ? "Menyimpan…" : "Simpan"}
              </button>
            </>
          }
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
