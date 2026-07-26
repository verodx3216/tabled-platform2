# Tabled — Platform

The stored-value dating club. This repository contains the marketing site, waitlist,
and the data-model foundation for the full product.

**Start here, in order:**

1. `README.md` (this file) — run the project locally
2. `docs/ARCHITECTURE.md` — how the code is organized and why
3. `docs/ROADMAP.md` — what exists, what's next, phase by phase
4. `docs/INTEGRATIONS.md` — every external service gap, with exact patch points marked `TODO(handover)` in code
5. `docs/DEPLOY.md` — domain, DNS, and Vercel deployment, step by step
6. `PLAYBOOK.md` — the founder's business playbook (payments, KYC, legal, hiring)

## Quick start (local)

```bash
npm install
cp .env.example .env      # then edit ADMIN_TOKEN
npm run dev               # http://localhost:3000  (dev DB auto-creates)
```

Pages:

- `/` — marketing landing page + waitlist
- `/dinners` — founders' dinners (Phase 0 events)
- `/admin/waitlist?token=...` — waitlist admin (token from `.env`)

API:

- `POST /api/waitlist` — `{ email, name?, city?, interest?, source? }`

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · SQLite (dev, Node built-in driver) / Postgres (prod, pure-JS `postgres` package).
All choices are deliberately mainstream — any Next.js developer can take this over with zero ramp-up
on exotic tooling.

## Handover contract

Every place where a real external service must be wired in is marked in code with
`TODO(handover)` and cross-referenced to a numbered section in `docs/INTEGRATIONS.md`.
Search the codebase for `TODO(handover)` to enumerate every gap:

```bash
grep -rn "TODO(handover)" src docs
```

The canonical database schema in `docs/data-model.prisma` covers ALL product phases
(wallet, ledger, invitations, reservations, stakes, couples) so the data layer never
needs a redesign. Phase 0 uses a minimal storage layer (`src/lib/waitlist.ts`) that
implements the WaitlistEntry model; the Phase-1 developer adopts a full ORM (Prisma or
Drizzle) against that schema — on normal infrastructure Prisma installs cleanly.
