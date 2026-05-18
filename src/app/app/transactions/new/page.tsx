"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { useApp, type TxType } from "@/lib/store";
import { parseNaturalText } from "@/lib/parse";
import { formatCurrency } from "@/lib/format";
import { Sparkles } from "lucide-react";

export default function NewTransactionPage() {
  const router = useRouter();
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

  const runParse = () => {
    const p = parseNaturalText(smart);
    if (!p) return;
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
    router.push("/app/transactions");
  };

  return (
    <>
      <Topbar title="Tambah Transaksi" />
      <div className="grid gap-4 p-4 md:grid-cols-3 md:p-6">
        <div className="card md:col-span-2">
          <h2 className="text-sm font-semibold">Form Manual</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Tipe</label>
              <select
                className="input mt-1"
                value={type}
                onChange={(e) => setType(e.target.value as TxType)}
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="TRANSFER">Transfer</option>
                <option value="SAVING">Saving</option>
              </select>
            </div>
            <div>
              <label className="label">Nominal</label>
              <input
                className="input mt-1"
                inputMode="numeric"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")))}
                placeholder="0"
              />
              <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                {formatCurrency(amount)}
              </div>
            </div>
            <div>
              <label className="label">Kategori</label>
              <input className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <label className="label">Tanggal</label>
              <input className="input mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="label">Akun {type === "TRANSFER" ? "Asal" : ""}</label>
              <select className="input mt-1" value={accountFromId} onChange={(e) => setAccountFromId(e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {type === "TRANSFER" && (
              <div>
                <label className="label">Akun Tujuan</label>
                <select className="input mt-1" value={accountToId} onChange={(e) => setAccountToId(e.target.value)}>
                  <option value="">— Pilih —</option>
                  {accounts.filter((a) => a.id !== accountFromId).map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="label">Catatan</label>
              <textarea className="input mt-1" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => router.back()}>Batal</button>
            <button className="btn-primary" onClick={submit} disabled={!amount}>
              Simpan
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} className="text-brand-600" /> Smart Input (AI Parsing)
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Tulis bebas seperti chat ke Telegram. Sistem mengekstrak jenis, nominal & kategori.
          </p>
          <textarea
            className="input mt-3"
            rows={4}
            placeholder='Contoh: "Beli kopi 25rb" atau "Gaji 10jt"'
            value={smart}
            onChange={(e) => setSmart(e.target.value)}
          />
          <button className="btn-primary mt-3 w-full" onClick={runParse} disabled={!smart.trim()}>
            <Sparkles size={14} /> Parse
          </button>
          <div className="mt-3 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--border)" }}>
            <div className="label mb-1">Preview</div>
            <div>Tipe: <b>{type}</b></div>
            <div>Nominal: <b>{formatCurrency(amount)}</b></div>
            <div>Kategori: <b>{category}</b></div>
          </div>
        </div>
      </div>
    </>
  );
}
