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
import { ArrowLeft, CalendarDays, Sparkles, ChevronDown, Images } from "lucide-react";
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
  const [galleryOpen, setGalleryOpen] = useState(false);

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
  // Feature image is always the first thumbnail, followed by any extra gallery photos.
  const allPhotos = [article.cover, ...article.gallery];

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-x-hidden bg-ivory bg-chakra-texture pb-20">
        {/* ── Slim top bar — just the back-link, title/category moved into
            the right-hand text column below for the image-left/text-right
            layout. ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-deep-brown pt-24 pb-6 sm:pt-28">
          <div className={`${GOLD_LINE} bottom-0`} />
          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-champagne/70 transition-colors hover:text-champagne"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("articles.backToAll")}
            </Link>
          </div>
        </section>

        {/* ── Image (left, ~70%) + Text (right, ~30%) ─────────────────── */}
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_3fr] lg:gap-12">
            {/* LEFT — feature image + photo gallery dropdown */}
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-antique-gold/25 shadow-[0_20px_60px_-20px_rgba(75,13,19,0.35)]">
                <Image
                  src={article.cover}
                  alt={tr({ en: article.title, kn: article.titleKn })}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Photo Gallery dropdown — feature image + every extra
                  photo, so seekers can revisit all images from one spot. */}
              <div className="mt-4 overflow-hidden rounded-xl border border-antique-gold/20 bg-white">
                <button
                  onClick={() => setGalleryOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Images className="h-4 w-4 text-saffron-accent" />
                    <span className="font-heading text-[15px] font-bold text-deep-brown">Photo Gallery</span>
                    <span className="text-[11px] font-medium text-deep-brown/40">({allPhotos.length})</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-deep-brown/50 transition-transform duration-300 ${galleryOpen ? "rotate-180" : ""}`} />
                </button>
                {galleryOpen && (
                  <div className="grid grid-cols-3 gap-2 border-t border-antique-gold/15 p-4 sm:grid-cols-4">
                    {allPhotos.map((src, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                        <Image src={src} alt={`${tr({ en: article.title, kn: article.titleKn })} — photo ${idx + 1}`} fill sizes="150px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
    </>
  );
}
