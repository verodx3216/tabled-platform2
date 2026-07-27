import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { LogoLockup } from "@/components/Logo";
import { site, howItWorks, tiers, faqs } from "@/content/site";

export default function Home() {
  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-berryDark text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-berry/70" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 h-[24rem] w-[24rem] rounded-full bg-berry/50" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <LogoLockup light />
          <div className="flex items-center gap-6 text-sm text-cream/90">
            <Link href="#how" className="hover:text-white">How it works</Link>
            <Link href="#membership" className="hover:text-white">Membership</Link>
            <Link href="/dinners" className="hover:text-white">Dinners</Link>
            <Link
              href="#waitlist"
              className="rounded-full border border-cream/40 px-4 py-1.5 hover:border-white hover:text-white"
            >
              Join
            </Link>
          </div>
        </nav>
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
            A members&apos; dining club · Dubai
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-tight md:text-6xl">
            Your membership never disappears.{" "}
            <span className="text-cream">It becomes dates.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/90">{site.sub}</p>
          <div className="mt-10 max-w-xl" id="waitlist-hero">
            <WaitlistForm compact />
            <p className="mt-3 text-sm text-cream/60">
              Founding waitlist · first seats at the autumn dinners · founding pricing
            </p>
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="bg-cream/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">How it works</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-berryDark">
            Four steps from joining to dinner
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {howItWorks.map((s, i) => (
              <div key={s.title} className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-berry font-serif text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-berryDark">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/80">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== The difference ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              t: "75% of your fee comes back as Date Credits",
              b: "Spendable at Dubai's best venues. Unused credits roll over, month after month. On other apps the money vanishes — here it banks.",
            },
            {
              t: "Every member is verified. Every date is real.",
              b: "Mandatory ID verification. Introductions arrive as funded invitations — a table, a time, a budget — never an endless chat.",
            },
            {
              t: "Stand someone up, and it costs you — not them",
              b: "Both sides stake a small amount on confirmed dates. No-shows forfeit their stake to the person who showed up.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-3xl bg-creamLight p-8">
              <h3 className="font-serif text-xl font-bold text-berryDark">{c.t}</h3>
              <p className="mt-3 text-ink/80">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Membership ===== */}
      <section id="membership" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">Membership</p>
        <h2 className="mt-3 font-serif text-4xl font-bold text-berryDark">
          A fee you keep, not a fee you lose
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl p-8 ${
                t.highlight
                  ? "bg-berryDark text-white shadow-xl"
                  : "bg-creamLight text-ink"
              }`}
            >
              <h3 className={`font-serif text-xl font-bold ${t.highlight ? "text-cream" : "text-berryDark"}`}>
                {t.name}
              </h3>
              <p className="mt-4">
                <span className="font-serif text-4xl font-bold">{t.price}</span>
                <span className={`ml-1 text-sm ${t.highlight ? "text-cream/70" : "text-ink/60"}`}>
                  {t.period}
                </span>
              </p>
              <ul className={`mt-6 space-y-3 text-sm ${t.highlight ? "text-cream/90" : "text-ink/80"}`}>
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={t.highlight ? "text-rose" : "text-berry"}>◆</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-berryDark p-8 text-white md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="font-serif text-2xl font-bold text-cream">A floor, never a ceiling.</p>
            <p className="mt-2 max-w-2xl text-white/85">
              Top up your wallet anytime — and 100% of every top-up becomes Date Credits, with no club
              fee. Host any evening you can imagine, from a quiet coffee to the chef&apos;s table. Your
              balance is always private: a guest sees the invitation, never a number.
            </p>
          </div>
          <p className="mt-5 whitespace-nowrap rounded-full bg-berry px-6 py-3 text-center font-semibold md:mt-0">
            100% credit conversion
          </p>
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Founding-member pricing locked for life for the first 500 members. Credits are redeemable at
          partner venues; money on Tabled is never transferable to a person.
        </p>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-cream/60 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">Questions</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-berryDark">Fair questions, straight answers</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group rounded-2xl bg-white p-6 shadow-sm">
                <summary className="cursor-pointer list-none font-serif text-lg font-bold text-berryDark">
                  {f.q}
                </summary>
                <p className="mt-3 text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section id="waitlist" className="bg-berryDark py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-4xl font-bold">
            The first 500 members set the table.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/85">
            Join the founding waitlist for first seats at the autumn dinners, founding pricing locked
            for life, and priority verification.
          </p>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-cream bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm text-ink/60 md:flex-row md:items-center">
          <LogoLockup />
          <p>
            Date Credits are prepaid venue value, redeemable only at partner venues. Funds are never
            transferable between members. © {new Date().getFullYear()} Tabled.
          </p>
        </div>
      </footer>
    </main>
  );
}
