# Tabled — Founder's Execution Playbook

*The things code cannot do: accounts, approvals, contracts, and people. Work through
these in order. Everything technical referenced here is already prepared in this repo —
see README.md for the document map. This playbook is practical guidance, not legal advice;
items marked ⚖️ need a professional's sign-off.*

---

## §1. Domain & launch (this week, ~1 hour of your time, ~$12)

**You do:**

1. ✅ DONE — domain purchased: **tabled.club**. (Optional later: tabled.ae for UAE presence.)
2. Create three free accounts, all with the same email: **github.com**, **vercel.com**
   (sign in *with* GitHub), **neon.tech** (free Postgres).
3. Follow `docs/DEPLOY.md` — it is written for a non-developer and takes ~30 minutes:
   push repo → import to Vercel → paste two environment variables → add domain → set two
   DNS records at Namecheap. SSL is automatic.

**Cost:** domain ~$12/yr · Vercel free tier · Neon free tier. Total ≈ $12 to be live.

## §2. Legal entity + payments (start now — longest lead time)

Payment processors onboard **businesses**, not ideas, so the entity comes first.

1. ⚖️ **Entity.** Two sane options — discuss with an advisor which fits your tax situation:
   - **US LLC via Stripe Atlas** (stripe.com/atlas, ~$500, ~1–2 weeks): fastest path to
     Stripe, works globally, standard for startups raising US capital.
   - **UAE free-zone company** (DMCC, RAKEZ, or Dubai Internet City; ~AED 12–25K/yr):
     needed eventually for UAE operations, venue contracts, and local payment rails.
   Many founders do both: US entity for the platform/Stripe, UAE entity as the operating
   subsidiary for venue contracts. Get advice before choosing.
2. **Stripe application.** Describe the business as: *"Members-only social dining club.
   Membership fees include prepaid dining credit redeemable exclusively at partner
   restaurant venues. No user-to-user payments."* That is accurate and avoids the dating-MCC
   trap of being classified as a personals service. Expect possible follow-up questions;
   answer with the venue-restricted framing. Timeline: days to ~2 weeks.
3. **UAE rails (Phase 1):** Telr, Network International, or Checkout.com for AED billing.
   Same positioning. Start this only once Dubai revenue justifies it — Stripe handles USD fine.
4. ⚖️ **Stored-value review.** Before Phase 1 (credits at scale), have fintech counsel confirm
   the credits-as-prepaid-venue-vouchers structure in both markets (US: state gift-card/
   escheatment rules; UAE: Central Bank stored-value perimeter). Budget $5–15K. The schema
   already enforces the key property (no user-to-user transfers) — point counsel at
   `docs/ARCHITECTURE.md` → "Money never moves between users."

## §3. Identity verification (needed at Phase 1, not before)

- Vendors: **Persona** (persona.com) — fastest integration, operates globally; Onfido as
  alternative; **UAE Pass** for the strongest local trust signal later.
- Pricing: roughly $1–2 per verification — already modeled in the financial model's opex line.
- Your task is only the account signup + compliance questionnaire; the integration seam is
  prepared (`docs/INTEGRATIONS.md` #2).

## §4. Venue partnerships (your highest-leverage founder work)

The venue network is the moat — and it cannot be delegated early. Target: **30 hand-picked
venues before public launch.**

- **The pitch** (one sentence): *"We fill your quiet tables with prepaid, no-show-protected
  couples — you never hold inventory, you set your own standing rules, and we settle weekly."*
  Key: you are NOT asking for allocated tables. Each venue publishes its own always-on
  policy (e.g. "accept Tabled 2-tops Sun–Wed; Thu after 9:45pm; blackout late December")
  and can tighten it any time. Hosts propose a shortlist of venues; the platform books
  whichever shortlisted venue's rules accept — so no venue ever serves Tabled during a rush
  unless it chose to, and no allocation ever sits unused. A Tabled cover is the best cover
  a restaurant can seat: prepaid, stake-protected against no-shows, two verified adults,
  one weekly settlement, zero chargebacks.
- **Terms to standardize** (one-page agreement, ⚖️ template reviewed once, reused 30×):
  discount % (deepest on off-peak rules — ask 30–40 for Sun–Wed, accept 15–20 peak),
  standing availability rules, weekly settlement, a named contact, 90-day pilot.
- **Demand steering:** credit multipliers make member credits worth ~25% more on off-peak
  nights — members feel savvy, venues fill dead rooms, and your margin is widest exactly
  where volume flows.
- Track prospects in the `Venue` table's `status` field (prospect → active) once Phase 1
  admin exists; a spreadsheet is fine until then.

## §4b. Payment flow at the table (the spec that protects the product)

The moment being protected: two people finish dinner and simply walk out — no wallets,
no math, no awkwardness. Every rule below serves that.

- **The venue sees one payer: Tabled.** The restaurant closes the full bill to the booking
  code (like a hotel room charge) and is paid 100% in weekly settlement — it never sees a
  balance, never splits a payment, never touches a member's card. Payment is guaranteed up
  to a per-reservation cap (~3× the committed budget); beyond that, the host approves with
  one tap in the app. Any later card-decline is Tabled's receivable, never the venue's.
- **Overage is always the host's, automatically.** Every host has a card on file. When the
  venue closes the bill to the booking code, credits draw first; any remainder auto-charges
  the host's card as an instant top-up (100% conversion, no club fee). The guest is never
  asked to pay on a hosted date. Split mode (mutual dates): both commit credits 50/50 and
  each covers their own overage the same way.
- **Booking-code settlement is contractually exclusive** up to the committed amount on
  Tabled reservations. Enforcement layers: (1) the host polices it — their money is locked
  in prepaid credits, so they will insist on the booking code; (2) anomaly detection — a
  reservation with confirmed check-ins and zero recorded settlement is auto-flagged;
  (3) Phase 2+ hard lock — a single-use virtual card per reservation (limit = committed
  credits + top-up headroom) so payment physically cannot travel another rail, on the
  venue's existing POS.
- **Tips and service charges pass through at 100% — never discounted.** The platform's
  discount applies to food & beverage face value only. UAE service charges ride inside the
  bill; the host app shows a tip prompt at bill close (added to the same settlement), and
  cash tips are always fine. Put this sentence in the venue agreement verbatim.

## §4c. No-show stakes — the legally safe structure

⚖️ Brief counsel with this exact framing: stakes are **platform-fixed** (~AED 75/$20 per
side, never user-negotiated), secured at confirmation (wallet lock, or a card authorization
hold for guests, released at check-in). A no-show resolves as two independent transactions:
a **cancellation fee paid to the platform** (liquidated damages for a broken booking — the
airline/no-show-fee pattern) and a separate **goodwill credit** granted by the platform to
the member who showed up, in venue-restricted, non-withdrawable credits. Money never moves
person-to-person and never leaves the venue loop. Marketing may say "ghosting pays for their
wasted evening"; contracts and code must say "cancellation fee + goodwill credit."

## §4d. The couples wallet — success becomes revenue

When two members become a couple: no subscription. They link (which closes both to new
invitations), top up a shared wallet, and receive **15% bonus credits** on every top-up —
escalating to 18% / 20% at anniversaries — redeemable only on date nights *together*
(both partners check in; reuses the verification infra). Venues still give ~25%, so the
platform keeps a perpetual ~10% spread at zero acquisition cost: a couple averaging $300/mo
in top-ups contributes ~$58/mo. Guardrails: dating-history or verified-relationship gate,
one partner + 90-day re-link cooldown, monthly bonus-eligible cap. On breakup, two verified
members return to the pool free. Brand line: **the only dating company that pays you to
stay in love.**

## §4e. Conversation, splitting & cancellation policy

- **Splitting:** decided in-app, never at the table. Acceptance offers "as guest" or
  "accept & split"; split halves draw from each person's own wallet/card and pay the VENUE
  (never each other — firewall preserved). "Make it split" available until bill close; one
  more offer on the receipt for 24h.
- **Chat gating:** invitation carries one note; guest responds structurally (accept /
  decline / counter-propose). Freeform chat opens ONLY on confirmation, scoped to that date,
  archives 48h after. No open DMs — scarcity of chat converts intent into dinners and
  slashes moderation/harassment surface.
- **Cancellation:** reschedule-first (one free >24h). >24h: free, stakes released. <24h:
  canceller's stake resolves (fee + goodwill credit). No-show: full resolution + strike.
  Mutual cancel: free. Safety/report cancel: free for reporter, ops review.
- **Number exchange is a success signal, not a leak.** Chat was never monetized; abandoned
  balances are breakage; retained balances pull members back ("we already have dinner money
  at Zuma"). The at-risk stream is venue spread on future dinners — plugged by the couples
  wallet (15% beats cash anywhere), access perks, and a one-tap "book the second date"
  prompt in the post-date thread. KPI: second-date rebooking rate.

## §5. The first dinners (revenue + acquisition engine)

Run dinners **manually** before any of the booking software exists — the site's waitlist
plus WhatsApp is enough for the first ten:

1. Curate 6 people per table from `/admin/waitlist` (balance gender, age band, interests).
2. Collect ticket payment by Stripe Payment Link (no code needed — create in the Stripe
   dashboard, ~AED 150–250/seat, covers venue minimum).
3. Venue from your §4 pipeline; reveal 48h before; WhatsApp group per table.
4. Collect structured feedback after each dinner — this is the training data for matching.

Rule of thumb from Timeleft's playbook: the dinner *is* the marketing. Photograph the
tables (with consent), post city-specific content, and let waitlist growth compound.

## §6. App stores (Phase 3 — do not rush this)

- Stay **web-first** until Phase 2 is stable. You lose nothing: mobile web handles
  check-in QR flows fine, and you avoid both the 15–30% store commission and category risk.
- When you do submit: category is **Lifestyle / Social Networking**, positioned as a
  members' dining club with in-app venue credits. The structural fact that funds can
  never reach a person is your approval argument. Precedent to cite in review notes:
  restaurant loyalty and dining-club apps, not dating apps.

## §7. Hiring the developer (when dinner revenue starts, ~Phase 0.5)

- **Who:** one mid-to-senior full-stack developer comfortable with Next.js + TypeScript +
  Postgres. That single profile covers everything in `docs/ROADMAP.md` through Phase 2.
- **Where:** referrals first; otherwise Lemon.io / Toptal (vetted contractors,
  ~$40–80/hr remote, $100–150/hr US). A 20 hr/week contractor is enough through Phase 1.
- **Onboarding = this repo.** Point them at README.md. Their literal first task is
  `docs/INTEGRATIONS.md` §0 (adopt the ORM, ~1 day), which forces them through the whole
  codebase. If they push back on the architecture wholesale, that's a signal — it is
  deliberately boring and they should extend it, not rewrite it.
- **Before real money flows through stakes (Phase 2):** budget $5–15K for an external
  security review (see INTEGRATIONS.md "out of scope" note).

## §8. Ongoing operations checklist

- Error monitoring: Sentry free tier (developer adds in an hour).
- Analytics: Plausible (~$9/mo) — no cookie banner needed.
- Backups: Neon paid tier ($19/mo) adds point-in-time restore — turn on before Phase 1.
- Support: a shared help@ inbox (Google Workspace, $6/user/mo) from day one.

## §9. Budget summary (pre-revenue)

| Item | Cost | When |
|---|---|---|
| Domain | ~$12/yr | Now |
| Hosting (Vercel) + DB (Neon) | $0 → ~$40/mo at scale | Now / Phase 1 |
| Entity (Stripe Atlas) | ~$500 once + ~$300/yr | Now |
| UAE free-zone entity | ~AED 12–25K/yr | Before UAE venue contracts |
| Stripe fees | 2.9% + 30¢ per charge | At first ticket |
| ID verification | ~$1–2/member verified | Phase 1 |
| Legal (stored-value + venue template + ToS) | ~$8–20K total | Staged, §2/§4 |
| Developer (20 hr/wk contractor) | ~$3–6K/mo | Phase 0.5 |
| Security review | $5–15K once | Before Phase 2 |

**Total to a revenue-generating launch (dinners): under ~$2K plus your time.**
The heavy costs (entity, legal, developer) phase in only as revenue phases in.

## §10. 90-day sequence

- **Weeks 1–2:** domain + deploy (§1) · start entity (§2) · waitlist marketing begins
- **Weeks 3–6:** venue pipeline (§4) · Stripe live · first two curated dinners (§5)
- **Weeks 7–10:** dinners weekly · hire contractor (§7) · Phase 0.5 ticketing built
- **Weeks 11–13:** 30 venues signed · Phase 1 build starts · fintech counsel engaged (§2.4)
