import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { waitlistStore } from "@/lib/waitlist";
import { raceCities, UNLOCK_AT, SHOW_COUNT_FROM } from "@/content/cities";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Race to 500 — Tabled",
  description:
    "Fifty cities. Five hundred founding seats each. When your city reaches 500 founding applications, we launch it. Get your city to the table first.",
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
    .sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0) || b.count - a.count);

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
          Your city launches when it earns it.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Fifty cities. Five hundred founding seats each. When a city reaches {UNLOCK_AT} founding
          applications, we launch it — venues, introductions, first dates on the club. The order
          isn&apos;t up to us. It&apos;s up to you. Apply, then bring your city with you.
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
            const liveCount = rows.filter((r) => r.live).length;
            const rank = i - liveCount + 1;
            const pct = Math.min(100, Math.round((c.count / UNLOCK_AT) * 100));
            const showCount = c.count >= SHOW_COUNT_FROM;
            return (
              <div
                key={c.name}
                className={`rounded-2xl p-5 ${
                  c.live ? "bg-berryDark text-white" : "bg-white shadow-sm"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className={`font-serif text-xl font-bold ${c.live ? "text-cream" : "text-berryDark"}`}>
                    {!c.live && rank > 0 && (
                      <span className="mr-2 font-sans text-sm text-ink/40">#{rank}</span>
                    )}
                    {c.name}
                  </p>
                  {c.live ? (
                    <span className="rounded-full bg-berry px-3 py-1 text-xs font-semibold text-white">
                      Founding class open
                    </span>
                  ) : showCount ? (
                    <span className="text-sm font-semibold text-berry">
                      {c.count.toLocaleString()} / {UNLOCK_AT}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Just opened — be first
                    </span>
                  )}
                </div>
                <div className={`mt-3 h-2 overflow-hidden rounded-full ${c.live ? "bg-white/20" : "bg-cream"}`}>
                  <div
                    className="h-full rounded-full bg-berry"
                    style={{ width: `${c.live ? 100 : Math.max(pct, c.count > 0 ? 2 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-ink/60">
          Counts update live. Founding members who bring their city over the line get first
          seats, founding pricing for life, and their first date on the club.
        </p>
      </section>
    </main>
  );
}
