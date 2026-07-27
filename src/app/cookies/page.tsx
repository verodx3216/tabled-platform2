import { LegalShell, S } from "@/components/LegalShell";

export const metadata = { title: "Cookie Policy — Tabled" };

export default function Cookies() {
  return (
    <LegalShell title="Cookie Policy">
      <S title="1. The short version">
        <p>
          Tabled uses almost no cookies. We do not run third-party advertising cookies, social
          media pixels, or cross-site trackers, and we do not sell or share data for behavioral
          advertising.
        </p>
      </S>
      <S title="2. What we actually use">
        <p>
          <b>Strictly necessary:</b> minimal first-party storage that makes the site work —
          for example, keeping your session stable while you complete an application. These
          require no consent. <b>Referral parameters:</b> if you arrive through a member&apos;s
          share link (?ref) or a campaign link (utm), we read those parameters from the URL to
          credit the person who invited you; this happens at signup, not through tracking
          cookies. <b>Analytics (future):</b> if we add analytics, we intend to use a
          privacy-first, cookieless service; if we ever adopt cookie-based analytics we will
          update this policy and, where required, ask consent first.
        </p>
      </S>
      <S title="3. Your choices">
        <p>
          You can block or clear cookies in your browser settings without losing access to the
          site&apos;s content. We honor Global Privacy Control signals. Questions:{" "}
          <a className="text-berry underline" href="mailto:hello@tabled.club">hello@tabled.club</a>.
        </p>
      </S>
    </LegalShell>
  );
}
