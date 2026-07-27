import Link from "next/link";
import { LogoLockup } from "@/components/Logo";

/** Shared wrapper for legal documents. */
export function LegalShell({
  title,
  updated = "July 27, 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-creamLight pb-24">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/"><LogoLockup /></Link>
        <Link href="/apply" className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berryDark">
          Apply
        </Link>
      </nav>
      <article className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="font-serif text-4xl font-bold text-berryDark">{title}</h1>
        <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>
        <div className="mt-8 space-y-8">{children}</div>
        <div className="mt-14 rounded-2xl bg-cream p-5 text-sm text-ink/70">
          Questions about this document? Write to{" "}
          <a href="mailto:hello@tabled.club" className="font-semibold text-berry hover:underline">hello@tabled.club</a>.
          {"  "}See also:{" "}
          <Link href="/terms" className="text-berry hover:underline">Terms</Link> ·{" "}
          <Link href="/credits" className="text-berry hover:underline">Date Credits</Link> ·{" "}
          <Link href="/privacy" className="text-berry hover:underline">Privacy</Link> ·{" "}
          <Link href="/cookies" className="text-berry hover:underline">Cookies</Link> ·{" "}
          <Link href="/guidelines" className="text-berry hover:underline">Guidelines</Link> ·{" "}
          <Link href="/safety" className="text-berry hover:underline">Safety</Link>
        </div>
      </article>
    </main>
  );
}

/** A titled legal section. */
export function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-berryDark">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}
