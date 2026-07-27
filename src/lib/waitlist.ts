/**
 * Phase-0 storage layer — deliberately dependency-light.
 *
 * Two drivers, selected automatically by DATABASE_URL:
 *   - postgres://…  → Postgres via the pure-JS `postgres` package (PRODUCTION: Neon/Vercel)
 *   - file:…        → local SQLite via Node's built-in node:sqlite (dev / demo; no native deps)
 *
 * Production on Vercel MUST use Postgres — serverless filesystems are ephemeral.
 *
 * Growth mechanics (v2): every entry gets a short ref_code; signups arriving via
 * ?ref=CODE store it in referred_by. upsert() returns the member's queue position
 * (1-based, by signup time) so the UI can show "You're #N" + their share link.
 *
 * TODO(handover): Phase 1 replaces this file with a full ORM (Prisma or Drizzle)
 * implementing the canonical schema in docs/data-model.prisma.
 */

export type WaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  city: string | null;
  interest: string | null;
  source: string | null;
  refCode: string | null;
  referredBy: string | null;
  createdAt: string; // ISO string
};

export type NewWaitlistEntry = Omit<WaitlistEntry, "id" | "createdAt" | "refCode">;

export type JoinResult = { position: number; total: number; refCode: string };

interface WaitlistStore {
  upsert(entry: NewWaitlistEntry): Promise<JoinResult>;
  list(): Promise<WaitlistEntry[]>;
  /** Founding-application counts per city (Race to 500 leaderboard). */
  countByCity(): Promise<Array<{ city: string; count: number }>>;
}

const DDL = `
  CREATE TABLE IF NOT EXISTS waitlist_entries (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    city TEXT,
    interest TEXT,
    source TEXT,
    created_at TEXT NOT NULL
  )
`;

function newId() {
  return "wl_" + crypto.randomUUID().replace(/-/g, "");
}

/** Short, human-shareable referral code (no ambiguous chars). */
function newRefCode() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += alphabet[Math.floor(Math.random() * alphabet.length)];
  return c;
}

// ---------- Postgres driver (production) ----------

function postgresStore(url: string): WaitlistStore {
  const postgres = require("postgres") as typeof import("postgres");
  const sql = postgres(url, { max: 1 });
  const ready = (async () => {
    await sql.unsafe(DDL);
    // v2 migration — safe to run repeatedly
    await sql.unsafe(`ALTER TABLE waitlist_entries ADD COLUMN IF NOT EXISTS ref_code TEXT`);
    await sql.unsafe(`ALTER TABLE waitlist_entries ADD COLUMN IF NOT EXISTS referred_by TEXT`);
  })();
  return {
    async upsert(e) {
      await ready;
      await sql`
        INSERT INTO waitlist_entries (id, email, name, city, interest, source, ref_code, referred_by, created_at)
        VALUES (${newId()}, ${e.email}, ${e.name}, ${e.city}, ${e.interest}, ${e.source}, ${newRefCode()}, ${e.referredBy}, ${new Date().toISOString()})
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(EXCLUDED.name, waitlist_entries.name),
          city = COALESCE(EXCLUDED.city, waitlist_entries.city),
          interest = COALESCE(EXCLUDED.interest, waitlist_entries.interest),
          source = COALESCE(EXCLUDED.source, waitlist_entries.source),
          referred_by = COALESCE(waitlist_entries.referred_by, EXCLUDED.referred_by),
          ref_code = COALESCE(waitlist_entries.ref_code, EXCLUDED.ref_code)
      `;
      const [me] = await sql`
        SELECT ref_code AS "refCode", created_at AS "createdAt"
        FROM waitlist_entries WHERE email = ${e.email}
      `;
      const [{ position }] = await sql`
        SELECT COUNT(*)::int AS position FROM waitlist_entries WHERE created_at <= ${me.createdAt}
      `;
      const [{ total }] = await sql`
        SELECT COUNT(*)::int AS total FROM waitlist_entries
      `;
      return { position, total, refCode: me.refCode ?? "" };
    },
    async list() {
      await ready;
      const rows = await sql`
        SELECT id, email, name, city, interest, source,
               ref_code AS "refCode", referred_by AS "referredBy", created_at AS "createdAt"
        FROM waitlist_entries ORDER BY created_at DESC
      `;
      return rows as unknown as WaitlistEntry[];
    },
    async countByCity() {
      await ready;
      const rows = await sql`
        SELECT city, COUNT(*)::int AS count FROM waitlist_entries
        WHERE city IS NOT NULL AND city <> ''
        GROUP BY city ORDER BY count DESC
      `;
      return rows as unknown as Array<{ city: string; count: number }>;
    },
  };
}

// ---------- SQLite driver (dev/demo; Node built-in) ----------

function sqliteStore(url: string): WaitlistStore {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DatabaseSync } = require("node:sqlite");
  const path = url.replace(/^file:/, "");
  const db = new DatabaseSync(path);
  db.exec(DDL);
  for (const col of ["ref_code", "referred_by"]) {
    try {
      db.exec(`ALTER TABLE waitlist_entries ADD COLUMN ${col} TEXT`);
    } catch {
      /* column already exists */
    }
  }
  return {
    async upsert(e) {
      db.prepare(
        `INSERT INTO waitlist_entries (id, email, name, city, interest, source, ref_code, referred_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (email) DO UPDATE SET
           name = COALESCE(excluded.name, name),
           city = COALESCE(excluded.city, city),
           interest = COALESCE(excluded.interest, interest),
           source = COALESCE(excluded.source, source),
           referred_by = COALESCE(referred_by, excluded.referred_by),
           ref_code = COALESCE(ref_code, excluded.ref_code)`
      ).run(newId(), e.email, e.name, e.city, e.interest, e.source, newRefCode(), e.referredBy, new Date().toISOString());
      const me = db
        .prepare(`SELECT ref_code AS refCode, created_at AS createdAt FROM waitlist_entries WHERE email = ?`)
        .get(e.email) as { refCode: string | null; createdAt: string };
      const pos = db
        .prepare(`SELECT COUNT(*) AS position FROM waitlist_entries WHERE created_at <= ?`)
        .get(me.createdAt) as { position: number };
      const tot = db.prepare(`SELECT COUNT(*) AS total FROM waitlist_entries`).get() as { total: number };
      return { position: pos.position, total: tot.total, refCode: me.refCode ?? "" };
    },
    async list() {
      return db
        .prepare(
          `SELECT id, email, name, city, interest, source,
                  ref_code AS refCode, referred_by AS referredBy, created_at AS createdAt
           FROM waitlist_entries ORDER BY created_at DESC`
        )
        .all() as WaitlistEntry[];
    },
    async countByCity() {
      return db
        .prepare(
          `SELECT city, COUNT(*) AS count FROM waitlist_entries
           WHERE city IS NOT NULL AND city <> '' GROUP BY city ORDER BY count DESC`
        )
        .all() as Array<{ city: string; count: number }>;
    },
  };
}

// ---------- Singleton ----------

const g = globalThis as unknown as { __waitlistStore?: WaitlistStore };

export function waitlistStore(): WaitlistStore {
  if (!g.__waitlistStore) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "file:./dev.db";
    g.__waitlistStore = url.startsWith("postgres") ? postgresStore(url) : sqliteStore(url);
  }
  return g.__waitlistStore;
}
