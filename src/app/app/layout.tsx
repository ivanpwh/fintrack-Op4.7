import { Sidebar } from "@/components/Sidebar";
import { AuthGate } from "@/components/AuthGate";
import { TransactionModal } from "@/components/TransactionModal";
import { Toaster } from "@/components/ui/Toaster";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <main className="flex min-h-screen flex-1 flex-col">{children}</main>
        <TransactionModal />
        <Toaster />
      </div>
    </AuthGate>
  );
}
