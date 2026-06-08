"use client";

import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";

export function HomeTestimonials() {
  const { t } = useLanguage();

  return (
    <section className="section-ivory overflow-hidden py-20 sm:py-24">
      <Reveal className="mx-auto mb-12 max-w-3xl px-6 text-center">
        <span className="eyebrow eyebrow-center">{t("testimonials.eyebrow")}</span>
        <h2 className="font-heading mt-4 text-4xl font-medium leading-[1.08] tracking-tight text-deep-brown sm:text-5xl">
          {t("testimonials.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-deep-brown/68">
          {t("testimonials.trustline")}
        </p>
      </Reveal>
      <TestimonialCarousel />
    </section>
  );
}
