import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "FinTrack — Pencatatan Keuangan Lintas Perangkat",
    template: "%s · FinTrack",
  },
  description:
    "FinTrack: catat transaksi via Telegram, Web, dan Mobile. Dasbor analitik, AI parsing, dan akun terpadu.",
  applicationName: "FinTrack",
  appleWebApp: { title: "FinTrack", capable: true, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#022c22" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
