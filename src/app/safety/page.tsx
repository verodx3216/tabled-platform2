import { LegalShell, S } from "@/components/LegalShell";

export const metadata = { title: "Dating Safety — Tabled" };

export default function Safety() {
  return (
    <LegalShell title="Dating Safety">
      <S title="How Tabled is built for safety">
        <p>
          Every member is ID-verified — no anonymous browsing, no unverified accounts. Dates
          happen at partner venues where the house knows it&apos;s a Tabled table and both
          guests check in with a booking code. Chat opens only after a date is confirmed, so
          strangers can&apos;t message you cold. And because money can never move between
          members, the most common romance-scam playbook is structurally impossible here.
          These protections reduce risk; they don&apos;t eliminate it.{" "}
          <b>We do not run criminal background checks</b> — your judgment is still your best
          protection.
        </p>
      </S>
      <S title="Before the date">
        <p>
          Keep conversations in the app until you&apos;ve met. Don&apos;t share your home or
          work address, financial details, or daily routine with someone you haven&apos;t met.
          Video-chat first if it helps you feel sure. Tell a friend where you&apos;re going and
          when you expect to be back — share the venue, not just the neighborhood.
        </p>
      </S>
      <S title="At the table">
        <p>
          Arrive and leave on your own transportation. Keep your phone charged and your drink
          in sight. If an evening feels wrong, you can quietly ask venue staff to close your
          tab — partner venues know what that means, and there is no charge or explanation
          needed for leaving. Trust the feeling; the club will always take your side on an
          early exit.
        </p>
      </S>
      <S title="Money is the red flag">
        <p>
          No Tabled member will ever need money from you — the platform makes it impossible to
          send. Anyone who asks for money, crypto, gift cards, investment &ldquo;tips,&rdquo; or
          your financial details is violating our rules and is almost certainly a scammer.
          Stop contact and report them to us immediately.
        </p>
      </S>
      <S title="Reporting & resources">
        <p>
          Report any member or experience to{" "}
          <a className="text-berry underline" href="mailto:hello@tabled.club">hello@tabled.club</a>{" "}
          — every report is read by a human and handled confidentially. In an emergency, call
          911 first. Other resources: RAINN National Sexual Assault Hotline 1-800-656-4673
          (24/7), National Domestic Violence Hotline 1-800-799-7233, and the FTC at
          reportfraud.ftc.gov for romance scams.
        </p>
      </S>
    </LegalShell>
  );
}
