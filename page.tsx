"use client";

import { useState } from "react";

/** Creator program application — posts to the waitlist API with interest="creator"
 *  and the creator's IG/TikTok handle. Review happens in /admin/waitlist. */
export default function CreatorForm() {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [city, setCity] = useState("Raleigh");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, interest: "creator", handle, source: "creators-page" }),
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
        <p className="font-serif text-lg font-bold">Application received.</p>
        <p className="mt-1 text-sm text-ink/80">
          We review creator applications personally. If it&apos;s a fit, you&apos;ll hear from{" "}
          <span className="font-semibold">hello@tabled.club</span> with your code and your
          comped Tabled evening.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full rounded-full border border-rose/40 bg-white px-5 py-3 text-ink outline-none transition focus:border-berry"
      />
      <input
        type="text"
        required
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="@your Instagram or TikTok"
        className="w-full rounded-full border border-rose/40 bg-white px-5 py-3 text-ink outline-none transition focus:border-berry"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-rose/40 bg-white px-4 py-3 text-ink outline-none focus:border-berry"
        >
          <option>Raleigh</option>
          <option>New York</option>
          <option>Miami</option>
          <option>Other</option>
        </select>
        <button
          type="submit"
          disabled={state === "loading"}
          className="flex-1 rounded-full bg-berry px-7 py-3 font-semibold text-white transition hover:bg-berryDark disabled:opacity-60"
        >
          {state === "loading" ? "Sending…" : "Apply for a code"}
        </button>
      </div>
      {state === "error" && <p className="text-sm text-red-700">{message}</p>}
    </form>
  );
}
