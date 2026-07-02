import { resolveAndRecord } from "@/lib/links";

function deviceFrom(ua: string): string {
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (!ua) return "unknown";
  return "desktop";
}

function referrerHost(ref: string | null): string | null {
  if (!ref) return null;
  try {
    return new URL(ref).hostname;
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ua = req.headers.get("user-agent") ?? "";
  const ref = referrerHost(req.headers.get("referer"));

  const url = await resolveAndRecord(slug, ref, deviceFrom(ua));
  if (!url) {
    return new Response("Short link not found.", { status: 404 });
  }
  return Response.redirect(url, 302);
}
