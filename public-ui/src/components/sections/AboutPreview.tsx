"use client";

import { Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";

export function AboutPreview() {
  const { t } = useLanguage();

  return (
    <section className="section-pearl px-4 py-20 sm:py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-2">
        <Reveal>
          <span className="eyebrow">{t("about.eyebrow")}</span>
          <h2 className="font-heading mt-4 text-4xl font-medium leading-[1.08] tracking-tight text-deep-brown sm:text-5xl lg:text-[3.2rem]">
            {t("about.title.a")}{" "}
            <span className="italic text-gradient-gold-rich">{t("about.title.b")}</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-deep-brown/80">{t("about.body")}</p>
          <Link href="/about" className="btn-outline-pill mt-8 inline-flex">
            {t("cta.readJourney")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <Image
            src="/images/guruji-meditating.png"
            alt="Pujya Sri Gurumurthy Guruji in deep meditation"
            width={400}
            height={500}
            sizes="(max-width: 768px) 80vw, 35vw"
            className="mx-auto h-auto w-[38%] object-contain md:w-[60%]"
          />
          <div className="absolute -bottom-6 -left-4 z-20 max-w-[220px] rounded-2xl border border-champagne/35 bg-white/95 p-5 shadow-premium backdrop-blur-sm md:-left-8">
            <Quote className="pointer-events-none absolute left-2 top-2 h-6 w-6 text-antique-gold/25" />
            <p className="font-heading relative z-10 pl-2 text-sm italic leading-relaxed text-deep-brown/95">
              {t("about.quote")}
            </p>
            <span className="mt-2.5 block text-right text-[9px] font-bold uppercase tracking-widest text-antique-gold">
              {t("about.quoteBy")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
