import Link from "next/link";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { lp } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-7xl text-dragon">404</h1>
        <h2 className="mt-4 text-xl">{t.notFoundTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.notFoundText}</p>
        <Link href={lp(locale, "/")} className="mt-6 inline-block rounded-btn bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {t.goHome}
        </Link>
      </div>
    </div>
  );
}
