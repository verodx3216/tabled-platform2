"use client";

import { useState } from "react";
import { cityNamesAlpha } from "@/content/cities";

/** Venue partner application — /partners. */
export default function PartnerForm() {
  const [f, setF] = useState({
    venueName: "", kind: "restaurant", city: "Raleigh", neighborhood: "",
    contactName: "", email: "", phone: "", instagram: "", note: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const set = (k: string, v: string) => setF(x => ({ ...x, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setMsg("");
    try {
      const res = await fetch("/api/partners", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = await res.json();
      if (d.ok) setState("done");
      else { setState("error"); setMsg(d.error ?? "Something went wrong."); }
    } catch { setState("error"); setMsg("Network error — please try again."); }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-cream px-6 py-5 text-berryDark">
        <p className="font-serif text-lg font-bold">Application received — welcome to the table.</p>
        <p className="mt-1 text-sm text-ink/80">
          We review every venue personally and reply from{" "}
          <span className="font-semibold">hello@tabled.club</span> within a few days with your
          allocation form and partnership terms.
        </p>
      </div>
    );
  }

  const input = "w-full rounded-2xl border border-rose/40 bg-white px-5 py-3 text-ink outline-none focus:border-berry";
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input className={input} required placeholder="Venue name" value={f.venueName} onChange={e => set("venueName", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <select className={input} value={f.kind} onChange={e => set("kind", e.target.value)}>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Cafe</option>
          <option value="rooftop">Rooftop / lounge</option>
          <option value="bar">Bar / wine bar</option>
          <option value="activity">Activity / experience</option>
        </select>
        <select className={input} value={f.city} onChange={e => set("city", e.target.value)}>
          {cityNamesAlpha.map(c => <option key={c}>{c}</option>)}
          <option>Other</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className={input} placeholder="Neighborhood" value={f.neighborhood} onChange={e => set("neighborhood", e.target.value)} />
        <input className={input} placeholder="Your name & role" value={f.contactName} onChange={e => set("contactName", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className={input} type="email" required placeholder="Email" value={f.email} onChange={e => set("email", e.target.value)} />
        <input className={input} placeholder="Phone (optional)" value={f.phone} onChange={e => set("phone", e.target.value)} />
      </div>
      <input className={input} placeholder="Instagram (optional)" value={f.instagram} onChange={e => set("instagram", e.target.value)} />
      <textarea className={input} rows={2} placeholder="Anything we should know? (quiet nights, private room, gift cards…)" value={f.note} onChange={e => set("note", e.target.value)} />
      <button type="submit" disabled={state === "loading"}
        className="rounded-full bg-berry py-3.5 font-semibold text-white transition hover:bg-berryDark disabled:opacity-60">
        {state === "loading" ? "Sending…" : "Apply to partner"}
      </button>
      {state === "error" && <p className="text-sm text-red-700">{msg}</p>}
    </form>
  );
}
