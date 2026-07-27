"use client";

import { useState } from "react";

/** Admin: add a partner venue with its standing allocation. */
export default function VenueForm({ token }: { token: string }) {
  const [f, setF] = useState({
    name: "", city: "Raleigh", neighborhood: "", cuisine: "",
    days: "tue,wed,thu", times: "18:30,20:30", tablesPerSlot: "2", leadHours: "48",
    contact: "", notes: "",
  });
  const [msg, setMsg] = useState("");
  const set = (k: string, v: string) => setF(x => ({ ...x, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("…");
    const res = await fetch("/api/admin/venues", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token, ...f,
        tablesPerSlot: Number(f.tablesPerSlot), leadHours: Number(f.leadHours),
      }),
    });
    const d = await res.json();
    setMsg(d.ok ? `Added ${f.name} — refresh to see it.` : (d.error ?? "Failed"));
  }

  const input = "rounded-xl border border-rose/40 px-3 py-2 text-sm";
  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2">
      <input className={input} placeholder="Venue name" value={f.name} onChange={e => set("name", e.target.value)} required />
      <input className={input + " w-28"} placeholder="City" value={f.city} onChange={e => set("city", e.target.value)} required />
      <input className={input + " w-32"} placeholder="Neighborhood" value={f.neighborhood} onChange={e => set("neighborhood", e.target.value)} />
      <input className={input + " w-28"} placeholder="Cuisine" value={f.cuisine} onChange={e => set("cuisine", e.target.value)} />
      <input className={input + " w-32"} title="Weekdays csv" value={f.days} onChange={e => set("days", e.target.value)} />
      <input className={input + " w-32"} title="Seatings csv (24h)" value={f.times} onChange={e => set("times", e.target.value)} />
      <input className={input + " w-16"} title="Tables per seating" type="number" min={1} max={10} value={f.tablesPerSlot} onChange={e => set("tablesPerSlot", e.target.value)} />
      <input className={input + " w-16"} title="Lead hours" type="number" min={2} max={168} value={f.leadHours} onChange={e => set("leadHours", e.target.value)} />
      <input className={input + " w-44"} placeholder="Contact (name/phone)" value={f.contact} onChange={e => set("contact", e.target.value)} />
      <button className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white">Add venue</button>
      {msg && <span className="text-sm text-ink/70">{msg}</span>}
    </form>
  );
}
