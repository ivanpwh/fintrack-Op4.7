import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BarChart3,
  Shield,
  Sparkles,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
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
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Catat keuangan tanpa hambatan.
              <span className="block bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                Telegram. Web. Mobile.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              FinTrack menyatukan pencatatan, anggaran, dan wawasan keuangan dalam satu
              sumber kebenaran berbasis PostgreSQL — lengkap dengan AI Gateway dan SSO Google.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary">
                Mulai gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/maintenance" className="btn-ghost">
                Lihat status sistem
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <Stat label="Pengguna aktif" value="12K+" />
              <Stat label="Transaksi diproses" value="3.2M" />
              <Stat label="Uptime" value="99.9%" />
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl"
            />
            <div className="card space-y-3 p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Operational
                </span>
                <span>API · Bot · Web</span>
              </div>

              <MockRow
                channel="Telegram"
                line='"Beli kopi 25rb"'
                meta="✓ Pengeluaran · Kopi · Rp25.000"
                tone="destructive"
              />
              <MockRow
                channel="Web"
                line='"Gaji 10jt"'
                meta="✓ Income · Gaji · Rp10.000.000"
                tone="success"
              />
              <MockRow
                channel="Mobile"
                line="Sinkron ke dashboard dalam 1 detik"
                meta="Realtime via PostgreSQL"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="card transition-shadow hover:shadow-md"
            >
              <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-base font-semibold text-foreground">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function MockRow({
  channel,
  line,
  meta,
  tone,
}: {
  channel: string;
  line: string;
  meta: string;
  tone?: "success" | "destructive";
}) {
  const ToneIcon = tone === "success" ? ArrowUpRight : tone === "destructive" ? ArrowDownRight : null;
  const toneCls =
    tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="rounded-md border bg-background/40 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{channel}</div>
      <div className="mt-1 text-sm">{line}</div>
      <div className={`mt-2 flex items-center gap-1.5 text-xs ${toneCls}`}>
        {ToneIcon && <ToneIcon className="h-3 w-3" />}
        {meta}
      </div>
    </div>
  );
}
