import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { DragonShowcase } from "@/components/dragon/DragonShowcase";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.dragon.title, robots: { index: false } };
}

// Preview page for the mascot: /dragon and /ar/dragon (not linked in the menu)
export default async function DragonPage() {
  const t = getDictionary(await getLocale());
  return (
    <>
      <PageHero title={t.dragon.title} subtitle={t.dragon.lead} />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <DragonShowcase labels={t.dragon} />
      </section>
    </>
  );
}
