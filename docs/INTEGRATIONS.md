# Integrations — the gaps a developer patches

## 0. Adopt the ORM (first task, ~1 day)

Phase 0 ships a deliberately minimal storage layer (`src/lib/waitlist.ts`) so the site could
launch with zero vendor dependencies. Your first task: install Prisma (or Drizzle) on normal
infrastructure, copy `docs/data-model.prisma` to `prisma/schema.prisma`, run
`prisma db push` against the production Postgres, and replace the two call sites of
`waitlistStore()`. Everything else below builds on that ORM layer.

Each numbered section below corresponds to `TODO(handover)` markers in code.
These are ordered by launch priority. None require rearchitecting: the schema and
call sites are prepared; you are wiring vendors into marked seams.

## 1. Payments (Stripe first; UAE gateway later)

**Where:** `EventBooking.stripePaymentId`, `Membership.stripeSubId` in `docs/data-model.prisma` (adopt via ORM first — see §0).

- Phase 0.5 (dinner tickets): Stripe Checkout Session per `Event`; on `checkout.session.completed`
  webhook, set `EventBooking.status = "paid"` and store the payment id. A single
  `src/app/api/stripe/webhook/route.ts` handler is the only new file needed.
- Phase 1 (memberships): Stripe Billing subscriptions (`member_79`, `select_199`
  price ids; couples pay no subscription — wallet-spread model, see PLAYBOOK §4d). On `invoice.paid`, create the monthly credit allocation:
  `LedgerEntry(kind: "monthly_allocation", amount: plan credit in cents)` + increment wallet balance
  in the same transaction (`prisma.$transaction`).
- Dating is a **high-risk MCC** — Stripe may require review; see PLAYBOOK.md §2 for the merchant
  onboarding sequence and UAE alternatives (Telr, Network International, Checkout.com).
- Keep credits denominated in cents (already the schema convention). Never store card data.

## 2. Identity verification

**Where:** `User.verificationState`, `User.verificationRef`.

- US/global: Persona (persona.com) hosted flow — create an Inquiry, store its id in
  `verificationRef`, update `verificationState` from the webhook.
- UAE: UAE Pass integration is the gold standard locally; Persona also operates there.
- Gate: users cannot receive/send invitations until `verificationState = "verified"`.

## 3. Reservations & venue POS settlement (Phase 2)

**Where:** `Reservation`, `Stake`, `Venue.discountPct`.

- Start manual: concierge books tables and enters them; venue confirms redemption amounts
  weekly. The schema supports this without change (`settledCredits` set by admin).
- Automate later: SevenRooms/OpenTable APIs for booking; a simple venue web portal (role
  `venue_manager`) for check-in confirmation and settlement entry.
- Adjudication worker: a scheduled job (Vercel Cron) that, past `startsAt + graceMinutes`,
  resolves stakes per ARCHITECTURE.md. Resolution writes `no_show_fee` (breacher → platform)
  and `goodwill_credit` (platform → attending member) in ONE `prisma.$transaction` — never a
  direct user→user entry. Stake amounts come from platform config, not user input. Guest
  stakes are card authorization holds (Stripe manual-capture PaymentIntent): released on
  check-in, captured only on no-show.

## 3b. Table settlement & overage flow (build spec for Phase 2)

Implements PLAYBOOK.md §4b. The invariants:

- **Single-payer principle:** the venue's ONLY interface is the booking code; they close the
  FULL bill to it (hotel room-charge pattern) and are paid 100% by Tabled in weekly
  settlement. Venues never see balances, never split payments, never take a member's card.
  The credits-vs-card split happens inside the ledger AFTER bill close.
- **Sufficiency is pre-guaranteed, not table-checked:** confirmation locks wallet credits and
  charges/auth-holds the host's mandatory card on file for any committed shortfall. Bills over
  the committed budget are guaranteed to the venue up to a per-reservation cap (config, e.g.
  3× committed budget); beyond the cap, an in-app one-tap approval pushes to the host's phone
  and raises the guarantee instantly. Card-decline risk after the fact is Tabled's receivable
  (dunning + account suspension), never the venue's — the cap bounds exposure.

- **Bill close sequence:** venue closes bill to `Reservation.bookingCode` → platform draws
  locked credits first (`LedgerEntry kind: redemption`), then auto-charges the host's
  stored card for any remainder as an instant top-up (`kind: top_up` + `kind: redemption`,
  same `$transaction`). The guest is NEVER billed on a hosted date. Split mode: two wallets,
  each 50% of the bill, each host-side overage rule applied per person.
- **Card on file is mandatory for Hosts** (Stripe SetupIntent at Select signup) — it is the
  guarantee behind "invitations are never blocked and overages never touch the guest."
- **Discount applies to F&B face value only.** `Venue.discountPct` must never be applied to
  service charge or gratuity lines — model the bill as `{fnb, serviceCharge, tip}` and pass
  serviceCharge + tip through at 100% in weekly settlement.
- **Tip prompt:** host app shows tip options at bill close; tip settles through the same
  booking code, passed through untouched. Cash tips need no code path.
- **Decline waterfall:** shortfall vs committed budget is CHARGED at confirmation (decline
  there just blocks confirmation); ~24h pre-date, auth-hold the overage headroom so dying
  cards surface early (push: "update card to keep Thursday"). Post-bill capture failure:
  retry → fallback card → platform pays venue regardless; host debt = wallet offset first,
  72h in-app grace, account frozen until settled. New hosts get lower guarantee caps until
  payment history exists.
- **Bill capture channels (phased):** (1) Launch — venue portal (mobile web): booking code +
  total + photo of itemized check (photo = audit trail; itemization separates service/tip
  from discountable F&B); submit fires the ledger split + host receipt push. WhatsApp
  Business as fallback. (2) Phase 2 — Stripe Issuing real-time authorization webhook: exact
  amount arrives mid-swipe and code approves/declines applying wallet+card logic. (3) Phase
  3 — POS integration (Foodics for UAE, SevenRooms/Omnivore US) streams line items.
- **Host comms rule:** arithmetic before the date or never. Live budget math while composing;
  one summary at confirmation; instant receipt push at bill close ("500 from wallet, 620 to
  Visa — guest saw none of this"); one-tap approval only beyond the cap.
- **Anomaly flag:** scheduled job — any Reservation with both check-ins and
  `settledCredits IS NULL` after 24h → status `under_review`, notify ops. This catches
  venues settling off-platform.
- **Phase 2+ hard lock (optional):** issue a single-use virtual card per reservation
  (Stripe Issuing or Lithic; limit = locked credits + headroom) that the venue charges on
  its normal POS — replaces trust with rails, no venue hardware needed.

## 4. Email + rate limiting

**Where:** `src/app/api/waitlist/route.ts`.

- Transactional email: Resend (resend.com) — waitlist confirmation, dinner invitations.
- Rate limiting: Upstash Ratelimit (free tier) or Vercel WAF rules on `/api/*`.

## 5. Authentication (before any sensitive feature)

**Where:** `src/app/admin/waitlist/page.tsx` (currently token-in-URL — fine for a waitlist,
nothing more).

- Recommended: Clerk (fastest) or NextAuth v5 (no vendor). Email-code login; no passwords.
- Roles are already on `User.role` (`member | admin | venue_manager`).

## 6. Analytics & attribution

- Plausible or PostHog (EU-friendly, no cookie banner needed for Plausible).
- The waitlist API already accepts `source` — pass `?utm_source=` values from ads into it.

## 7. Mobile apps (Phase 3)

- React Native + Expo, sharing this backend's API routes. Do NOT fork business logic into
  the apps: keep all wallet/stake/adjudication logic server-side. The apps are thin clients.
- App-store note: submit as a "social club / events" app with venue-restricted payments;
  see PLAYBOOK.md §6 for store-policy positioning.

## Explicitly out of scope for any single developer

Production on-call, security audits before Phase 2 (stakes/wallet), and penetration testing —
budget for a specialist review before real money flows through stakes (PLAYBOOK.md §7).
