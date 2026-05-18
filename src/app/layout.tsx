import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FinTrack — Pencatatan Keuangan Lintas Perangkat",
  description:
    "FinTrack: catat transaksi via Telegram, Web, dan Mobile. Dasbor analitik, AI parsing, dan akun terpadu.",
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
