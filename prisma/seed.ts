import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log("Seeding database…");

  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "demo@fintrack.app",
      displayName: "Demo User",
      tier: "free",
    },
  });

  const bca = await prisma.account.create({
    data: { userId: user.id, name: "BCA", type: "BANK_CARD", balance: 12_450_000 },
  });
  const cash = await prisma.account.create({
    data: { userId: user.id, name: "Cash", type: "CASH", balance: 850_000 },
  });
  const inv = await prisma.account.create({
    data: { userId: user.id, name: "Reksadana", type: "INVESTMENT", balance: 25_000_000 },
  });

  const txs: Array<{
    type: string;
    amount: number;
    category: string;
    accountFromId: string;
    accountToId?: string;
    date: Date;
    notes?: string;
    rawInput?: string;
  }> = [
    { type: "INCOME", amount: 10_000_000, category: "Gaji", accountFromId: bca.id, date: daysAgo(20), notes: "Gaji bulanan" },
    { type: "EXPENSE", amount: 25_000, category: "Kopi", accountFromId: cash.id, date: daysAgo(18), rawInput: "Beli kopi 25rb" },
    { type: "EXPENSE", amount: 350_000, category: "Belanja", accountFromId: bca.id, date: daysAgo(14) },
    { type: "TRANSFER", amount: 1_000_000, category: "Transfer", accountFromId: bca.id, accountToId: inv.id, date: daysAgo(10) },
    { type: "EXPENSE", amount: 75_000, category: "Transport", accountFromId: cash.id, date: daysAgo(7) },
    { type: "EXPENSE", amount: 220_000, category: "Makan", accountFromId: bca.id, date: daysAgo(5) },
    { type: "INCOME", amount: 500_000, category: "Bonus", accountFromId: bca.id, date: daysAgo(3) },
    { type: "EXPENSE", amount: 45_000, category: "Kopi", accountFromId: cash.id, date: daysAgo(1) },
  ];

  for (const tx of txs) {
    await prisma.transaction.create({ data: { ...tx, userId: user.id } });
  }

  console.log(
    `Seeded user ${user.email} with ${txs.length} transactions across 3 accounts.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
