"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { guruParampara } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { LotusDivider } from "@/components/ui/lotus-divider";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

export default function GuruParamparaPage() {
  const { t, tr } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Soft Decorative Glows */}
        <div className="absolute top-20 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("parampara.hero.titleLead")} <span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic text-gold-glow">{t("parampara.hero.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-deep-brown/80 max-w-2xl mx-auto leading-relaxed">
              {t("parampara.hero.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-16" />

          {/* ── Section 1: Header ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-4xl mx-auto mb-6"
          >
            {/* Outer glow */}
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-saffron-accent/15 via-antique-gold/10 to-maroon-accent/15 blur-xl" />

            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
                  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
                  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
                  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)",
              }}
            >
              {/* Top gold line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-antique-gold/80 to-transparent" />
              {/* Bottom gold line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-antique-gold/60 to-transparent" />

              {/* Decorative OM watermark */}
              <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none opacity-[0.06]">
                <span className="font-heading text-[180px] leading-none text-champagne">ॐ</span>
              </div>

              <div className="relative z-10 px-6 py-8 text-center md:px-10">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-champagne/50">
                  Sacred Lineage
                </p>
                <h2 className="font-heading text-2xl font-bold text-pearl sm:text-3xl">
                  {t("parampara.tree.heading")}
                </h2>
                <p className="mt-2 text-sm text-pearl/55 max-w-xl mx-auto leading-relaxed">
                  {t("parampara.tree.subtitle")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Section 2: Lineage Image — fully responsive, no crop ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-4xl mx-auto mb-20"
          >
            {/* Outer glow ring */}
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-saffron-accent/15 via-antique-gold/10 to-maroon-accent/15 blur-xl" />

            <div
              className="group relative w-full cursor-zoom-in overflow-hidden rounded-2xl border border-antique-gold/25 shadow-[0_8px_48px_rgba(75,13,19,0.18)]"
              onClick={() => setLightboxOpen(true)}
            >
              {/*
                width + height set the intrinsic aspect ratio only.
                style width:100% / height:auto lets HTML decide the
                rendered size — fully fluid, zero cropping, no object-fit.
              */}
              <Image
                src="/images/guru-parampara-tree.jpg"
                alt="Guru Parampara Lineage Tree"
                width={1200}
                height={750}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 896px"
                style={{ width: "100%", height: "auto", display: "block" }}
                className="transition-transform duration-700 group-hover:scale-[1.015]"
                priority
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <span className="flex translate-y-2 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-deep-brown opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <svg className="h-4 w-4 text-saffron-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                  </svg>
                  {t("parampara.tree.expandButton")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Cosmic Source Feature */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-2xl mx-auto text-center mb-16 relative"
          >
            <div className="absolute inset-0 bg-saffron-accent/10 rounded-full blur-[60px] w-48 h-48 mx-auto pointer-events-none" />
            <div className="w-44 h-44 mx-auto rounded-full p-2 relative overflow-hidden mb-6 group">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-b from-champagne/20 to-pearl">
                <Image 
                  src="/images/adi-shiva.png"
                  alt="Adi Guru Shiva"
                  fill
                  sizes="176px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <h2 className="font-heading text-3xl font-bold text-deep-brown">{t("parampara.cosmic.heading")}</h2>
            <p className="text-saffron-accent font-semibold italic text-sm mt-1">{t("parampara.cosmic.subtitle")}</p>
          </motion.div>

          {/* Vertical Timeline */}
          <div className="relative py-8 max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron-accent/60 via-champagne to-saffron-accent/20 -translate-x-1/2" />

            <div className="space-y-16">
              {guruParampara.map((guru, index) => {
                const isEven = index % 2 === 0;
                // Skip Adi Shiva since we highlighted him above as cosmic source
                if (guru.name.toLowerCase().includes("shiva")) return null;

                return (
                  <motion.div 
                    key={guru.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.05 }}
                    className="relative flex items-center md:justify-center group"
                  >
                    {/* Node with Glow */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-saffron-accent shadow-[0_0_12px_rgba(201,130,43,0.7)] -translate-x-1/2 z-10 group-hover:scale-125 transition-all duration-300" />
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right md:ml-auto' : 'md:pl-12 md:mr-auto'}`}>
                      <div className="bg-white border border-champagne/25 hover:border-saffron-accent/40 rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_25px_rgba(185,147,69,0.08)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-accent/20 via-antique-gold/20 to-transparent" />
                        <h3 className="font-heading text-xl md:text-2xl font-bold text-deep-brown mb-2 group-hover:text-saffron-accent transition-colors duration-300">
                          {guru.name}
                        </h3>
                        <p className="text-deep-brown/75 text-sm leading-relaxed">
                          {tr({ en: guru.description, kn: guru.description_kn })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Lightbox Modal for Lineage Tree */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
            >
              <Image
                src="/images/guru-parampara-tree.jpg"
                alt="Guru Parampara Lineage Tree"
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
            <button 
              className="absolute top-6 right-6 text-white hover:text-saffron-accent font-bold text-sm bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all"
              onClick={() => setLightboxOpen(false)}
            >
              {t("parampara.lightbox.close")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
