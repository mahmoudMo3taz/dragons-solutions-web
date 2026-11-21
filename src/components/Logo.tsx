import Link from "next/link";
import Image from "next/image";
import { lp, type Locale } from "@/lib/i18n";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link href={lp(locale, "/")} dir="ltr" className="flex items-center gap-3" aria-label="Dragons Solutions home">
      <span className="grid h-11 w-11 place-items-center rounded-md bg-mark">
        <Image src="/brand/dragon-mark.png" alt="" width={40} height={32} priority />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-brand text-base tracking-wider text-brand-gradient">DRAGONS</span>
        <span className="mt-1 font-brand text-[0.55rem] tracking-[0.45em] text-brand-sub">SOLUTIONS</span>
      </span>
    </Link>
  );
}
