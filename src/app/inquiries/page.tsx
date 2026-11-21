import type { Metadata } from "next";
import { Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { InquiryForm } from "@/components/InquiryForm";
import { getServices, serviceSlugs } from "@/content/services";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { photo } from "@/lib/server-context";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.inqTitle, description: t.inqSub };
}

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const preselect = service && serviceSlugs.includes(service) ? service : undefined;

  return (
    <>
      <PageHero image={photo("images/inquiries")} title={t.inqTitle} subtitle={t.inqSub} />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-3">
        <aside className="space-y-6">
          <h2 className="red-rule text-2xl">{t.buildTogether}</h2>
          <p className="text-muted-foreground">{t.buildTogetherSub}</p>
          <div className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-dragon" /><span className="text-sm">{t.reply}</span></div>
          <div className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-dragon" /><span className="text-sm">{t.reviewed}</span></div>
        </aside>
        <div className="md:col-span-2">
          <InquiryForm t={t} services={getServices(locale).map(({ slug, title }) => ({ slug, title }))} defaultService={preselect} />
        </div>
      </section>
    </>
  );
}
