import { NextRequest, NextResponse } from "next/server";
import { clubStore, type Profile } from "@/lib/club";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * AI matchmaker co-pilot (admin only).
 * Given a member, ranks eligible candidates with a written rationale using the
 * Anthropic API. The admin reviews/edits before assigning — AI proposes,
 * a human disposes. Requires ANTHROPIC_API_KEY (Vercel env var).
 *
 * TODO(handover): Stage B — feed post-date feedback into this ranking prompt;
 * Stage C — replace prompt-ranking with learned scoring once outcome data exists.
 */

const PLURAL: Record<string, string> = { woman: "women", man: "men" };

function wants(seeker: Profile, other: Profile): boolean {
  if (!seeker.seeking || seeker.seeking === "everyone") return true;
  return seeker.seeking === PLURAL[other.gender ?? ""];
}

function eligibleFor(member: Profile, all: Profile[]): Profile[] {
  const sameCity = (a?: string | null, b?: string | null) =>
    (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
  let pool = all.filter(
    (c) => c.email !== member.email && wants(member, c) && wants(c, member)
  );
  const local = pool.filter((c) => sameCity(c.city, member.city));
  if (local.length >= 2) pool = local; // relax city only when the local pool is tiny
  return pool;
}

function profileLine(p: Profile): string {
  return [
    `email: ${p.email}`,
    `name: ${p.name}, ${p.age}, ${p.gender}, seeking ${p.seeking}`,
    `city: ${p.city}${p.neighborhood ? " / " + p.neighborhood : ""}`,
    p.profession ? `profession: ${p.profession}` : null,
    p.prompt1 ? `ideal Friday: ${p.prompt1}` : null,
    p.prompt2 ? `looking for: ${p.prompt2}` : null,
    p.availability ? `available: ${p.availability}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

export async function POST(req: NextRequest) {
  let body: { token?: string; memberEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || body.token !== expected) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "AI matchmaker not configured — add ANTHROPIC_API_KEY in Vercel env vars." },
      { status: 501 }
    );
  }
  const memberEmail = (body.memberEmail ?? "").trim().toLowerCase();
  if (!memberEmail) {
    return NextResponse.json({ ok: false, error: "memberEmail required" }, { status: 400 });
  }

  const store = clubStore();
  const all = await store.listProfiles();
  const member = all.find((p) => p.email.toLowerCase() === memberEmail);
  if (!member) {
    return NextResponse.json({ ok: false, error: "No profile with that email." }, { status: 404 });
  }
  const pool = eligibleFor(member, all);
  if (pool.length === 0) {
    return NextResponse.json({ ok: false, error: "No eligible candidates yet (check city / seeking compatibility)." }, { status: 404 });
  }

  const prompt = `You are the matchmaker for Tabled, a members' dining club where mutual picks
become real dinners for two. Rank the best introductions for this member. Judge like a great
human matchmaker: shared energy in their written answers, complementary lifestyles, availability
overlap, sensible age fit, neighborhood practicality. Substance over surface.

MEMBER:
${profileLine(member)}

CANDIDATES:
${pool.map(profileLine).join("\n")}

Reply with ONLY a JSON array (no prose, no markdown fences) of at most 9 objects, best first:
[{"email":"...","reason":"one warm, specific sentence addressed to the pair — start with \\"You both\\" or similar, cite one real detail from EACH profile, never mention emails or use third-person names"}]
These sentences are shown to both members as their matchmaker's note, so make each one feel
hand-written and true — no flattery you can't back up with their own words.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.MATCHMAKER_MODEL ?? "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("anthropic error", res.status, detail.slice(0, 300));
    return NextResponse.json({ ok: false, error: `AI request failed (${res.status}).` }, { status: 502 });
  }
  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const text = (data.content ?? []).map((c) => c.text ?? "").join("");
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) {
    return NextResponse.json({ ok: false, error: "AI returned an unexpected format — try again." }, { status: 502 });
  }
  let ranked: Array<{ email: string; reason: string }>;
  try {
    ranked = JSON.parse(text.slice(start, end + 1));
  } catch {
    return NextResponse.json({ ok: false, error: "AI returned invalid JSON — try again." }, { status: 502 });
  }

  const byEmail = new Map(pool.map((p) => [p.email.toLowerCase(), p]));
  const suggestions = ranked
    .filter((r) => r && typeof r.email === "string" && byEmail.has(r.email.toLowerCase()))
    .slice(0, 9)
    .map((r) => {
      const p = byEmail.get(r.email.toLowerCase())!;
      return { email: p.email, name: p.name, age: p.age, reason: String(r.reason ?? "") };
    });

  if (suggestions.length === 0) {
    return NextResponse.json({ ok: false, error: "AI produced no valid candidates — try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, member: member.email, poolSize: pool.length, suggestions });
}
