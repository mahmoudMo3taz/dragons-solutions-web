import { NextResponse, type NextRequest } from "next/server";

// Language detection. Arabic pages live under /ar (src/app/ar/...) and reuse the
// English page components; this middleware only tells them which language to render
// through the `x-locale` header. No rewrites, so it works behind any reverse proxy.
//   /en/...  -> redirected to the unprefixed English URL
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    // Build the target from the public host and protocol the visitor used, so the
    // redirect stays on the real domain behind a reverse proxy
    const proto = req.headers.get("x-forwarded-proto")?.split(",")[0] ?? "http";
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host;
    const target = `${proto}://${host}${pathname.slice(3) || "/"}${req.nextUrl.search}`;
    return NextResponse.redirect(target, 308);
  }

  const headers = new Headers(req.headers);
  headers.set("x-locale", pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Skip API routes, Next.js internals and files with an extension
  matcher: ["/((?!api|_next|brand|images|models|.*\\..*).*)"],
};
