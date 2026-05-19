import { NextResponse } from "next/server";
import { parseNaturalText } from "@/lib/parse";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { text } = (await req.json()) as { text?: string };
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }
  const start = Date.now();
  const parsed = parseNaturalText(text);
  const latency = Date.now() - start;

  return NextResponse.json({
    parsed,
    model: "fintrack-regex-v1",
    latencyMs: latency,
  });
}
