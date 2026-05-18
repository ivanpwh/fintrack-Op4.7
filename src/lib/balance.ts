import type { Prisma, PrismaClient } from "@prisma/client";
import type { TxType } from "./dto";

type TxClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export async function applyBalance(
  tx: TxClient | Prisma.TransactionClient,
  type: TxType,
  fromId: string,
  toId: string | null | undefined,
  amount: number,
  reverse = false,
) {
  const sign = reverse ? -1 : 1;
  switch (type) {
    case "INCOME":
      await tx.account.update({
        where: { id: fromId },
        data: { balance: { increment: sign * amount } },
      });
      break;
    case "EXPENSE":
      await tx.account.update({
        where: { id: fromId },
        data: { balance: { decrement: sign * amount } },
      });
      break;
    case "TRANSFER":
    case "SAVING":
      await tx.account.update({
        where: { id: fromId },
        data: { balance: { decrement: sign * amount } },
      });
      if (toId) {
        await tx.account.update({
          where: { id: toId },
          data: { balance: { increment: sign * amount } },
        });
      }
      break;
  }
}
