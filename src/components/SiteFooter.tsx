import Link from "next/link";
import { getServices } from "@/content/services";
import type { Dictionary } from "@/content/dictionary";
import { lp, type Locale } from "@/lib/i18n";
import { site } from "@/config/site";
import { Dragon } from "./dragon/Dragon";
import { Logo } from "./Logo";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const services = getServices(locale);
  return (
    <>
      {/* The mascot walks back and forth along the top of the footer, in the theme's colour */}
      <div className="pointer-events-none relative z-10 mx-auto -mb-3 h-[110px] max-w-7xl px-6 sm:h-[150px]">
        <Dragon mode="walk" />
      </div>
      <footer className="border-t-4 border-dragon bg-footer text-footer-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div className="space-y-3">
            <Logo locale={locale} />
            <p className="text-sm text-footer-foreground/70">{t.footerTag}</p>
            <a href={`mailto:${site.email}`} dir="ltr" className="inline-block text-sm text-footer-foreground/70 hover:text-footer-foreground">
              {site.email}
            </a>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">{t.services}</h4>
            <ul className="grid gap-2 text-sm text-footer-foreground/70 sm:grid-cols-2 md:grid-cols-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={lp(locale, `/services/${s.slug}`)} className="hover:text-footer-foreground">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">{t.company}</h4>
            <ul className="space-y-2 text-sm text-footer-foreground/70">
              <li><Link href={lp(locale, "/about")} className="hover:text-footer-foreground">{t.aboutUs}</Link></li>
              <li><Link href={lp(locale, "/inquiries")} className="hover:text-footer-foreground">{t.inquiries}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-footer-foreground/10 py-5 text-center text-xs text-footer-foreground/60">
          © {new Date().getFullYear()} Dragons Solutions. {t.rights}
        </div>
      </footer>
    </>
  );
}
