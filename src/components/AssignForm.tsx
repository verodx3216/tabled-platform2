"use client";

import { useState } from "react";

type Suggestion = { email: string; name: string; age: number; reason: string };

export default function AssignForm({ token }: { token: string }) {
  const [member, setMember] = useState("");
  const [cands, setCands] = useState("");
  const [msg, setMsg] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("…");
    const candidates = cands.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean).slice(0, 9);
    // carry the AI matchmaker notes for any candidate that came from Suggest
    const notes: Record<string, string> = {};
    for (const s of suggestions) {
      if (s.reason && candidates.some(c => c.toLowerCase() === s.email.toLowerCase())) {
        notes[s.email] = s.reason.slice(0, 300);
      }
    }
    const res = await fetch("/api/admin/intros", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token, memberEmail: member, candidates,
        week: new Date().toISOString().slice(0, 10),
        ...(Object.keys(notes).length ? { notes } : {}),
      }),
    });
    const d = await res.json();
    setMsg(d.ok ? `Assigned ${candidates.length} intro(s) to ${member}.` : (d.error ?? "Failed"));
  }

  async function suggest() {
    if (!member.trim()) { setMsg("Enter the member's email first, then Suggest."); return; }
    setSuggesting(true); setMsg(""); setSuggestions([]);
    try {
      const res = await fetch("/api/admin/suggest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, memberEmail: member }),
      });
      const d = await res.json();
      if (d.ok) {
        setSuggestions(d.suggestions);
        setCands(d.suggestions.map((s: Suggestion) => s.email).join(", "));
        setMsg(`AI ranked ${d.suggestions.length} of ${d.poolSize} eligible — review, edit, then Assign.`);
      } else {
        setMsg(d.error ?? "Suggestion failed.");
      }
    } catch {
      setMsg("Network error — try again.");
    } finally {
      setSuggesting(false);
    }
  }

  const input = "rounded-xl border border-rose/40 px-3 py-2 text-sm";
  return (
    <div className="mt-3">
      <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
        <input className={input} placeholder="member email" value={member} onChange={e => setMember(e.target.value)} />
        <textarea className={input + " min-w-[420px]"} rows={2} placeholder="up to 9 candidate emails (comma or newline separated) — assignments are reciprocal"
          value={cands} onChange={e => setCands(e.target.value)} />
        <button type="button" onClick={suggest} disabled={suggesting}
          className="rounded-full border-2 border-berry px-5 py-2 text-sm font-semibold text-berry hover:bg-berry hover:text-white disabled:opacity-50">
          {suggesting ? "Matchmaking…" : "✨ Suggest 9"}
        </button>
        <button className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white">Assign</button>
        {msg && <span className="text-sm text-ink/70">{msg}</span>}
      </form>
      {suggestions.length > 0 && (
        <ol className="mt-3 space-y-1.5 rounded-2xl bg-cream p-4 text-sm">
          {suggestions.map((s, i) => (
            <li key={s.email}>
              <span className="font-semibold text-berryDark">{i + 1}. {s.name}, {s.age}</span>{" "}
              <span className="text-ink/50">({s.email})</span> — <span className="text-ink/80">{s.reason}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
