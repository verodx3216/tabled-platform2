import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clubStore } from "@/lib/club";
import { aiEnabled, whyThemNote } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60; // note generation fans out to the Claude API

const schema = z.object({
  token: z.string(), // ADMIN_TOKEN
  memberEmail: z.string().email(),
  candidates: z.array(z.string().email()).min(1).max(9),
  week: z.string().max(20),
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
  const store = clubStore();
  const member = p.data.memberEmail.toLowerCase();
  const candidates = p.data.candidates.map((c) => c.toLowerCase());
  await store.assignIntros(member, candidates, p.data.week);

  // Stage-2 matchmaking: Claude writes a personal "why them" note for BOTH
  // directions of every intro. Best-effort — assignment never fails on notes.
  let notes = 0;
  if (aiEnabled()) {
    const profiles = await store.listProfiles();
    const byEmail = new Map(profiles.map((pr) => [pr.email, pr]));
    const me = byEmail.get(member);
    if (me) {
      await Promise.all(
        candidates.flatMap((c) => {
          const cand = byEmail.get(c);
          if (!cand) return [];
          return [
            whyThemNote(me, cand).then(async (n) => {
              if (n) { await store.setIntroNote(member, c, n); notes++; }
            }),
            whyThemNote(cand, me).then(async (n) => {
              if (n) { await store.setIntroNote(c, member, n); notes++; }
            }),
          ];
        })
      );
    }
  }
  return NextResponse.json({ ok: true, notes, ai: aiEnabled() });
}
