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
} from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";

const items = [
  { href: "/app", icon: LayoutDashboard, key: "dashboard" },
  { href: "/app/transactions", icon: Receipt, key: "transactions" },
  { href: "/app/accounts", icon: Wallet, key: "accounts" },
  { href: "/app/settings", icon: SettingsIcon, key: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const locale = useApp((s) => s.settings.locale);
  const user = useApp((s) => s.user);

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card p-4 md:flex md:flex-col">
      <div className="px-2 py-2">
        <Logo />
      </div>
      <nav className="mt-6 flex-1 space-y-1">
        {items.map(({ href, icon: Icon, key }) => {
          const active =
            href === "/app" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={clsx("nav-link", active && "active")}>
              <Icon className="h-4 w-4" />
              {t(locale, key)}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="card mt-4 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {user.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="mt-3">
            <span
              className={clsx(
                "pill",
                user.tier === "premium"
                  ? "border-transparent bg-warning/15 text-warning"
                  : "border-transparent bg-secondary text-secondary-foreground",
              )}
            >
              {user.tier === "premium" ? <Crown className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
              {t(locale, user.tier === "premium" ? "premium" : "free")}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
