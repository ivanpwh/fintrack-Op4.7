"use client";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { useApp } from "@/lib/store";
import { t, type Locale } from "@/lib/i18n";
import { Bot, Check, Code, Moon, Send, type LucideIcon } from "lucide-react";
import clsx from "clsx";

export default function SettingsPage() {
  const { settings, user } = useApp();
  const updateSettings = useApp((s) => s.updateSettings);
  const toggleMaintenance = useApp((s) => s.toggleMaintenance);
  const maintenance = useApp((s) => s.maintenance);
  const bindTelegram = useApp((s) => s.bindTelegram);
  const locale = settings.locale;

  const [code] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [bindInput, setBindInput] = useState("");
  const [testStatus, setTestStatus] = useState<null | { ok: boolean; ms: number }>(null);

  const onTest = async () => {
    setTestStatus(null);
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    setTestStatus({ ok: true, ms: Math.round(performance.now() - start) });
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
      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <section className="card">
          <h2 className="text-sm font-semibold">Tampilan & Bahasa</h2>
          <div className="mt-4 space-y-4">
            <Row icon={Moon} label={t(locale, "darkMode")} desc="Toggle tema gelap untuk seluruh aplikasi.">
              <Toggle
                checked={settings.darkMode}
                onChange={(v) => updateSettings({ darkMode: v })}
              />
            </Row>
            <Row label={t(locale, "language")} desc="Localization · ID/EN/JA">
              <select
                className="input w-40"
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
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Bot size={16} /> Telegram Binding
          </h2>
          {user?.telegramId ? (
            <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              ✓ Tertaut ke Telegram ID <b>{user.telegramId}</b>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Kirim <code>/start</code> ke bot Telegram, lalu masukkan kode 6 digit dari bot di sini.
              </p>
              <div className="mt-3 rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="label">Kode demo dari bot</div>
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
                  onClick={() => bindTelegram("tg-" + Date.now())}
                >
                  <Send size={14} /> Bind
                </button>
              </div>
            </>
          )}
        </section>

        <section className={clsx("card md:col-span-2", !isPremium && "opacity-90")}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Code size={16} /> {t(locale, "developerMode")}
              {!isPremium && <span className="pill bg-amber-100 text-amber-700">Premium</span>}
            </h2>
            <Toggle
              checked={devMode}
              disabled={!isPremium}
              onChange={(v) => updateSettings({ developerMode: v })}
            />
          </div>

          {devMode ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Custom AI Endpoint URL</label>
                <input
                  className="input mt-1"
                  placeholder="https://your-proxy.example.com/v1"
                  value={settings.customEndpoint ?? ""}
                  onChange={(e) => updateSettings({ customEndpoint: e.target.value })}
                />
                <label className="label mt-3 block">Custom API Key</label>
                <input
                  className="input mt-1"
                  type="password"
                  placeholder="sk-…"
                  value={settings.customApiKey ?? ""}
                  onChange={(e) => updateSettings({ customApiKey: e.target.value })}
                />
                <button className="btn-primary mt-3" onClick={onTest}>
                  Test Connectivity
                </button>
                {testStatus && (
                  <div className="mt-2 text-sm text-emerald-600">
                    <Check size={12} className="inline" /> OK · {testStatus.ms} ms
                  </div>
                )}
              </div>
              <div>
                <label className="label">Raw Request / Response</label>
                <pre className="mt-1 max-h-56 overflow-auto rounded-lg border p-3 text-xs" style={{ borderColor: "var(--border)" }}>
{sample}
                </pre>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              {isPremium
                ? "Aktifkan untuk melihat raw payload, latency, dan custom endpoint."
                : "Tersedia di tier Premium / Pro."}
            </p>
          )}
        </section>

        <section className="card md:col-span-2">
          <h2 className="text-sm font-semibold">Status Sistem</h2>
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
    <div className="flex items-center justify-between gap-4 border-t pt-4 first:border-0 first:pt-0" style={{ borderColor: "var(--border)" }}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          {Icon && <Icon size={14} />} {label}
        </div>
        {desc && <div className="text-xs" style={{ color: "var(--muted)" }}>{desc}</div>}
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
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={clsx(
        "relative h-6 w-11 rounded-full transition",
        checked ? "bg-brand-600" : "bg-slate-300",
        disabled && "opacity-50",
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
          checked ? "left-5" : "left-0.5",
        )}
      />
    </button>
  );
}
