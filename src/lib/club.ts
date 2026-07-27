/**
 * Member layer storage — profiles, weekly introductions, picks, mutual matches.
 * Same dual-driver pattern as waitlist.ts (Postgres in prod, node:sqlite in dev).
 *
 * Auth model (founding phase): each profile gets a secret member token; their
 * personal page lives at /me/<token>. No passwords — the token IS the login,
 * delivered on application and meant to be bookmarked / installed as an app.
 * TODO(handover): replace with real auth (Clerk/NextAuth) in Phase 1.
 *
 * Photos are stored as small base64 JPEG data-URLs (client resizes to ~900px)
 * directly in the database — deliberately vendor-free for the founding phase.
 * TODO(handover): move to Vercel Blob / S3 when volume justifies it.
 */

export type Profile = {
  id: string;
  email: string;
  token: string;
  name: string;
  age: number;
  gender: string;   // woman | man | nonbinary
  seeking: string;  // women | men | everyone
  city: string;
  neighborhood: string | null;
  profession: string | null;
  instagram: string | null;
  prompt1: string | null; // ideal Friday
  prompt2: string | null; // what I'm looking for
  availability: string | null; // e.g. "weeknights,weekends"
  photo1: string | null; // data URL
  photo2: string | null;
  status: string; // applied | approved | paused
  createdAt: string;
};

export type NewProfile = Omit<Profile, "id" | "token" | "status" | "createdAt">;

export type IntroCard = Pick<
  Profile,
  "name" | "age" | "profession" | "neighborhood" | "prompt1" | "prompt2" | "photo1" | "photo2"
> & { candidateEmail: string; picked: boolean; mutual: boolean; note: string | null };

export interface ClubStore {
  createProfile(p: NewProfile): Promise<{ token: string; existing: boolean }>;
  getProfileByToken(token: string): Promise<Profile | null>;
  listProfiles(): Promise<Profile[]>;
  assignIntros(memberEmail: string, candidateEmails: string[], week: string, notes?: Record<string, string>): Promise<void>;
  getIntrosFor(memberEmail: string): Promise<IntroCard[]>;
  recordPick(memberEmail: string, candidateEmail: string): Promise<{ mutual: boolean }>;
  listMutuals(): Promise<Array<{ a: string; b: string }>>;
  listPicks(): Promise<Array<{ member: string; candidate: string; createdAt: string }>>;
}

const DDL = [
  `CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    seeking TEXT,
    city TEXT,
    neighborhood TEXT,
    profession TEXT,
    instagram TEXT,
    prompt1 TEXT,
    prompt2 TEXT,
    availability TEXT,
    photo1 TEXT,
    photo2 TEXT,
    status TEXT NOT NULL DEFAULT 'applied',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS intros (
    id TEXT PRIMARY KEY,
    member_email TEXT NOT NULL,
    candidate_email TEXT NOT NULL,
    week TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(member_email, candidate_email, week)
  )`,
  `CREATE TABLE IF NOT EXISTS picks (
    id TEXT PRIMARY KEY,
    member_email TEXT NOT NULL,
    candidate_email TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(member_email, candidate_email)
  )`,
];

function newId(prefix: string) {
  return prefix + "_" + crypto.randomUUID().replace(/-/g, "");
}
function newToken() {
  const a = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 22; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

const PROFILE_COLS = `id, email, token, name, age, gender, seeking, city, neighborhood,
  profession, instagram, prompt1, prompt2, availability, photo1, photo2, status,
  created_at AS "createdAt"`;

// ---------- Postgres ----------
function pgStore(url: string): ClubStore {
  const postgres = require("postgres") as typeof import("postgres");
  const sql = postgres(url, { max: 1 });
  const ready = (async () => {
    for (const d of DDL) await sql.unsafe(d);
    // migration for tables created before matchmaker notes existed
    await sql.unsafe(`ALTER TABLE intros ADD COLUMN IF NOT EXISTS note TEXT`);
  })();

  async function introCardsFor(memberEmail: string): Promise<IntroCard[]> {
    const rows = await sql`
      SELECT p.email AS "candidateEmail", p.name, p.age, p.profession, p.neighborhood,
             p.prompt1, p.prompt2, p.photo1, p.photo2, i.note,
             EXISTS(SELECT 1 FROM picks k WHERE k.member_email=${memberEmail} AND k.candidate_email=p.email) AS picked,
             (EXISTS(SELECT 1 FROM picks k WHERE k.member_email=${memberEmail} AND k.candidate_email=p.email)
              AND EXISTS(SELECT 1 FROM picks k2 WHERE k2.member_email=p.email AND k2.candidate_email=${memberEmail})) AS mutual
      FROM intros i JOIN profiles p ON p.email = i.candidate_email
      WHERE i.member_email = ${memberEmail}
      ORDER BY i.created_at DESC LIMIT 9
    `;
    return rows as unknown as IntroCard[];
  }

  return {
    async createProfile(p) {
      await ready;
      const existing = await sql`SELECT token FROM profiles WHERE email=${p.email}`;
      if (existing.length) {
        await sql`UPDATE profiles SET name=${p.name}, age=${p.age}, gender=${p.gender},
          seeking=${p.seeking}, city=${p.city}, neighborhood=${p.neighborhood},
          profession=${p.profession}, instagram=${p.instagram}, prompt1=${p.prompt1},
          prompt2=${p.prompt2}, availability=${p.availability},
          photo1=COALESCE(${p.photo1}, photo1), photo2=COALESCE(${p.photo2}, photo2)
          WHERE email=${p.email}`;
        return { token: existing[0].token as string, existing: true };
      }
      const token = newToken();
      await sql`INSERT INTO profiles (id,email,token,name,age,gender,seeking,city,neighborhood,
        profession,instagram,prompt1,prompt2,availability,photo1,photo2,status,created_at)
        VALUES (${newId("pr")},${p.email},${token},${p.name},${p.age},${p.gender},${p.seeking},
        ${p.city},${p.neighborhood},${p.profession},${p.instagram},${p.prompt1},${p.prompt2},
        ${p.availability},${p.photo1},${p.photo2},'applied',${new Date().toISOString()})`;
      return { token, existing: false };
    },
    async getProfileByToken(token) {
      await ready;
      const r = await sql.unsafe(`SELECT ${PROFILE_COLS} FROM profiles WHERE token=$1`, [token]);
      return (r[0] as unknown as Profile) ?? null;
    },
    async listProfiles() {
      await ready;
      const r = await sql.unsafe(`SELECT ${PROFILE_COLS} FROM profiles ORDER BY created_at DESC`);
      return r as unknown as Profile[];
    },
    async assignIntros(memberEmail, candidates, week, notes) {
      await ready;
      await sql`DELETE FROM intros WHERE member_email=${memberEmail} AND week=${week}`;
      for (const c of candidates) {
        const note = notes?.[c] ?? null;
        // forward + reciprocal: both sides see each other, so mutuals can happen;
        // the matchmaker note is written to the pair, so both rows carry it
        await sql`INSERT INTO intros (id,member_email,candidate_email,week,note,created_at)
          VALUES (${newId("in")},${memberEmail},${c},${week},${note},${new Date().toISOString()})
          ON CONFLICT (member_email,candidate_email,week) DO NOTHING`;
        await sql`INSERT INTO intros (id,member_email,candidate_email,week,note,created_at)
          VALUES (${newId("in")},${c},${memberEmail},${week},${note},${new Date().toISOString()})
          ON CONFLICT (member_email,candidate_email,week) DO NOTHING`;
      }
    },
    getIntrosFor: introCardsFor,
    async recordPick(memberEmail, candidateEmail) {
      await ready;
      await sql`INSERT INTO picks (id,member_email,candidate_email,created_at)
        VALUES (${newId("pk")},${memberEmail},${candidateEmail},${new Date().toISOString()})
        ON CONFLICT (member_email,candidate_email) DO NOTHING`;
      const m = await sql`SELECT 1 FROM picks WHERE member_email=${candidateEmail} AND candidate_email=${memberEmail}`;
      return { mutual: m.length > 0 };
    },
    async listMutuals() {
      await ready;
      const r = await sql`SELECT a.member_email AS a, a.candidate_email AS b FROM picks a
        JOIN picks b ON b.member_email=a.candidate_email AND b.candidate_email=a.member_email
        WHERE a.member_email < a.candidate_email`;
      return r as unknown as Array<{ a: string; b: string }>;
    },
    async listPicks() {
      await ready;
      const r = await sql`SELECT member_email AS member, candidate_email AS candidate, created_at AS "createdAt" FROM picks ORDER BY created_at DESC`;
      return r as unknown as Array<{ member: string; candidate: string; createdAt: string }>;
    },
  };
}

// ---------- SQLite (dev) ----------
function liteStore(url: string): ClubStore {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(url.replace(/^file:/, ""));
  for (const d of DDL) db.exec(d);
  try { db.exec(`ALTER TABLE intros ADD COLUMN note TEXT`); } catch { /* column exists */ }
  const cols = PROFILE_COLS.replace(/"/g, "");

  return {
    async createProfile(p) {
      const ex = db.prepare(`SELECT token FROM profiles WHERE email=?`).get(p.email) as { token: string } | undefined;
      if (ex) {
        db.prepare(`UPDATE profiles SET name=?,age=?,gender=?,seeking=?,city=?,neighborhood=?,profession=?,instagram=?,prompt1=?,prompt2=?,availability=?,photo1=COALESCE(?,photo1),photo2=COALESCE(?,photo2) WHERE email=?`)
          .run(p.name, p.age, p.gender, p.seeking, p.city, p.neighborhood, p.profession, p.instagram, p.prompt1, p.prompt2, p.availability, p.photo1, p.photo2, p.email);
        return { token: ex.token, existing: true };
      }
      const token = newToken();
      db.prepare(`INSERT INTO profiles (id,email,token,name,age,gender,seeking,city,neighborhood,profession,instagram,prompt1,prompt2,availability,photo1,photo2,status,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'applied',?)`)
        .run(newId("pr"), p.email, token, p.name, p.age, p.gender, p.seeking, p.city, p.neighborhood, p.profession, p.instagram, p.prompt1, p.prompt2, p.availability, p.photo1, p.photo2, new Date().toISOString());
      return { token, existing: false };
    },
    async getProfileByToken(token) {
      return (db.prepare(`SELECT ${cols} FROM profiles WHERE token=?`).get(token) as unknown as Profile) ?? null;
    },
    async listProfiles() {
      return db.prepare(`SELECT ${cols} FROM profiles ORDER BY created_at DESC`).all() as unknown as Profile[];
    },
    async assignIntros(memberEmail, candidates, week, notes) {
      db.prepare(`DELETE FROM intros WHERE member_email=? AND week=?`).run(memberEmail, week);
      for (const c of candidates) {
        const note = notes?.[c] ?? null;
        // forward + reciprocal: both sides see each other, so mutuals can happen;
        // the matchmaker note is written to the pair, so both rows carry it
        db.prepare(`INSERT OR IGNORE INTO intros (id,member_email,candidate_email,week,note,created_at) VALUES (?,?,?,?,?,?)`)
          .run(newId("in"), memberEmail, c, week, note, new Date().toISOString());
        db.prepare(`INSERT OR IGNORE INTO intros (id,member_email,candidate_email,week,note,created_at) VALUES (?,?,?,?,?,?)`)
          .run(newId("in"), c, memberEmail, week, note, new Date().toISOString());
      }
    },
    async getIntrosFor(memberEmail) {
      const rows = db.prepare(`
        SELECT p.email AS candidateEmail, p.name, p.age, p.profession, p.neighborhood,
               p.prompt1, p.prompt2, p.photo1, p.photo2, i.note,
               EXISTS(SELECT 1 FROM picks k WHERE k.member_email=? AND k.candidate_email=p.email) AS picked,
               (EXISTS(SELECT 1 FROM picks k WHERE k.member_email=? AND k.candidate_email=p.email)
                AND EXISTS(SELECT 1 FROM picks k2 WHERE k2.member_email=p.email AND k2.candidate_email=?)) AS mutual
        FROM intros i JOIN profiles p ON p.email = i.candidate_email
        WHERE i.member_email = ? ORDER BY i.created_at DESC LIMIT 9`)
        .all(memberEmail, memberEmail, memberEmail, memberEmail) as unknown as Array<Record<string, unknown>>;
      return rows.map(r => ({ ...(r as object), picked: !!r.picked, mutual: !!r.mutual }) as IntroCard);
    },
    async recordPick(memberEmail, candidateEmail) {
      db.prepare(`INSERT OR IGNORE INTO picks (id,member_email,candidate_email,created_at) VALUES (?,?,?,?)`)
        .run(newId("pk"), memberEmail, candidateEmail, new Date().toISOString());
      const m = db.prepare(`SELECT 1 FROM picks WHERE member_email=? AND candidate_email=?`).get(candidateEmail, memberEmail);
      return { mutual: !!m };
    },
    async listMutuals() {
      return db.prepare(`SELECT a.member_email AS a, a.candidate_email AS b FROM picks a
        JOIN picks b ON b.member_email=a.candidate_email AND b.candidate_email=a.member_email
        WHERE a.member_email < a.candidate_email`).all() as unknown as Array<{ a: string; b: string }>;
    },
    async listPicks() {
      return db.prepare(`SELECT member_email AS member, candidate_email AS candidate, created_at AS createdAt FROM picks ORDER BY created_at DESC`).all() as unknown as Array<{ member: string; candidate: string; createdAt: string }>;
    },
  };
}

const g = globalThis as unknown as { __clubStore?: ClubStore };
export function clubStore(): ClubStore {
  if (!g.__clubStore) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "file:./dev.db";
    g.__clubStore = url.startsWith("postgres") ? pgStore(url) : liteStore(url);
  }
  return g.__clubStore;
}
