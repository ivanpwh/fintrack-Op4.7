"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import clsx from "clsx";
import { Dialog } from "./ui/Dialog";
import { useApp, type TxType } from "@/lib/store";
import { parseNaturalText, type ParsedTx } from "@/lib/parse";
import { formatCurrency } from "@/lib/format";
import { toast } from "@/lib/toast";

type UserMsg = { id: string; role: "user"; text: string };
type AiThinking = { id: string; role: "ai"; status: "thinking"; for: string };
type AiResult = {
  id: string;
  role: "ai";
  status: "done";
  for: string;
  parsed: ParsedTx;
};
type AiError = { id: string; role: "ai"; status: "error"; for: string };
type Msg = UserMsg | AiThinking | AiResult | AiError;

const EXAMPLES = [
  "Beli kopi 25rb",
  "Gaji 10jt",
  "Bensin 50000",
  "Transfer ke tabungan 500rb",
];

const TX_META = {
  INCOME: { label: "Income", Icon: ArrowUpRight, cls: "bg-success/15 text-success" },
  EXPENSE: { label: "Expense", Icon: ArrowDownRight, cls: "bg-destructive/15 text-destructive" },
  TRANSFER: { label: "Transfer", Icon: ArrowLeftRight, cls: "bg-info/15 text-info" },
  SAVING: { label: "Saving", Icon: PiggyBank, cls: "bg-warning/15 text-warning" },
} as const;

export function TransactionModal() {
  const open = useApp((s) => s.txModalOpen);
  const close = useApp((s) => s.closeTxModal);
  const { accounts } = useApp();
  const addTransaction = useApp((s) => s.addTransaction);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [prompt, setPrompt] = useState("");
  const [thinking, setThinking] = useState(false);

  const [type, setType] = useState<TxType>("EXPENSE");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("Umum");
  const [accountFromId, setAccountFromId] = useState(accounts[0]?.id ?? "");
  const [accountToId, setAccountToId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [editOpen, setEditOpen] = useState(false);
  const [lastSource, setLastSource] = useState<string>("");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setMessages([]);
    setPrompt("");
    setThinking(false);
    setType("EXPENSE");
    setAmount(0);
    setCategory("Umum");
    setAccountFromId(accounts[0]?.id ?? "");
    setAccountToId("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    setEditOpen(false);
    setLastSource("");
  };

  useEffect(() => {
    if (open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const askAi = async (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;

    const userMsg: UserMsg = { id: crypto.randomUUID(), role: "user", text: value };
    const thinkingMsg: AiThinking = {
      id: crypto.randomUUID(),
      role: "ai",
      status: "thinking",
      for: userMsg.id,
    };
    setMessages((m) => [...m, userMsg, thinkingMsg]);
    setPrompt("");
    setThinking(true);

    await new Promise((r) => setTimeout(r, 450 + Math.random() * 450));

    const parsed = parseNaturalText(value);
    setThinking(false);

    if (!parsed) {
      setMessages((m) =>
        m.map((x): Msg =>
          x.id === thinkingMsg.id
            ? { id: x.id, role: "ai", status: "error", for: userMsg.id }
            : x,
        ),
      );
      return;
    }

    setMessages((m) =>
      m.map((x): Msg =>
        x.id === thinkingMsg.id
          ? { id: x.id, role: "ai", status: "done", for: userMsg.id, parsed }
          : x,
      ),
    );

    setType(parsed.type);
    setAmount(parsed.amount);
    setCategory(parsed.category);
    setNotes(parsed.notes ?? value);
    setLastSource(value);
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
      rawInput: lastSource || undefined,
      date: new Date(date).toISOString(),
    });
    toast({
      title: "Transaksi tersimpan",
      description: `${category} · ${formatCurrency(amount)}`,
      variant: "success",
    });
    close();
  };

  const hasParsed = messages.some((m) => m.role === "ai" && m.status === "done");
  const accName = (id?: string) => accounts.find((a) => a.id === id)?.name ?? "—";
  const summary = useMemo(
    () => ({
      type,
      amount,
      category,
      from: accName(accountFromId),
      to: type === "TRANSFER" ? accName(accountToId) : null,
      date,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, amount, category, accountFromId, accountToId, date, accounts],
  );

  return (
    <Dialog
      open={open}
      onClose={close}
      size="lg"
      title="Tambah Transaksi"
      description="Chat dengan AI atau isi detail manual."
      footer={
        <>
          <button className="btn-ghost" onClick={close}>Batal</button>
          <button className="btn-primary" onClick={submit} disabled={!amount}>
            Simpan
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <section className="overflow-hidden rounded-xl border bg-gradient-to-br from-primary/[0.08] via-card to-card">
          <header className="flex items-center gap-3 border-b bg-gradient-to-r from-primary/10 to-transparent px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold">
                FinTrack AI
                <span className="pill border-transparent bg-success/15 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Tulis transaksi seperti chat — AI akan mengekstrak detailnya.
              </p>
            </div>
          </header>

          <div className="max-h-[40vh] min-h-[180px] space-y-3 overflow-y-auto px-4 py-4 sm:max-h-[44vh]">
            {messages.length === 0 ? (
              <div className="flex items-start gap-3">
                <AiAvatar />
                <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm">
                  Hai! Coba tulis transaksi Anda, contoh:
                  <span className="mt-1 block text-muted-foreground">
                    "Beli kopi 25rb" atau "Gaji 10jt".
                  </span>
                </div>
              </div>
            ) : (
              messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex items-start justify-end gap-3">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground shadow-sm">
                      {m.text}
                    </div>
                    <UserAvatar />
                  </div>
                ) : (
                  <div key={m.id} className="flex items-start gap-3">
                    <AiAvatar />
                    <div className="min-w-0 flex-1">
                      {m.status === "thinking" && <ThinkingBubble />}
                      {m.status === "error" && (
                        <div className="rounded-2xl rounded-tl-sm border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                          Maaf, saya belum bisa mengenali nominalnya. Sertakan angka,
                          contoh: <i>"Beli sushi 75rb"</i>.
                        </div>
                      )}
                      {m.status === "done" && <ResultBubble parsed={m.parsed} />}
                    </div>
                  </div>
                ),
              )
            )}
            <div ref={chatBottomRef} />
          </div>

          {!hasParsed && messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 border-t px-4 py-2.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => askAi(ex)}
                  className="pill border-input bg-background text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          <div className="border-t bg-card p-3">
            <div className="flex items-center gap-2">
              <input
                className="input rounded-full px-4"
                placeholder="Tulis transaksi Anda…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askAi(prompt);
                  }
                }}
                disabled={thinking}
              />
              <button
                onClick={() => askAi(prompt)}
                disabled={!prompt.trim() || thinking}
                className="btn-primary h-9 w-9 shrink-0 p-0"
                aria-label="Kirim ke AI"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border">
          <button
            type="button"
            onClick={() => setEditOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-muted/40"
          >
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground">Detail manual</span>
              {hasParsed && (
                <span className="pill border-transparent bg-success/15 text-success">
                  Auto-fill
                </span>
              )}
            </span>
            {editOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {!editOpen && (
            <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3 text-xs">
              <TypeChip type={summary.type} />
              <SummaryChip label="Nominal" value={formatCurrency(summary.amount)} bold />
              <SummaryChip label="Kategori" value={summary.category} />
              <SummaryChip label="Dari" value={summary.from} />
              {summary.to && <SummaryChip label="Ke" value={summary.to} />}
            </div>
          )}

          {editOpen && (
            <div className="grid gap-3 border-t px-4 py-4 sm:grid-cols-2">
              <Field label="Tipe">
                <select
                  className="input"
                  value={type}
                  onChange={(e) => setType(e.target.value as TxType)}
                >
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
                <input
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Field>
              <Field label="Tanggal">
                <input
                  className="input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field label={type === "TRANSFER" ? "Akun Asal" : "Akun"}>
                <select
                  className="input"
                  value={accountFromId}
                  onChange={(e) => setAccountFromId(e.target.value)}
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </Field>
              {type === "TRANSFER" && (
                <Field label="Akun Tujuan">
                  <select
                    className="input"
                    value={accountToId}
                    onChange={(e) => setAccountToId(e.target.value)}
                  >
                    <option value="">— Pilih —</option>
                    {accounts
                      .filter((a) => a.id !== accountFromId)
                      .map((a) => (
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
          )}
        </section>
      </div>
    </Dialog>
  );
}

function AiAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm shadow-primary/30">
      <Sparkles className="h-4 w-4" />
    </span>
  );
}

function UserAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
      <User className="h-4 w-4" />
    </span>
  );
}

function ThinkingBubble() {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm">
      <span className="flex gap-1">
        <Dot delay="0ms" />
        <Dot delay="120ms" />
        <Dot delay="240ms" />
      </span>
      <span className="text-muted-foreground">AI menganalisa…</span>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70"
      style={{ animationDelay: delay }}
    />
  );
}

function ResultBubble({ parsed }: { parsed: ParsedTx }) {
  const meta = TX_META[parsed.type];
  const Icon = meta.Icon;
  return (
    <div className="rounded-2xl rounded-tl-sm border bg-card px-3.5 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-2 text-success">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-medium">Terdeteksi! Detail diisi otomatis.</span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className={clsx("pill border-transparent", meta.cls)}>
          <Icon className="h-3 w-3" /> {meta.label}
        </span>
        <span className="pill-outline">{formatCurrency(parsed.amount)}</span>
        <span className="pill-outline">#{parsed.category}</span>
      </div>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className={clsx(bold && "font-semibold")}>{value}</span>
    </span>
  );
}

function TypeChip({ type }: { type: TxType }) {
  const m = TX_META[type];
  return (
    <span className={clsx("pill border-transparent", m.cls)}>
      <m.Icon className="h-3 w-3" /> {m.label}
    </span>
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
