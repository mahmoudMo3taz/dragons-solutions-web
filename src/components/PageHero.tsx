import type { ReactNode } from "react";

/**
 * Full-width page header. `image` is an optional background photo (add it in /public);
 * `aside` is shown beside the text on large screens (the home page puts the dragon there).
 */
export function PageHero({
  title,
  subtitle,
  image,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  image?: string | null;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-hero text-hero-foreground">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-arcs" />
      )}
      {image && <div className="absolute inset-0 bg-hero-overlay" />}
      <div className={`relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-20 md:py-28 ${aside ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div>
          <div className="mb-5 h-1 w-16 rounded bg-dragon" />
          <h1 className="max-w-3xl text-4xl leading-tight text-title-gradient md:text-6xl rtl:leading-snug">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-hero-foreground/80">{subtitle}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
