import { NextResponse, type NextRequest } from "next/server";

// /ar/...  -> rendered by the same pages in Arabic (URL stays /ar/...)
// /en/...  -> redirected to the unprefixed English URL
// anything else -> English
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const headers = new Headers(req.headers);

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    headers.set("x-locale", "ar");
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  headers.set("x-locale", "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Skip API routes, Next.js internals and files with an extension
  matcher: ["/((?!api|_next|brand|images|.*\\..*).*)"],
};
