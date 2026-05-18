"use client";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/lib/toast";

const ICONS = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
  warning: AlertTriangle,
};

const TONE = {
  default: "border-border bg-card",
  success: "border-success/40 bg-success/10 text-success-foreground",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  warning: "border-warning/40 bg-warning/10",
};

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const variant = t.variant ?? "default";
        const Icon = ICONS[variant];
        return (
          <div
            key={t.id}
            className={clsx(
              "pointer-events-auto flex items-start gap-3 rounded-md border bg-card p-3 shadow-lg animate-scale-in",
              TONE[variant],
            )}
          >
            <Icon
              className={clsx(
                "mt-0.5 h-4 w-4 shrink-0",
                variant === "success" && "text-success",
                variant === "destructive" && "text-destructive",
                variant === "warning" && "text-warning",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium leading-tight">{t.title}</div>
              {t.description && (
                <div className="mt-0.5 text-xs text-muted-foreground">{t.description}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
