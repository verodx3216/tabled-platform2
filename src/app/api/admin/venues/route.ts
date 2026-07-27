import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { venueStore } from "@/lib/venues";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string(),
  name: z.string().min(1).max(120),
  city: z.string().min(1).max(60),
  neighborhood: z.string().max(120).optional().or(z.literal("")),
  cuisine: z.string().max(120).optional().or(z.literal("")),
  days: z.string().min(3).max(60),      // "tue,wed,thu"
  times: z.string().min(4).max(80),     // "18:30,20:30"
  tablesPerSlot: z.number().int().min(1).max(10),
  leadHours: z.number().int().min(2).max(168),
  contact: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
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
  const d = p.data;
  const id = await venueStore().addVenue({
    name: d.name, city: d.city, neighborhood: d.neighborhood || null,
    cuisine: d.cuisine || null, days: d.days.toLowerCase(), times: d.times,
    tablesPerSlot: d.tablesPerSlot, leadHours: d.leadHours,
    contact: d.contact || null, notes: d.notes || null,
  });
  return NextResponse.json({ ok: true, id });
}
