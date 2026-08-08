"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AshramCard } from "@/components/cards/AshramCard";
import { ashrams, ashramStatusKn } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)";

const GOLD_LINE =
  "absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent";

export default function AshramsPage() {
  const { t, tr, lang } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-ivory bg-chakra-texture">

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-52 pb-16" style={{ background: COSMIC }}>
          <div className={`${GOLD_LINE} top-0`} />
          {/* OM watermark — pt-16 shifts it below the fixed navbar */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden pt-28">
            <span className="font-heading text-[300px] leading-none text-champagne opacity-[0.04]">ॐ</span>
          </div>
          <div className="pointer-events-none absolute -top-16 left-1/3 h-56 w-56 rounded-full bg-saffron-accent/15 blur-[70px]" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-2xl px-4 text-center md:px-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/20 bg-champagne/8 px-4 py-1.5">
              <Sparkles className="h-3 w-3 text-champagne" />
              <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-champagne/70">
                Sacred Centres · Karnataka
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-pearl sm:text-5xl lg:text-6xl">
              {t("ashramspage.hero.titlePrefix")}
              <span className="italic text-champagne">{t("ashramspage.hero.titleAccent")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-pearl/60">
              {t("ashramspage.hero.subtitle")}
            </p>
          </motion.div>
          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

        {/* ── Ashram banner ────────────────────────────────────────── */}
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="group relative overflow-hidden rounded-2xl border border-antique-gold/20 shadow-[0_4px_32px_rgba(75,13,19,0.12)]"
            >
              <div className={`${GOLD_LINE} top-0 z-20`} />

              <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
                <Image
                  src="/ashramImg.png"
                  alt="Sadhguru Sai Samsthana Ashram at sunrise, on the river's edge"
                  fill
                  sizes="(max-width: 768px) 100vw, 1152px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                {/* Scrim so the title/caption stay legible over any part of the photo */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-7 text-center sm:pb-9">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-antique-gold/40 bg-antique-gold/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                    <MapPin className="h-5 w-5 text-champagne sm:h-6 sm:w-6" />
                  </div>
                  <p className="font-heading text-lg font-bold text-pearl drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-xl">
                    {t("ashramspage.map.title")}
                  </p>
                  <p className="mt-1.5 text-xs text-pearl/70 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-sm">
                    {t("ashramspage.map.caption")}
                  </p>
                </div>
              </div>

              <div className={`${GOLD_LINE} bottom-0 z-20`} />
            </motion.div>
          </div>
        </section>

        {/* ── Ashram Cards ────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-7 text-center"
            >
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.26em] text-antique-gold">
                Our Centres
              </p>
              <h2 className="font-heading text-2xl font-bold leading-tight text-deep-brown sm:text-3xl">
                Ashrams Across Karnataka
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ashrams.map((ashram, idx) => (
                <motion.div
                  key={ashram.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                >
                  <AshramCard
                    name={ashram.name}
                    location={ashram.location}
                    status={ashram.status}
                    statusLabel={lang === "kn" ? ashramStatusKn[ashram.status] ?? ashram.status : ashram.status}
                    description={tr({ en: ashram.description, kn: ashram.description_kn })}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
