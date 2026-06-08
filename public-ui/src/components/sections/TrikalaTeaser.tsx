"use client";

import { Link } from "@/components/ui/locale-link";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const times: {
  key: UiKey;
  lineKey: UiKey;
  sanskrit: string;
  symbol: string;
  isCenter?: boolean;
}[] = [
  { key: "trikala.past",    lineKey: "trikala.past.line",    sanskrit: "Bhūta",      symbol: "☽" },
  { key: "trikala.present", lineKey: "trikala.present.line", sanskrit: "Vartamāna",  symbol: "ॐ", isCenter: true },
  { key: "trikala.future",  lineKey: "trikala.future.line",  sanskrit: "Bhaviṣya",   symbol: "✦" },
];

export function TrikalaTeaser() {
  const { t } = useLanguage();

  return (
    <section className="section-cosmic relative overflow-hidden border-y border-champagne/10 px-4 py-20 sm:py-28 md:px-8">
      {/* Chakra texture overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-[size:200px] bg-repeat opacity-[0.04]" />

      {/* Corner glows */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-champagne/8 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 translate-y-1/3 -translate-x-1/4 rounded-full bg-maroon-accent/15 blur-[120px]" />
      {/* Central warm glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne blur-[180px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal>
          {/* Sacred eyebrow */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-champagne/40" />
            <span className="eyebrow-sacred text-champagne/75">{t("trikala.eyebrow")}</span>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-champagne/40" />
          </div>

          <h2 className="font-heading text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            <span className="italic text-shimmer-gold">{t("nav.trikala")}</span>
          </h2>

          <p className="mt-3 font-heading text-[11px] font-bold uppercase tracking-[0.28em] text-champagne/50">
            {t("trikala.subtitle")}
          </p>

          <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-[1.8] text-pearl/65">
            {t("trikala.intro")}
          </p>
        </Reveal>

        {/* Three-Times Triptych */}
        <div className="relative mt-14">
          {/* Connecting thread */}
          <div
            className="pointer-events-none absolute left-1/2 top-[4.5rem] hidden h-px w-[68%] -translate-x-1/2 sm:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(216,183,106,0.18) 18%, rgba(216,183,106,0.38) 50%, rgba(216,183,106,0.18) 82%, transparent 100%)",
            }}
          />

          <div className="grid gap-4 sm:grid-cols-3 sm:gap-3">
            {times.map((time, i) => (
              <Reveal key={time.key} delay={i * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className={[
                    "corner-ornate relative flex h-full flex-col items-center rounded-2xl border px-5 py-8 text-center backdrop-blur-sm transition-colors duration-300",
                    time.isCenter
                      ? "border-champagne/28 trikala-center-card bg-gradient-to-br from-champagne/[0.10] to-antique-gold/[0.04]"
                      : "border-pearl/8 bg-white/[0.03] hover:border-champagne/20 hover:bg-white/[0.055]",
                  ].join(" ")}
                >
                  {/* Symbol ring */}
                  <div
                    className={[
                      "mb-5 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300",
                      time.isCenter
                        ? "border-champagne/45 bg-champagne/14 shadow-[0_0_28px_rgba(185,147,69,0.22)]"
                        : "border-pearl/12 bg-pearl/[0.04]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "font-heading text-2xl leading-none",
                        time.isCenter ? "text-champagne" : "text-pearl/50",
                      ].join(" ")}
                    >
                      {time.symbol}
                    </span>
                  </div>

                  {/* Time name */}
                  <p
                    className={[
                      "font-heading text-xl font-semibold leading-tight",
                      time.isCenter ? "text-pearl" : "text-pearl/72",
                    ].join(" ")}
                  >
                    {t(time.key)}
                  </p>
                  <p className="mt-1 font-heading text-[10px] italic tracking-wider text-champagne/45">
                    {time.sanskrit}
                  </p>

                  {/* Description */}
                  <p
                    className={[
                      "mt-3 text-[13.5px] leading-relaxed",
                      time.isCenter ? "text-pearl/68" : "text-pearl/45",
                    ].join(" ")}
                  >
                    {t(time.lineKey)}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Clarifier + CTA */}
        <Reveal delay={0.14}>
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="rounded-2xl border border-champagne/12 bg-white/[0.03] px-6 py-5 text-[14px] italic leading-relaxed text-pearl/65 backdrop-blur-sm">
              ✦ {t("trikala.clarifier")}
            </p>
          </div>
          <Link href="/trikala-jnana" className="btn-champagne-pill mt-8 inline-flex">
            {t("cta.learnTrikala")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
