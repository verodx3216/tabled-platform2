"use client";

import { useEffect, useState } from "react";

type Opt = { venueId: string; venueName: string; kind?: string; neighborhood: string | null; cuisine: string | null; date: string; time: string };

const KIND_LABEL: Record<string, string> = {
  cafe: "☕ coffee date", rooftop: "🌇 rooftop", bar: "🍸 drinks", activity: "🎯 activity",
};
type Booking = { code: string; venueName: string; neighborhood: string | null; date: string; time: string };

function nice(d: string, t: string) {
  const dt = new Date(`${d}T${t}:00Z`);
  const day = dt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${day} · ${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Booking flow shown on a mutual match: the club proposes secured tables,
 *  one member suggests up to 3, the other confirms one. */
export default function TableBooking({ token, candidateEmail, candidateName }:
  { token: string; candidateEmail: string; candidateName: string }) {
  const [stage, setStage] = useState<"loading" | "propose" | "waiting" | "choose" | "booked" | "none">("loading");
  const [options, setOptions] = useState<Opt[]>([]);
  const [picked, setPicked] = useState<Opt[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(payload: Record<string, unknown>) {
    const res = await fetch("/api/table", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, candidateEmail, ...payload }),
    });
    return res.json();
  }

  async function refresh() {
    const d = await call({ action: "state" });
    if (!d.ok) { setStage("none"); return; }
    setStage(d.stage);
    setOptions(d.options ?? []);
    setBooking(d.booking ?? null);
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  function togglePick(o: Opt) {
    setPicked(prev => {
      const has = prev.some(x => x.venueId === o.venueId && x.date === o.date && x.time === o.time);
      if (has) return prev.filter(x => !(x.venueId === o.venueId && x.date === o.date && x.time === o.time));
      return prev.length >= 3 ? prev : [...prev, o];
    });
  }

  async function propose() {
    setBusy(true); setMsg("");
    const d = await call({ action: "propose", options: picked });
    setBusy(false);
    if (d.ok) { setStage("waiting"); setOptions(d.options); }
    else { setMsg(d.error ?? "Try again."); refresh(); }
  }

  async function confirm(o: Opt) {
    setBusy(true); setMsg("");
    const d = await call({ action: "confirm", option: o });
    setBusy(false);
    if (d.ok) { setStage("booked"); setBooking(d.booking); }
    else { setMsg(d.error ?? "Try again."); refresh(); }
  }

  if (stage === "loading") return <p className="mt-4 text-sm text-ink/50">Checking tables…</p>;
  if (stage === "none") return null;

  if (stage === "booked" && booking) {
    return (
      <div className="mt-4 rounded-2xl bg-berryDark p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose">Your table is booked 🥂</p>
        <p className="mt-1 font-serif text-xl font-bold text-cream">
          {booking.venueName}{booking.neighborhood ? ` · ${booking.neighborhood}` : ""}
        </p>
        <p className="mt-1 text-sm text-white/85">{nice(booking.date, booking.time)}</p>
        <p className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-center font-mono text-lg font-bold tracking-widest text-cream">
          {booking.code}
        </p>
        <p className="mt-2 text-xs text-white/60">Give this code at the host stand. The table is under Tabled.</p>
      </div>
    );
  }

  if (stage === "waiting") {
    return (
      <div className="mt-4 rounded-2xl bg-cream p-5">
        <p className="text-sm font-semibold text-berryDark">Tables suggested — waiting on {candidateName.split(" ")[0]} to choose:</p>
        <ul className="mt-2 space-y-1 text-sm text-ink/75">
          {options.map((o, i) => <li key={i}>◆ {o.venueName} — {nice(o.date, o.time)}</li>)}
        </ul>
      </div>
    );
  }

  if (stage === "choose") {
    return (
      <div className="mt-4 rounded-2xl bg-cream p-5">
        <p className="text-sm font-semibold text-berryDark">
          {candidateName.split(" ")[0]} suggested these tables — pick one and it&apos;s booked:
        </p>
        <div className="mt-3 space-y-2">
          {options.map((o, i) => (
            <button key={i} disabled={busy} onClick={() => confirm(o)}
              className="block w-full rounded-xl bg-white px-4 py-3 text-left text-sm shadow-sm hover:bg-berry hover:text-white disabled:opacity-50">
              <b>{o.venueName}</b>{o.neighborhood ? ` · ${o.neighborhood}` : ""}
              {o.kind && KIND_LABEL[o.kind] ? ` · ${KIND_LABEL[o.kind]}` : ""} — {nice(o.date, o.time)}
            </button>
          ))}
        </div>
        {msg && <p className="mt-2 text-sm text-red-700">{msg}</p>}
      </div>
    );
  }

  // propose
  return (
    <div className="mt-4 rounded-2xl bg-cream p-5">
      <p className="text-sm font-semibold text-berryDark">It&apos;s mutual — choose your table.</p>
      <p className="mt-1 text-xs text-ink/60">
        Every option below is a real table the club already holds. Pick up to 3 to suggest to{" "}
        {candidateName.split(" ")[0]} — they confirm one, and it&apos;s booked.
      </p>
      {options.length === 0 ? (
        <p className="mt-3 text-sm text-ink/70">
          Our concierge is securing tables in your city — options appear here within a day.
        </p>
      ) : (
        <>
          <div className="mt-3 space-y-2">
            {options.map((o, i) => {
              const on = picked.some(x => x.venueId === o.venueId && x.date === o.date && x.time === o.time);
              return (
                <button key={i} type="button" onClick={() => togglePick(o)}
                  className={`block w-full rounded-xl px-4 py-3 text-left text-sm shadow-sm transition ${
                    on ? "bg-berry text-white" : "bg-white hover:bg-white/70"}`}>
                  <b>{o.venueName}</b>{o.neighborhood ? ` · ${o.neighborhood}` : ""}
                  {o.kind && KIND_LABEL[o.kind] ? ` · ${KIND_LABEL[o.kind]}` : ""} — {nice(o.date, o.time)}
                </button>
              );
            })}
          </div>
          <button disabled={busy || picked.length === 0} onClick={propose}
            className="mt-3 w-full rounded-full bg-berry py-3 font-semibold text-white disabled:opacity-50">
            {busy ? "Suggesting…" : `Suggest ${picked.length || ""} table${picked.length === 1 ? "" : "s"}`}
          </button>
        </>
      )}
      {msg && <p className="mt-2 text-sm text-red-700">{msg}</p>}
    </div>
  );
}
