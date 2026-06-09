"use client";

import { motion } from "framer-motion";
import { Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { Sparkles, Heart, Gift } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";

const trustItems: { icon: typeof Heart; key: UiKey }[] = [
  { icon: Heart, key: "hero.trust.guided" },
  { icon: Sparkles, key: "hero.trust.blessed" },
  { icon: Gift, key: "hero.trust.free" },
];

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="section-cosmic relative flex min-h-screen items-center justify-center overflow-hidden pb-16 pt-28">
      {/* Sacred pattern texture */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/pattern-chakras.png')] bg-[size:220px] bg-repeat opacity-[0.045]" />

      {/* Gold glow — right side, behind portrait */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.14, 0.26, 0.14] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] top-1/2 z-0 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-champagne blur-[140px]"
      />
      {/* Secondary glow — left accent */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="pointer-events-none absolute left-0 top-1/4 z-0 h-[400px] w-[400px] rounded-full bg-maroon-accent blur-[120px]"
      />

      {/* Floating motes — visible on dark */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[
          { top: "18%", left: "12%", d: 8 },
          { top: "72%", left: "18%", d: 11 },
          { top: "25%", left: "88%", d: 9 },
          { top: "78%", left: "82%", d: 13 },
          { top: "50%", left: "5%",  d: 7  },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-champagne/50"
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -24, 0], opacity: [0.1, 0.55, 0.1] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
          />
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Frosted dark badge */}
            <div className="badge-dark mx-auto mb-7 w-fit lg:mx-0">
              <Sparkles className="h-3.5 w-3.5" />
              {t("hero.badge")}
            </div>

            {/* Display headline */}
            <h1 className="font-heading mb-4 leading-tight">
              <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.25em] text-champagne/55 sm:text-[11px] lg:text-[16px] xl:text-[22px]">
                {t("hero.h1.line1")}
              </span>
              <span className="block text-[1.6rem] sm:text-[2rem] lg:text-[2.4rem] xl:text-[2.8rem] font-bold tracking-normal text-pearl leading-[1.15]">
                {t("hero.h1.name")}
              </span>
            </h1>

            {/* Tagline */}
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.25em] text-champagne/55">
              {t("hero.tagline")}
            </p>

            {/* Body — reduced from 17px → 14px */}
            <p className="mx-auto mb-5 max-w-lg text-[14px] leading-[1.75] text-pearl/62 lg:mx-0">
              {t("hero.body")}
            </p>

            {/* Pull quote — reduced from text-base → text-[13px] */}
            <blockquote className="mx-auto mb-7 max-w-md border-l-2 border-champagne/25 pl-4 text-[13px] italic leading-relaxed text-pearl/38 lg:mx-0">
              {t("hero.quote")}
            </blockquote>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-start">
              <Link href="/meet-guruji" className="btn-champagne-pill w-full sm:w-auto">
                {t("cta.book")}
              </Link>
              <Link href="/trikala-jnana" className="btn-outline-pill-dark w-full sm:w-auto">
                {t("cta.discoverTrikala")}
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-pearl/8 pt-5 lg:justify-start">
              {trustItems.map((item, i) => (
                <span key={item.key} className="inline-flex items-center gap-1.5 text-[11.5px] text-pearl/38">
                  {i > 0 && <span className="mr-3 text-pearl/18">·</span>}
                  <item.icon className="h-3 w-3 text-champagne/50" />
                  {t(item.key)}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-[420px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              {/* Outer champagne halo — stronger on dark */}
              <div className="absolute -inset-8 z-0 rounded-full bg-champagne/18 blur-[70px]" />
              {/* Mandala glow */}
              <div className="golden-aura animate-mandala-glow absolute -inset-4 z-0" />

              {/* Portrait arch frame */}
              <div className="absolute inset-0 z-10 overflow-hidden">
                {/* Subtle top gradient to blend into dark bg */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b" />
                <Image
                  src="/images/guruji-portrait.png"
                  alt="Pujya Sri Gurumurthy Guruji"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </motion.div>

            {/* Floating OM chip — dark frosted style */}
            <div className="absolute -bottom-2 left-2 z-20 rounded-2xl border border-champagne/22 bg-deep-brown/85 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:-bottom-0 sm:left-0 sm:px-4 sm:py-3 lg:-left-6">
              <p className="font-heading text-xl leading-none text-champagne sm:text-2xl">ॐ</p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-pearl/40 sm:text-[9.5px]">
                {t("hero.chip")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-20 bg-gradient-to-t from-pearl/8 to-transparent" />

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5 text-pearl/35">
        <span className="text-[8.5px] font-bold uppercase tracking-[0.22em]">Scroll</span>
        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          className="text-pearl/40"
        >
          <path
            d="M1 1L9 9L17 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
