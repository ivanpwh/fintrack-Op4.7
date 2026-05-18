"use client";
import { Topbar } from "@/components/Topbar";
import { useApp } from "@/lib/store";
import { Check, Crown, X } from "lucide-react";
import clsx from "clsx";

const ROWS = [
  { label: "Catat Transaksi", free: "50 / bulan", premium: "Unlimited" },
  { label: "Riwayat & Filter", free: "Dasar", premium: "Lanjutan + Export" },
  { label: "Dashboard Chart", free: "Ringkas", premium: "Lengkap" },
  { label: "Akun Aset", free: "1", premium: "Unlimited" },
  { label: "AI Parsing", free: "Regex + Fallback", premium: "High-tier Model" },
  { label: "OCR Scan Struk", free: false, premium: true },
  { label: "Multi-Currency", free: false, premium: true },
  { label: "Developer Mode", free: false, premium: true },
  { label: "Iklan / Banner", free: "Mungkin Tampil", premium: "Tidak Ada" },
];

export default function PricingPage() {
  const user = useApp((s) => s.user);
  const upgrade = useApp((s) => s.upgrade);

  return (
    <>
      <Topbar title="Pricing" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Plan
            title="Free"
            price="Rp 0"
            sub="Untuk mulai mencatat keuangan harian."
            ctaLabel={user?.tier === "free" ? "Plan saat ini" : "Downgrade"}
            ctaDisabled
            bullets={[
              "Pencatatan & dashboard dasar",
              "1 akun investasi",
              "AI parsing Regex + fallback",
            ]}
            current={user?.tier === "free"}
          />
          <Plan
            title="Premium"
            price="Rp 49.000"
            sub="per bulan · Aktifkan semua fitur lanjutan."
            highlight
            ctaLabel={user?.tier === "premium" ? "Aktif" : "Upgrade sekarang"}
            ctaDisabled={user?.tier === "premium"}
            onClick={upgrade}
            bullets={[
              "OCR Scan struk & Multi-currency",
              "AI Financial Advisor mingguan",
              "Unlimited akun & export",
              "Developer Mode (custom API key)",
            ]}
            current={user?.tier === "premium"}
          />
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--muted)" }}>
                <th className="px-4 py-3">Fitur</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3">Premium</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 font-medium">{r.label}</td>
                  <td className="px-4 py-3"><Cell value={r.free} /></td>
                  <td className="px-4 py-3"><Cell value={r.premium} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check size={16} className="text-emerald-600" />;
  if (value === false) return <X size={16} className="text-rose-500" />;
  return <span>{value}</span>;
}

function Plan({
  title,
  price,
  sub,
  bullets,
  ctaLabel,
  ctaDisabled,
  onClick,
  highlight,
  current,
}: {
  title: string;
  price: string;
  sub: string;
  bullets: string[];
  ctaLabel: string;
  ctaDisabled?: boolean;
  onClick?: () => void;
  highlight?: boolean;
  current?: boolean;
}) {
  return (
    <div className={clsx("card relative", highlight && "border-brand-500 ring-1 ring-brand-500")}>
      {highlight && (
        <span className="pill absolute -top-3 left-5 bg-brand-600 text-white">
          <Crown size={12} /> Recommended
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {current && <span className="pill bg-emerald-100 text-emerald-700">Saat ini</span>}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{price}</div>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{sub}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <Check size={14} className="text-emerald-600" /> {b}
          </li>
        ))}
      </ul>
      <button
        className={clsx("mt-5 w-full", highlight ? "btn-primary" : "btn-ghost")}
        onClick={onClick}
        disabled={ctaDisabled}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
