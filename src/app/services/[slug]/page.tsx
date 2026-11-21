import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ServiceCard, ServiceVisual } from "@/components/ServiceCard";
import { getService, getServices } from "@/content/services";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { photo } from "@/lib/server-context";
import { lp } from "@/lib/i18n";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug, await getLocale());
  return s ? { title: s.title, description: s.intro } : {};
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const service = getService(slug, locale);
  if (!service) notFound();
  const others = getServices(locale).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero image={photo(`images/services/${service.slug}`)} title={service.title} subtitle={service.intro} />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <h2 className="red-rule text-3xl">{t.included}</h2>
          <ul className="mt-6 space-y-4">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dragon" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href={lp(locale, `/inquiries?service=${service.slug}`)}
            className="mt-8 inline-block rounded-btn bg-dragon px-6 py-3 font-semibold text-dragon-foreground transition-opacity hover:opacity-90"
          >
            {t.askAbout} {service.title}
          </Link>
        </div>
        <div className="aspect-[3/2] overflow-hidden rounded-lg border shadow-hover">
          <ServiceVisual service={service} />
        </div>
      </section>
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="red-rule text-2xl">{t.otherServices}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((s) => (
              <ServiceCard key={s.slug} service={s} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
