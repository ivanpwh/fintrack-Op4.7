import { NextResponse } from "next/server";
import { getOrCreateDemoUser, prisma } from "@/lib/db";
import { applyBalance } from "@/lib/balance";
import type { TxType } from "@/lib/dto";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const user = await getOrCreateDemoUser();
  const existing = await prisma.transaction.findFirst({
    where: { id: ctx.params.id, userId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await applyBalance(
      tx,
      existing.type as TxType,
      existing.accountFromId,
      existing.accountToId,
      existing.amount,
      /* reverse */ true,
    );
    await tx.transaction.delete({ where: { id: existing.id } });
  });

  return NextResponse.json({ ok: true });
}
