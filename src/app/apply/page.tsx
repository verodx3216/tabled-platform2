"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { cityNamesAlpha, comingSoon } from "@/content/cities";

/**
 * Founding member application. On success the member is redirected straight
 * into their personal member page (/me/<token>) — the token IS their login.
 * Photos: up to 8, resized client-side to ~800px JPEG, sent as data URLs.
 * All photos are public to the member's introductions — nothing is hidden.
 */

const INTEREST_OPTIONS = [
  "Fine dining", "Cocktails", "Wine", "Coffee culture", "Live music",
  "Art & museums", "Travel", "Fitness", "Outdoors", "Books",
  "Film & TV", "Cooking", "Dancing", "Dogs", "Foodie adventures", "Sports",
];

const VIBE_OPTIONS = [
  "Warm & easygoing", "Life of the table", "Dry wit",
  "Deep conversations", "Quiet confidence", "Spontaneous",
];

const MAX_PHOTOS = 8;

async function resizeToDataUrl(file: File, maxDim = 800, quality = 0.75): Promise<string> {
  const img = document.createElement("img");
  const url = URL.createObjectURL(file);
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function Apply() {
  const [form, setForm] = useState({
    name: "", email: "", age: "", gender: "woman", seeking: "men",
    city: "Raleigh", neighborhood: "", profession: "", instagram: "",
    prompt1: "", prompt2: "", loves: "", dealbreaker: "", vibe: "",
    availability: [] as string[],
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function toggleInterest(i: string) {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : prev.length >= 5 ? prev : [...prev, i]
    );
  }

  async function onPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError("");
    const next = [...photos];
    for (const f of files) {
      if (next.length >= MAX_PHOTOS) break;
      try {
        const data = await resizeToDataUrl(f);
        if (data.length > 400_000) continue; // skip oversized results quietly
        next.push(data);
      } catch { /* skip unreadable file */ }
    }
    setPhotos(next);
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (photos.length === 0) { setError("Add at least one photo."); return; }
    setState("loading"); setError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, age: Number(form.age),
          availability: form.availability.join(","),
          interests: interests.join(","),
          photos,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = `/me/${data.token}`;
      } else { setState("error"); setError(data.error ?? "Something went wrong."); }
    } catch { setState("error"); setError("Network error — please try again."); }
  }

  const input = "w-full rounded-2xl border border-rose/40 bg-white px-5 py-3 text-ink outline-none focus:border-berry";
  const label = "mb-1 mt-5 block text-sm font-semibold text-berryDark";

  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
      </nav>
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">Founding application</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-berryDark">Two minutes. Real answers.</h1>
        <p className="mt-3 text-ink/75">
          This is how we curate your table and your introductions. Honest beats impressive.
        </p>

        <form onSubmit={submit} className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <label className={label}>Your name</label>
          <input className={input} required value={form.name} onChange={e => set("name", e.target.value)} />

          <label className={label}>Email</label>
          <input className={input} type="email" required value={form.email} onChange={e => set("email", e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Age</label>
              <input className={input} type="number" min={21} max={75} required value={form.age} onChange={e => set("age", e.target.value)} />
            </div>
            <div>
              <label className={label}>City</label>
              <select className={input} value={form.city} onChange={e => set("city", e.target.value)}>
                {cityNamesAlpha.map(c => <option key={c}>{c}</option>)}
                {comingSoon.map(c => <option key={c} value={c}>{c} (coming soon)</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>I am</label>
              <select className={input} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="woman">A woman</option><option value="man">A man</option><option value="nonbinary">Non-binary</option>
              </select>
            </div>
            <div>
              <label className={label}>Interested in meeting</label>
              <select className={input} value={form.seeking} onChange={e => set("seeking", e.target.value)}>
                <option value="men">Men</option><option value="women">Women</option><option value="everyone">Everyone</option>
              </select>
            </div>
          </div>

          <label className={label}>Neighborhood</label>
          <input className={input} value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} placeholder="e.g. North Hills" />

          <label className={label}>What do you do?</label>
          <input className={input} value={form.profession} onChange={e => set("profession", e.target.value)} placeholder="e.g. Product designer" />

          <label className={label}>Instagram (optional — helps us curate)</label>
          <input className={input} value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@handle" />

          {/* ===== Personality — sweet & short ===== */}
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-rose">A little personality</p>

          <label className={label}>Your energy at the table</label>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map(v => (
              <button type="button" key={v} onClick={() => set("vibe", form.vibe === v ? "" : v)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  form.vibe === v ? "bg-berry text-white" : "bg-creamLight text-ink/70 hover:bg-cream"}`}>
                {v}
              </button>
            ))}
          </div>

          <label className={label}>Pick up to 5 things you&apos;re into</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(i => (
              <button type="button" key={i} onClick={() => toggleInterest(i)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  interests.includes(i) ? "bg-berry text-white" : "bg-creamLight text-ink/70 hover:bg-cream"}`}>
                {i}
              </button>
            ))}
          </div>

          <label className={label}>Your ideal Friday evening</label>
          <input className={input} required value={form.prompt1} onChange={e => set("prompt1", e.target.value)} placeholder="Chef's counter? Rooftop? Hole-in-the-wall tacos?" />

          <label className={label}>Three things you love</label>
          <input className={input} value={form.loves} onChange={e => set("loves", e.target.value)} placeholder="e.g. Sunday markets, jazz, good espresso" />

          <label className={label}>One thing you can&apos;t stand</label>
          <input className={input} value={form.dealbreaker} onChange={e => set("dealbreaker", e.target.value)} placeholder="e.g. Phones at the table" />

          <label className={label}>What are you actually looking for?</label>
          <input className={input} required value={form.prompt2} onChange={e => set("prompt2", e.target.value)} placeholder="Honest answers get better tables." />

          <label className={label}>When can you usually make dinner?</label>
          <div className="flex gap-4 text-sm text-ink/80">
            {["weeknights", "weekends"].map(a => (
              <label key={a} className="flex items-center gap-2">
                <input type="checkbox" checked={form.availability.includes(a)}
                  onChange={e => setForm(f => ({ ...f, availability: e.target.checked ? [...f.availability, a] : f.availability.filter(x => x !== a) }))} />
                {a}
              </label>
            ))}
          </div>

          {/* ===== Photos ===== */}
          <label className={label}>Photos — up to 8 (clear face in the first)</label>
          <p className="mb-2 text-xs text-ink/55">
            All photos are visible to your introductions. No hidden or private photos — that&apos;s
            the deal both ways.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {photos.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} alt="" className="h-24 w-full rounded-2xl object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-berry px-2 py-0.5 text-[10px] font-semibold text-white">Lead</span>
                )}
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-berryDark text-xs font-bold text-white">
                  ×
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <label className="flex h-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-rose/40 bg-creamLight text-center text-xs font-semibold text-ink/60 hover:border-berry">
                + Add photo{photos.length === 0 ? "s" : ""}
                <input type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
              </label>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={state === "loading" || photos.length === 0}
            className="mt-8 w-full rounded-full bg-berry py-4 font-semibold text-white transition hover:bg-berryDark disabled:opacity-50">
            {state === "loading" ? "Submitting…" : "Submit application"}
          </button>
          {photos.length === 0 && <p className="mt-2 text-center text-xs text-ink/50">At least one photo required.</p>}
        </form>
      </div>
    </main>
  );
}
