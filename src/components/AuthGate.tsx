"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const maintenance = useApp((s) => s.maintenance);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (maintenance) router.replace("/maintenance");
    else if (!user) router.replace("/login");
  }, [ready, user, maintenance, router]);

  if (!ready || !user || maintenance) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          Loading…
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
