import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { waitlistStore } from "@/lib/waitlist";
import { raceCities, comingSoon, UNLOCK_AT, SHOW_COUNT_FROM } from "@/content/cities";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Race to 500 — Tabled",
  description:
    "Fifty cities, live at once. Five hundred founding seats each, claimed in order of application. Which city sets the table first?",
};

export default async function Cities() {
  const counts = await waitlistStore().countByCity();
  const byCity = new Map(
    counts.map((c) => [c.city.trim().toLowerCase(), c.count])
  );
  const rows = raceCities
    .map((c) => ({
      ...c,
      count: byCity.get(c.name.toLowerCase()) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
        <Link href="/apply" className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berryDark">
          Apply
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
          The Race to 500
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold text-berryDark md:text-6xl">
          Every city is live. Five hundred seats each.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          All fifty founding classes are open at once. Seats are claimed in order of
          application, city by city — first date on the club, founding pricing for life, VIP
          badge included. Introductions and first tables begin as your city fills, so the only
          question is which city sets the table first. Apply, then bring your city with you.
        </p>
        <Link
          href="/apply"
          className="mt-8 inline-block rounded-full bg-berry px-8 py-3.5 font-semibold text-white hover:bg-berryDark"
        >
          Claim your city&apos;s seat
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((c, i) => {
            const rank = i + 1;
            const podium = rank <= 3 && c.count > 0;
            const pct = Math.min(100, Math.round((c.count / UNLOCK_AT) * 100));
            const showCount = c.count >= SHOW_COUNT_FROM;
            return (
              <div
                key={c.name}
                className={`rounded-2xl p-5 ${podium ? "bg-berryDark text-white" : "bg-white shadow-sm"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className={`font-serif text-xl font-bold ${podium ? "text-cream" : "text-berryDark"}`}>
                    <span className={`mr-2 font-sans text-sm ${podium ? "text-rose" : "text-ink/40"}`}>#{rank}</span>
                    {c.name}
                  </p>
                  {showCount ? (
                    <span className={`text-sm font-semibold ${podium ? "text-rose" : "text-berry"}`}>
                      {c.count.toLocaleString()} / {UNLOCK_AT}
                    </span>
                  ) : (
                    <span className={`text-xs font-semibold uppercase tracking-wide ${podium ? "text-white/60" : "text-ink/40"}`}>
                      {c.count > 0 ? "Filling — founding seats open" : "Just opened — be first"}
                    </span>
                  )}
                </div>
                <div className={`mt-3 h-2 overflow-hidden rounded-full ${podium ? "bg-white/20" : "bg-cream"}`}>
                  <div
                    className="h-full rounded-full bg-berry"
                    style={{ width: `${Math.max(pct, c.count > 0 ? 2 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-ink/60">
          Counts update live. Every founding member gets founding pricing for life, the
          Founding 90, a year of the VIP badge — and their first date on the club.
        </p>

        {/* International — coming soon */}
        <div className="mt-12 rounded-3xl bg-berryDark p-8 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">
            Beyond the fifty
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-cream">
            {comingSoon.join(" · ")} — coming soon.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
            The club crosses oceans next. Join the waitlist and choose your city — when enough
            of you are at the door, we bring the table to you.
          </p>
          <Link
            href="/apply"
            className="mt-5 inline-block rounded-full bg-berry px-7 py-3 font-semibold text-white hover:opacity-90"
          >
            Hold your city&apos;s seat
          </Link>
        </div>
      </section>
    </main>
  );
}
