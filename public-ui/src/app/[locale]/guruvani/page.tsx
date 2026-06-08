"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteCard } from "@/components/cards/QuoteCard";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { teachings, teachingCategoryKn } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

const categories = ["All", ...Array.from(new Set(teachings.map(t => t.category)))];

export default function GuruvaniPage() {
  const { t, tr, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const catLabel = (cat: string) =>
    cat === "All" ? t("guruvani.filters.all") : lang === "kn" ? teachingCategoryKn[cat] ?? cat : cat;

  const filteredTeachings = activeCategory === "All" 
    ? teachings 
    : teachings.filter(t => t.category === activeCategory);

  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Soft Background Accent Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("guruvani.hero.titleLead")}<span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic text-gold-glow">{t("guruvani.hero.titleAccent")}</span>
            </h1>
            <p className="text-xl text-deep-brown/85 max-w-2xl mx-auto leading-relaxed">
              {t("guruvani.hero.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-12" />

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border cursor-pointer",
                  activeCategory === category
                    ? "bg-gradient-to-r from-saffron-accent to-antique-gold text-white border-transparent shadow-md -translate-y-0.5"
                    : "bg-white text-deep-brown/70 border-champagne/30 hover:border-saffron-accent/40 hover:text-saffron-accent"
                )}
              >
                {catLabel(category)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachings.map((teaching) => (
              <QuoteCard
                key={teaching.id}
                quote={tr({ en: teaching.quote, kn: teaching.quote_kn })}
                category={catLabel(teaching.category)}
              />
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
