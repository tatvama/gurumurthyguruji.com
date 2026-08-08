"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/components/ui/locale-link";
import { getArticles, incrementArticleView, articleContentHtml, type Article } from "@/lib/api";
import { articleCategoryKn } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const GOLD_LINE =
  "absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent";

function formatDate(iso: string | undefined, lang: "en" | "kn") {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const { t, tr, lang } = useLanguage();
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getArticles()
      .then((data) => { if (!cancelled) setArticles(data); })
      .catch(() => { if (!cancelled) setArticles([]); });
    return () => { cancelled = true; };
  }, []);

  const article = articles?.find((a) => a.slug === params.slug);

  // Best-effort view counter — fires once per mount, only once the article
  // is actually resolved (declared before any early return so hook order
  // stays stable across renders per the Rules of Hooks).
  useEffect(() => {
    if (article) incrementArticleView(article.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  const allPhotos = article ? [article.cover, ...article.gallery] : [];

  const carouselPrev = () => setCarouselIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length);
  const carouselNext = () => setCarouselIndex((i) => (i + 1) % allPhotos.length);

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + allPhotos.length) % allPhotos.length));
  const showNext = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % allPhotos.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex]);

  if (articles === null) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-ivory pt-32 pb-24 text-center text-deep-brown/50">Loading…</main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-ivory pt-32 pb-24 text-center">
          <p className="mb-4 text-deep-brown/60">This article could not be found.</p>
          <Link href="/articles" className="text-saffron-accent font-semibold">
            {t("articles.backToAll")}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const catLabel = lang === "kn" ? articleCategoryKn[article.category] ?? article.category : article.category;
  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2);
  const activePhoto = lightboxIndex !== null ? allPhotos[lightboxIndex] : null;

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-ivory bg-chakra-texture pb-20">
        {/* ── Slim top bar — back link, overlaid on the hero image below ── */}
        <div className="relative z-20 bg-deep-brown pt-20 pb-3 sm:pt-24">
          <div className={`${GOLD_LINE} bottom-0`} />
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-champagne/70 transition-colors hover:text-champagne"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("articles.backToAll")}
            </Link>
          </div>
        </div>

        {/* ── Feature image — full width, 70vh ─────────────────────────── */}
        <div className="relative w-full" style={{ height: "70vh" }}>
          <Image
            src={article.cover}
            alt={tr({ en: article.title, kn: article.titleKn })}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        {/* ── Slider (left) + Text (right) ─────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
            {/* LEFT — one-image-at-a-time carousel: feature image + every
                gallery photo, with side arrows and dot indicators. Click
                the image itself to open the full-screen lightbox. */}
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-antique-gold">
                Photo Gallery ({allPhotos.length})
              </p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-antique-gold/25 bg-black shadow-[0_16px_40px_-16px_rgba(75,13,19,0.35)]">
                <button
                  onClick={() => setLightboxIndex(carouselIndex)}
                  className="absolute inset-0 z-0"
                  aria-label="View larger"
                >
                  <Image
                    src={allPhotos[carouselIndex]}
                    alt={`${tr({ en: article.title, kn: article.titleKn })} — photo ${carouselIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </button>
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={carouselPrev}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={carouselNext}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {allPhotos.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {allPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      aria-label={`Go to photo ${idx + 1}`}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        idx === carouselIndex ? "bg-saffron-accent" : "bg-antique-gold/25"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — all text content */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-saffron-accent" />
                <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-saffron-accent">
                  {catLabel}
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold leading-tight text-deep-brown sm:text-3xl">
                {tr({ en: article.title, kn: article.titleKn })}
              </h1>
              <div className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-deep-brown/50">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(article.createdAt, lang)}
                {article.author && <span>· {article.author}</span>}
              </div>

              <article
                className="prose-article mt-6 text-[15px] leading-[1.85] text-deep-brown/85"
                style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                dangerouslySetInnerHTML={{ __html: articleContentHtml(article.content) }}
              />

              {article.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-antique-gold/25 bg-antique-gold/5 px-3 py-1 text-[11px] font-medium text-deep-brown/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related articles ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mx-auto mt-4 max-w-7xl px-4 md:px-8">
            <div className="border-t border-antique-gold/20 pt-8">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-antique-gold">
                More on {catLabel}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/articles/${r.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-antique-gold/15 bg-white p-3 transition-all duration-300 hover:border-antique-gold/40 hover:shadow-[0_8px_24px_rgba(75,13,19,0.1)]"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image src={r.cover} alt={tr({ en: r.title, kn: r.titleKn })} fill sizes="80px" className="object-cover" />
                    </div>
                    <h4 className="font-heading text-[14px] font-bold leading-snug text-deep-brown transition-colors duration-300 group-hover:text-maroon-accent">
                      {tr({ en: r.title, kn: r.titleKn })}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* ── Lightbox — click any slider thumbnail to view it larger ───── */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label="Previous"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label="Next"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div
              className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-xl border border-antique-gold/25 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={activePhoto} alt="" fill sizes="90vw" className="object-contain bg-black" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
