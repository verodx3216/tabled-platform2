"use client";

import { useState } from "react";

export default function AssignForm({ token }: { token: string }) {
  const [member, setMember] = useState("");
  const [cands, setCands] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("…");
    const candidates = cands.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean).slice(0, 9);
    const res = await fetch("/api/admin/intros", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, memberEmail: member, candidates, week: new Date().toISOString().slice(0, 10) }),
    });
    const d = await res.json();
    setMsg(d.ok ? `Assigned ${candidates.length} intro(s) to ${member}.` : (d.error ?? "Failed"));
  }

  const input = "rounded-xl border border-rose/40 px-3 py-2 text-sm";
  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2">
      <input className={input} placeholder="member email" value={member} onChange={e => setMember(e.target.value)} />
      <textarea className={input + " min-w-[420px]"} rows={2} placeholder="up to 9 candidate emails (comma or newline separated) — assignments are reciprocal"
        value={cands} onChange={e => setCands(e.target.value)} />
      <button className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white">Assign</button>
      {msg && <span className="text-sm text-ink/70">{msg}</span>}
    </form>
  );
}
