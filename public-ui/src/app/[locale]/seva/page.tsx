"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { sevaStats } from "@/lib/data";
import { HeartHandshake, Utensils, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)";

const GOLD_LINE = "absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent";

export default function SevaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-pearl bg-chakra-texture">

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-24 pb-16" style={{ background: COSMIC }}>
          <div className={`${GOLD_LINE} top-0`} />
          {/* OM watermark */}
          {/* OM watermark — pt-16 shifts it below the fixed navbar */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden pt-28">
            <span className="font-heading text-[320px] leading-none text-champagne opacity-[0.04]">ॐ</span>
          </div>
          {/* glow blobs */}
          <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-saffron-accent/15 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-maroon-accent/20 blur-[60px]" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8"
          >
            {/* eyebrow chip */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/20 bg-champagne/8 px-4 py-1.5">
              <Sparkles className="h-3 w-3 text-champagne" />
              <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-champagne/70">
                Sadhguru Sai Samsthana Trust
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight text-pearl sm:text-5xl lg:text-6xl">
              {t("sevapage.hero.titleLead")}{" "}
              <span className="italic text-champagne">{t("sevapage.hero.titleAccent")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pearl/60">
              {t("sevapage.hero.subtitle")}
            </p>
          </motion.div>

          {/* Stats inside hero */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10 mx-4 mt-10 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-antique-gold/20 sm:mx-auto"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {sevaStats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center py-5 px-3 text-center ${idx < sevaStats.length - 1 ? "border-r border-antique-gold/15" : ""}`}
              >
                <span className="font-heading text-2xl font-bold leading-none text-champagne sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-pearl/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

        {/* ── Initiatives ─────────────────────────────────────────── */}
        <section className="py-14">
          <div className="mx-auto max-w-5xl px-4 md:px-8">

            {/* section header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center"
            >
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.26em] text-antique-gold">
                How We Serve
              </p>
              <h2 className="font-heading text-2xl font-bold leading-tight text-deep-brown sm:text-3xl">
                {t("sevapage.initiatives.heading")}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Annadana */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="group relative overflow-hidden rounded-2xl border border-champagne/30 bg-white/75 backdrop-blur-sm transition-all duration-300 hover:border-saffron-accent/35 hover:shadow-[0_8px_28px_rgba(75,13,19,0.10)]"
              >
                {/* accent top */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-saffron-accent/60 to-transparent" />
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-saffron-accent/20 bg-saffron-accent/8 transition-all duration-300 group-hover:bg-saffron-accent/15">
                      <Utensils className="h-5 w-5 text-saffron-accent" />
                    </div>
                    <h3 className="font-heading text-lg font-bold leading-snug text-deep-brown transition-colors duration-300 group-hover:text-saffron-accent">
                      {t("sevapage.initiatives.annadana.title")}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-deep-brown/70">
                    {t("sevapage.initiatives.annadana.body")}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-saffron-accent/70 transition-colors group-hover:text-saffron-accent">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>

              {/* Education / Compassionate service */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-champagne/30 bg-white/75 backdrop-blur-sm transition-all duration-300 hover:border-antique-gold/35 hover:shadow-[0_8px_28px_rgba(75,13,19,0.10)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/60 to-transparent" />
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-antique-gold/20 bg-antique-gold/8 transition-all duration-300 group-hover:bg-antique-gold/15">
                      <HeartHandshake className="h-5 w-5 text-antique-gold" />
                    </div>
                    <h3 className="font-heading text-lg font-bold leading-snug text-deep-brown transition-colors duration-300 group-hover:text-antique-gold">
                      {t("sevapage.initiatives.education.title")}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-deep-brown/70">
                    {t("sevapage.initiatives.education.body")}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-antique-gold/70 transition-colors group-hover:text-antique-gold">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-14" style={{ background: COSMIC }}>
          <div className={`${GOLD_LINE} top-0`} />
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat bg-[size:120px] opacity-[0.04]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
            <span className="font-heading text-[280px] leading-none text-champagne opacity-[0.04]">ॐ</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 mx-auto max-w-2xl px-4 text-center md:px-8"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.28em] text-champagne/45">
              Join the Mission
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-champagne sm:text-4xl">
              {t("sevapage.cta.heading")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-pearl/60">
              {t("sevapage.cta.body")}
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="h-auto border-0 bg-gradient-to-r from-saffron-accent to-antique-gold px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                {t("sevapage.cta.button")}
              </Button>
              <p className="mt-4 text-[11px] italic text-pearl/40">
                {t("sevapage.cta.note")}
              </p>
            </div>
          </motion.div>
          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

      </main>
      <Footer />
    </>
  );
}
