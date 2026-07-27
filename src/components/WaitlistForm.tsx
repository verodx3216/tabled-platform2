"use client";

import { useEffect, useState } from "react";
import { cityNamesAlpha, comingSoon } from "@/content/cities";

/**
 * Waitlist form with growth mechanics:
 * - captures ?ref= (referral code) and ?utm_source= from the URL
 * - on success shows the member's queue position and their personal share link
 * - one-tap WhatsApp share + copy-link button
 */
export default function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("New York");
  const [interest, setInterest] = useState<"member" | "host" | "venue-partner">("member");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlRef, setUrlRef] = useState<string | undefined>(undefined);
  const [utm, setUtm] = useState<string | undefined>(undefined);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUrlRef(p.get("ref") ?? undefined);
    setUtm(p.get("utm_source") ?? p.get("src") ?? undefined);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, interest, source: utm ?? "site", ref: urlRef }),
      });
      const data = await res.json();
      if (data.ok) {
        setRefCode(data.refCode ?? "");
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
    const shareUrl = `https://tabled.club?ref=${refCode}`;
    const shareText = encodeURIComponent(
      `I just joined the waitlist for Tabled — the members' dining club where your membership becomes real dates at the city's best tables. 500 founding seats. Join the line with my link: ${shareUrl}`
    );
    return (
      <div className="rounded-2xl bg-cream px-6 py-5 text-berryDark">
        <p className="font-serif text-lg font-bold">
          Your founding application is open.
        </p>
        <p className="mt-1 text-sm text-ink/80">
          Founding seats aren&apos;t first-come, first-served — they&apos;re chosen. Boost your
          application: post your invite to your Story and tag{" "}
          <span className="font-semibold">@tabled.club</span> — verified founders earn an extra{" "}
          <span className="font-semibold">$25 in Date Credits</span> at launch. Bringing great
          people counts too — share your personal link below.
        </p>
        <a href="/apply" className="mt-3 block rounded-full bg-berry px-5 py-3 text-center font-semibold text-white hover:bg-berryDark">
          Complete your founding application &rarr;
        </a>
        <ShareKit shareUrl={shareUrl} copied={copied} setCopied={setCopied} />
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
              {cityNamesAlpha.map((c) => (
                <option key={c}>{c}</option>
              ))}
              {comingSoon.map((c) => (
                <option key={c} value={c}>{c} (coming soon)</option>
              ))}
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


/** Multi-platform share kit. WhatsApp/Telegram/iMessage support pre-filled
 *  messages via URL; Instagram & Snapchat don't allow web prefill, so those
 *  buttons copy the message then open the app. The Share button uses the
 *  native share sheet (all apps appear there on mobile). */
function ShareKit({ shareUrl, copied, setCopied }:
  { shareUrl: string; copied: boolean; setCopied: (b: boolean) => void }) {
  const msg = `Real first dates at great tables — zero swiping. 500 founding seats. Join the line with my link: ${shareUrl}`;
  const enc = encodeURIComponent(msg);
  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const smsHref = isIOS ? `sms:&body=${enc}` : `sms:?body=${enc}`;
  const canNative = typeof navigator !== "undefined" && !!navigator.share;

  function copyMsg(thenOpen?: string) {
    navigator.clipboard?.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (thenOpen) window.location.href = thenOpen;
    });
  }

  const pill = "rounded-full px-4 py-2 text-sm font-semibold text-white hover:opacity-90";
  return (
    <div className="mt-3">
      {canNative && (
        <button type="button"
          onClick={() => navigator.share({ title: "Tabled", text: msg, url: shareUrl }).catch(() => {})}
          className="mb-2 w-full rounded-full bg-berryDark py-3 font-semibold text-white hover:opacity-90">
          Share with friends
        </button>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <a className={pill + " bg-[#25D366]"} target="_blank" rel="noopener noreferrer"
          href={`https://wa.me/?text=${enc}`}>WhatsApp</a>
        <a className={pill + " bg-[#229ED9]"} target="_blank" rel="noopener noreferrer"
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Real first dates at great tables — zero swiping. 500 founding seats.")}`}>Telegram</a>
        <a className={pill + " bg-[#34C759]"} href={smsHref}>iMessage</a>
        <button type="button" className={pill + " bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]"}
          onClick={() => copyMsg("https://www.instagram.com/")}>Instagram</button>
        <button type="button" className={pill + " bg-[#FFFC00] !text-black"}
          onClick={() => copyMsg("https://www.snapchat.com/")}>Snapchat</button>
        <button type="button" className={pill + " bg-berryDark"} onClick={() => copyMsg()}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-xs text-ink/60">
          Message copied — paste it into your Story, DM, or chat.
        </p>
      )}
    </div>
  );
}