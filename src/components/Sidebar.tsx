"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Settings as SettingsIcon,
  Crown,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { Logo } from "./Logo";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

const items = [
  { href: "/app", icon: LayoutDashboard, key: "dashboard" },
  { href: "/app/transactions", icon: Receipt, key: "transactions" },
  { href: "/app/accounts", icon: Wallet, key: "accounts" },
  { href: "/app/settings", icon: SettingsIcon, key: "settings" },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const locale = useApp((s) => s.settings.locale);
  const user = useApp((s) => s.user);

  return (
    <div className="flex h-full flex-col">
      <div className="px-2 py-2">
        <Logo />
      </div>
      <nav className="mt-6 flex-1 space-y-1">
        {items.map(({ href, icon: Icon, key }) => {
          const active = href === "/app" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={clsx("nav-link", active && "active")}
            >
              <Icon className="h-4 w-4" />
              {t(locale, key)}
            </Link>
          );
        })}
      </nav>

      {user?.tier === "free" && (
        <Link
          href="/app/settings"
          onClick={onNavigate}
          className="mb-3 rounded-md border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-3 text-sm transition-colors hover:from-primary/15"
        >
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4" /> Upgrade ke Premium
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            OCR scan, multi-currency, dan AI insight mingguan.
          </p>
        </Link>
      )}

      {user && (
        <div className="rounded-md border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user.displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user.displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
            <span
              className={clsx(
                "pill",
                user.tier === "premium"
                  ? "border-transparent bg-warning/15 text-warning"
                  : "border-transparent bg-secondary text-secondary-foreground",
              )}
            >
              {user.tier === "premium" ? (
                <Crown className="h-3 w-3" />
              ) : (
                <ShieldAlert className="h-3 w-3" />
              )}
              {t(locale, user.tier === "premium" ? "premium" : "free")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const open = useApp((s) => s.mobileNavOpen);
  const setOpen = useApp((s) => s.setMobileNav);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card p-4 md:flex md:flex-col">
        <SidebarBody />
      </aside>

      <div
        className={clsx(
          "fixed inset-0 z-40 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-72 border-r bg-card p-4 shadow-xl transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}
