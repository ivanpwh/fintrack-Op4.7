import { NextResponse } from "next/server";
import { getOrCreateDemoUser, prisma } from "@/lib/db";
import type { AccountDTO, AccountType, CreateAccountInput } from "@/lib/dto";

export const dynamic = "force-dynamic";

const VALID_TYPES: AccountType[] = ["CASH", "BANK_CARD", "INVESTMENT", "ASSET"];

type AccountRow = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
};

function toDTO(a: AccountRow): AccountDTO {
  return {
    id: a.id,
    name: a.name,
    type: a.type as AccountType,
    balance: a.balance,
    currency: a.currency,
  };
}

export async function GET() {
  const user = await getOrCreateDemoUser();
  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(accounts.map(toDTO));
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateAccountInput;
  if (!body?.name || !VALID_TYPES.includes(body.type)) {
    return NextResponse.json({ error: "Invalid account payload" }, { status: 400 });
  }
  const user = await getOrCreateDemoUser();

  if (user.tier === "free" && body.type === "INVESTMENT") {
    const count = await prisma.account.count({
      where: { userId: user.id, type: "INVESTMENT" },
    });
    if (count >= 1) {
      return NextResponse.json(
        { error: "Free tier limited to 1 investment account" },
        { status: 403 },
      );
    }
  }

  const created = await prisma.account.create({
    data: {
      userId: user.id,
      name: body.name.trim(),
      type: body.type,
      balance: Math.max(0, Math.round(body.balance ?? 0)),
      currency: body.currency || "IDR",
    },
  });
  return NextResponse.json(toDTO(created), { status: 201 });
}
