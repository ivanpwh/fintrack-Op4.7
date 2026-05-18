"use client";
import { Eye, EyeOff, LogOut, Plus, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const { hideAmounts, locale } = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const signOut = useApp((s) => s.signOut);
  const openTxModal = useApp((s) => s.openTxModal);
  const setMobileNav = useApp((s) => s.setMobileNav);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="btn-ghost h-9 w-9 p-0 md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileNav(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="hidden text-xs text-muted-foreground sm:block">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost"
            onClick={() => updateSettings({ hideAmounts: !hideAmounts })}
            title={t(locale, hideAmounts ? "showAmount" : "hideAmount")}
            aria-label={t(locale, hideAmounts ? "showAmount" : "hideAmount")}
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden lg:inline">
              {t(locale, hideAmounts ? "showAmount" : "hideAmount")}
            </span>
          </button>
          <button onClick={openTxModal} className="btn-primary">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t(locale, "addTransaction")}</span>
          </button>
          <button
            className="btn-ghost h-9 w-9 p-0"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            title={t(locale, "signOut")}
            aria-label={t(locale, "signOut")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
