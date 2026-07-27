import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clubStore } from "@/lib/club";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string(), // ADMIN_TOKEN
  memberEmail: z.string().email(),
  candidates: z.array(z.string().email()).min(1).max(9),
  week: z.string().max(20),
  notes: z.record(z.string().max(300)).optional(), // candidateEmail -> matchmaker note (shown to both members)
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const p = schema.safeParse(body);
  if (!p.success) return NextResponse.json({ ok: false, error: "Bad input" }, { status: 400 });
  if (!process.env.ADMIN_TOKEN || p.data.token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 });
  }
  const notes = p.data.notes
    ? Object.fromEntries(Object.entries(p.data.notes).map(([k, v]) => [k.toLowerCase(), v]))
    : undefined;
  await clubStore().assignIntros(p.data.memberEmail.toLowerCase(), p.data.candidates.map(c => c.toLowerCase()), p.data.week, notes);
  return NextResponse.json({ ok: true });
}
