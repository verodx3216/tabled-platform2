/**
 * Phase-0 storage layer — deliberately dependency-light.
 *
 * Two drivers, selected automatically by DATABASE_URL:
 *   - postgres://…  → Postgres via the pure-JS `postgres` package (PRODUCTION: Neon/Supabase)
 *   - file:…        → local SQLite via Node's built-in node:sqlite (dev / demo; no native deps)
 *
 * Production on Vercel MUST use Postgres — serverless filesystems are ephemeral,
 * so a SQLite file would be wiped on every deploy. Set DATABASE_URL in Vercel env.
 *
 * TODO(handover): Phase 1 replaces this file with a full ORM (Prisma or Drizzle)
 * implementing the canonical schema in docs/data-model.prisma. Only this file and
 * its two call sites (api/waitlist route, admin page) need to change — the shapes
 * below match the WaitlistEntry model exactly.
 */

export type WaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  city: string | null;
  interest: string | null;
  source: string | null;
  createdAt: string; // ISO string
};

export type NewWaitlistEntry = Omit<WaitlistEntry, "id" | "createdAt">;

interface WaitlistStore {
  upsert(entry: NewWaitlistEntry): Promise<void>;
  list(): Promise<WaitlistEntry[]>;
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

// ---------- Postgres driver (production) ----------

function postgresStore(url: string): WaitlistStore {
  // Lazy import keeps the sqlite dev path free of the dependency at runtime.
  const postgres = require("postgres") as typeof import("postgres");
  const sql = postgres(url, { max: 1 }); // serverless-friendly single connection
  const ready = sql.unsafe(DDL);
  return {
    async upsert(e) {
      await ready;
      await sql`
        INSERT INTO waitlist_entries (id, email, name, city, interest, source, created_at)
        VALUES (${newId()}, ${e.email}, ${e.name}, ${e.city}, ${e.interest}, ${e.source}, ${new Date().toISOString()})
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(EXCLUDED.name, waitlist_entries.name),
          city = COALESCE(EXCLUDED.city, waitlist_entries.city),
          interest = COALESCE(EXCLUDED.interest, waitlist_entries.interest),
          source = COALESCE(EXCLUDED.source, waitlist_entries.source)
      `;
    },
    async list() {
      await ready;
      const rows = await sql`
        SELECT id, email, name, city, interest, source, created_at AS "createdAt"
        FROM waitlist_entries ORDER BY created_at DESC
      `;
      return rows as unknown as WaitlistEntry[];
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
  return {
    async upsert(e) {
      db.prepare(
        `INSERT INTO waitlist_entries (id, email, name, city, interest, source, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (email) DO UPDATE SET
           name = COALESCE(excluded.name, name),
           city = COALESCE(excluded.city, city),
           interest = COALESCE(excluded.interest, interest),
           source = COALESCE(excluded.source, source)`
      ).run(newId(), e.email, e.name, e.city, e.interest, e.source, new Date().toISOString());
    },
    async list() {
      return db
        .prepare(
          `SELECT id, email, name, city, interest, source, created_at AS createdAt
           FROM waitlist_entries ORDER BY created_at DESC`
        )
        .all() as WaitlistEntry[];
    },
  };
}

// ---------- Singleton ----------

const g = globalThis as unknown as { __waitlistStore?: WaitlistStore };

export function waitlistStore(): WaitlistStore {
  if (!g.__waitlistStore) {
    const url = process.env.DATABASE_URL ?? "file:./dev.db";
    g.__waitlistStore = url.startsWith("postgres") ? postgresStore(url) : sqliteStore(url);
  }
  return g.__waitlistStore;
}
