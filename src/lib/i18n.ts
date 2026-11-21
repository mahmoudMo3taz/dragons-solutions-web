// Shared language helpers (safe in server and client components).
// English lives at /, Arabic at /ar. The middleware rewrites /ar/... to the same
// pages and passes the language in the `x-locale` header.

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Build a link for a page in the given language: lp("ar", "/about") -> "/ar/about" */
export function lp(locale: Locale, path: string) {
  if (locale === "en") return path;
  return path === "/" ? "/ar" : `/ar${path}`;
}

/** Split a browser pathname into language and page path: "/ar/about" -> { locale: "ar", path: "/about" } */
export function splitPath(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return { locale: "ar", path: pathname.slice(3) || "/" };
  }
  return { locale: "en", path: pathname || "/" };
}
