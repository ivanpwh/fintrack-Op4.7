import Link from "next/link";
import { ArrowRight, Bot, BarChart3, Shield, Sparkles, Wallet } from "lucide-react";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: Bot,
    title: "Telegram Bot Natural",
    body: "Catat transaksi cukup dengan chat. Regex + AI Gateway sebagai fallback parsing.",
  },
  {
    icon: BarChart3,
    title: "Dasbor Analitik",
    body: "Tren pemasukan/pengeluaran, kategori, dan saldo lintas akun secara real-time.",
  },
  {
    icon: Sparkles,
    title: "AI Unified Gateway",
    body: "Switch antar Gemini, GPT-4o, Claude via OpenRouter. Bawa API key sendiri di Dev Mode.",
  },
  {
    icon: Shield,
    title: "Isolasi & Keamanan",
    body: "JWT, enkripsi at-rest, dan rate limit. Decimal precision untuk nominal mata uang.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/app/pricing" className="btn-ghost">Pricing</Link>
          <Link href="/login" className="btn-primary">
            Sign in <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="pill bg-brand-100 text-brand-700">
              <Wallet size={12} /> Multi-platform · Real-time sync
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Catat keuangan tanpa hambatan.
              <span className="block text-brand-600">Telegram. Web. Mobile.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base" style={{ color: "var(--muted)" }}>
              FinTrack menyatukan pencatatan, anggaran, dan wawasan keuangan dalam satu
              sumber kebenaran berbasis PostgreSQL — lengkap dengan AI Gateway dan SSO Google.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary">Mulai gratis</Link>
              <Link href="/app/pricing" className="btn-ghost">Lihat fitur Premium</Link>
            </div>
          </div>
          <div className="card">
            <div className="mb-4 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Operational · API · Bot · Web
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Telegram</div>
                <div className="mt-1 text-sm">"Beli kopi 25rb"</div>
                <div className="mt-2 text-sm text-emerald-600">
                  ✅ Tercatat: Pengeluaran Kopi Rp25.000
                </div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Web</div>
                <div className="mt-1 text-sm">Sinkron ke dasbor & riwayat dalam 1 detik.</div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Mobile</div>
                <div className="mt-1 text-sm">Notif & dashboard kompak untuk on-the-go.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card">
              <Icon size={20} className="text-brand-600" />
              <h3 className="mt-3 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs" style={{ color: "var(--muted)" }}>
          <span>© {new Date().getFullYear()} FinTrack Platform</span>
          <Link href="/maintenance" className="hover:underline">Status</Link>
        </div>
      </footer>
    </div>
  );
}
