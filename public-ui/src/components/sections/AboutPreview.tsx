"use client";

import { Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";

export function AboutPreview() {
  const { t } = useLanguage();

  return (
    <section className="section-pearl px-4 py-12 sm:py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <Reveal>
          <span className="eyebrow">{t("about.eyebrow")}</span>
          <h2 className="font-heading mt-4 text-2xl font-medium leading-[1.08] tracking-tight text-deep-brown sm:text-3xl lg:text-[2.6rem]">
            {t("about.title.a")}{" "}
            <span className="italic text-gradient-gold-rich">{t("about.title.b")}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-deep-brown/80 sm:text-lg">{t("about.body")}</p>
          <Link href="/journey-of-awakening" className="btn-outline-pill mt-7 inline-flex">
            {t("cta.readJourney")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col items-center md:relative md:block">
          <Image
            src="/images/guruji-meditating.png"
            alt="Pujya Sri Gurumurthy Guruji in deep meditation"
            width={400}
            height={500}
            sizes="(max-width: 768px) 60vw, 35vw"
            className="h-auto w-[45%] object-contain sm:w-[40%] md:mx-auto md:w-[48%]"
          />
          {/* Quote card — inline centered on mobile, floating absolute on md+ */}
          <div className="relative z-20 mt-4 w-full max-w-[210px] rounded-xl border border-champagne/35 bg-white/95 p-3 backdrop-blur-sm sm:max-w-[195px] md:absolute md:-bottom-4 md:-left-8 md:mt-0 md:max-w-[175px] md:p-3.5">
            <Quote className="pointer-events-none absolute left-1.5 top-1.5 h-4 w-4 text-antique-gold/25" />
            <p className="font-heading relative z-10 pl-1.5 text-xs italic leading-relaxed text-deep-brown/95">
              {t("about.quote")}
            </p>
            <span className="mt-1.5 block text-right text-[8px] font-bold uppercase tracking-widest text-antique-gold">
              {t("about.quoteBy")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
