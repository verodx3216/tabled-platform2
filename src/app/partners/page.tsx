import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import PartnerForm from "@/components/PartnerForm";

export const metadata = {
  title: "Partner Venues — Tabled",
  description:
    "Prepaid tables of two on your quietest nights. Restaurants, cafes, rooftops, bars, and experiences — join Tabled's partner network. No software, no fees, risk-free.",
};

const gets = [
  {
    t: "Guaranteed midweek covers",
    b: "Prepaid, committed tables of two on Tuesday–Thursday — the covers your quiet nights are missing. Booked through us, honored by contract, released back to you 48 hours out if unclaimed.",
  },
  {
    t: "Cash before the guest arrives",
    b: "For founding first dates we purchase your gift cards up front. Single payer at the table — one check, no splitting, no awkwardness at the best moment of their night.",
  },
  {
    t: "Guests who actually show up",
    b: "Every member stakes money on a confirmed reservation, so our no-show rate embarrasses the big platforms. And a great first date becomes your newest pair of regulars.",
  },
  {
    t: "Zero software. Zero fees.",
    b: "No tablet, no integration, no listing charge. A booking code at the host stand is the entire operational footprint. You choose the tables, seatings, and blackout dates.",
  },
];

export default function Partners() {
  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
        <a href="#join" className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berryDark">
          Join the network
        </a>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
          For restaurants · cafes · rooftops · bars · experiences
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold text-berryDark md:text-6xl">
          Fill your quietest tables with first dates.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Tabled is a members&apos; dining club for dating: ID-verified members whose fees
          convert into credit that can <b>only be spent at partner venues</b>. When two members
          match, we book them a table for two at your place — prepaid, single-payer, committed.
          You get the revenue your Tuesday was missing; they get the best night of their week.
        </p>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          {gets.map((g) => (
            <div key={g.t} className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-berryDark">{g.t}</h3>
              <p className="mt-2 text-ink/80">{g.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Every kind of date */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-berryDark p-10 text-white">
          <h2 className="font-serif text-3xl font-bold text-cream">
            Every kind of date. Every budget.
          </h2>
          <p className="mt-3 max-w-2xl text-white/85">
            Tabled dates run from a $12 cortado to a chef&apos;s counter — coffee dates, wine
            bars, rooftops at golden hour, pottery wheels, sunset sails, and dinners for two.
            If your room is somewhere two people fall into conversation, it belongs in the
            network. Members spend club credit at every tier, so an affordable date is still a
            prepaid one.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Restaurants", "Cafes", "Rooftops", "Cocktail & wine bars", "Cooking classes", "Pottery & art", "Sails & experiences"].map(t => (
              <span key={t} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cream">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* The ask + math */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-berryDark">What we ask</h3>
            <p className="mt-2 text-ink/80">
              A standing allocation you define — typically two tables, two seatings, on the
              nights you choose — and a 25% partner rate on Tabled tables: a discount on
              covers you weren&apos;t going to seat, not a fee on business you already have.
              Cancel anytime with 30 days&apos; notice.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-berryDark">The quiet-Tuesday math</h3>
            <p className="mt-2 text-ink/80">
              Two Tabled two-tops at a $120 average check is $240 a night that your empty
              seats earn instead of costing you. Three nights a week ≈ <b>$2,800/month of
              incremental revenue</b> — you keep ~$2,100 after the partner rate, plus the
              return visits, anniversaries, and regulars a good first date creates.
            </p>
          </div>
        </div>
      </section>

      {/* Join form */}
      <section className="mx-auto max-w-3xl px-6 py-10" id="join">
        <div className="rounded-3xl bg-white p-9 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-berryDark">Join the partner network</h2>
          <p className="mt-3 text-ink/80">
            Two minutes. We reply personally with your allocation form — you choose the
            tables, the seatings, and the terms before anything goes live.
          </p>
          <div className="mt-6">
            <PartnerForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-ink/60">
          Questions first? Write to{" "}
          <a href="mailto:hello@tabled.club" className="font-semibold text-berry hover:underline">hello@tabled.club</a>{" "}
          — the founder reads every note.
        </p>
      </section>
    </main>
  );
}
