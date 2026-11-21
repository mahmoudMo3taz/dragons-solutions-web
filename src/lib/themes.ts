import type { DragonColor } from "@/components/dragon/engine";

// The four site designs. Colours, fonts, corner radius and header/hero styling
// for each live in src/app/globals.css under [data-theme="<id>"].
export const themes = [
  { id: "night", dragon: "blue", swatch: ["#0b1324", "#2f7cf6", "#e5383b"] },
  { id: "daylight", dragon: "red", swatch: ["#ffffff", "#d7262b", "#1d4ed8"] },
  { id: "ember", dragon: "gold", swatch: ["#141010", "#f08a24", "#e3a52a"] },
  { id: "jade", dragon: "green", swatch: ["#f8f6ef", "#137a52", "#e8a33a"] },
] as const satisfies readonly { id: string; dragon: DragonColor; swatch: readonly string[] }[];

export type ThemeId = (typeof themes)[number]["id"];
export const defaultTheme: ThemeId = "night";
export const THEME_COOKIE = "theme";

export function isTheme(v: string | undefined | null): v is ThemeId {
  return !!v && themes.some((t) => t.id === v);
}

export function dragonColorFor(theme: string | undefined | null): DragonColor {
  return themes.find((t) => t.id === theme)?.dragon ?? "blue";
}
