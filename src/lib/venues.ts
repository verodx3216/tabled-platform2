/**
 * Venue & booking layer — the "owned inventory" model.
 *
 * Restaurants pre-commit standing allocations by contract (e.g. two 2-tops,
 * Tue–Thu, 6:30 & 8:30). We only ever OFFER slots we already own, so
 * availability is answered by our own database — no external reservation
 * system needed. Double-booking is prevented by a UNIQUE(venue,date,time,slot_no)
 * constraint: claiming a table is one atomic insert.
 *
 * Flow: mutual match → member A proposes up to 3 secured options →
 * member B confirms one → booking created with a code both show at the door.
 *
 * TODO(handover): venue portal + SevenRooms/OpenTable sync live in
 * docs/INTEGRATIONS.md §3; this layer is designed to survive underneath.
 */

export type Venue = {
  id: string;
  name: string;
  city: string;
  neighborhood: string | null;
  cuisine: string | null;
  days: string;          // csv of weekdays: "tue,wed,thu"
  times: string;         // csv of seatings: "18:30,20:30"
  tablesPerSlot: number; // how many 2-tops we own per seating
  leadHours: number;     // stop offering this close to the seating (release-back window)
  contact: string | null;
  notes: string | null;
  active: number;        // 1 | 0
  createdAt: string;
};

export type SlotOption = {
  venueId: string;
  venueName: string;
  neighborhood: string | null;
  cuisine: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
};

export type Proposal = {
  proposer: string;
  other: string;
  options: SlotOption[];
  createdAt: string;
};

export type Booking = {
  id: string;
  code: string;
  venueId: string;
  venueName: string;
  neighborhood: string | null;
  date: string;
  time: string;
  memberA: string;
  memberB: string;
  status: string; // confirmed | cancelled
  createdAt: string;
};

export interface VenueStore {
  addVenue(v: Omit<Venue, "id" | "active" | "createdAt">): Promise<string>;
  listVenues(): Promise<Venue[]>;
  listBookings(): Promise<Booking[]>;
  availability(city: string, daysAhead?: number): Promise<SlotOption[]>;
  setProposal(proposer: string, other: string, options: SlotOption[]): Promise<void>;
  getProposal(a: string, b: string): Promise<Proposal | null>;
  clearProposal(a: string, b: string): Promise<void>;
  /** Atomically claim a table. Returns the booking, or null if that slot was just taken. */
  claim(a: string, b: string, opt: { venueId: string; date: string; time: string }): Promise<Booking | null>;
  getBooking(a: string, b: string): Promise<Booking | null>;
}

const DDL = [
  `CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    neighborhood TEXT,
    cuisine TEXT,
    days TEXT NOT NULL,
    times TEXT NOT NULL,
    tables_per_slot INTEGER NOT NULL DEFAULT 2,
    lead_hours INTEGER NOT NULL DEFAULT 48,
    contact TEXT,
    notes TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS table_proposals (
    pair TEXT PRIMARY KEY,
    proposer TEXT NOT NULL,
    other TEXT NOT NULL,
    options TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    pair TEXT NOT NULL,
    venue_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    slot_no INTEGER NOT NULL,
    member_a TEXT NOT NULL,
    member_b TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TEXT NOT NULL,
    UNIQUE(venue_id, date, time, slot_no)
  )`,
];

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function pairKey(a: string, b: string) {
  return [a.toLowerCase(), b.toLowerCase()].sort().join("|");
}
function newId(prefix: string) {
  return prefix + "_" + crypto.randomUUID().replace(/-/g, "");
}
function newCode() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "TBL-";
  for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

/** Compute offerable slots from venue rules minus booked counts. Pure logic, shared by both drivers. */
function computeAvailability(
  venues: Venue[],
  booked: Map<string, number>, // `${venueId}|${date}|${time}` -> count
  city: string,
  daysAhead: number
): SlotOption[] {
  const out: SlotOption[] = [];
  const now = Date.now();
  const cityLc = city.trim().toLowerCase();
  for (const v of venues) {
    if (!v.active || v.city.trim().toLowerCase() !== cityLc) continue;
    const days = v.days.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);
    const times = v.times.split(",").map((t) => t.trim()).filter(Boolean);
    for (let d = 0; d <= daysAhead; d++) {
      const dt = new Date(now + d * 86_400_000);
      if (!days.includes(WEEKDAYS[dt.getUTCDay()])) continue;
      const date = dt.toISOString().slice(0, 10);
      for (const time of times) {
        const slotMs = Date.parse(`${date}T${time}:00Z`);
        if (isNaN(slotMs) || slotMs - now < v.leadHours * 3_600_000) continue;
        const used = booked.get(`${v.id}|${date}|${time}`) ?? 0;
        if (used >= v.tablesPerSlot) continue;
        out.push({
          venueId: v.id, venueName: v.name, neighborhood: v.neighborhood,
          cuisine: v.cuisine, date, time,
        });
      }
    }
  }
  out.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
  return out;
}

const VENUE_COLS = `id, name, city, neighborhood, cuisine, days, times,
  tables_per_slot AS "tablesPerSlot", lead_hours AS "leadHours",
  contact, notes, active, created_at AS "createdAt"`;

// ---------- Postgres ----------
function pgStore(url: string): VenueStore {
  const postgres = require("postgres") as typeof import("postgres");
  const sql = postgres(url, { max: 1 });
  const ready = (async () => { for (const d of DDL) await sql.unsafe(d); })();

  async function venueList(): Promise<Venue[]> {
    const r = await sql.unsafe(`SELECT ${VENUE_COLS} FROM venues ORDER BY created_at DESC`);
    return r as unknown as Venue[];
  }
  async function bookedCounts(): Promise<Map<string, number>> {
    const rows = await sql`SELECT venue_id, date, time, COUNT(*)::int AS n FROM bookings
      WHERE status='confirmed' GROUP BY venue_id, date, time`;
    return new Map(rows.map((r) => [`${r.venue_id}|${r.date}|${r.time}`, r.n as number]));
  }

  return {
    async addVenue(v) {
      await ready;
      const id = newId("vn");
      await sql`INSERT INTO venues (id,name,city,neighborhood,cuisine,days,times,tables_per_slot,lead_hours,contact,notes,active,created_at)
        VALUES (${id},${v.name},${v.city},${v.neighborhood},${v.cuisine},${v.days},${v.times},${v.tablesPerSlot},${v.leadHours},${v.contact},${v.notes},1,${new Date().toISOString()})`;
      return id;
    },
    async listVenues() { await ready; return venueList(); },
    async listBookings() {
      await ready;
      const r = await sql`SELECT b.id, b.code, b.venue_id AS "venueId", v.name AS "venueName",
        v.neighborhood, b.date, b.time, b.member_a AS "memberA", b.member_b AS "memberB",
        b.status, b.created_at AS "createdAt"
        FROM bookings b JOIN venues v ON v.id=b.venue_id ORDER BY b.date DESC, b.time DESC`;
      return r as unknown as Booking[];
    },
    async availability(city, daysAhead = 14) {
      await ready;
      return computeAvailability(await venueList(), await bookedCounts(), city, daysAhead);
    },
    async setProposal(proposer, other, options) {
      await ready;
      const pair = pairKey(proposer, other);
      await sql`INSERT INTO table_proposals (pair, proposer, other, options, created_at)
        VALUES (${pair},${proposer},${other},${JSON.stringify(options)},${new Date().toISOString()})
        ON CONFLICT (pair) DO UPDATE SET proposer=EXCLUDED.proposer, other=EXCLUDED.other,
          options=EXCLUDED.options, created_at=EXCLUDED.created_at`;
    },
    async getProposal(a, b) {
      await ready;
      const r = await sql`SELECT proposer, other, options, created_at AS "createdAt"
        FROM table_proposals WHERE pair=${pairKey(a, b)}`;
      if (!r.length) return null;
      return { proposer: r[0].proposer, other: r[0].other, options: JSON.parse(r[0].options), createdAt: r[0].createdAt };
    },
    async clearProposal(a, b) {
      await ready;
      await sql`DELETE FROM table_proposals WHERE pair=${pairKey(a, b)}`;
    },
    async claim(a, b, opt) {
      await ready;
      const venues = await venueList();
      const v = venues.find((x) => x.id === opt.venueId);
      if (!v) return null;
      // re-validate the slot is still offerable (rules + lead time)
      const avail = computeAvailability([v], await bookedCounts(), v.city, 14);
      if (!avail.some((s) => s.venueId === opt.venueId && s.date === opt.date && s.time === opt.time)) return null;
      const pair = pairKey(a, b);
      const code = newCode();
      for (let slot = 0; slot < v.tablesPerSlot; slot++) {
        const inserted = await sql`INSERT INTO bookings (id,code,pair,venue_id,date,time,slot_no,member_a,member_b,status,created_at)
          VALUES (${newId("bk")},${code},${pair},${opt.venueId},${opt.date},${opt.time},${slot},${a},${b},'confirmed',${new Date().toISOString()})
          ON CONFLICT (venue_id,date,time,slot_no) DO NOTHING RETURNING id`;
        if (inserted.length) {
          await sql`DELETE FROM table_proposals WHERE pair=${pair}`;
          return {
            id: inserted[0].id as string, code, venueId: v.id, venueName: v.name,
            neighborhood: v.neighborhood, date: opt.date, time: opt.time,
            memberA: a, memberB: b, status: "confirmed", createdAt: new Date().toISOString(),
          };
        }
      }
      return null; // every table at that seating was just taken
    },
    async getBooking(a, b) {
      await ready;
      const r = await sql`SELECT b.id, b.code, b.venue_id AS "venueId", v.name AS "venueName",
        v.neighborhood, b.date, b.time, b.member_a AS "memberA", b.member_b AS "memberB",
        b.status, b.created_at AS "createdAt"
        FROM bookings b JOIN venues v ON v.id=b.venue_id
        WHERE b.pair=${pairKey(a, b)} AND b.status='confirmed'
        ORDER BY b.created_at DESC LIMIT 1`;
      return (r[0] as unknown as Booking) ?? null;
    },
  };
}

// ---------- SQLite (dev) ----------
function liteStore(url: string): VenueStore {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(url.replace(/^file:/, ""));
  for (const d of DDL) db.exec(d);
  const cols = VENUE_COLS.replace(/"/g, "");

  function venueList(): Venue[] {
    return db.prepare(`SELECT ${cols} FROM venues ORDER BY created_at DESC`).all() as unknown as Venue[];
  }
  function bookedCounts(): Map<string, number> {
    const rows = db.prepare(`SELECT venue_id, date, time, COUNT(*) AS n FROM bookings
      WHERE status='confirmed' GROUP BY venue_id, date, time`).all() as Array<Record<string, unknown>>;
    return new Map(rows.map((r) => [`${r.venue_id}|${r.date}|${r.time}`, r.n as number]));
  }

  return {
    async addVenue(v) {
      const id = newId("vn");
      db.prepare(`INSERT INTO venues (id,name,city,neighborhood,cuisine,days,times,tables_per_slot,lead_hours,contact,notes,active,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?)`)
        .run(id, v.name, v.city, v.neighborhood, v.cuisine, v.days, v.times, v.tablesPerSlot, v.leadHours, v.contact, v.notes, new Date().toISOString());
      return id;
    },
    async listVenues() { return venueList(); },
    async listBookings() {
      return db.prepare(`SELECT b.id, b.code, b.venue_id AS venueId, v.name AS venueName,
        v.neighborhood, b.date, b.time, b.member_a AS memberA, b.member_b AS memberB,
        b.status, b.created_at AS createdAt
        FROM bookings b JOIN venues v ON v.id=b.venue_id ORDER BY b.date DESC, b.time DESC`).all() as unknown as Booking[];
    },
    async availability(city, daysAhead = 14) {
      return computeAvailability(venueList(), bookedCounts(), city, daysAhead);
    },
    async setProposal(proposer, other, options) {
      db.prepare(`INSERT INTO table_proposals (pair, proposer, other, options, created_at) VALUES (?,?,?,?,?)
        ON CONFLICT (pair) DO UPDATE SET proposer=excluded.proposer, other=excluded.other,
          options=excluded.options, created_at=excluded.created_at`)
        .run(pairKey(proposer, other), proposer, other, JSON.stringify(options), new Date().toISOString());
    },
    async getProposal(a, b) {
      const r = db.prepare(`SELECT proposer, other, options, created_at AS createdAt FROM table_proposals WHERE pair=?`)
        .get(pairKey(a, b)) as Record<string, string> | undefined;
      if (!r) return null;
      return { proposer: r.proposer, other: r.other, options: JSON.parse(r.options), createdAt: r.createdAt };
    },
    async clearProposal(a, b) {
      db.prepare(`DELETE FROM table_proposals WHERE pair=?`).run(pairKey(a, b));
    },
    async claim(a, b, opt) {
      const v = venueList().find((x) => x.id === opt.venueId);
      if (!v) return null;
      const avail = computeAvailability([v], bookedCounts(), v.city, 14);
      if (!avail.some((s) => s.venueId === opt.venueId && s.date === opt.date && s.time === opt.time)) return null;
      const pair = pairKey(a, b);
      const code = newCode();
      for (let slot = 0; slot < v.tablesPerSlot; slot++) {
        try {
          db.prepare(`INSERT INTO bookings (id,code,pair,venue_id,date,time,slot_no,member_a,member_b,status,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,'confirmed',?)`)
            .run(newId("bk"), code, pair, opt.venueId, opt.date, opt.time, slot, a, b, new Date().toISOString());
          db.prepare(`DELETE FROM table_proposals WHERE pair=?`).run(pair);
          return {
            id: "", code, venueId: v.id, venueName: v.name, neighborhood: v.neighborhood,
            date: opt.date, time: opt.time, memberA: a, memberB: b,
            status: "confirmed", createdAt: new Date().toISOString(),
          };
        } catch { /* slot taken — try next */ }
      }
      return null;
    },
    async getBooking(a, b) {
      const r = db.prepare(`SELECT b.id, b.code, b.venue_id AS venueId, v.name AS venueName,
        v.neighborhood, b.date, b.time, b.member_a AS memberA, b.member_b AS memberB,
        b.status, b.created_at AS createdAt
        FROM bookings b JOIN venues v ON v.id=b.venue_id
        WHERE b.pair=? AND b.status='confirmed' ORDER BY b.created_at DESC LIMIT 1`)
        .get(pairKey(a, b)) as unknown as Booking | undefined;
      return r ?? null;
    },
  };
}

const g = globalThis as unknown as { __venueStore?: VenueStore };
export function venueStore(): VenueStore {
  if (!g.__venueStore) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "file:./dev.db";
    g.__venueStore = url.startsWith("postgres") ? pgStore(url) : liteStore(url);
  }
  return g.__venueStore;
}
