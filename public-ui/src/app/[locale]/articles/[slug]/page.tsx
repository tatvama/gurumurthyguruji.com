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
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
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

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const { t, tr, lang } = useLanguage();
  const [articles, setArticles] = useState<Article[] | null>(null);

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

  if (articles === null) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-ivory pt-52 pb-24 text-center text-deep-brown/50">Loading…</main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-ivory pt-52 pb-24 text-center">
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

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-ivory bg-chakra-texture pb-20">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-44 pb-14 sm:pt-52" style={{ background: COSMIC }}>
          <div className={`${GOLD_LINE} top-0`} />
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden pt-28">
            <span className="font-heading text-[280px] leading-none text-champagne opacity-[0.04]">ॐ</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8"
          >
            <Link
              href="/articles"
              className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-champagne/70 transition-colors hover:text-champagne"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("articles.backToAll")}
            </Link>
            <div className="mb-5 flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3 text-champagne" />
              <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-champagne/70">
                {catLabel}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold leading-tight text-pearl sm:text-4xl lg:text-5xl">
              {tr({ en: article.title, kn: article.titleKn })}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] font-medium text-pearl/50">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(article.createdAt, lang)}
            </div>
          </motion.div>
          <div className={`${GOLD_LINE} bottom-0`} />
        </section>

        {/* ── Cover image ──────────────────────────────────────────── */}
        <div className="mx-auto -mt-10 max-w-4xl px-4 md:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-antique-gold/25 shadow-[0_20px_60px_-20px_rgba(75,13,19,0.35)]">
            <Image
              src={article.cover}
              alt={tr({ en: article.title, kn: article.titleKn })}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        <article
          className="prose-article mx-auto max-w-2xl px-4 pt-10 md:px-8 text-[16px] leading-[1.85] text-deep-brown/85"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          dangerouslySetInnerHTML={{ __html: articleContentHtml(article.content) }}
        />

        {article.tags.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap gap-2 px-4 md:px-8">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-antique-gold/25 bg-antique-gold/5 px-3 py-1 text-[11px] font-medium text-deep-brown/60">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Related articles ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mx-auto mt-12 max-w-2xl px-4 md:px-8">
            <div className="border-t border-antique-gold/20 pt-8">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-antique-gold">
                More on {catLabel}
              </p>
              <div className="flex flex-col gap-4">
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
    </>
  );
}
