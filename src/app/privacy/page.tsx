import { LegalShell, S } from "@/components/LegalShell";

export const metadata = { title: "Privacy Policy — Tabled" };

export default function Privacy() {
  return (
    <LegalShell title="Privacy Policy">
      <S title="1. Scope">
        <p>
          This policy explains how Tabled collects, uses, and shares personal information when
          you use tabled.club. Because Tabled is a dating service, some of what you share with
          us is sensitive by nature — we treat it that way.
        </p>
      </S>

      <S title="2. What we collect">
        <p>
          <b>Account &amp; application:</b> name, email, age, city and neighborhood, profession,
          Instagram handle (optional), photos, written prompts, availability.{" "}
          <b>Sensitive information:</b> your gender and who you&apos;re seeking — information
          that can reveal sexual orientation. We collect it <b>only with your consent</b>, given
          when you submit your application, and use it solely to make introductions.{" "}
          <b>Membership &amp; wallet (when live):</b> plan, transactions, credit balance,
          bookings, and attendance (for the no-show program). Payment card details will be
          processed by our payment processor and never stored by Tabled.{" "}
          <b>Usage:</b> pages viewed, referral code and campaign parameters (?ref, utm), device
          and log data. <b>Identity verification (when live):</b> handled by a specialized
          vendor with separate notice and, where biometric comparison is used, your{" "}
          <b>prior written consent</b>; verification images are deleted on a published retention
          schedule and never used for any other purpose (see §7).
        </p>
      </S>

      <S title="3. How we use it">
        <p>
          To run the club: verify members, curate introductions, book tables, operate the
          wallet, prevent fraud and abuse, and send service messages. Marketing email is sent
          only with the ability to opt out in every message; SMS only with your prior express
          written consent, which you may revoke by any reasonable means, including replying
          STOP.
        </p>
      </S>

      <S title="4. AI-assisted matchmaking (profiling notice)">
        <p>
          Tabled uses automated tools, including AI language models, to help rank potential
          introductions and draft matchmaker notes. <b>A human reviews and approves every
          introduction before it is sent</b> — no significant decision about you is made solely
          by automated means. Matching considers your application answers and, in the future,
          post-date feedback. You may opt out of AI-assisted ranking (a human will curate
          without AI assistance) or object to profiling by emailing{" "}
          <a className="text-berry underline" href="mailto:hello@tabled.club">hello@tabled.club</a>.
        </p>
      </S>

      <S title="5. What we share — and what we don't">
        <p>
          <b>We do not sell your personal information, and we do not share it for cross-context
          behavioral advertising.</b> Venues receive only what a reservation needs: a first
          name, party size, and booking code — never your contact details, balance, or profile.
          Other members see your profile card only when we introduce you, and your picks stay
          private unless mutual. Service providers process data under contract on our behalf:
          hosting (Vercel), database (Neon), AI processing (Anthropic), and, when live, payments
          (Stripe), email (Resend), and identity verification. We disclose information if the
          law requires it or to protect members from harm.
        </p>
      </S>

      <S title="6. Your rights, state by state">
        <p>
          As of 2026, twenty states have comprehensive privacy laws — including California,
          Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland,
          Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island,
          Tennessee, Texas, Utah, and Virginia. Wherever you live, Tabled honors the strongest
          common set: the right to <b>know/access</b> what we hold, <b>correct</b> it,{" "}
          <b>delete</b> it, receive a <b>portable copy</b>, <b>opt out</b> of targeted
          advertising, sale, and profiling (we do none of the first two), and{" "}
          <b>limit use of sensitive information</b> to what the service requires. We never
          discriminate for exercising rights. We honor Global Privacy Control signals.{" "}
          <b>California residents:</b> this section plus §2 serves as your notice at collection;
          you may act via an authorized agent. <b>Virginia, Colorado, Connecticut and similar
          states:</b> if we deny a request you may appeal by replying to our decision, and if
          the appeal fails we will tell you how to contact your Attorney General.{" "}
          <b>Washington &amp; Nevada:</b> Tabled does not collect consumer health data. To
          exercise any right, email{" "}
          <a className="text-berry underline" href="mailto:hello@tabled.club">hello@tabled.club</a>{" "}
          with the subject &ldquo;Privacy request&rdquo; — we verify, then respond within 45
          days.
        </p>
      </S>

      <S title="7. Biometric information (Illinois, Texas, Washington & elsewhere)">
        <p>
          When identity verification launches, it may involve comparing a selfie to your photo
          ID, which can involve biometric identifiers. Before any collection you will receive
          written notice of what is collected, why, and for how long, and we will obtain your
          written release. Biometric data will be used only for verification, never sold or
          disclosed for value, protected with reasonable security, and{" "}
          <b>permanently destroyed once verification is complete</b> or within the statutory
          period, whichever is sooner.
        </p>
      </S>

      <S title="8. Retention & security">
        <p>
          We keep personal information only as long as needed for the purposes above or as the
          law requires, then delete or de-identify it. Deleting your account removes your
          profile from circulation immediately; residual records (e.g., transactions we must
          keep for tax or audit) are retained only as required. We use encryption in transit,
          access controls, and least-privilege administration. No system is perfectly secure —
          if a breach affects you, we will notify you as the law requires.
        </p>
      </S>

      <S title="9. Minors, changes, contact">
        <p>
          Tabled is strictly 18+; we do not knowingly collect information from anyone under 18
          and delete it on discovery. We will post updates to this policy here and, for material
          changes, notify you directly. Contact:{" "}
          <a className="text-berry underline" href="mailto:hello@tabled.club">hello@tabled.club</a>.
        </p>
      </S>
    </LegalShell>
  );
}
