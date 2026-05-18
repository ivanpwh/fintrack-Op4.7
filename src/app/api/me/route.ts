import { NextResponse } from "next/server";
import { getOrCreateDemoUser, prisma } from "@/lib/db";
import type { MeDTO } from "@/lib/dto";

export const dynamic = "force-dynamic";

function toDTO(u: Awaited<ReturnType<typeof getOrCreateDemoUser>>): MeDTO {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    tier: u.tier === "premium" ? "premium" : "free",
    telegramId: u.telegramId,
  };
}

export async function GET() {
  const user = await getOrCreateDemoUser();
  return NextResponse.json(toDTO(user));
}

export async function PATCH(req: Request) {
  const body = (await req.json()) as Partial<{
    tier: "free" | "premium";
    telegramId: string | null;
    displayName: string;
  }>;
  const user = await getOrCreateDemoUser();
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      tier: body.tier,
      telegramId: body.telegramId,
      displayName: body.displayName,
    },
  });
  return NextResponse.json(toDTO(updated));
}
