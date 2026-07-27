import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clubStore } from "@/lib/club";
import { venueStore, type SlotOption } from "@/lib/venues";

export const runtime = "nodejs";

const optionSchema = z.object({
  venueId: z.string().max(60),
  venueName: z.string().max(120).optional(),
  neighborhood: z.string().max(120).nullable().optional(),
  cuisine: z.string().max(120).nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

const schema = z.object({
  action: z.enum(["state", "propose", "confirm"]),
  token: z.string().min(10).max(40),
  candidateEmail: z.string().email(),
  options: z.array(optionSchema).max(3).optional(), // propose
  option: optionSchema.optional(),                  // confirm
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const p = schema.safeParse(body);
  if (!p.success) return NextResponse.json({ ok: false, error: "Bad input" }, { status: 400 });
  const { action, token, candidateEmail } = p.data;

  const club = clubStore();
  const me = await club.getProfileByToken(token);
  if (!me) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const other = candidateEmail.toLowerCase();

  // the pair must be a mutual match
  const mutuals = await club.listMutuals();
  const meLc = me.email.toLowerCase();
  const isMutual = mutuals.some(
    (m) => (m.a.toLowerCase() === meLc && m.b.toLowerCase() === other) ||
           (m.b.toLowerCase() === meLc && m.a.toLowerCase() === other)
  );
  if (!isMutual) return NextResponse.json({ ok: false, error: "Not a mutual match." }, { status: 403 });

  const venues = venueStore();

  if (action === "state") {
    const booking = await venues.getBooking(meLc, other);
    if (booking) return NextResponse.json({ ok: true, stage: "booked", booking });
    const proposal = await venues.getProposal(meLc, other);
    if (proposal) {
      return NextResponse.json({
        ok: true,
        stage: proposal.proposer.toLowerCase() === meLc ? "waiting" : "choose",
        options: proposal.options,
      });
    }
    const avail = (await venues.availability(me.city ?? "", 14)).slice(0, 12);
    return NextResponse.json({ ok: true, stage: "propose", options: avail });
  }

  if (action === "propose") {
    const opts = p.data.options ?? [];
    if (!opts.length) return NextResponse.json({ ok: false, error: "Pick at least one option." }, { status: 400 });
    // only allow options that are genuinely available right now
    const avail = await venues.availability(me.city ?? "", 14);
    const valid = opts.filter((o) =>
      avail.some((s) => s.venueId === o.venueId && s.date === o.date && s.time === o.time)
    ) as SlotOption[];
    if (!valid.length) return NextResponse.json({ ok: false, error: "Those tables were just taken — refresh and pick again." }, { status: 409 });
    const enriched = valid.map((o) => {
      const s = avail.find((x) => x.venueId === o.venueId && x.date === o.date && x.time === o.time)!;
      return s;
    });
    await venues.setProposal(meLc, other, enriched);
    return NextResponse.json({ ok: true, stage: "waiting", options: enriched });
  }

  // confirm
  const proposal = await venues.getProposal(meLc, other);
  if (!proposal || proposal.proposer.toLowerCase() === meLc) {
    return NextResponse.json({ ok: false, error: "Nothing to confirm yet." }, { status: 409 });
  }
  const o = p.data.option;
  if (!o || !proposal.options.some((x) => x.venueId === o.venueId && x.date === o.date && x.time === o.time)) {
    return NextResponse.json({ ok: false, error: "Choose one of the proposed tables." }, { status: 400 });
  }
  const booking = await venues.claim(meLc, other, { venueId: o.venueId, date: o.date, time: o.time });
  if (!booking) {
    return NextResponse.json({ ok: false, error: "That table was just taken — ask for fresh options." }, { status: 409 });
  }
  return NextResponse.json({ ok: true, stage: "booked", booking });
}
