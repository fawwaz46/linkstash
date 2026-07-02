"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, slug: slug || undefined }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setUrl("");
    setSlug("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-[#0e0e11] p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/really/long/link"
          className="flex-1 rounded-lg border border-line bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#4a4a4a] focus:border-accent"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="custom-slug (optional)"
          className="w-full rounded-lg border border-line bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#4a4a4a] focus:border-accent sm:w-52"
        />
        <button
          disabled={busy || !url}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "…" : "Shorten"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
