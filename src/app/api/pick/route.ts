import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clubStore } from "@/lib/club";

export const runtime = "nodejs";

const schema = z.object({ token: z.string().min(10).max(40), candidateEmail: z.string().email() });

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const p = schema.safeParse(body);
  if (!p.success) return NextResponse.json({ ok: false }, { status: 400 });
  const store = clubStore();
  const me = await store.getProfileByToken(p.data.token);
  if (!me) return NextResponse.json({ ok: false, error: "Unknown member." }, { status: 403 });
  // only allow picking someone actually in your intro set
  const intros = await store.getIntrosFor(me.email);
  if (!intros.some(i => i.candidateEmail === p.data.candidateEmail)) {
    return NextResponse.json({ ok: false, error: "Not in your introductions." }, { status: 403 });
  }
  const { mutual } = await store.recordPick(me.email, p.data.candidateEmail);
  return NextResponse.json({ ok: true, mutual });
}
