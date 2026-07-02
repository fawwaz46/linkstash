import Link from "next/link";
import { listLinks } from "@/lib/links";
import { CreateForm } from "@/components/CreateForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const links = await listLinks();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          linkstash
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Short links, real analytics.
        </h1>
        <p className="mt-4 text-lg text-muted">
          Shorten a URL, then track clicks over time, top referrers, and device
          breakdown — no third-party analytics required.
        </p>
      </header>

      <CreateForm />

      <section className="mt-10">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
          {links.length} link{links.length === 1 ? "" : "s"}
        </h2>
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {links.length === 0 && (
            <li className="p-5 text-sm text-muted">
              No links yet — shorten one above.
            </li>
          )}
          {links.map((l) => (
            <li key={l.slug} className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <Link href={`/stats/${l.slug}`} className="font-mono text-accent hover:underline">
                  /{l.slug}
                </Link>
                <p className="truncate text-sm text-muted">{l.url}</p>
              </div>
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="text-sm">
                  <span className="font-semibold">{l.clicks}</span>{" "}
                  <span className="text-muted">clicks</span>
                </span>
                <Link
                  href={`/stats/${l.slug}`}
                  className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted hover:border-accent hover:text-paper"
                >
                  stats →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-24 border-t border-line pt-6 font-mono text-xs text-muted">
        Next.js App Router + libSQL. Runs on a local file DB out of the box; set{" "}
        <code className="text-paper">TURSO_DATABASE_URL</code> to deploy serverless.
      </footer>
    </main>
  );
}
