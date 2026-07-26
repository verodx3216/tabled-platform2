"use client";

import { useState } from "react";

export default function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Dubai");
  const [interest, setInterest] = useState<"member" | "host" | "venue-partner">("member");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, interest, source: "site" }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("done");
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-cream px-6 py-5 text-berryDark">
        <p className="font-serif text-lg font-bold">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-ink/80">
          Founding members get first seats at the autumn dinners, founding pricing, and priority
          verification. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-full border border-rose/40 bg-white px-5 py-3 text-ink outline-none transition focus:border-berry"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="whitespace-nowrap rounded-full bg-berry px-7 py-3 font-semibold text-white transition hover:bg-berryDark disabled:opacity-60"
        >
          {state === "loading" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {!compact && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-cream/80">
          <label className="flex items-center gap-2">
            City
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-full border border-rose/40 bg-white px-3 py-1.5 text-ink outline-none focus:border-berry"
            >
              <option>Dubai</option>
              <option>Miami</option>
              <option>New York</option>
              <option>Other</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            I&apos;m interested as
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value as typeof interest)}
              className="rounded-full border border-rose/40 bg-white px-3 py-1.5 text-ink outline-none focus:border-berry"
            >
              <option value="member">a Member</option>
              <option value="host">a Select Host</option>
              <option value="venue-partner">a Venue Partner</option>
            </select>
          </label>
        </div>
      )}
      {state === "error" && <p className="text-sm text-red-700">{message}</p>}
    </form>
  );
}
