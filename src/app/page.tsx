import Link from "next/link";
import { ShieldCheck, Zap, Users, Cog } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { HeroDragon } from "@/components/dragon/HeroDragon";
import { getServices } from "@/content/services";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { photo } from "@/lib/server-context";
import { lp } from "@/lib/i18n";

const reasons = [
  { icon: Zap, title: "r1t", text: "r1" },
  { icon: ShieldCheck, title: "r2t", text: "r2" },
  { icon: Users, title: "r3t", text: "r3" },
  { icon: Cog, title: "r4t", text: "r4" },
] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const services = getServices(locale);

  return (
    <>
      <PageHero
        image={photo("images/hero")}
        title={t.heroTitle}
        subtitle={t.heroSub}
        aside={<HeroDragon hint={t.dragonHint} />}
      >
        <div className="flex flex-wrap gap-4">
          <Link href={lp(locale, "/inquiries")} className="rounded-btn bg-dragon px-6 py-3 font-semibold text-dragon-foreground transition-opacity hover:opacity-90">
            {t.startProject}
          </Link>
          <Link href={lp(locale, "/services")} className="rounded-btn border border-hero-foreground/30 px-6 py-3 font-semibold text-hero-foreground transition-colors hover:bg-hero-foreground/10">
            {t.ourServices}
          </Link>
        </div>
      </PageHero>

      <section className="bg-arcs">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="red-rule text-3xl md:text-4xl">{t.whatWeDo}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t.whatWeDoSub}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="red-rule text-3xl md:text-4xl">{t.why}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-lg bg-card p-6 text-card-foreground shadow-card">
                <r.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg">{t[r.title]}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t[r.text]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-hero text-hero-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <h2 className="text-3xl">
            {t.ctaTitle} <span className="text-dragon">{t.ctaRed}</span>
          </h2>
          <Link href={lp(locale, "/inquiries")} className="rounded-btn bg-dragon px-6 py-3 font-semibold text-dragon-foreground transition-opacity hover:opacity-90">
            {t.ctaBtn}
          </Link>
        </div>
      </section>
    </>
  );
}
