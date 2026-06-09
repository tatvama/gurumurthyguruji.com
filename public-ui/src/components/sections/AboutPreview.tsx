"use client";

import { Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";

export function AboutPreview() {
  const { t } = useLanguage();

  return (
    <section className="section-pearl px-4 py-16 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        <Reveal>
          <span className="eyebrow">{t("about.eyebrow")}</span>
          <h2 className="font-heading mt-4 text-3xl font-medium leading-[1.08] tracking-tight text-deep-brown sm:text-4xl lg:text-[3.2rem]">
            {t("about.title.a")}{" "}
            <span className="italic text-gradient-gold-rich">{t("about.title.b")}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-deep-brown/80 sm:text-lg">{t("about.body")}</p>
          <Link href="/about" className="btn-outline-pill mt-7 inline-flex">
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
            className="h-auto w-[60%] object-contain sm:w-[50%] md:mx-auto md:w-[65%]"
          />
          {/* Quote card — inline centered on mobile, floating absolute on md+ */}
          <div className="relative z-20 mt-4 w-full max-w-[260px] rounded-2xl border border-champagne/35 bg-white/95 p-4 backdrop-blur-sm sm:max-w-[240px] md:absolute md:-bottom-4 md:-left-8 md:mt-0 md:max-w-[220px] md:p-5">
            <Quote className="pointer-events-none absolute left-2 top-2 h-5 w-5 text-antique-gold/25" />
            <p className="font-heading relative z-10 pl-2 text-sm italic leading-relaxed text-deep-brown/95">
              {t("about.quote")}
            </p>
            <span className="mt-2 block text-right text-[9px] font-bold uppercase tracking-widest text-antique-gold">
              {t("about.quoteBy")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
