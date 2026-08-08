"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/components/ui/locale-link";
import { getArticles, type Article } from "@/lib/api";
import { articleCategoryKn } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)";

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

export default function ArticlesPage() {
  const { t, tr, lang } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Articles are admin-managed (see /admin → Articles tab) — fetched live
  // from the database instead of a hardcoded list.
  useEffect(() => {
    let cancelled = false;
    getArticles()
      .then((data) => { if (!cancelled) setArticles(data); })
      .catch(() => { if (!cancelled) setArticles([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles],
  );

  const catLabel = (cat: string) =>
    cat === "All" ? t("articles.filters.all") : lang === "kn" ? articleCategoryKn[cat] ?? cat : cat;

  const filtered = activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);

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
                Guruvani · Wisdom
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-pearl sm:text-5xl lg:text-6xl">
              {t("articles.hero.titlePrefix")}
              <span className="italic text-champagne">{t("articles.hero.titleAccent")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-pearl/60">
              {t("articles.hero.subtitle")}
            </p>
          </motion.div>
          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

        {/* ── Filters ──────────────────────────────────────────────── */}
        {!loading && articles.length > 0 && (
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

        {/* ── Article Cards ────────────────────────────────────────── */}
        <section className="py-10 pb-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-champagne/10" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-16 text-center text-deep-brown/50">No articles yet — check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (idx % 6) * 0.05 }}
                  >
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-antique-gold/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-antique-gold/40 hover:shadow-[0_10px_30px_rgba(75,13,19,0.12)]"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={article.cover}
                          alt={tr({ en: article.title, kn: article.titleKn })}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                        <span className="absolute left-3 top-3 rounded-full border border-champagne/40 bg-black/40 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-champagne backdrop-blur-sm">
                          {catLabel(article.category)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col px-5 py-4">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-deep-brown/50">
                          <CalendarDays className="h-3 w-3 shrink-0 text-saffron-accent" />
                          {formatDate(article.createdAt, lang)}
                        </div>
                        <h3 className="font-heading text-[16px] font-bold leading-snug text-deep-brown transition-colors duration-300 group-hover:text-maroon-accent">
                          {tr({ en: article.title, kn: article.titleKn })}
                        </h3>
                        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-deep-brown/70">
                          {tr({ en: article.excerpt, kn: article.excerptKn })}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-saffron-accent">
                          {t("aboutpage.readmore")}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
