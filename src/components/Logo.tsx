import { Wallet } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-md bg-primary text-primary-foreground"
        style={{ width: size, height: size }}
      >
        <Wallet style={{ width: size * 0.6, height: size * 0.6 }} />
      </div>
      <span className="text-lg font-semibold tracking-tight">FinTrack</span>
    </div>
  );
}
