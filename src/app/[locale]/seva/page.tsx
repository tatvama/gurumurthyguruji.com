"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Button } from "@/components/ui/button";
import { sevaStats } from "@/lib/data";
import { HeartHandshake, Utensils } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function SevaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Soft Decorative Glows */}
        <div className="absolute top-40 left-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("sevapage.hero.titleLead")} <span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic text-gold-glow">{t("sevapage.hero.titleAccent")}</span>
            </h1>
            <p className="text-xl text-deep-brown/85 max-w-2xl mx-auto leading-relaxed">
              {t("sevapage.hero.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-16" />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {sevaStats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-champagne/30 text-center shadow-sm hover:shadow-[0_8px_25px_rgba(201,130,43,0.08)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="font-heading text-4xl md:text-5xl font-bold text-saffron-accent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-deep-brown/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Initiatives */}
          <div className="space-y-12 mb-24">
            <h2 className="font-heading text-3xl font-bold text-deep-brown text-center mb-12">
              {t("sevapage.initiatives.heading")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] p-10 border border-champagne/30 hover:border-saffron-accent/40 hover:shadow-[0_10px_25px_rgba(201,130,43,0.08)] transition-all duration-300 group">
                <div className="w-16 h-16 bg-ivory rounded-2xl flex items-center justify-center mb-6 border border-champagne/20 group-hover:bg-saffron-accent/15 group-hover:border-saffron-accent/30 transition-all duration-300">
                  <Utensils className="w-8 h-8 text-saffron-accent" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-deep-brown mb-4 group-hover:text-saffron-accent transition-colors duration-300">
                  {t("sevapage.initiatives.annadana.title")}
                </h3>
                <p className="text-deep-brown/80 leading-relaxed text-base">
                  {t("sevapage.initiatives.annadana.body")}
                </p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] p-10 border border-champagne/30 hover:border-saffron-accent/40 hover:shadow-[0_10px_25px_rgba(201,130,43,0.08)] transition-all duration-300 group">
                <div className="w-16 h-16 bg-ivory rounded-2xl flex items-center justify-center mb-6 border border-champagne/20 group-hover:bg-saffron-accent/15 group-hover:border-saffron-accent/30 transition-all duration-300">
                  <HeartHandshake className="w-8 h-8 text-saffron-accent" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-deep-brown mb-4 group-hover:text-saffron-accent transition-colors duration-300">
                  {t("sevapage.initiatives.education.title")}
                </h3>
                <p className="text-deep-brown/80 leading-relaxed text-base">
                  {t("sevapage.initiatives.education.body")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-gold-double rounded-[3rem] p-12 md:p-20 text-center bg-maroon-gradient text-pearl relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.06] bg-[size:120px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-accent/15 via-transparent to-transparent pointer-events-none" />
            
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-champagne mb-6 relative z-10 text-gold-glow">
              {t("sevapage.cta.heading")}
            </h2>
            <p className="text-lg text-pearl/85 max-w-2xl mx-auto mb-10 relative z-10">
              {t("sevapage.cta.body")}
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-saffron-accent to-antique-gold text-white border-0 hover:brightness-110 shadow-lg relative z-10 transition-all font-semibold hover:-translate-y-0.5 text-lg px-8 py-6 h-auto"
            >
              {t("sevapage.cta.button")}
            </Button>
            <p className="text-sm text-pearl/75 mt-6 italic relative z-10">
              {t("sevapage.cta.note")}
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
