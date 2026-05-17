"use client";
import { Eye, EyeOff, LogOut, Plus, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const { hideAmounts, locale } = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const signOut = useApp((s) => s.signOut);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur"
      style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--bg) 80%, transparent)" }}
    >
      <div className="flex items-center gap-2">
        <button className="md:hidden btn-ghost p-2">
          <Menu size={18} />
        </button>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn-ghost"
          onClick={() => updateSettings({ hideAmounts: !hideAmounts })}
          title={t(locale, hideAmounts ? "showAmount" : "hideAmount")}
        >
          {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="hidden sm:inline">
            {t(locale, hideAmounts ? "showAmount" : "hideAmount")}
          </span>
        </button>
        <Link href="/app/transactions/new" className="btn-primary">
          <Plus size={16} />
          <span className="hidden sm:inline">{t(locale, "addTransaction")}</span>
        </Link>
        <button
          className="btn-ghost"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          title={t(locale, "signOut")}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
