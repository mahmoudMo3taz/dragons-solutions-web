"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { themes, THEME_COOKIE, type ThemeId } from "@/lib/themes";
import type { Dictionary } from "@/content/dictionary";

/** Switch between the four site designs. The choice is saved in a cookie for a year. */
export function ThemeSwitcher({ current, t, align = "end" }: { current: ThemeId; t: Dictionary; align?: "start" | "end" }) {
  const [theme, setTheme] = useState<ThemeId>(current);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(id: ThemeId) {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    document.cookie = `${THEME_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.themeAria}
        className="inline-flex items-center gap-2 rounded-btn border border-header-foreground/25 px-3 py-1.5 text-sm font-semibold text-header-foreground transition-colors hover:bg-header-foreground/10"
      >
        <Palette className="h-4 w-4" aria-hidden />
        <span>{t.themeNames[theme]}</span>
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 w-72 rounded-lg border bg-card p-2 text-card-foreground shadow-xl ${
            align === "end" ? "end-0" : "start-0"
          }`}
        >
          <p className="px-2 pb-2 pt-1 text-xs font-semibold text-muted-foreground">{t.theme}</p>
          {themes.map((th) => (
            <button
              key={th.id}
              type="button"
              role="menuitemradio"
              aria-checked={theme === th.id}
              onClick={() => choose(th.id)}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-start transition-colors hover:bg-muted"
            >
              <span className="flex overflow-hidden rounded-full border" aria-hidden>
                {th.swatch.map((c) => (
                  <span key={c} className="h-6 w-3" style={{ background: c }} />
                ))}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{t.themeNames[th.id]}</span>
                <span className="block text-xs text-muted-foreground">{t.themeNotes[th.id]}</span>
              </span>
              {theme === th.id && <Check className="h-4 w-4 text-dragon" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
