"use client";

import { Link } from "@/components/ui/locale-link";
import { useLanguage } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

export function FreeAudienceCTA() {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden px-4 py-24 text-center md:px-8"
      style={{
        background:
          "linear-gradient(150deg, #2A1505 0%, #3D1018 38%, #1E0D0A 72%, #260810 100%)",
      }}
    >
      {/* Chakra texture */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-[size:130px] bg-repeat opacity-[0.055]" />

      {/* Large backdrop OM */}
      <div
        aria-hidden
        className="text-om-glow pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading leading-none text-pearl"
        style={{ fontSize: "clamp(14rem, 40vw, 26rem)", opacity: 0.028 }}
      >
        ॐ
      </div>

      {/* Warm pulsing halo behind OM */}
      <motion.div
        animate={{ scale: [1, 1.10, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,130,43,0.30) 0%, transparent 65%)",
        }}
      />

      {/* Flame glows — left & right */}
      <div
        className="flame-glow-accent pointer-events-none absolute left-[12%] top-1/2 h-40 w-20 -translate-y-1/2 blur-[36px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.42), rgba(217,119,6,0.20), transparent)",
          borderRadius: "50% 50% 30% 30%",
        }}
      />
      <div
        className="flame-glow-accent pointer-events-none absolute right-[12%] top-1/2 h-40 w-20 -translate-y-1/2 blur-[36px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.42), rgba(217,119,6,0.20), transparent)",
          borderRadius: "50% 50% 30% 30%",
          animationDelay: "1.4s",
        }}
      />

      {/* Top/bottom gold hairlines */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(216,183,106,0.50), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(216,183,106,0.50), transparent)",
        }}
      />

      <Reveal className="relative z-10 mx-auto max-w-3xl">
        {/* Sacred badge */}
        <div className="badge-dark mx-auto mb-6 w-fit">
          ✦ {t("final.badge")} ✦
        </div>

        {/* Heading */}
        <h2 className="font-heading mb-5 text-4xl font-medium tracking-tight text-champagne text-gold-glow sm:text-5xl lg:text-[3.4rem]">
          {t("final.title")}
        </h2>

        {/* OM divider */}
        <div className="mx-auto mb-6 flex items-center justify-center gap-3">
          <span
            className="h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(216,183,106,0.40))",
            }}
          />
          <motion.span
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-heading text-xl text-champagne/75"
          >
            ॐ
          </motion.span>
          <span
            className="h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(216,183,106,0.40), transparent)",
            }}
          />
        </div>

        <p className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-pearl/82">
          {t("final.body")}
        </p>

        {/* Animated star row */}
        <div className="mx-auto mb-8 flex items-center justify-center gap-8">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="font-heading text-champagne/45"
              animate={{ opacity: [0.25, 0.75, 0.25] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.45,
                ease: "easeInOut",
              }}
            >
              {i === 1 ? "ॐ" : "✦"}
            </motion.span>
          ))}
        </div>

        <Link
          href="/meet-guruji"
          className="btn-champagne-pill shadow-[0_4px_30px_rgba(201,130,43,0.48)]"
        >
          {t("cta.book")}
        </Link>

        <p className="mt-7 text-[10.5px] font-bold uppercase tracking-[0.26em] text-pearl/32">
          {t("hero.trust.free")}
        </p>
      </Reveal>
    </section>
  );
}
