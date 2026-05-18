"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Dialog } from "./ui/Dialog";
import { useApp, type TxType } from "@/lib/store";
import { parseNaturalText } from "@/lib/parse";
import { formatCurrency } from "@/lib/format";
import { toast } from "@/lib/toast";

export function TransactionModal() {
  const open = useApp((s) => s.txModalOpen);
  const close = useApp((s) => s.closeTxModal);
  const { accounts } = useApp();
  const addTransaction = useApp((s) => s.addTransaction);

  const [smart, setSmart] = useState("");
  const [type, setType] = useState<TxType>("EXPENSE");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("Umum");
  const [accountFromId, setAccountFromId] = useState(accounts[0]?.id ?? "");
  const [accountToId, setAccountToId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (open) {
      setSmart("");
      setType("EXPENSE");
      setAmount(0);
      setCategory("Umum");
      setAccountFromId(accounts[0]?.id ?? "");
      setAccountToId("");
      setNotes("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open, accounts]);

  const runParse = () => {
    const p = parseNaturalText(smart);
    if (!p) {
      toast({
        title: "Tidak terdeteksi",
        description: "Sertakan nominal, mis. \"Beli kopi 25rb\".",
        variant: "warning",
      });
      return;
    }
    setType(p.type);
    setAmount(p.amount);
    setCategory(p.category);
    setNotes(p.notes ?? "");
  };

  const submit = () => {
    if (!accountFromId || !amount) return;
    addTransaction({
      type,
      amount,
      category,
      accountFromId,
      accountToId: type === "TRANSFER" ? accountToId || undefined : undefined,
      notes: notes || undefined,
      rawInput: smart || undefined,
      date: new Date(date).toISOString(),
    });
    toast({
      title: "Transaksi tersimpan",
      description: `${category} · ${formatCurrency(amount)}`,
      variant: "success",
    });
    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Tambah Transaksi"
      description="Catat pemasukan, pengeluaran, transfer, atau tabungan."
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" /> Smart Input (AI Parsing)
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder='Contoh: "Beli kopi 25rb" atau "Gaji 10jt"'
              value={smart}
              onChange={(e) => setSmart(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runParse()}
            />
            <button className="btn-secondary" onClick={runParse} disabled={!smart.trim()}>
              Parse
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tipe">
            <select className="input" value={type} onChange={(e) => setType(e.target.value as TxType)}>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
              <option value="SAVING">Saving</option>
            </select>
          </Field>
          <Field label="Nominal" hint={formatCurrency(amount)}>
            <input
              className="input"
              inputMode="numeric"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")))}
              placeholder="0"
            />
          </Field>
          <Field label="Kategori">
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </Field>
          <Field label="Tanggal">
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label={type === "TRANSFER" ? "Akun Asal" : "Akun"}>
            <select className="input" value={accountFromId} onChange={(e) => setAccountFromId(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </Field>
          {type === "TRANSFER" && (
            <Field label="Akun Tujuan">
              <select className="input" value={accountToId} onChange={(e) => setAccountToId(e.target.value)}>
                <option value="">— Pilih —</option>
                {accounts.filter((a) => a.id !== accountFromId).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </Field>
          )}
          <div className="sm:col-span-2">
            <Field label="Catatan">
              <textarea
                className="input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button className="btn-ghost" onClick={close}>Batal</button>
          <button className="btn-primary" onClick={submit} disabled={!amount}>
            Simpan
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
