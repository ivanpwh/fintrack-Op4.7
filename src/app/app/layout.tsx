import { Sidebar } from "@/components/Sidebar";
import { AuthGate } from "@/components/AuthGate";
import { TransactionModal } from "@/components/TransactionModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1">{children}</main>
        <TransactionModal />
      </div>
    </AuthGate>
  );
}
