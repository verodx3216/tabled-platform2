/**
 * All marketing copy and Phase-0 event data lives here so a
 * non-developer can edit words without touching components.
 * Phase 1 moves events into the database (see prisma/schema.prisma → Event).
 */

export const site = {
  name: "Tabled",
  tagline: "Your membership never disappears. It becomes dates.",
  sub: "Real first dates at the city\u2019s best tables \u2014 matched by AI, funded by your membership, zero swiping.",
  waitlistCta: "Join the founding waitlist",
  cities: ["New York", "Miami", "Dubai (coming soon)"],
};

export const howItWorks = [
  {
    title: "Join & verify",
    body: "Every member is ID-verified. No bots, no fakes, no anonymous browsing. Optional verified-career and lifestyle badges.",
  },
  {
    title: "Your fee becomes Date Credits",
    body: "75% of every membership fee converts into Date Credits — spendable only on real dates at our partner venues. Unused credits roll over. Nothing vanishes.",
  },
  {
    title: "An AI matchmaker with taste",
    body: "A real interview, not a swipe deck: our AI matchmaker learns what matters to you, improves with every dinner's feedback, and sends a few high-conviction introductions a week — each a concrete, funded date proposal: venue, time, budget.",
  },
  {
    title: "Show up — it's already paid",
    body: "Credits settle the bill at the venue. Both sides commit a small stake on confirmed dates; a no-show forfeits it to the person who kept their word.",
  },
];

export const tiers = [
  {
    name: "Guest",
    price: "Free",
    period: "",
    features: ["ID-verified profile", "Receive hosted invitations", "Book curated dinners"],
    highlight: false,
  },
  {
    name: "Member",
    price: "$79",
    period: "/month",
    features: [
      "$59 in Date Credits every month",
      "Credits roll over — always yours",
      "Curated introductions weekly",
      "Access to members' dinners",
    ],
    highlight: true,
  },
  {
    name: "Select",
    price: "$199",
    period: "/month",
    features: [
      "$149 in Date Credits every month",
      "Host invitations — your treat, your table",
      "Verified-standing badge",
      "Priority matching with human review",
    ],
    highlight: false,
  },
];

export const faqs = [
  {
    q: "What happens to my money if I don't go on dates?",
    a: "It stays yours. 75% of every fee converts to Date Credits that bank and roll over month after month. Cancel any time and use your remaining balance at partner venues for a defined wind-down period. Your membership is stored value, not a sunk cost.",
  },
  {
    q: "Is this a sugar dating site?",
    a: "No. Money on Tabled can only ever be spent at partner venues — it can never be sent to a person. Hosting an invitation means treating someone to dinner at a verified restaurant, the way hospitality has always worked.",
  },
  {
    q: "How do you stop ghosting?",
    a: "Confirmed dates carry a small stake from both sides. Arrive, and it goes toward the evening. Stand someone up, and your stake is transferred to them. Politeness, financially guaranteed.",
  },
  {
    q: "Why no swiping?",
    a: "Swiping optimizes for time-on-app; we optimize for dinners that happen. Our AI matchmaker interviews you when you join, learns from every date's feedback, and sends a handful of real invitations a week instead of an infinite feed — the judgment of a great matchmaker, at the scale of a great platform.",
  },
  {
    q: "What if the evening costs more than my credits?",
    a: "Top up your wallet anytime — top-ups convert 100% into Date Credits, with no club fee (that applies only to membership). If an invitation exceeds your balance, the difference is added instantly at confirmation. Your plan is a floor, never a ceiling. And your balance is always private — a guest sees the invitation, never a number.",
  },
  {
    q: "When do you launch?",
    a: "Founding members' dinners begin this autumn. The waitlist gets first seats, founding pricing, and priority verification.",
  },
];

/** Phase-0 dinners — displayed on /dinners. Booking opens with Stripe integration (docs/INTEGRATIONS.md #1). */
export const upcomingDinners = [
  {
    title: "The Founders' Table No. 1",
    tag: "Table No. 1 · September",
    meta: "Dinner for six · curated by application",
    note: "A balanced table at one of the city's best venues. Venue revealed 48 hours before.",
  },
  {
    title: "The Founders' Table No. 2",
    tag: "Table No. 2 · September",
    meta: "Dinner for six · ages 28–38",
    note: "Curated for compatible energy. Venue revealed 48 hours before.",
  },
  {
    title: "The Founders' Table No. 3",
    tag: "Table No. 3 · October",
    meta: "Dinner for six · ages 35–45",
    note: "Curated for compatible energy. Venue revealed 48 hours before.",
  },
];
