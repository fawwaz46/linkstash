import "server-only";
import { createClient, type Client } from "@libsql/client";

// Local dev uses a file DB; set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN to point
// at a hosted libSQL/Turso database in production (works on serverless).
let client: Client | null = null;
let ready: Promise<void> | null = null;

function defaultUrl(): string {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  // On serverless (Vercel) the only writable path is /tmp — good enough for a
  // live demo, though it's ephemeral. Set TURSO_DATABASE_URL for real persistence.
  if (process.env.VERCEL) return "file:/tmp/linkstash.db";
  return "file:linkstash.db";
}

function db(): Client {
  if (!client) {
    client = createClient({
      url: defaultUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

async function migrate(): Promise<void> {
  const c = db();
  await c.batch(
    [
      `CREATE TABLE IF NOT EXISTS links (
        slug        TEXT PRIMARY KEY,
        url         TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS clicks (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        slug        TEXT NOT NULL REFERENCES links(slug) ON DELETE CASCADE,
        ts          TEXT NOT NULL DEFAULT (datetime('now')),
        referrer    TEXT,
        device      TEXT
      )`,
      `CREATE INDEX IF NOT EXISTS idx_clicks_slug ON clicks(slug)`,
    ],
    "write"
  );
}

/** Ensure migrations run exactly once per process before any query. */
export async function withDb(): Promise<Client> {
  if (!ready) ready = migrate();
  await ready;
  return db();
}
