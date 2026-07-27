import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import CreatorForm from "@/components/CreatorForm";

export const metadata = {
  title: "Creators — Tabled",
  description:
    "Get paid when your people fall in love. 15% of your members' restaurant spend, every month, until they're Coupled — plus a $200 Graduation Toast when it works.",
};

const steps = [
  {
    n: "1",
    title: "Claim your code",
    body: "Your personal link and a reserved block of founding seats in your city — access your audience can't get anywhere else.",
  },
  {
    n: "2",
    title: "Share your experience",
    body: "We plan and comp a real Tabled evening at one of the city's best tables. Film it, post it, tag it. Your followers join through your link.",
  },
  {
    n: "3",
    title: "Earn on every date",
    body: "Every time a member you brought dines on Tabled, 15% of the restaurant spend is yours. Paid monthly. No caps.",
  },
  {
    n: "4",
    title: "Win when love wins",
    body: "When one of your members becomes Coupled, you get a $200 Graduation Toast. You earn while they date — and celebrate when it works.",
  },
];

export default function Creators() {
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
          The Tabled Creator Program
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold text-berryDark md:text-6xl">
          Get paid when your people fall in love.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Tabled is the members&apos; club where real first dates happen at the city&apos;s best
          tables. Bring your audience, and earn <span className="font-semibold">15% of every
          dollar your members spend at our partner restaurants</span> — every date, every month,
          until they find their person. Then we toast you for it.
        </p>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-6">
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

      {/* The math */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-berryDark p-10 text-white md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">Real numbers</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-cream">
              Ten members who date twice a month
            </h2>
            <p className="mt-4 max-w-xl text-white/85">
              Ten of your followers join and average two $100 dinners a month. That&apos;s
              $2,000 in tables — and $300 a month to you, recurring, for sharing something
              you&apos;d post about anyway. Your best month with a flat-fee brand deal pays
              once. This pays every month people keep dating.
            </p>
          </div>
          <div className="mt-8 rounded-2xl bg-white/10 p-8 text-center md:mt-0">
            <p className="font-serif text-5xl font-bold text-cream">$300<span className="text-2xl">/mo</span></p>
            <p className="mt-2 text-sm text-white/70">from just 10 active members</p>
            <p className="mt-4 font-serif text-3xl font-bold text-rose">+$200</p>
            <p className="mt-1 text-sm text-white/70">every time one of them couples</p>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section className="mx-auto max-w-3xl px-6 py-10" id="apply">
        <div className="rounded-3xl bg-white p-9 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-berryDark">Apply for a creator code</h2>
          <p className="mt-3 text-ink/80">
            We partner with a small number of creators per city — people whose taste we&apos;d
            trust with a founding seat. Tell us where to find you.
          </p>
          <div className="mt-6">
            <CreatorForm />
          </div>
          <p className="mt-6 text-xs text-ink/50">
            Creator commissions are paid on settled restaurant spend by members who joined
            through your link, monthly, until that member becomes Coupled. Posts must include
            clear disclosure (#ad or &ldquo;paid partner&rdquo;) per FTC guidelines. Money on
            Tabled is never transferable between members; creator earnings are marketing
            commissions paid by the club, not by members.
          </p>
        </div>
      </section>
    </main>
  );
}
