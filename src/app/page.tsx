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
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/login" className="btn-primary">
            Mulai gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="pill-secondary">
              <Wallet className="h-3 w-3" /> Multi-platform · Real-time sync
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Catat keuangan tanpa hambatan.
              <span className="block text-muted-foreground">Telegram. Web. Mobile.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              FinTrack menyatukan pencatatan, anggaran, dan wawasan keuangan dalam satu
              sumber kebenaran berbasis PostgreSQL — lengkap dengan AI Gateway dan SSO Google.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary">Mulai gratis</Link>
              <Link href="/maintenance" className="btn-ghost">Lihat status sistem</Link>
            </div>
          </div>
          <div className="card">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              Operational · API · Bot · Web
            </div>
            <div className="space-y-3">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Telegram</div>
                <div className="mt-1 text-sm">"Beli kopi 25rb"</div>
                <div className="mt-2 text-sm text-success">
                  ✓ Tercatat: Pengeluaran Kopi Rp25.000
                </div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Web</div>
                <div className="mt-1 text-sm">Sinkron ke dasbor & riwayat dalam 1 detik.</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Mobile</div>
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
              <Icon className="h-5 w-5" />
              <h3 className="mt-3 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} FinTrack Platform</span>
          <Link href="/maintenance" className="hover:text-foreground">Status</Link>
        </div>
      </footer>
    </div>
  );
}
