"use client";

import { useState } from "react";

export default function PickButton({ token, candidateEmail, picked, mutual }:
  { token: string; candidateEmail: string; picked: boolean; mutual: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "picked" | "mutual">(
    mutual ? "mutual" : picked ? "picked" : "idle"
  );

  async function pick() {
    setState("loading");
    try {
      const res = await fetch("/api/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, candidateEmail }),
      });
      const d = await res.json();
      setState(d.ok ? (d.mutual ? "mutual" : "picked") : "idle");
    } catch { setState("idle"); }
  }

  if (state === "mutual") {
    return (
      <div className="mt-5 rounded-2xl bg-berryDark p-4 text-center text-white">
        <p className="font-serif text-lg font-bold text-cream">It&apos;s mutual. 🥂</p>
        <p className="mt-1 text-sm text-white/80">We&apos;re booking your table — details coming shortly.</p>
      </div>
    );
  }
  if (state === "picked") {
    return (
      <p className="mt-5 rounded-full bg-cream px-5 py-3 text-center text-sm font-semibold text-berryDark">
        Noted — privately. If it&apos;s mutual, we book the table.
      </p>
    );
  }
  return (
    <button onClick={pick} disabled={state === "loading"}
      className="mt-5 w-full rounded-full bg-berry py-3.5 font-semibold text-white transition hover:bg-berryDark disabled:opacity-60">
      {state === "loading" ? "…" : "I'd share a table with them"}
    </button>
  );
}
