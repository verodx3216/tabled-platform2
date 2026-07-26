# Roadmap

## Phase 0 — NOW (this repo, launchable today)
- [x] Landing page with waitlist (email + city + interest)
- [x] Founders' dinners page (content-driven)
- [x] Admin waitlist view (token-protected)
- [x] Full-product database schema
- [ ] Deploy to Vercel + domain (docs/DEPLOY.md)
- [ ] Plausible analytics (INTEGRATIONS.md #6)

## Phase 0.5 — Dinner ticketing (1–2 dev-weeks)
- [ ] Adopt ORM against docs/data-model.prisma (INTEGRATIONS.md #0)
- [ ] Stripe Checkout for dinner tickets (INTEGRATIONS.md #1)
- [ ] Move dinners from content file to Event table + tiny admin CRUD
- [ ] Resend confirmation emails (INTEGRATIONS.md #4)
- [ ] Application/curation flow for balanced tables

## Phase 1 — Memberships & wallet (4–6 dev-weeks)
- [ ] Auth (INTEGRATIONS.md #5)
- [ ] ID verification (INTEGRATIONS.md #2)
- [ ] Stripe Billing subscriptions → monthly credit allocation (ledger)
- [ ] Member dashboard: balance, ledger history
- [ ] Venue directory + partner terms admin

## Phase 2 — Invitations, reservations, stakes (6–8 dev-weeks)
- [ ] Host/Guest invitation flow
- [ ] Concierge/manual reservation booking → Reservation records
- [ ] Check-in (GPS + table QR) endpoints
- [ ] Stake lifecycle + adjudication cron
- [ ] Venue portal (check-in confirm, settlement entry)
- [ ] Security review before real value flows (PLAYBOOK.md §7)

## Phase 3 — Couples Mode & mobile
- [ ] Couples wallet: link/unlink + invitation auto-close, 15% bonus credits (partner-locked via dual check-in), anniversary escalation, caps + cooldowns
- [ ] React Native/Expo apps (thin clients on this API)
