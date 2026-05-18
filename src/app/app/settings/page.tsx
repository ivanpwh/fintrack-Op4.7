"use client";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { useApp } from "@/lib/store";
import { t, type Locale } from "@/lib/i18n";
import {
  Bot,
  Check,
  Code,
  Crown,
  Moon,
  Send,
  ShieldAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "@/lib/toast";
import { api } from "@/lib/api";

const PLAN_ROWS: { label: string; free: string | boolean; premium: string | boolean }[] = [
  { label: "Catat Transaksi", free: "50 / bulan", premium: "Unlimited" },
  { label: "Riwayat & Filter", free: "Dasar", premium: "Lanjutan + Export" },
  { label: "Dashboard Chart", free: "Ringkas", premium: "Lengkap" },
  { label: "Akun Aset", free: "1", premium: "Unlimited" },
  { label: "AI Parsing", free: "Regex + Fallback", premium: "High-tier Model" },
  { label: "OCR Scan Struk", free: false, premium: true },
  { label: "Multi-Currency", free: false, premium: true },
  { label: "Developer Mode", free: false, premium: true },
];

export default function SettingsPage() {
  const { settings, user } = useApp();
  const updateSettings = useApp((s) => s.updateSettings);
  const toggleMaintenance = useApp((s) => s.toggleMaintenance);
  const maintenance = useApp((s) => s.maintenance);
  const setTier = useApp((s) => s.setTier);
  const setTelegramId = useApp((s) => s.setTelegramId);
  const locale = settings.locale;

  const [code] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [bindInput, setBindInput] = useState("");
  const [testStatus, setTestStatus] = useState<null | { ok: boolean; ms: number }>(null);

  const onTest = async () => {
    setTestStatus(null);
    const start = performance.now();
    try {
      await api.parseText("Test koneksi 1rb");
      const ms = Math.round(performance.now() - start);
      setTestStatus({ ok: true, ms });
      toast({ title: "Endpoint reachable", description: `${ms} ms`, variant: "success" });
    } catch (e) {
      const ms = Math.round(performance.now() - start);
      setTestStatus({ ok: false, ms });
      toast({
        title: "Connectivity failed",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    }
  };

  const onUpgrade = async () => {
    try {
      const me = await api.patchMe({ tier: "premium" });
      setTier(me.tier);
      toast({
        title: "Premium aktif",
        description: "Semua fitur lanjutan telah terbuka.",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Gagal upgrade",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    }
  };

  const onBind = async () => {
    const tgId = "tg-" + Date.now();
    try {
      const me = await api.patchMe({ telegramId: tgId });
      setTelegramId(me.telegramId);
      toast({
        title: "Telegram tertaut",
        description: "Akun bot Anda sekarang sinkron.",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Gagal menautkan Telegram",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    }
  };

  const isPremium = user?.tier === "premium";
  const devMode = settings.developerMode && isPremium;
  const sample = useMemo(
    () =>
      JSON.stringify(
        {
          model: settings.customEndpoint ? "custom" : "openrouter/auto",
          prompt: "Beli kopi 25rb",
          response: { type: "EXPENSE", amount: 25000, category: "Kopi" },
        },
        null,
        2,
      ),
    [settings.customEndpoint],
  );

  return (
    <>
      <Topbar title={t(locale, "settings")} />
      <div className="space-y-6 p-4 md:p-6">
        <section className="card">
          <SectionHeader title="Langganan" desc="Tier akun & benefit yang aktif." />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <PlanCard
              title="Free"
              price="Rp 0"
              icon={ShieldAlert}
              current={!isPremium}
              bullets={[
                "Pencatatan & dashboard dasar",
                "1 akun investasi",
                "AI parsing Regex + fallback",
              ]}
            />
            <PlanCard
              title="Premium"
              price="Rp 49.000 / bulan"
              icon={Crown}
              highlight
              current={isPremium}
              onUpgrade={!isPremium ? onUpgrade : undefined}
              bullets={[
                "OCR Scan struk & Multi-currency",
                "AI Financial Advisor mingguan",
                "Unlimited akun & export",
                "Developer Mode (custom API key)",
              ]}
            />
          </div>
          <div className="mt-5 overflow-x-auto rounded-md border">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Fitur</th>
                  <th className="px-4 py-2 font-medium">Free</th>
                  <th className="px-4 py-2 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_ROWS.map((r) => (
                  <tr key={r.label} className="border-b last:border-0">
                    <td className="px-4 py-2 font-medium">{r.label}</td>
                    <td className="px-4 py-2"><Cell value={r.free} /></td>
                    <td className="px-4 py-2"><Cell value={r.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <SectionHeader title="Tampilan & Bahasa" desc="Preferensi visual aplikasi." />
          <div className="mt-4 space-y-4">
            <Row
              icon={Moon}
              label={t(locale, "darkMode")}
              desc="Toggle tema gelap untuk seluruh aplikasi."
            >
              <Toggle
                checked={settings.darkMode}
                onChange={(v) => updateSettings({ darkMode: v })}
              />
            </Row>
            <Row label={t(locale, "language")} desc="Localization · ID/EN/JA">
              <select
                className="input w-44"
                value={settings.locale}
                onChange={(e) => updateSettings({ locale: e.target.value as Locale })}
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </Row>
          </div>
        </section>

        <section className="card">
          <SectionHeader
            icon={Bot}
            title="Telegram Binding"
            desc="Tautkan bot Telegram ke akun Google Anda."
          />
          {user?.telegramId ? (
            <div className="mt-3 rounded-md border border-success/40 bg-success/10 p-3 text-sm text-success">
              ✓ Tertaut ke Telegram ID <b>{user.telegramId}</b>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Kirim <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/start</code> ke bot
                Telegram, lalu masukkan kode 6 digit dari bot di sini.
              </p>
              <div className="mt-3 rounded-md border bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Kode demo dari bot</div>
                <div className="mt-1 font-mono text-2xl tracking-widest">{code}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  className="input"
                  placeholder="Masukkan kode 6 digit"
                  value={bindInput}
                  onChange={(e) => setBindInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <button
                  className="btn-primary"
                  disabled={bindInput !== code}
                  onClick={onBind}
                >
                  <Send className="h-4 w-4" /> Bind
                </button>
              </div>
            </>
          )}
        </section>

        <section className="card">
          <div className="flex items-center justify-between">
            <SectionHeader
              icon={Code}
              title={t(locale, "developerMode")}
              desc={
                isPremium
                  ? "Inspeksi raw payload, latency, dan custom endpoint."
                  : "Tersedia di tier Premium / Pro."
              }
              badge={!isPremium ? "Premium" : undefined}
            />
            <Toggle
              checked={devMode}
              disabled={!isPremium}
              onChange={(v) => updateSettings({ developerMode: v })}
            />
          </div>

          {devMode && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="label">Custom AI Endpoint URL</label>
                  <input
                    className="input"
                    placeholder="https://your-proxy.example.com/v1"
                    value={settings.customEndpoint ?? ""}
                    onChange={(e) => updateSettings({ customEndpoint: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Custom API Key</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="sk-…"
                    value={settings.customApiKey ?? ""}
                    onChange={(e) => updateSettings({ customApiKey: e.target.value })}
                  />
                </div>
                <button className="btn-primary" onClick={onTest}>
                  Test Connectivity
                </button>
                {testStatus && (
                  <div className="text-sm text-success">
                    <Check className="mr-1 inline h-3 w-3" /> OK · {testStatus.ms} ms
                  </div>
                )}
              </div>
              <div>
                <label className="label">Raw Request / Response</label>
                <pre className="mt-1.5 max-h-56 overflow-auto rounded-md border bg-muted/40 p-3 text-xs">
{sample}
                </pre>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <SectionHeader
            title="Status Sistem"
            desc="Toggle maintenance mode untuk memutus akses tulis."
          />
          <Row
            label="Maintenance Mode"
            desc="Mengembalikan respon 503 dari API & merender halaman Maintenance di klien."
          >
            <Toggle checked={maintenance} onChange={() => toggleMaintenance()} />
          </Row>
        </section>
      </div>
    </>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  desc,
  badge,
}: {
  icon?: LucideIcon;
  title: string;
  desc?: string;
  badge?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
        {Icon && <Icon className="h-4 w-4" />} {title}
        {badge && <span className="pill border-transparent bg-warning/15 text-warning">{badge}</span>}
      </div>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  desc,
  children,
}: {
  icon?: LucideIcon;
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t pt-4 first:border-0 first:pt-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          {Icon && <Icon className="h-4 w-4" />} {label}
        </div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={clsx(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={clsx(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}

function PlanCard({
  title,
  price,
  icon: Icon,
  bullets,
  current,
  highlight,
  onUpgrade,
}: {
  title: string;
  price: string;
  icon: LucideIcon;
  bullets: string[];
  current?: boolean;
  highlight?: boolean;
  onUpgrade?: () => void;
}) {
  return (
    <div
      className={clsx(
        "rounded-md border p-4",
        highlight && "border-primary/40 bg-primary/[0.03]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-base font-semibold">
            <Icon className="h-4 w-4" /> {title}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{price}</div>
        </div>
        {current && (
          <span className="pill border-transparent bg-success/15 text-success">Aktif</span>
        )}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 text-success" /> {b}
          </li>
        ))}
      </ul>
      {onUpgrade && (
        <button className="btn-primary mt-4 w-full" onClick={onUpgrade}>
          Upgrade ke Premium
        </button>
      )}
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-success" />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground" />;
  return <span>{value}</span>;
}
