"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { motion } from "framer-motion";
import Image from "next/image";

const sections: { num: string; titleKey: UiKey; paras: UiKey[] }[] = [
  { num: "I.",   titleKey: "aboutpage.s1.title", paras: ["aboutpage.s1.p1", "aboutpage.s1.p2"] },
  { num: "II.",  titleKey: "aboutpage.s2.title", paras: ["aboutpage.s2.p1", "aboutpage.s2.p2"] },
  { num: "III.", titleKey: "aboutpage.s3.title", paras: ["aboutpage.s3.p1", "aboutpage.s3.p2"] },
  { num: "IV.",  titleKey: "aboutpage.s4.title", paras: ["aboutpage.s4.p1", "aboutpage.s4.p2"] },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory bg-chakra-texture pt-24 pb-24 relative overflow-x-hidden sm:pt-32">
        <div className="absolute top-40 left-0 w-80 h-80 bg-saffron-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-antique-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">

          {/* Header with portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="lg:col-span-7 space-y-6"
            >
              <h1 className="font-heading text-3xl font-bold text-deep-brown leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {t("aboutpage.h1.a")}{" "}
                <span className="bg-gradient-to-r from-maroon-accent to-saffron-accent bg-clip-text text-transparent italic">
                  {t("aboutpage.h1.b")}
                </span>
              </h1>
              <p className="text-xl text-deep-brown/85 font-semibold tracking-wide border-l-2 border-saffron-accent pl-4">
                {t("aboutpage.lead")}
              </p>
              <p className="text-deep-brown/80 leading-relaxed text-lg">{t("aboutpage.intro")}</p>
            </motion.div>

            <div className="lg:col-span-5 flex justify-center">
              <Image
                src="/images/guruji-meditating.png"
                alt="Pujya Sri Gurumurthy Guruji in meditation"
                width={420}
                height={560}
                sizes="(max-width: 768px) 80vw, 40vw"
                className="h-auto w-[70%] object-contain sm:w-[60%] lg:w-[78%] xl:w-[70%]"
                priority
              />
            </div>
          </div>

          <LotusDivider />

          <div className="space-y-16 mt-16 text-lg leading-loose text-deep-brown/85 font-sans">

            {/* Sections I–IV */}
            {sections.slice(0, 1).map((s) => (
              <SectionBlock key={s.num} num={s.num} title={t(s.titleKey)} paras={s.paras.map((p) => t(p))} />
            ))}

            {/* Pull quote */}
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-l-4 border-maroon-accent pl-8 my-12 font-heading text-2xl md:text-3xl text-deep-brown italic leading-relaxed py-6 bg-gradient-to-r from-saffron-accent/10 to-transparent rounded-r-3xl pr-4"
            >
              {t("aboutpage.quote")}
            </motion.blockquote>

            {sections.slice(1).map((s) => (
              <SectionBlock key={s.num} num={s.num} title={t(s.titleKey)} paras={s.paras.map((p) => t(p))} />
            ))}

            {/* Section V — Antaryami (the signature gift) */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-12 items-stretch rounded-3xl border border-champagne/30 bg-white/50 shadow-sm overflow-hidden backdrop-blur-sm"
            >
              {/* Left panel */}
              <div className="md:col-span-4 flex items-center border-b md:border-b-0 md:border-r border-champagne/30 min-h-[140px] bg-champagne/10">
                <div className="p-8 font-heading text-2xl font-bold text-deep-brown">
                  <span className="text-saffron-accent mr-3">V.</span> {t("aboutpage.s5.title")}
                </div>
              </div>
              {/* Right panel — no background image */}
              <div className="md:col-span-8 space-y-6 p-8">
                <p>{t("aboutpage.s5.p1")}</p>
                <p>{t("aboutpage.s5.p2")}</p>
                <p className="border-l-2 border-antique-gold/50 pl-4 text-[16px] italic text-deep-brown/70">
                  {t("aboutpage.s5.trust")}
                </p>
              </div>
            </motion.section>

            <LotusDivider />

            {/* Mission */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center max-w-3xl mx-auto pt-8 pb-4"
            >
              <h2 className="font-heading text-4xl font-bold text-deep-brown mb-6">
                {t("aboutpage.mission.a")} <span className="text-saffron-accent italic">{t("aboutpage.mission.b")}</span>
              </h2>
              <p className="text-xl leading-relaxed text-deep-brown/85">{t("aboutpage.mission.body")}</p>
            </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionBlock({ num, title, paras }: { num: string; title: string; paras: string[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-12 items-stretch bg-white/50 backdrop-blur-sm rounded-3xl border border-champagne/20 shadow-sm overflow-hidden"
    >
      {/* Left panel */}
      <div className="md:col-span-4 flex items-center border-b md:border-b-0 md:border-r border-champagne/30 min-h-[140px] bg-champagne/10">
        <div className="p-8 font-heading text-2xl font-bold text-deep-brown">
          <span className="text-saffron-accent mr-3">{num}</span> {title}
        </div>
      </div>

      {/* Right panel — no background image */}
      <div className="md:col-span-8 space-y-6 p-8">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </motion.section>
  );
}
