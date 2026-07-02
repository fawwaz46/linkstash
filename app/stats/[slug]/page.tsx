import Link from "next/link";
import { notFound } from "next/navigation";
import { getStats } from "@/lib/links";
import { BarChart } from "@/components/BarChart";

export const dynamic = "force-dynamic";

export default async function StatsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stats = await getStats(slug);
  if (!stats) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="font-mono text-xs text-muted hover:text-paper">
        ← all links
      </Link>

      <header className="mb-10 mt-4">
        <h1 className="font-mono text-3xl font-semibold text-accent">/{stats.slug}</h1>
        <p className="mt-2 truncate text-sm text-muted">{stats.url}</p>
        <p className="mt-6 text-5xl font-semibold">
          {stats.total}
          <span className="ml-2 text-lg font-normal text-muted">total clicks</span>
        </p>
      </header>

      <section className="space-y-10">
        <Panel title="Clicks over time">
          <BarChart data={stats.byDay} />
        </Panel>

        <div className="grid gap-10 sm:grid-cols-2">
          <Panel title="Top referrers">
            <BarChart data={stats.byReferrer} height={120} />
          </Panel>
          <Panel title="Devices">
            <BarChart data={stats.byDevice} height={120} />
          </Panel>
        </div>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </h2>
      <div className="rounded-2xl border border-line bg-[#0e0e11] p-5">{children}</div>
    </div>
  );
}
