import Link from "next/link";
import { clubStore } from "@/lib/club";
import { LogoLockup } from "@/components/Logo";
import PickButton from "@/components/PickButton";

export const dynamic = "force-dynamic";

/**
 * The member's personal page — their "app". The URL token is their login;
 * the page invites them to install it to their home screen (PWA).
 */
export default async function MemberPage({ params }: { params: { token: string } }) {
  const store = clubStore();
  const me = await store.getProfileByToken(params.token);

  if (!me) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-berryDark">This link isn&apos;t valid.</h1>
        <p className="mt-2 text-ink/70">Check the link from your application, or <Link className="underline" href="/apply">apply again</Link>.</p>
      </main>
    );
  }

  const intros = await store.getIntrosFor(me.email);

  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
        <span className="rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-berryDark">
          {me.status === "applied" ? "Application received" : "Founding member"}
        </span>
      </nav>

      <div className="mx-auto max-w-2xl px-6">
        <h1 className="font-serif text-4xl font-bold text-berryDark">
          {me.name.split(" ")[0]}, welcome to the club.
        </h1>
        <p className="mt-3 text-ink/75">
          This page is your Tabled app — <b>bookmark it</b>, or better: open your browser menu and tap{" "}
          <b>&ldquo;Add to Home Screen&rdquo;</b> so it lives on your phone like any app. Your weekly
          introductions appear here.
        </p>

        <section className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose">Your introductions</p>
          {intros.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-white p-8 text-ink/75 shadow-sm">
              <p className="font-serif text-xl font-bold text-berryDark">Curating your introductions…</p>
              <p className="mt-2 text-sm">
                We hand-pick every introduction. Yours are being curated now — you&apos;ll find them
                here within the week. Meanwhile, your application is in line for the next
                Founders&apos; Table.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              {intros.map(c => (
                <div key={c.candidateEmail} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="flex gap-1">
                    {c.photo1 && <img src={c.photo1} alt="" className="h-64 w-1/2 flex-1 object-cover" />}
                    {c.photo2 && <img src={c.photo2} alt="" className="h-64 w-1/2 flex-1 object-cover" />}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-berryDark">
                      {c.name}, {c.age}
                    </h3>
                    <p className="mt-1 text-sm text-ink/60">
                      {[c.profession, c.neighborhood].filter(Boolean).join(" · ")}
                    </p>
                    {c.prompt1 && <p className="mt-3 text-sm text-ink/85"><b className="text-rose">Ideal Friday:</b> {c.prompt1}</p>}
                    {c.prompt2 && <p className="mt-1.5 text-sm text-ink/85"><b className="text-rose">Looking for:</b> {c.prompt2}</p>}
                    {c.note && (
                      <p className="mt-3 rounded-2xl bg-cream px-4 py-3 text-sm italic text-berryDark">
                        <b className="not-italic text-rose">From your matchmaker:</b> {c.note}
                      </p>
                    )}
                    <PickButton token={params.token} candidateEmail={c.candidateEmail} picked={c.picked} mutual={c.mutual} />
                  </div>
                </div>
              ))}
              <p className="text-center text-xs text-ink/50">
                Your choices are private. Interest is only ever revealed when it&apos;s mutual.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
