"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { lp, splitPath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionary";
import type { ThemeId } from "@/lib/themes";
import { ThemeSwitcher } from "./ThemeSwitcher";

const nav = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
] as const;

export function SiteHeader({ locale, t, theme, logo }: { locale: Locale; t: Dictionary; theme: ThemeId; logo: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const { path } = splitPath(pathname);
  const other: Locale = locale === "ar" ? "en" : "ar";
  const active = (p: string) => (p === "/" ? path === "/" : path === p || path.startsWith(`${p}/`));

  const langToggle = (
    <Link
      href={lp(other, path)}
      hrefLang={other}
      aria-label={t.switchLangAria}
      className="rounded-btn border border-header-foreground/30 px-3 py-1.5 text-sm font-semibold text-header-foreground transition-colors hover:bg-header-foreground/10"
    >
      {t.switchLang}
    </Link>
  );

  return (
    <header
      className="sticky top-0 z-50 border-b bg-header backdrop-blur"
      style={{ boxShadow: "0 1px 0 0 var(--header-line)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        {logo}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.path}
              href={lp(locale, n.path)}
              aria-current={active(n.path) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-header-foreground ${
                active(n.path) ? "text-header-foreground" : "text-header-foreground/75"
              }`}
            >
              {t[n.key]}
            </Link>
          ))}
          <Link
            href={lp(locale, "/inquiries")}
            className="rounded-btn bg-dragon px-4 py-2 text-sm font-semibold text-dragon-foreground transition-opacity hover:opacity-90"
          >
            {t.sendInquiry}
          </Link>
          {langToggle}
          <ThemeSwitcher current={theme} t={t} />
        </nav>
        <button
          className="text-header-foreground lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={t.menu}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-header-foreground/10 px-6 py-4 lg:hidden" aria-label="Mobile">
          {nav.map((n) => (
            <Link key={n.path} href={lp(locale, n.path)} className="text-header-foreground">
              {t[n.key]}
            </Link>
          ))}
          <Link href={lp(locale, "/inquiries")} className="font-semibold text-dragon">
            {t.sendInquiry}
          </Link>
          <div className="flex items-center gap-3">
            {langToggle}
            <ThemeSwitcher current={theme} t={t} align="start" />
          </div>
        </nav>
      )}
    </header>
  );
}
