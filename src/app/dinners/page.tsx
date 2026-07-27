import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { upcomingDinners } from "@/content/site";

export const metadata = {
  title: "Dinners — Tabled",
  description: "Two ways to meet at a Tabled table: a dinner for two with the person you chose, or a curated table of six.",
};

export default function Dinners() {
  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
        <Link href="/apply" className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berryDark">
          Apply
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">How founding membership begins</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold text-berryDark">
          Two ways to meet at a Tabled table.
        </h1>
        <p className="mt-5 max-w-2xl text-ink/80">
          Apply once. Your application unlocks both: hand-picked introductions in your member
          app, and a seat at our curated dinners. No blind dates — you always know why
          you&apos;re at the table.
        </p>

        {/* Format 1: the chosen table */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl bg-berryDark p-9 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose">The Chosen Table</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-cream">Dinner for two —<br />with the person you chose.</h2>
            <p className="mt-4 flex-1 text-white/85">
              Nine hand-picked introductions in your member app. Choose who you&apos;d share a
              table with. If it&apos;s mutual, we book the evening — venue, time, done. When you
              walk in, you&apos;re sitting across from the person you picked.
            </p>
            <Link href="/apply" className="mt-6 rounded-full bg-berry px-6 py-3.5 text-center font-semibold text-white hover:opacity-90">
              Apply for membership
            </Link>
          </div>

          <div className="flex flex-col rounded-3xl bg-white p-9 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose">The Founders&apos; Table</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-berryDark">Dinner for six —<br />curated strangers, one great night.</h2>
            <p className="mt-4 flex-1 text-ink/80">
              A balanced table of six from the founding class, matched for compatible energy.
              Your ticket covers your seat; the venue is revealed 48 hours before. The people
              you&apos;d like to see again — that&apos;s your call, privately, afterward.
            </p>
            <Link href="/apply" className="mt-6 rounded-full border-2 border-berry px-6 py-3 text-center font-semibold text-berry hover:bg-berry hover:text-white">
              Apply for a seat
            </Link>
          </div>
        </div>

        {/* Upcoming tables */}
        <p className="mt-16 text-sm font-semibold uppercase tracking-[0.3em] text-rose">Upcoming founders&apos; tables</p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {upcomingDinners.map((d) => (
            <div key={d.title} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose">{d.tag}</p>
              <h3 className="mt-2 font-serif text-2xl font-bold text-berryDark">{d.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{d.meta}</p>
              <p className="mt-4 flex-1 text-sm text-ink/80">{d.note}</p>
              <Link href="/apply" className="mt-6 rounded-full bg-cream px-4 py-2.5 text-center text-sm font-semibold text-berryDark hover:bg-berry hover:text-white">
                Apply — waitlist gets first seats
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-berryDark p-8 text-center text-white">
          <h3 className="font-serif text-2xl font-bold text-cream">One application. Every table.</h3>
          <p className="mx-auto mt-2 max-w-xl text-white/85">
            Two minutes, real answers, two photos. Your application is your seat in line for
            introductions and dinners alike.
          </p>
          <Link href="/apply" className="mt-5 inline-block rounded-full bg-berry px-8 py-3.5 font-semibold text-white hover:opacity-90">
            Start your application
          </Link>
        </div>
      </section>
    </main>
  );
}
