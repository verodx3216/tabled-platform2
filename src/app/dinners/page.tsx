import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { foundingOffer } from "@/content/site";

export const metadata = {
  title: "The First Table — Tabled",
  description:
    "Your first date is on us. The first 500 founding members in each city get their first mutual table funded by the club — private, intimate, just the two of you.",
};

const steps = [
  {
    n: "1",
    title: "Apply once",
    body: "Two minutes, real answers, two photos. Every founding member is ID-verified — no bots, no fakes.",
  },
  {
    n: "2",
    title: "Choose your person",
    body: "Nine hand-picked introductions in your member app, refreshed until it clicks. You pick privately — nobody sees a thing unless it's mutual.",
  },
  {
    n: "3",
    title: "It's mutual — we book",
    body: "Venue, date, time: handled. A quiet table for two at one of the city's best restaurants. No group dinners, no audience — just the two of you.",
  },
  {
    n: "4",
    title: "The first table is on us",
    body: "We issue a gift card to the restaurant — up to $100 — and you simply settle the balance. Your first date, funded by the club.",
  },
];

export default function FirstTable() {
  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
        <Link href="/apply" className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berryDark">
          Apply
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
          {foundingOffer.kicker}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold text-berryDark md:text-6xl">
          Your first date is on us.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          No group dinners. No strangers listening in. A first date should be two people at a
          quiet table, talking about life — so that&apos;s exactly what we fund. The first 500
          founding members in each city get their first mutual table paid for by the club.
        </p>
        <Link
          href="/apply"
          className="mt-8 inline-block rounded-full bg-berry px-8 py-3.5 font-semibold text-white hover:bg-berryDark"
        >
          Claim a founding seat
        </Link>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-berry font-serif text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-berryDark">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founding perks */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-berryDark p-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
            Founding privileges
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-cream">
            Being first should feel like it.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {foundingOffer.perks.map((p) => (
              <div key={p.title} className="rounded-2xl bg-white/10 p-7">
                <h3 className="font-serif text-lg font-bold text-cream">{p.title}</h3>
                <p className="mt-2 text-sm text-white/85">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-white/50">{foundingOffer.fineprint}</p>
        </div>
      </section>

      {/* The endgame: Coupled */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid items-center gap-8 rounded-3xl border-2 border-berry bg-white p-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
              And when it works
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-berryDark">
              Coupled is free. Forever.
            </h2>
            <p className="mt-4 max-w-2xl text-ink/80">
              Found your person at a Tabled table? You graduate. Membership fees end, your
              wallets merge with up to 20% bonus credits, and you keep member pricing at the
              best restaurants in town — date nights, anniversaries, Tuesdays. Tabled is the
              only dating membership designed to make itself free.
            </p>
          </div>
          <Link
            href="/apply"
            className="rounded-full bg-berry px-8 py-3.5 text-center font-semibold text-white hover:bg-berryDark"
          >
            Start with a seat
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-6 pt-6">
        <div className="rounded-3xl bg-berryDark p-8 text-center text-white">
          <h3 className="font-serif text-2xl font-bold text-cream">
            500 seats per city. One first table each.
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-white/85">
            One application — two minutes, real answers, two photos. Your seat in line for
            introductions, and a first date the club pays for.
          </p>
          <Link
            href="/apply"
            className="mt-5 inline-block rounded-full bg-berry px-8 py-3.5 font-semibold text-white hover:opacity-90"
          >
            Start your application
          </Link>
        </div>
      </section>
    </main>
  );
}
