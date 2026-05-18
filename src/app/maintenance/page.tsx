"use client";
import Link from "next/link";
import { Wrench, Activity } from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/Logo";

export default function MaintenancePage() {
  const maintenance = useApp((s) => s.maintenance);
  const toggleMaintenance = useApp((s) => s.toggleMaintenance);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="pill-secondary">
            <Wrench className="h-3 w-3" />
            {maintenance ? "Maintenance" : "Operational"}
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {maintenance ? "Sedang Maintenance" : "Semua Sistem Berjalan"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {maintenance
            ? "Data Anda aman. Akses tulis dibatasi sementara. Estimasi selesai: ~15 menit."
            : "Tidak ada gangguan saat ini. Anda dapat melanjutkan menggunakan aplikasi."}
        </p>

        <div className="mt-6 space-y-2 text-sm">
          <StatusRow label="API Backend" ok={!maintenance} />
          <StatusRow label="Telegram Bot" ok={!maintenance} />
          <StatusRow label="AI Gateway" ok />
          <StatusRow label="Database" ok />
        </div>

        <div className="mt-6 flex justify-between">
          <Link href="/" className="btn-ghost">Kembali</Link>
          <button className="btn-primary" onClick={toggleMaintenance}>
            {maintenance ? "Akhiri Mode Demo" : "Aktifkan Mode Demo"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4" /> {label}
      </div>
      <span
        className={`pill ${
          ok
            ? "border-transparent bg-success/15 text-success"
            : "border-transparent bg-warning/15 text-warning"
        }`}
      >
        {ok ? "Operational" : "Degraded"}
      </span>
    </div>
  );
}
