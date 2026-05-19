import { NextResponse } from "next/server";
import { getOrCreateDemoUser, prisma } from "@/lib/db";
import { applyBalance } from "@/lib/balance";
import type {
  CreateTransactionInput,
  TransactionDTO,
  TxType,
} from "@/lib/dto";

export const dynamic = "force-dynamic";

const VALID: TxType[] = ["INCOME", "EXPENSE", "TRANSFER", "SAVING"];

type TxRow = {
  id: string;
  type: string;
  amount: number;
  category: string;
  accountFromId: string;
  accountToId: string | null;
  date: Date;
  notes: string | null;
  rawInput: string | null;
};

function toDTO(t: TxRow): TransactionDTO {
  return {
    id: t.id,
    type: t.type as TxType,
    amount: t.amount,
    category: t.category,
    accountFromId: t.accountFromId,
    accountToId: t.accountToId,
    date: t.date.toISOString(),
    notes: t.notes,
    rawInput: t.rawInput,
  };
}

export async function GET() {
  const user = await getOrCreateDemoUser();
  const rows = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(rows.map(toDTO));
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateTransactionInput;
  if (!body || !VALID.includes(body.type) || !body.accountFromId) {
    return NextResponse.json({ error: "Invalid transaction payload" }, { status: 400 });
  }
  const amount = Math.max(0, Math.round(Number(body.amount) || 0));
  if (amount <= 0) {
    return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
  }

  const user = await getOrCreateDemoUser();

  const created = await prisma.$transaction(async (tx) => {
    const row = await tx.transaction.create({
      data: {
        userId: user.id,
        type: body.type,
        amount,
        category: body.category?.trim() || "Lainnya",
        accountFromId: body.accountFromId,
        accountToId:
          body.type === "TRANSFER" || body.type === "SAVING"
            ? body.accountToId ?? null
            : null,
        date: body.date ? new Date(body.date) : new Date(),
        notes: body.notes ?? null,
        rawInput: body.rawInput ?? null,
      },
    });
    await applyBalance(tx, body.type, body.accountFromId, body.accountToId, amount);
    return row;
  });

  return NextResponse.json(toDTO(created), { status: 201 });
}
