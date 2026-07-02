import { createLink, listLinks, normalizeUrl, SlugTakenError } from "@/lib/links";

export async function GET() {
  return Response.json(await listLinks());
}

export async function POST(req: Request) {
  const { url, slug } = await req.json().catch(() => ({}));
  const normalized = normalizeUrl(url ?? "");
  if (!normalized) {
    return Response.json({ error: "Enter a valid URL." }, { status: 400 });
  }
  if (slug && !/^[a-zA-Z0-9_-]{3,32}$/.test(slug)) {
    return Response.json(
      { error: "Custom slug must be 3-32 letters, numbers, - or _." },
      { status: 400 }
    );
  }
  try {
    const link = await createLink(normalized, slug);
    return Response.json(link, { status: 201 });
  } catch (err) {
    if (err instanceof SlugTakenError) {
      return Response.json({ error: err.message }, { status: 409 });
    }
    throw err; // real errors surface as 500 instead of a misleading 409
  }
}
