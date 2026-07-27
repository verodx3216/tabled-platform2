"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { cityNames } from "@/content/cities";

/**
 * Founding member application. On success the member is redirected straight
 * into their personal member page (/me/<token>) — the token IS their login.
 * Photos are resized client-side to ~900px JPEG and sent as data URLs.
 */

async function resizeToDataUrl(file: File, maxDim = 900, quality = 0.8): Promise<string> {
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
    prompt1: "", prompt2: "", availability: [] as string[],
  });
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>, which: 1 | 2) {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await resizeToDataUrl(f);
    if (data.length > 400_000) { setError("That photo is too large — try a smaller one."); return; }
    which === 1 ? setPhoto1(data) : setPhoto2(data);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading"); setError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), availability: form.availability.join(","), photo1, photo2 }),
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
                {cityNames.map(c => <option key={c}>{c}</option>)}
                <option>Dubai</option>
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

          <label className={label}>Your ideal Friday evening</label>
          <input className={input} required value={form.prompt1} onChange={e => set("prompt1", e.target.value)} placeholder="Chef's counter? Rooftop? Hole-in-the-wall tacos?" />

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

          <label className={label}>Two photos (clear face in at least one)</label>
          <div className="flex gap-4">
            {[1, 2].map(n => (
              <label key={n} className="flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-rose/40 bg-creamLight text-sm text-ink/60">
                {(n === 1 ? photo1 : photo2)
                  ? <img src={(n === 1 ? photo1 : photo2)!} alt="" className="h-full w-full object-cover" />
                  : `Add photo ${n}`}
                <input type="file" accept="image/*" className="hidden" onChange={e => onPhoto(e, n as 1 | 2)} />
              </label>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={state === "loading" || !photo1}
            className="mt-8 w-full rounded-full bg-berry py-4 font-semibold text-white transition hover:bg-berryDark disabled:opacity-50">
            {state === "loading" ? "Submitting…" : "Submit application"}
          </button>
          {!photo1 && <p className="mt-2 text-center text-xs text-ink/50">At least one photo required.</p>}
        </form>
      </div>
    </main>
  );
}
