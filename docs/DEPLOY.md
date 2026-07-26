# Deploy — domain to live site

## 1. Buy the domain
Recommended registrars (either is fine; both are cheap, no-upsell, and work cleanly with Vercel):
- **Namecheap** (namecheap.com) — easiest UI, ~$10–12/yr for .com
- **Cloudflare Registrar** (cloudflare.com) — at-cost pricing, best DNS, slightly more technical

Name candidates to check: gettabled.com · jointabled.com · tabled.club · tabled.ae
(.ae via Namecheap or a UAE registrar; .com should be primary.)

## 2. Create accounts (free)
- github.com — push this repo there
- vercel.com — sign in WITH the GitHub account
- neon.tech — free Postgres database (production)

## 3. Production database
1. Create a Neon project (neon.tech, free tier) → copy the Postgres connection string.
2. That's it — the app auto-detects a postgres:// DATABASE_URL and creates its table on
   first request. No migration step needed for Phase 0.

## 4. Deploy on Vercel
1. Vercel → Add New Project → import the GitHub repo. Framework auto-detects Next.js.
2. Environment variables: `DATABASE_URL` (Neon), `ADMIN_TOKEN` (long random string).
3. Deploy — done. The waitlist table auto-creates on the first signup.

## 5. Connect the domain
Vercel Project → Settings → Domains → add yourdomain.com.
- Namecheap: set the two DNS records Vercel shows (A 76.76.21.21 + CNAME cname.vercel-dns.com).
- Cloudflare: add the same records; set proxy status to "DNS only" for the CNAME initially.
SSL is automatic. Propagation: minutes to a few hours.

## 6. Post-launch checklist
- [ ] Test the waitlist form on the live domain
- [ ] /admin/waitlist?token=… works
- [ ] Add Plausible analytics snippet
- [ ] Set up a weekly Neon backup (Neon does point-in-time restore on paid tier)
