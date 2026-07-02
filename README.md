# LinkStash

A full-stack **URL shortener with a real analytics dashboard** — clicks over
time, top referrers, and device breakdown. No third-party analytics, and the
charts are hand-rolled SVG (zero chart-library dependencies).

![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![libSQL](https://img.shields.io/badge/libSQL-Turso-4ff8d2)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What it does

- **Shorten** any URL, optionally with a custom slug.
- **Redirect** visitors via `/:slug` and record each click (timestamp,
  referrer host, device type) — without slowing the redirect down.
- **Analyze** per link: a clicks-over-time bar chart, top referrers, and a
  desktop / mobile / tablet split.

## Why it's interesting

- **Real full-stack data flow** — Server Components read straight from the DB;
  route handlers write; a client form triggers `router.refresh()` for instant
  updates.
- **Runs anywhere** — uses libSQL, so it's a local SQLite **file** in dev and a
  hosted serverless database in production with two env vars. No code changes.
- **SQL that does the work** — click aggregation (`GROUP BY date(ts)`,
  referrer/device rollups) happens in the database, not in JavaScript.
- **No chart dependency** — the bar charts are ~40 lines of SVG.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000  (creates linkstash.db automatically)
```

Shorten a link, open it a few times in different browsers, then click **stats**.

## Deploy (serverless)

1. Create a free libSQL database at [turso.tech](https://turso.tech).
2. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your host.
3. Deploy. That's it — the same code now runs on serverless.

## Layout

```
app/
├── page.tsx              # dashboard (Server Component) + create form
├── [slug]/route.ts       # redirect + click tracking
├── stats/[slug]/page.tsx # per-link analytics
└── api/links/route.ts    # create / list links
lib/
├── db.ts                 # libSQL client + migrations
└── links.ts              # queries, slug generation, aggregation
components/
├── CreateForm.tsx        # client form
└── BarChart.tsx          # dependency-free SVG chart
```

## License

MIT
