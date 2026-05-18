"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";

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
    router.replace("/app");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="card w-full max-w-md">
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

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Demo mode — autentikasi disimulasikan tanpa OAuth.
          <br />
          <Link href="/" className="hover:text-foreground">Kembali</Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z" />
    </svg>
  );
}
