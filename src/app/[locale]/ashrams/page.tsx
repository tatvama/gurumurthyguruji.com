"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AshramCard } from "@/components/cards/AshramCard";
import { ashrams, ashramStatusKn } from "@/lib/data";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { useLanguage } from "@/lib/i18n";

export default function AshramsPage() {
  const { t, tr, lang } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Soft Accent Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("ashramspage.hero.titlePrefix")}<span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic text-gold-glow">{t("ashramspage.hero.titleAccent")}</span>
            </h1>
            <p className="text-xl text-deep-brown/80 max-w-2xl mx-auto leading-relaxed">
              {t("ashramspage.hero.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-16" />

          {/* Map Section */}
          <div className="mb-20 rounded-[2.5rem] overflow-hidden border-gold-double bg-white shadow-xl aspect-video md:aspect-[21/8] relative flex items-center justify-center group">
            <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.06] bg-[size:150px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-accent/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="text-center relative z-10 text-deep-brown px-6">
               <div className="w-16 h-16 rounded-full bg-saffron-accent/15 border border-saffron-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                 <svg className="w-8 h-8 text-saffron-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25S12 3 12 3s7.5 4.108 7.5 11.25z" />
                 </svg>
               </div>
               <p className="font-heading text-2xl font-bold text-deep-brown">{t("ashramspage.map.title")}</p>
               <p className="text-sm text-deep-brown/70 mt-1 font-medium">{t("ashramspage.map.caption")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ashrams.map((ashram) => (
              <AshramCard
                key={ashram.id}
                name={ashram.name}
                location={ashram.location}
                status={ashram.status}
                statusLabel={lang === "kn" ? ashramStatusKn[ashram.status] ?? ashram.status : ashram.status}
                description={tr({ en: ashram.description, kn: ashram.description_kn })}
              />
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
