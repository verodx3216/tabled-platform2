import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { waitlistStore } from "@/lib/waitlist";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  city: z.string().max(60).optional(),
  interest: z.enum(["member", "host", "venue-partner"]).optional(),
  source: z.string().max(120).optional(),
  ref: z.string().max(20).optional(), // referral code of the member who shared their link
});

// TODO(handover): add rate limiting (Upstash Ratelimit or Vercel WAF)
// and a confirmation email via Resend — see docs/INTEGRATIONS.md #4.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  const { email, name, city, interest, source, ref } = parsed.data;
  try {
    const result = await waitlistStore().upsert({
      email: email.toLowerCase(),
      name: name ?? null,
      city: city ?? null,
      interest: interest ?? null,
      source: source ?? null,
      referredBy: ref ?? null,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("waitlist error", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500 });
  }
}
