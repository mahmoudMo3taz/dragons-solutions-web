import { existsSync } from "node:fs";
import { join } from "node:path";
import { cookies } from "next/headers";
import { defaultTheme, isTheme, THEME_COOKIE, type ThemeId } from "./themes";

/** Active design, saved in a cookie by the theme switcher */
export async function getTheme(): Promise<ThemeId> {
  const c = (await cookies()).get(THEME_COOKIE)?.value;
  return isTheme(c) ? c : defaultTheme;
}

/**
 * Optional photo: returns the public URL if the file exists in /public, otherwise null.
 *   photo("images/hero.jpg") -> "/images/hero.jpg" once you add the file
 */
export function photo(relPath: string): string | null {
  for (const ext of ["", ".jpg", ".jpeg", ".png", ".webp"]) {
    const p = relPath + ext;
    if (existsSync(join(process.cwd(), "public", p))) return `/${p}`;
  }
  return null;
}
