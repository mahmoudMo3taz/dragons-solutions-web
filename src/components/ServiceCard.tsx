import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/services";
import type { Dictionary } from "@/content/dictionary";
import { lp, type Locale } from "@/lib/i18n";
import { photo } from "@/lib/server-context";
import { ServiceArt } from "./ServiceArt";

/** Photo if public/images/services/<slug>.jpg exists, otherwise the themed illustration */
export function ServiceVisual({ service, className = "" }: { service: Service; className?: string }) {
  const src = photo(`images/services/${service.slug}`);
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={service.title} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`h-full w-full ${className}`}>
      <ServiceArt kind={service.icon} />
    </div>
  );
}

export function ServiceCard({ service, locale, t }: { service: Service; locale: Locale; t: Dictionary }) {
  return (
    <Link
      href={lp(locale, `/services/${service.slug}`)}
      className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-hover"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <ServiceVisual service={service} className="transition duration-500 group-hover:scale-105" />
      </div>
      <div className="border-t-2 border-transparent p-6 group-hover:border-dragon">
        <h3 className="text-xl">{service.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{service.short}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-dragon">
          {t.learnMore} <ArrowRight className="h-4 w-4 flip-rtl" />
        </span>
      </div>
    </Link>
  );
}
