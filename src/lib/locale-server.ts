import { headers } from "next/headers";
import type { Locale } from "./i18n";

/** Current page language, set by src/middleware.ts */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  return h.get("x-locale") === "ar" ? "ar" : "en";
}
