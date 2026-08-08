"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getGalleryImages, type GalleryImage } from "@/lib/api";
import { galleryCategoryKn } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)";

const GOLD_LINE =
  "absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent";

export default function GalleryPage() {
  const { t, tr, lang } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Gallery is admin-managed (see /admin → Gallery tab) — fetched live
  // from the database instead of a hardcoded list.
  useEffect(() => {
    let cancelled = false;
    getGalleryImages()
      .then((data) => { if (!cancelled) setImages(data); })
      .catch(() => { if (!cancelled) setImages([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(images.map((g) => g.category)))],
    [images],
  );

  const catLabel = (cat: string) =>
    cat === "All" ? t("gallery.filters.all") : lang === "kn" ? galleryCategoryKn[cat] ?? cat : cat;

  const filtered = activeCategory === "All" ? images : images.filter((g) => g.category === activeCategory);

  const openAt = (idx: number) => setLightboxIndex(idx);
  const close = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filtered.length]);

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-ivory bg-chakra-texture">
        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-52 pb-16" style={{ background: COSMIC }}>
          <div className={`${GOLD_LINE} top-0`} />
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
                {t("gallery.filters.all")} · Sanjeevini Kriya
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-pearl sm:text-5xl lg:text-6xl">
              {t("gallery.hero.titlePrefix")}
              <span className="italic text-champagne">{t("gallery.hero.titleAccent")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-pearl/60">
              {t("gallery.hero.subtitle")}
            </p>
          </motion.div>
          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

        {/* ── Filters ──────────────────────────────────────────────── */}
        {!loading && images.length > 0 && (
          <section className="pt-10">
            <div className="mx-auto max-w-6xl px-4 md:px-8">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300",
                      activeCategory === category
                        ? "-translate-y-0.5 border-transparent bg-gradient-to-r from-saffron-accent to-antique-gold text-white shadow-md"
                        : "border-champagne/30 bg-white text-deep-brown/70 hover:border-saffron-accent/40 hover:text-saffron-accent",
                    )}
                  >
                    {catLabel(category)}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Grid ─────────────────────────────────────────────────── */}
        <section className="py-10 pb-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-xl bg-champagne/10" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-16 text-center text-deep-brown/50">No photos yet — check back soon.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((img, idx) => (
                  <motion.button
                    key={img.id}
                    onClick={() => openAt(idx)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 8) * 0.04 }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-antique-gold/20 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-antique-gold/40 hover:shadow-[0_10px_30px_rgba(75,13,19,0.15)]"
                  >
                    <Image
                      src={img.src}
                      alt={tr({ en: img.caption, kn: img.captionKn })}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-left text-[11px] font-medium leading-snug text-white">
                        {tr({ en: img.caption, kn: img.captionKn })}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <Expand className="h-3.5 w-3.5 text-white" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[85vh] w-full max-w-3xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-antique-gold/25 shadow-2xl">
                <Image
                  src={active.src}
                  alt={tr({ en: active.caption, kn: active.captionKn })}
                  fill
                  sizes="90vw"
                  className="object-contain bg-black"
                  priority
                />
              </div>
              <p className="mt-4 max-w-lg text-center text-sm text-pearl/85">
                {tr({ en: active.caption, kn: active.captionKn })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
