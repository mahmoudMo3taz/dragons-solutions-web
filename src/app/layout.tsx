import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/exo-2/500.css";
import "@fontsource/exo-2/600.css";
import "@fontsource/exo-2/700.css";
import "@fontsource/michroma/400.css";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Logo } from "@/components/Logo";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { getTheme } from "@/lib/server-context";
import { dirOf } from "@/lib/i18n";
import { site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    metadataBase: new URL(site.url),
    title: { default: t.metaTitle, template: `%s · ${site.name}` },
    description: t.metaDesc,
    openGraph: { type: "website", siteName: site.name, title: t.metaTitle, description: t.metaDesc },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const theme = await getTheme();
  const t = getDictionary(locale);
  return (
    <html lang={locale} dir={dirOf(locale)} data-theme={theme}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
          {t.skip}
        </a>
        <SiteHeader locale={locale} t={t} theme={theme} logo={<Logo locale={locale} />} />
        <main id="main">{children}</main>
        <SiteFooter locale={locale} t={t} />
      </body>
    </html>
  );
}
