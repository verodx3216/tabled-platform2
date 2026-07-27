import { clubStore } from "@/lib/club";
import AssignForm from "@/components/AssignForm";
import { suggestFor } from "@/lib/match";
import { aiEnabled } from "@/lib/ai";

export const dynamic = "force-dynamic";

/** Curation console: profiles, picks, mutual matches, intro assignment. */
export default async function AdminClub({ searchParams }: { searchParams: { token?: string } }) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || searchParams.token !== expected) {
    return <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-2xl font-bold text-berryDark">Not authorized</h1>
    </main>;
  }
  const store = clubStore();
  const profiles = await store.listProfiles();
  const picks = await store.listPicks();
  const mutuals = await store.listMutuals();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-berryDark">Club console</h1>

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">Mutual matches ({mutuals.length})</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {mutuals.map((m, i) => (
          <li key={i} className="rounded-xl bg-cream px-4 py-2 font-semibold text-berryDark">
            {m.a} ↔ {m.b} — book their table!
          </li>
        ))}
        {mutuals.length === 0 && <li className="text-ink/50">None yet.</li>}
      </ul>

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">Matchmaker — ranked suggestions</h2>
      <p className="mt-1 text-sm text-ink/60">
        Deterministic ranking (seeking fit, city, age, availability, prompts, who picked whom).
        You decide — copy the emails you like into the assign form below.{" "}
        {aiEnabled()
          ? "AI notes are ON: every assignment gets a personal “why them” note on both sides."
          : "AI notes are OFF — add ANTHROPIC_API_KEY in Vercel to enable “why them” notes."}
      </p>
      <div className="mt-3 space-y-2">
        {profiles.map((p) => {
          const sugg = suggestFor(p, profiles, picks).slice(0, 9);
          return (
            <details key={p.id} className="rounded-2xl bg-cream/60 px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-berryDark">
                {p.name} ({p.email}) — top {sugg.length}
              </summary>
              <ol className="mt-2 space-y-1 text-sm">
                {sugg.map((s) => (
                  <li key={s.email} className={s.pickedYou ? "font-semibold text-berryDark" : ""}>
                    <span className="mr-2 inline-block w-10 rounded-full bg-white px-1.5 text-center text-xs font-bold">
                      {s.score}
                    </span>
                    {s.name}, {s.age} · {s.email}
                    {s.reasons.length > 0 && (
                      <span className="text-ink/60"> — {s.reasons.join(", ")}</span>
                    )}
                  </li>
                ))}
                {sugg.length === 0 && <li className="text-ink/50">No eligible candidates yet.</li>}
              </ol>
              {sugg.length > 0 && (
                <p className="mt-2 break-all rounded-xl bg-white px-3 py-2 text-xs text-ink/70">
                  <b>Paste-ready:</b> {sugg.map((s) => s.email).join(", ")}
                </p>
              )}
            </details>
          );
        })}
      </div>

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">Assign introductions</h2>
      <AssignForm token={searchParams.token!} />

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">Profiles ({profiles.length})</h2>
      <table className="mt-3 w-full text-left text-sm">
        <thead><tr className="border-b border-cream text-ink/60">
          <th className="py-2 pr-3">Photo</th><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Email</th>
          <th className="py-2 pr-3">Age</th><th className="py-2 pr-3">Is/Seeks</th><th className="py-2 pr-3">City</th>
          <th className="py-2 pr-3">Member link</th>
        </tr></thead>
        <tbody>
          {profiles.map(p => (
            <tr key={p.id} className="border-b border-cream/60 align-top">
              <td className="py-2 pr-3">{p.photo1 && <img src={p.photo1} alt="" className="h-14 w-14 rounded-xl object-cover" />}</td>
              <td className="py-2 pr-3 font-semibold">{p.name}</td>
              <td className="py-2 pr-3">{p.email}</td>
              <td className="py-2 pr-3">{p.age}</td>
              <td className="py-2 pr-3">{p.gender}/{p.seeking}</td>
              <td className="py-2 pr-3">{p.city}</td>
              <td className="py-2 pr-3 text-xs"><code>/me/{p.token}</code></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">All picks ({picks.length})</h2>
      <ul className="mt-2 space-y-1 text-xs text-ink/70">
        {picks.map((k, i) => <li key={i}>{k.member} → {k.candidate}</li>)}
      </ul>
    </main>
  );
}
