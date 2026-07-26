import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { LogoLockup } from "@/components/Logo";
import { upcomingDinners } from "@/content/site";

export const metadata = {
  title: "Founders' Dinners — Tabled",
  description: "Curated six-seat dinners at Dubai's best tables. Application-only.",
};

export default function Dinners() {
  return (
    <main className="min-h-screen bg-creamLight">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/">
          <LogoLockup />
        </Link>
        <Link href="/#waitlist" className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berryDark">
          Join the waitlist
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">How founding membership begins</p>
        <h1 className="mt-3 max-w-2xl font-serif text-5xl font-bold text-berryDark">
          Six seats. One great table. Zero small-talk apps.
        </h1>
        <p className="mt-5 max-w-2xl text-ink/80">
          Our first dinners are curated by application from the founding waitlist — a balanced table of
          six at one of Dubai&apos;s best venues. Your ticket covers your seat; the venue is revealed 48
          hours before. Dinners are how the founding class meets while we verify profiles and train the
          matchmaker &mdash; then your one-on-one introductions begin.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {upcomingDinners.map((d) => (
            <div key={d.title} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose">
                {d.city} · {d.area}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-berryDark">{d.title}</h2>
              <p className="mt-1 text-ink/60">{d.date} · {d.seats} seats</p>
              <p className="mt-4 flex-1 text-sm text-ink/80">{d.note}</p>
              <p className="mt-6 rounded-full bg-cream px-4 py-2 text-center text-sm font-semibold text-berryDark">
                Applications open to the waitlist first
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-xl">
          <h3 className="font-serif text-2xl font-bold text-berryDark">Get an invitation</h3>
          <p className="mb-4 mt-2 text-ink/80">
            Dinner applications open to the waitlist before anyone else.
          </p>
          <WaitlistForm compact />
        </div>
      </section>
    </main>
  );
}
