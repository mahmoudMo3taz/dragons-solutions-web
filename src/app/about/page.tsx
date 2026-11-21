import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Target, Eye, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/content/dictionary";
import { getLocale } from "@/lib/locale-server";
import { photo } from "@/lib/server-context";
import { lp } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.aboutTitle, description: t.aboutSub };
}

const values = [
  { icon: Target, title: "missionT", text: "mission" },
  { icon: Eye, title: "visionT", text: "vision" },
  { icon: HeartHandshake, title: "valuesT", text: "values" },
] as const;
const steps = ["s1", "s2", "s3", "s4"] as const;

export default async function AboutPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <>
      <PageHero image={photo("images/about")} title={t.aboutTitle} subtitle={t.aboutSub} />

      {/* Brand band: the full logo on its own dark background */}
      <section className="border-b bg-[#060a14]">
        <Image
          src="/brand/logo-wide.webp"
          alt="Dragons Solutions logo"
          width={970}
          height={493}
          className="mx-auto w-full max-w-4xl [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <h2 className="red-rule text-3xl">{t.whoWeAre}</h2>
          <p className="mt-4 text-muted-foreground">{t.who1}</p>
          <p className="mt-4 text-muted-foreground">{t.who2}</p>
        </div>
        <div className="grid gap-4">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4 rounded-lg border-s-4 border-dragon bg-card p-5 text-card-foreground shadow-card">
              <v.icon className="h-7 w-7 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{t[v.title]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t[v.text]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="red-rule text-3xl">{t.howWeWork}</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="rounded-lg bg-card p-6 text-card-foreground shadow-card">
                <span className="font-display text-4xl font-bold text-dragon">0{i + 1}</span>
                <p className="mt-2 font-semibold">{t[s]}</p>
              </li>
            ))}
          </ol>
          <Link href={lp(locale, "/inquiries")} className="mt-10 inline-block rounded-btn bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            {t.workWithUs}
          </Link>
        </div>
      </section>
    </>
  );
}
