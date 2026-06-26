"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/components/ui/locale-link";

const allCards: { num: string; titleKey: UiKey; paraKey: UiKey; id?: string; readMoreHref?: string }[] = [
  { num: "I.",   titleKey: "aboutpage.s1.title", paraKey: "aboutpage.s1.p1", id: "divine-birth",  readMoreHref: "/the-divine-birth" },
  { num: "II.",  titleKey: "aboutpage.s3.title", paraKey: "aboutpage.s3.p1", id: "babaji-grace",  readMoreHref: "/mahavatar-babaji-grace" },
  { num: "III.", titleKey: "aboutpage.s6.title", paraKey: "aboutpage.s6.p1",                      readMoreHref: "/the-turning-point" },
  { num: "IV.",  titleKey: "aboutpage.s4.title", paraKey: "aboutpage.s4.p1",                      readMoreHref: "/trikala-jnana" },
  { num: "V.",   titleKey: "aboutpage.s5.title", paraKey: "aboutpage.s5.p1" },
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

          <div className="mt-12 text-base leading-relaxed text-deep-brown/85 font-sans">

            {/* 2-column card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allCards.map((card, i) => (
                <SectionBlock
                  key={card.num}
                  id={card.id}
                  num={card.num}
                  title={t(card.titleKey)}
                  para={t(card.paraKey)}
                  readMoreHref={card.readMoreHref}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Quote below all cards */}
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-l-4 border-maroon-accent pl-6 mt-12 font-heading text-lg md:text-xl text-deep-brown italic leading-relaxed py-4 bg-gradient-to-r from-saffron-accent/10 to-transparent rounded-r-3xl pr-4"
            >
              {t("aboutpage.quote")}
            </motion.blockquote>

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

function GradientPanel() {
  return (
    <div className="relative overflow-hidden min-h-[140px]">
      <Image
        src="/images/cartphotoAboutsec.webp"
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </div>
  );
}

function SectionBlock({
  num, title, para, id, readMoreHref, delay = 0,
}: {
  num: string; title: string; para: string; id?: string; readMoreHref?: string; delay?: number;
}) {
  const { t } = useLanguage();
  return (
    <motion.section
      id={id}
      style={{ scrollMarginTop: "120px" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay }}
      className="flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl border border-champagne/20 shadow-sm overflow-hidden"
    >
      <GradientPanel />
      <div className="flex flex-col flex-1 gap-3 p-5">
        <h3 className="font-heading text-lg font-bold text-deep-brown">
          <span className="text-champagne mr-2">{num}</span>{title}
        </h3>
        <p className="text-sm leading-relaxed text-deep-brown/80 flex-1">{para}</p>
        {readMoreHref ? (
          <Link
            href={readMoreHref}
            className="group relative mt-1 self-start overflow-hidden inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-semibold text-pearl shadow-md transition-all duration-300 hover:shadow-[0_6px_22px_rgba(75,13,19,0.60)] hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#4b0d13 0%,#65161c 100%)" }}
          >
            <span className="relative">{t("aboutpage.readmore")}</span>
            <span className="relative inline-block transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-125 text-sm leading-none">→</span>
          </Link>
        ) : (
          <span
            className="mt-1 self-start inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-pearl/60"
            style={{ background: "linear-gradient(135deg,#4b0d13 0%,#65161c 100%)" }}
          >
            {t("aboutpage.readmore")} →
          </span>
        )}
      </div>
    </motion.section>
  );
}
