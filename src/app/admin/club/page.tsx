import { clubStore } from "@/lib/club";
import { venueStore } from "@/lib/venues";
import AssignForm from "@/components/AssignForm";
import VenueForm from "@/components/VenueForm";

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
  const venues = await venueStore().listVenues();
  const bookings = await venueStore().listBookings();

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

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">Bookings ({bookings.length})</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {bookings.map((b) => (
          <li key={b.id || b.code + b.date} className="rounded-xl bg-cream px-4 py-2">
            <b className="font-mono">{b.code}</b> · {b.venueName} · {b.date} {b.time} — {b.memberA} + {b.memberB}
            <span className="ml-2 text-xs text-ink/50">{b.status}</span>
          </li>
        ))}
        {bookings.length === 0 && <li className="text-ink/50">None yet.</li>}
      </ul>

      <h2 className="mt-8 font-serif text-xl font-bold text-berryDark">Partner venues ({venues.length})</h2>
      <VenueForm token={searchParams.token!} />
      <ul className="mt-3 space-y-1 text-sm">
        {venues.map((v) => (
          <li key={v.id} className="rounded-xl bg-creamLight px-4 py-2">
            <b>{v.name}</b> · {v.city}{v.neighborhood ? ` (${v.neighborhood})` : ""} — {v.days} at {v.times},{" "}
            {v.tablesPerSlot} table(s)/seating, {v.leadHours}h lead
            {v.contact && <span className="ml-2 text-xs text-ink/50">{v.contact}</span>}
          </li>
        ))}
        {venues.length === 0 && <li className="text-ink/50">No partner venues yet — add your first above.</li>}
      </ul>

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
