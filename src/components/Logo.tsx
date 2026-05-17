import { Wallet } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-xl bg-brand-600 text-white"
        style={{ width: size, height: size }}
      >
        <Wallet size={size * 0.6} />
      </div>
      <span className="text-lg font-semibold tracking-tight">FinTrack</span>
    </div>
  );
}
