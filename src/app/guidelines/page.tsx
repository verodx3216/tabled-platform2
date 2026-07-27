import { LegalShell, S } from "@/components/LegalShell";

export const metadata = { title: "Community Guidelines — Tabled" };

export default function Guidelines() {
  return (
    <LegalShell title="Community Guidelines">
      <S title="Be real">
        <p>
          One profile, your real name, your own recent photos, your true age. Impersonation,
          catfishing, or misrepresenting yourself — including your relationship status — is
          grounds for removal. Every member is ID-verified; keep your profile worthy of that.
        </p>
      </S>
      <S title="Money never moves between members">
        <p>
          This is the club&apos;s founding rule. Never request, offer, or accept money, gifts of
          monetary value, or &ldquo;arrangements&rdquo; of any kind from another member — on
          Tabled or off it. Sugar-dating, escorting, compensated companionship, and commercial
          solicitation of members have zero tolerance here: one report, investigation, and
          permanent removal. If anyone asks you for money, report it — that person is not here
          for what you&apos;re here for.
        </p>
      </S>
      <S title="Respect the table">
        <p>
          No harassment, hate, or cruelty — in chat, at dinner, or after. A polite decline is
          final; pursuing someone after a no is harassment. Treat venue staff as well as you
          treat your date; partner venues report conduct to us. Disagreement about chemistry is
          life; disrespect is a violation.
        </p>
      </S>
      <S title="Show up">
        <p>
          Confirmed dates are commitments. Cancel within the stated window if plans change; a
          no-show costs your stake and, repeated, your membership. Chronic late cancellations
          are treated as no-shows.
        </p>
      </S>
      <S title="Privacy is mutual">
        <p>
          Profiles, photos, matchmaker notes, and conversations are shared with you in
          confidence. Do not screenshot, repost, or share other members&apos; information
          anywhere. Who you saw, picked, or dined with stays private — that discretion is why
          the club works. Public disclosure of another member&apos;s presence on Tabled is a
          violation.
        </p>
      </S>
      <S title="No commercial use">
        <p>
          Membership is for dating, not marketing. No promotion, recruiting, fundraising, or
          selling to members. Tabled creator partners are the only exception, operate under
          written agreements, and always disclose their partnership.
        </p>
      </S>
      <S title="Reporting & enforcement">
        <p>
          Report any concern to{" "}
          <a className="text-berry underline" href="mailto:hello@tabled.club">hello@tabled.club</a>{" "}
          — reports are confidential and reviewed by a human. Enforcement ranges from warning to
          permanent removal without refund of membership fees, and we cooperate with law
          enforcement where conduct may be criminal. Safety-related reports (threats,
          exploitation, anyone under 18) are escalated immediately.
        </p>
      </S>
    </LegalShell>
  );
}
