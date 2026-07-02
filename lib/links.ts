import "server-only";
import { withDb } from "./db";

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous chars

export function randomSlug(len = 6): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}

export function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export interface LinkRow {
  slug: string;
  url: string;
  created_at: string;
  clicks: number;
}

export async function createLink(url: string, custom?: string): Promise<LinkRow> {
  const db = await withDb();
  const slug = custom?.trim() || randomSlug();
  await db.execute({
    sql: "INSERT INTO links (slug, url) VALUES (?, ?)",
    args: [slug, url],
  });
  return { slug, url, created_at: new Date().toISOString(), clicks: 0 };
}

export async function listLinks(): Promise<LinkRow[]> {
  const db = await withDb();
  const res = await db.execute(`
    SELECT l.slug, l.url, l.created_at, COUNT(c.id) AS clicks
    FROM links l LEFT JOIN clicks c ON c.slug = l.slug
    GROUP BY l.slug ORDER BY l.created_at DESC
  `);
  return res.rows as unknown as LinkRow[];
}

export async function resolveAndRecord(
  slug: string,
  referrer: string | null,
  device: string
): Promise<string | null> {
  const db = await withDb();
  const res = await db.execute({
    sql: "SELECT url FROM links WHERE slug = ?",
    args: [slug],
  });
  if (res.rows.length === 0) return null;
  await db.execute({
    sql: "INSERT INTO clicks (slug, referrer, device) VALUES (?, ?, ?)",
    args: [slug, referrer, device],
  });
  return res.rows[0].url as string;
}

export interface Stats {
  slug: string;
  url: string;
  total: number;
  byDay: { label: string; value: number }[];
  byReferrer: { label: string; value: number }[];
  byDevice: { label: string; value: number }[];
}

export async function getStats(slug: string): Promise<Stats | null> {
  const db = await withDb();
  const link = await db.execute({
    sql: "SELECT slug, url FROM links WHERE slug = ?",
    args: [slug],
  });
  if (link.rows.length === 0) return null;

  const byDay = await db.execute({
    sql: `SELECT date(ts) AS label, COUNT(*) AS value FROM clicks
          WHERE slug = ? GROUP BY date(ts) ORDER BY label`,
    args: [slug],
  });
  const byReferrer = await db.execute({
    sql: `SELECT COALESCE(NULLIF(referrer,''),'direct') AS label, COUNT(*) AS value
          FROM clicks WHERE slug = ? GROUP BY label ORDER BY value DESC LIMIT 6`,
    args: [slug],
  });
  const byDevice = await db.execute({
    sql: `SELECT COALESCE(device,'unknown') AS label, COUNT(*) AS value
          FROM clicks WHERE slug = ? GROUP BY label ORDER BY value DESC`,
    args: [slug],
  });
  const total = byDay.rows.reduce((s, r) => s + Number(r.value), 0);

  return {
    slug: link.rows[0].slug as string,
    url: link.rows[0].url as string,
    total,
    byDay: byDay.rows as unknown as Stats["byDay"],
    byReferrer: byReferrer.rows as unknown as Stats["byReferrer"],
    byDevice: byDevice.rows as unknown as Stats["byDevice"],
  };
}
