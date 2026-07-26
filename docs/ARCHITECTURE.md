# Architecture

## Principles

1. **Boring, mainstream stack.** Next.js + TypeScript + Tailwind + Postgres is the most
   hireable stack in the world. Any competent web developer can maintain this without ramp-up.
2. **The schema is the contract.** `docs/data-model.prisma` models the entire product (Phases 0–3).
   Features are built on top of it; it should not need structural redesign. If you must change it,
   write a migration — never edit production data by hand.
3. **Copy lives in `src/content/site.ts`**, not in components — a non-developer can edit marketing
   text without touching JSX.
4. **Every integration gap is marked.** `grep -rn "TODO(handover)"` lists every point where a real
   external service replaces a stub, each cross-referenced to `docs/INTEGRATIONS.md`.

## Layout

```
src/
  app/                    Next.js App Router
    page.tsx              Landing page (server component)
    dinners/page.tsx      Founders' dinners
    admin/waitlist/       Token-protected waitlist viewer
    api/waitlist/route.ts Waitlist POST endpoint (zod-validated)
    layout.tsx, globals.css
  components/             Client components (WaitlistForm)
  content/site.ts         ALL marketing copy + Phase-0 event data
  lib/waitlist.ts         Phase-0 storage layer (SQLite dev / Postgres prod)
docs/data-model.prisma    Canonical full-product data model (see below)
docs/                     You are here
```

## Data model — key invariants

- **Wallet/ledger:** `Wallet.balance` must always equal `SUM(LedgerEntry.amount)` for that wallet.
  The ledger is append-only; corrections are new entries (kind: `adjustment`), never edits or
  deletes. Every credit movement (allocation, redemption, stake, forfeit, referral, breakage)
  is a `LedgerEntry` with a `kind` and a `reference`.
- **Money never moves between users — with zero exceptions.** There is deliberately NO ledger
  kind for user→user transfer. No-show resolution is TWO independent transactions: the
  breacher pays the platform a fixed cancellation fee (`no_show_fee` — liquidated damages,
  same legal shape as an airline or restaurant no-show charge), and the platform separately
  grants the attending member venue-restricted credits (`goodwill_credit`) under its own
  policy. Stake amounts are platform-fixed and symbolic (~$20/side), never user-negotiated —
  a negotiable stake would look like a price for attendance, which is the category's fatal
  legal pattern. This is a compliance property, not a style choice.
- **Verification anchors:** a date's lifecycle lives on `Reservation`
  (`booked → checked_in_partial → completed | no_show | under_review`). Check-in timestamps and
  `settledCredits` are the objective evidence used by adjudication.

## Phase status

| Phase | Scope | Status |
|---|---|---|
| 0 | Landing, waitlist, dinners listing | **Built (this repo)** |
| 1 prep | Adopt Prisma/Drizzle ORM against docs/data-model.prisma | First task for incoming developer |
| 1 | Auth, memberships, Stripe billing, wallet accrual, venue portal | Schema ready; features to build |
| 2 | Invitations, reservations, check-in, stakes/adjudication | Schema ready; features to build |
| 3 | Couples Mode, mobile apps (React Native/Expo sharing this API) | Schema ready |

## Non-goals of Phase 0

No authentication, no payments, no PII beyond email — deliberately, so the site can launch
before any vendor onboarding completes. Do not add sensitive data without adding real auth
(INTEGRATIONS.md #5) first.
