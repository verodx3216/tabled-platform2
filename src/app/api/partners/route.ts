import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { venueStore } from "@/lib/venues";

export const runtime = "nodejs";

const schema = z.object({
  venueName: z.string().min(1).max(120),
  kind: z.enum(["restaurant", "cafe", "rooftop", "bar", "activity"]),
  city: z.string().min(1).max(60),
  neighborhood: z.string().max(120).optional().or(z.literal("")),
  contactName: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  instagram: z.string().max(80).optional().or(z.literal("")),
  note: z.string().max(600).optional().or(z.literal("")),
});

// TODO(handover): add rate limiting alongside the waitlist API.
export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const p = schema.safeParse(body);
  if (!p.success) return NextResponse.json({ ok: false, error: "Please check the form." }, { status: 400 });
  const d = p.data;
  try {
    await venueStore().addPartnerApp({
      venueName: d.venueName, kind: d.kind, city: d.city,
      neighborhood: d.neighborhood || null, contactName: d.contactName || null,
      email: d.email, phone: d.phone || null, instagram: d.instagram || null,
      note: d.note || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("partner app error", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500 });
  }
}
