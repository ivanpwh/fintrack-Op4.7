"use client";
import Link from "next/link";
import { Wrench, Activity } from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/Logo";

export default function MaintenancePage() {
  const maintenance = useApp((s) => s.maintenance);
  const toggleMaintenance = useApp((s) => s.toggleMaintenance);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="pill bg-amber-100 text-amber-700">
            <Wrench size={12} />
            {maintenance ? "Maintenance" : "Operational"}
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {maintenance ? "Sedang Maintenance" : "Semua Sistem Berjalan"}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
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
    <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2">
        <Activity size={14} /> {label}
      </div>
      <span className={`pill ${ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        {ok ? "Operational" : "Degraded"}
      </span>
    </div>
  );
}
