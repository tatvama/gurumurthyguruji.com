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

const sections: { num: string; titleKey: UiKey; paras: UiKey[]; id?: string; readMoreHref?: string }[] = [
  { num: "I.",   titleKey: "aboutpage.s1.title", paras: ["aboutpage.s1.p1"], id: "divine-birth", readMoreHref: "/the-divine-birth" },
  { num: "II.",  titleKey: "aboutpage.s2.title", paras: ["aboutpage.s2.p1"], id: "turning-point", readMoreHref: "/guru-parampara" },
  { num: "III.", titleKey: "aboutpage.s3.title", paras: ["aboutpage.s3.p1"], id: "babaji-grace", readMoreHref: "/mahavatar-babaji-grace" },
  { num: "IV.",  titleKey: "aboutpage.s4.title", paras: ["aboutpage.s4.p1"], readMoreHref: "/trikala-jnana" },
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
              <SectionBlock key={s.num} id={s.id} num={s.num} title={t(s.titleKey)} paras={s.paras.map((p) => t(p))} readMoreHref={s.readMoreHref} />
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

            {/* Section III — Babaji's Grace (shown as II.) */}
            <SectionBlock key={sections[2].num} id={sections[2].id} num="II." title={t(sections[2].titleKey)} paras={sections[2].paras.map((p) => t(p))} readMoreHref={sections[2].readMoreHref} />

            {/* Section VI — The Turning Point (card 3 position) */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col rounded-3xl border border-champagne/30 bg-white/50 shadow-sm overflow-hidden backdrop-blur-sm"
            >
              <GradientPanel num="III." title={t("aboutpage.s6.title")} />
              <div className="space-y-6 p-8">
                <p>{t("aboutpage.s6.p1")}</p>
                <Link
                  href="/the-turning-point"
                  className="inline-flex items-center gap-2 rounded-full border border-saffron-accent/40 px-5 py-2 text-sm font-semibold text-saffron-accent transition-all duration-200 hover:bg-saffron-accent/8 hover:border-saffron-accent"
                >
                  {t("aboutpage.readmore")} →
                </Link>
              </div>
            </motion.section>

            {/* Section IV — shown as IV. */}
            <SectionBlock key={sections[3].num} id={sections[3].id} num="IV." title={t(sections[3].titleKey)} paras={sections[3].paras.map((p) => t(p))} readMoreHref={sections[3].readMoreHref} />

            {/* Section V — Antaryami (the signature gift) */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col rounded-3xl border border-champagne/30 bg-white/50 shadow-sm overflow-hidden backdrop-blur-sm"
            >
              <GradientPanel num="V." title={t("aboutpage.s5.title")} />
              <div className="space-y-6 p-8">
                <p>{t("aboutpage.s5.p1")}</p>
                <span className="inline-flex items-center gap-2 rounded-full border border-saffron-accent/40 px-5 py-2 text-sm font-semibold text-saffron-accent">
                  {t("aboutpage.readmore")} →
                </span>
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

function GradientPanel({ num, title }: { num: string; title: string }) {
  return (
    <div className="relative overflow-hidden flex items-end border-b border-champagne/30 min-h-[200px]">
      {/* Background photo (bottom layer) */}
      <Image
        src="/images/cartphotoAboutsec.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Redness gradient overlay — semi-transparent so the photo shows through */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(91,17,24,0.88) 0%, rgba(122,42,34,0.82) 28%, rgba(181,121,58,0.74) 65%, rgba(221,186,94,0.66) 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute z-10 select-none font-heading leading-none"
        style={{
          top: "10px",
          right: "20px",
          fontSize: "clamp(64px, 8vw, 104px)",
          color: "rgba(255,255,255,0.12)",
        }}
      >
        ॐ
      </span>
      <div
        className="relative z-10 p-8 font-heading text-2xl font-bold text-white"
        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}
      >
        <span className="text-champagne mr-3">{num}</span> {title}
      </div>
    </div>
  );
}

function SectionBlock({ num, title, paras, id, readMoreHref }: { num: string; title: string; paras: string[]; id?: string; readMoreHref?: string }) {
  const { t } = useLanguage();
  return (
    <motion.section
      id={id}
      style={{ scrollMarginTop: "120px" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col bg-white/50 backdrop-blur-sm rounded-3xl border border-champagne/20 shadow-sm overflow-hidden"
    >
      <GradientPanel num={num} title={title} />
      <div className="space-y-6 p-8">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {readMoreHref && (
          <Link
            href={readMoreHref}
            className="inline-flex items-center gap-2 rounded-full border border-saffron-accent/40 px-5 py-2 text-sm font-semibold text-saffron-accent transition-all duration-200 hover:bg-saffron-accent/8 hover:border-saffron-accent"
          >
            {t("aboutpage.readmore")} →
          </Link>
        )}
      </div>
    </motion.section>
  );
}
