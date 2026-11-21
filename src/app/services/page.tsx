import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/content/services";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { photo } from "@/lib/server-context";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.servicesTitle, description: t.servicesSub };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <>
      <PageHero image={photo("images/hero")} title={t.servicesTitle} subtitle={t.servicesSub} />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getServices(locale).map((s) => (
            <ServiceCard key={s.slug} service={s} locale={locale} t={t} />
          ))}
        </div>
      </section>
    </>
  );
}
