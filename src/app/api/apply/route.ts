import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clubStore } from "@/lib/club";

export const runtime = "nodejs";

const photoSchema = z.string().startsWith("data:image/").max(450_000);

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  age: z.number().int().min(21).max(75),
  gender: z.enum(["woman", "man", "nonbinary"]),
  seeking: z.enum(["women", "men", "everyone"]),
  city: z.string().max(40),
  neighborhood: z.string().max(80).optional().or(z.literal("")),
  profession: z.string().max(80).optional().or(z.literal("")),
  instagram: z.string().max(60).optional().or(z.literal("")),
  prompt1: z.string().min(1).max(200),
  prompt2: z.string().min(1).max(200),
  availability: z.string().max(40).optional().or(z.literal("")),
  interests: z.string().max(300).optional().or(z.literal("")),
  vibe: z.string().max(60).optional().or(z.literal("")),
  loves: z.string().max(200).optional().or(z.literal("")),
  dealbreaker: z.string().max(200).optional().or(z.literal("")),
  /** Up to 8 photos, all public to introductions. */
  photos: z.array(photoSchema).min(1).max(8),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const p = schema.safeParse(body);
  if (!p.success) {
    return NextResponse.json({ ok: false, error: "Please check your answers and photos." }, { status: 400 });
  }
  const d = p.data;
  try {
    const { token } = await clubStore().createProfile({
      email: d.email.toLowerCase(), name: d.name, age: d.age, gender: d.gender,
      seeking: d.seeking, city: d.city, neighborhood: d.neighborhood || null,
      profession: d.profession || null, instagram: d.instagram || null,
      prompt1: d.prompt1, prompt2: d.prompt2, availability: d.availability || null,
      interests: d.interests || null, vibe: d.vibe || null,
      loves: d.loves || null, dealbreaker: d.dealbreaker || null,
      photos: JSON.stringify(d.photos),
      photo1: d.photos[0] ?? null, // lead photo kept for admin views & compatibility
      photo2: d.photos[1] ?? null,
    });
    return NextResponse.json({ ok: true, token });
  } catch (e) {
    console.error("apply error", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500 });
  }
}
