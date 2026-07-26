import { waitlistStore } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

/**
 * Minimal waitlist admin view, protected by a bearer token in the URL:
 *   /admin/waitlist?token=<ADMIN_TOKEN from .env>
 *
 * TODO(handover): replace with real authentication (NextAuth / Clerk)
 * before adding anything more sensitive than the waitlist.
 * See docs/INTEGRATIONS.md #5.
 */
export default async function AdminWaitlist({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || searchParams.token !== expected) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-berryDark">Not authorized</h1>
        <p className="mt-2 text-ink/70">Append ?token=YOUR_ADMIN_TOKEN to the URL.</p>
      </main>
    );
  }

  const entries = await waitlistStore().list();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-berryDark">
        Waitlist ({entries.length})
      </h1>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream text-ink/60">
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">City</th>
            <th className="py-2 pr-4">Interest</th>
            <th className="py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-cream/60">
              <td className="py-2 pr-4">{e.email}</td>
              <td className="py-2 pr-4">{e.city ?? "—"}</td>
              <td className="py-2 pr-4">{e.interest ?? "—"}</td>
              <td className="py-2">{e.createdAt.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
