"use client";

import { Link } from "@/components/ui/locale-link";
import { motion } from "framer-motion";
import { PenLine, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The signature "antaryami" section — Guruji perceives a seeker's unspoken pain
 * and quietly writes it on a slip of paper before a word is said.
 *
 *  variant="home"  → compact, ends with a CTA (homepage hook)
 *  variant="full"  → fuller heading, no CTA (embedded on the Trikāla page)
 */
export function AntaryamiSection({ variant = "home" }: { variant?: "home" | "full" }) {
  const { t } = useLanguage();
  const isHome = variant === "home";

  const Heading = isHome ? "h2" : "h2";

  return (
    <section className="section-ivory bg-mandala-soft relative overflow-hidden py-14 sm:py-20">
      {/* warm glow accents */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-champagne/14 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-saffron-accent/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

        {/* ── Text ─────────────────────────────────────────────── */}
        <Reveal>
          <span className="eyebrow">{t("antaryami.eyebrow")}</span>

          <Heading
            className={cn(
              "font-heading mt-4 font-medium leading-[1.04] tracking-tight text-deep-brown",
              isHome ? "text-3xl sm:text-4xl lg:text-[3rem]" : "text-3xl sm:text-4xl",
            )}
          >
            {t("antaryami.title")}
          </Heading>

          <p className="mt-6 text-[17px] leading-[1.85] text-deep-brown/78">
            {t("antaryami.body")}
          </p>
          <p className="mt-4 text-[17px] leading-[1.85] text-deep-brown/78">
            {t("antaryami.body2")}
          </p>

          {/* small trust line */}
          <p className="mt-7 flex items-start gap-2.5 border-l-2 border-champagne/50 pl-4 text-[14.5px] italic leading-relaxed text-deep-brown/75">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold/70" />
            {t("antaryami.stat")}
          </p>

          {isHome && (
            <Link href="/meet-guruji" className="btn-gold-pill mt-8 inline-flex">
              {t("cta.seekGuidance")}
            </Link>
          )}
        </Reveal>

        {/* ── The paper slip ───────────────────────────────────── */}
        <Reveal delay={0.12} className="flex justify-center">
          <motion.div
            initial={{ rotate: -3 }}
            whileHover={{ rotate: 0, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative w-full max-w-sm"
          >
            {/* shadow leaf behind */}
            <div className="absolute inset-0 -rotate-2 rounded-[1.25rem] bg-deep-brown/10 blur-[2px]" />

            {/* the note */}
            <div className="paper-slip relative rounded-[1.25rem] px-8 py-10">
              {/* pen chip */}
              <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-antique-gold/12 text-antique-gold ring-1 ring-antique-gold/25">
                <PenLine className="h-5 w-5" strokeWidth={1.6} />
              </div>

              <p className="font-heading text-[1.7rem] italic leading-[1.4] text-deep-brown/90">
                {t("antaryami.pullquote")}
              </p>

              {/* faux signature rule */}
              <div className="mt-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-deep-brown/15" />
                <span className="font-heading text-lg leading-none text-antique-gold">ॐ</span>
                <span className="h-px flex-1 bg-deep-brown/15" />
              </div>
              <p className="mt-3 text-center text-[10.5px] font-bold uppercase tracking-[0.2em] text-antique-gold/65">
                {t("hero.h1.name")}
              </p>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
