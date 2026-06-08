"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/locale-link";
import { Leaf, Sparkles, Wind, Brain, Heart, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const benefits = [
  { icon: Heart, title: "Inner Peace", desc: "Dissolve anxiety and find a deep reservoir of calm." },
  { icon: Brain, title: "Mental Clarity", desc: "Sharpen focus and remove the fog of overthinking." },
  { icon: Sparkles, title: "Devotional Depth", desc: "Awaken a profound, tearful love for the Divine." },
  { icon: Wind, title: "Breath Awareness", desc: "Master the life force (Prana) to energize the body." },
  { icon: Shield, title: "Guru's Grace", desc: "Walk the spiritual path with an invincible protective shield." },
  { icon: Leaf, title: "Spiritual Discipline", desc: "Build a daily rhythm that supports worldly and spiritual success." },
];

export default function SanjeeviniKriyaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-deep-brown mb-6">
              {t("sanjeevini.hero.titleMain")} <span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic text-gold-glow">{t("sanjeevini.hero.titleAccent")}</span>
            </h1>
            <p className="text-xl text-deep-brown/80 max-w-2xl mx-auto leading-relaxed">
              {t("sanjeevini.hero.subtitle")}
            </p>
          </div>

          <LotusDivider className="mb-20" />

          {/* Core Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24 items-center">
            <div className="md:col-span-7 space-y-6">
              <h2 className="font-heading text-3xl font-bold text-deep-brown">{t("sanjeevini.essence.heading")}</h2>
              <p className="text-deep-brown/80 leading-relaxed text-lg">
                {t("sanjeevini.essence.para1")}
              </p>
              <p className="text-deep-brown/80 leading-relaxed text-lg">
                {t("sanjeevini.essence.para2")}
              </p>
            </div>
            
            <div className="md:col-span-5 bg-white border-gold-double rounded-[3rem] p-10 text-center relative overflow-hidden shadow-lg group">
               <div className="absolute inset-0 bg-saffron-gradient opacity-60 pointer-events-none" />
               <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.06] bg-[size:100px] pointer-events-none" />
               <h3 className="font-heading text-3xl font-bold text-deep-brown mb-6 relative z-10">{t("sanjeevini.pillars.heading")}</h3>
               <ul className="space-y-5 text-left relative z-10 max-w-xs mx-auto">
                 <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-saffron-accent/15 flex items-center justify-center shrink-0 border border-saffron-accent/20 group-hover:scale-110 transition-transform duration-300">
                     <span className="w-3.5 h-3.5 rounded-full bg-saffron-accent"/>
                   </div>
                   <span className="text-deep-brown/95 font-semibold text-base">{t("sanjeevini.pillars.breath")}</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-antique-gold/15 flex items-center justify-center shrink-0 border border-antique-gold/20 group-hover:scale-110 transition-transform duration-300">
                     <span className="w-3.5 h-3.5 rounded-full bg-antique-gold"/>
                   </div>
                   <span className="text-deep-brown/95 font-semibold text-base">{t("sanjeevini.pillars.silence")}</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-maroon-accent/15 flex items-center justify-center shrink-0 border border-maroon-accent/20 group-hover:scale-110 transition-transform duration-300">
                     <span className="w-3.5 h-3.5 rounded-full bg-maroon-accent"/>
                   </div>
                   <span className="text-deep-brown/95 font-semibold text-base">{t("sanjeevini.pillars.grace")}</span>
                 </li>
               </ul>
            </div>
          </div>

          <LotusDivider className="mb-20" />

          {/* Benefits */}
          <div className="mb-24">
            <h2 className="font-heading text-3xl font-bold text-deep-brown text-center mb-12">
              {t("sanjeevini.benefits.heading")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-7 border border-champagne/30 shadow-sm hover:shadow-[0_10px_25px_rgba(201,130,43,0.08)] hover:border-saffron-accent/40 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-ivory border border-champagne/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-saffron-accent/15 group-hover:border-saffron-accent/30 transition-all duration-300">
                    <benefit.icon className="w-6 h-6 text-saffron-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-deep-brown mb-2 group-hover:text-saffron-accent transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-deep-brown/75 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-gold-double rounded-[3rem] p-12 md:p-20 text-center bg-maroon-gradient text-pearl relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.06] bg-[size:120px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-accent/15 via-transparent to-transparent pointer-events-none" />
            
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-champagne mb-6 relative z-10 text-gold-glow">
              {t("sanjeevini.cta.heading")}
            </h2>
            <p className="text-lg text-pearl/85 max-w-2xl mx-auto mb-10 relative z-10">
              {t("sanjeevini.cta.text")}
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-saffron-accent to-antique-gold text-white border-0 hover:brightness-110 shadow-lg relative z-10 transition-all font-semibold hover:-translate-y-0.5 text-lg px-8 py-6 h-auto" 
              asChild
            >
              <Link href="/meet-guruji">{t("sanjeevini.cta.button")}</Link>
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
