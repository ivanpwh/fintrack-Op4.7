"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";
import { toast } from "@/lib/toast";
import { Toaster } from "@/components/ui/Toaster";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useApp((s) => s.signIn);

  const handleGoogle = () => {
    signIn({
      id: "u1",
      email: "demo@fintrack.app",
      displayName: "Demo User",
      tier: "free",
    });
    toast({ title: "Selamat datang", description: "Demo User · Free tier", variant: "success" });
    router.replace("/app");
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_60%)]"
      />
      <div className="card w-full max-w-md shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Logo size={36} />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Masuk ke FinTrack</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gunakan akun Google untuk sinkronisasi lintas Web, Mobile, dan Telegram.
          </p>
        </div>

        <button onClick={handleGoogle} className="btn-ghost mt-6 w-full">
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          atau
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">Mode demo</div>
          <p className="mt-1">
            Autentikasi disimulasikan tanpa OAuth. Data tersimpan di browser Anda.
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">← Kembali ke beranda</Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z"
      />
    </svg>
  );
}
