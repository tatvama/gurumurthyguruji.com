"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/locale-link";
import { HeartPulse, Sparkles, Activity, Wind, Brain, Sun, ArrowRight } from "lucide-react";
import Image from "next/image";

const visionPoints = [
  { icon: HeartPulse, title: "Relieve stress & anxiety", desc: "By harmonizing the energy flows within you." },
  { icon: Sparkles,   title: "Deepen divine connection", desc: "Opening the door to genuine spiritual growth." },
  { icon: Activity,   title: "Enhance physical vitality", desc: "By balancing the elements within the body." },
];

const nineMinutes = [
  { icon: Wind, label: "Center the breath" },
  { icon: Brain, label: "Purify thoughts" },
  { icon: Sun, label: "Touch the silence of the soul" },
];

const purpose = [
  { from: "Not religion,", to: "but revelation" },
  { from: "Not belief,", to: "but direct experience" },
  { from: "Not about change,", to: "but about remembering the truth already within you" },
];


export default function SanjeeviniKriyaEssencePage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Dark Hero Section */}
        <section
          className="relative overflow-hidden pt-32 pb-20 md:pb-28"
          style={{ background: "linear-gradient(135deg, #0f0803 0%, #1e1005 40%, #2a1508 70%, #1a0d06 100%)" }}
        >
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(185,147,69,0.18) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,130,43,0.12) 0%, transparent 70%)" }}
          />
          <div className="absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-repeat opacity-[0.04] bg-[size:260px] pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left text */}
              <div className="md:col-span-7 text-center md:text-left">
                <p
                  className="text-xs md:text-sm font-semibold uppercase tracking-[0.45em] mb-5"
                  style={{ color: "rgba(216,183,106,0.55)", fontFamily: "var(--font-heading)" }}
                >
                  A Divine Connection of
                </p>
                <h1
                  className="font-heading font-bold uppercase leading-[1.0] mb-6"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5rem)",
                    color: "#FEFCF7",
                    textShadow: "0 0 40px rgba(185,147,69,0.25)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Sanjeevini<br />
                  <span style={{ color: "#D8B76A" }}>Kriya Yoga</span>
                </h1>
                <p
                  className="text-sm md:text-base font-light tracking-widest mb-8 italic"
                  style={{ color: "rgba(254,252,247,0.55)", fontFamily: "var(--font-heading)" }}
                >
                  By Pujya Sri Gurumurthy Guruji
                </p>
                <p
                  className="font-heading font-bold text-xl md:text-2xl lg:text-3xl"
                  style={{ color: "#C9822B" }}
                >
                  Experience the Divine Transformation
                </p>
              </div>

              {/* Right portrait */}
              <div className="md:col-span-5 flex items-center justify-center relative">
                {/* Golden radial glow behind image (same as Trikala hero) */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at 50% 42%, rgba(216,183,106,0.32) 0%, rgba(216,150,60,0.14) 45%, transparent 72%)",
                    filter: "blur(28px)",
                  }}
                />
                {/* Decorative gold lotus SVG */}
                <svg
                  aria-hidden
                  className="absolute inset-0 m-auto z-0 pointer-events-none opacity-25"
                  width="360" height="360" viewBox="0 0 200 200"
                >
                  {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
                    <ellipse key={i} cx="100" cy="100" rx="14" ry="58" fill="none"
                      stroke="#D4AF37" strokeWidth="0.7" transform={`rotate(${deg} 100 100)`} />
                  ))}
                  <circle cx="100" cy="100" r="8" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
                </svg>

                <div className="relative w-full max-w-sm mx-auto">
                  <div className="relative w-full aspect-[640/897]">
                    <Image
                      src="/images/guruji_imgkriya.webp"
                      alt="Pujya Sri Gurumurthy Guruji — Sanjeevini Kriya Yoga"
                      fill
                      sizes="(max-width: 768px) 80vw, 35vw"
                      className="relative z-10 object-contain"
                      style={{
                        // Feather the image's own edges to transparency so the
                        // dark photo background dissolves into the section —
                        // no visible rectangle, like a cut-out PNG.
                        WebkitMaskImage:
                          "radial-gradient(ellipse 72% 82% at 50% 45%, #000 42%, rgba(0,0,0,0.4) 68%, transparent 88%)",
                        maskImage:
                          "radial-gradient(ellipse 72% 82% at 50% 45%, #000 42%, rgba(0,0,0,0.4) 68%, transparent 88%)",
                      }}
                      priority
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Light content section */}
        <div className="bg-pearl bg-chakra-texture pb-24 relative overflow-hidden">
          <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10 pt-16">

            <LotusDivider className="mb-16" />

            {/* A Simple Practice. A Timeless Path */}
            <section className="mb-20 text-center max-w-3xl mx-auto">
              <h2
                className="heading-gold-rule mb-10"
                style={{
                  fontFamily: "var(--font-adamina), 'Adamina', sans-serif",
                  fontSize: "29px",
                  fontWeight: 500,
                  lineHeight: "40px",
                  color: "#C2765D",
                }}
              >
                🌸 A Simple Practice. A Timeless Path 🌸
              </h2>
              <p
                className="leading-relaxed text-lg mb-5 text-deep-brown/85"
                style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              >
                Sanjeevini Kriya is a{" "}
                <strong className="font-bold text-deep-brown">sacred path to revitalizing the soul, mind, and body</strong>,
                envisioned and taught by{" "}
                <strong className="font-bold text-deep-brown">Pujya Sri Gurumurthy Guruji</strong>,{" "}
                a spiritual luminary devoted to guiding humanity toward self-realization and harmony.{" "}
                Rooted in ancient wisdom and universal truths, this practice combines profound yogic principles and divine
                energy, designed to awaken the inherent life force within every individual.
              </p>
              <p
                className="leading-relaxed text-lg italic text-deep-brown/80"
                style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              >
                ✨ Discover the life-changing practice of Sanjeevini Kriya, guided by Pujya Sri Gurumurthy Guruji
                and blessed by Trayambak Babaji, to bring peace, vitality, and spiritual harmony into your life.
              </p>
            </section>

            <LotusDivider className="mb-20" />

            {/* What is Sanjeevini Kriya Yoga */}
            <section className="mb-24 max-w-3xl mx-auto">
              <h2
                className="heading-gold-rule text-center mb-10"
                style={{
                  fontFamily: "var(--font-adamina), 'Adamina', sans-serif",
                  fontSize: "29px",
                  fontWeight: 500,
                  lineHeight: "40px",
                  color: "#C2765D",
                }}
              >
                What is Sanjeevini Kriya Yoga?
              </h2>
              <div className="space-y-6">
                <p
                  className="leading-relaxed text-lg text-deep-brown/85"
                  style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                >
                  ✨ <strong className="font-bold text-deep-brown">Sanjeevini Kriya</strong> is not merely a technique, it is a{" "}
                  <strong className="font-bold text-deep-brown">living stream of divine energy</strong> blessed
                  by <strong className="font-bold text-deep-brown">Mahavatar Babaji</strong> and lovingly shared
                  by <strong className="font-bold text-deep-brown">Pujya Sri Dr. Gurumurthy Guruji</strong>. Rooted in the ancient tradition of Kriya Yoga, this sacred
                  practice flows through conscious breath, gentle awareness, and mantra. As one begins the
                  journey, the <strong className="font-bold text-deep-brown">nervous system calms</strong>,{" "}
                  <strong className="font-bold text-deep-brown">emotions regain balance</strong>, and both
                  digestion and sleep improve naturally.
                </p>
                <p
                  className="leading-relaxed text-lg text-deep-brown/85"
                  style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                >
                  Gradually, an <strong className="font-bold text-deep-brown">inner strength awakens</strong>, filling life with vitality and resilience, while the
                  practice quietly leads the seeker into a{" "}
                  <strong className="font-bold text-deep-brown">direct connection with the Eternal Self</strong>. This is not a
                  theory but a <strong className="font-bold text-deep-brown">living truth</strong>, witnessed in the lives of countless devotees and seekers who have
                  experienced deep transformation through the grace of Mahavatar Babaji and the guidance of
                  Pujya Sri Dr. Gurumurthy Guruji.
                </p>
              </div>
            </section>

            {/* Guruji's Vision + Presence — 2-col layout */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-14 lg:gap-24 items-start mb-24">

              {/* Left: text */}
              <div className="md:col-span-6 space-y-5">

                {/* Heading — centered text, decorators pinned to left/right edges */}
                <div className="relative flex items-center justify-center mb-1">
                  <span className="absolute left-0 text-saffron-accent select-none" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "20px", letterSpacing: "2px" }}>·||·</span>
                  <h2
                    style={{
                      fontFamily: "var(--font-caveat), cursive",
                      fontSize: "32px",
                      fontWeight: 400,
                      color: "#C2765D",
                      lineHeight: "1.2",
                    }}
                  >
                    Guruji&rsquo;s Vision
                  </h2>
                  <span className="absolute right-0 text-saffron-accent select-none" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "20px", letterSpacing: "2px" }}>·||·</span>
                </div>

                <p className="leading-relaxed text-base text-deep-brown/85" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                  Pujya Sri Gurumurthy Guruji explains that Sanjeevini Kriya is not just a spiritual exercise — it is a{" "}
                  <strong className="font-bold text-deep-brown">way of living in harmony with the universe</strong>.
                  Through this kriya, he teaches seekers to:
                </p>

                {/* Bullet list — no cards */}
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start gap-3 text-base text-deep-brown/85 leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    <span className="mt-[9px] w-[6px] h-[6px] rounded-full bg-saffron-accent shrink-0" />
                    Relieve stress and anxiety by harmonizing the energy flows.
                  </li>
                  <li className="flex items-start gap-3 text-base text-deep-brown/85 leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    <span className="mt-[9px] w-[6px] h-[6px] rounded-full bg-saffron-accent shrink-0" />
                    Deepen the connection to the divine, enabling spiritual growth.
                  </li>
                  <li className="flex items-start gap-3 text-base text-deep-brown/85 leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    <span className="mt-[9px] w-[6px] h-[6px] rounded-full bg-saffron-accent shrink-0" />
                    Enhance physical vitality by balancing the elements within the body.
                  </li>
                </ul>

                <p className="leading-relaxed text-base text-deep-brown/80 italic" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                  Guruji reminds us that Sanjeevini Kriya is a gift meant for everyone — simple enough for
                  beginners, yet profound enough to lead to the highest realization.
                </p>

                {/* Guruji's Presence sub-section */}
                <div className="pt-2">
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-adamina), 'Adamina', sans-serif",
                      fontSize: "22px",
                      fontWeight: 500,
                      color: "#C2765D",
                    }}
                  >
                    🙏 Guruji&rsquo;s Presence
                  </h3>
                  {/* small gold underline */}
                  <div className="mb-4 h-[3px] w-28 rounded-full" style={{ background: "linear-gradient(to right, #d4af37 60%, transparent 100%)" }} />
                  <p className="leading-relaxed text-base text-deep-brown/85" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    Pujya Sri Gurumurthy Guruji received direct initiation from Mahavatar Babaji.<br />
                    He walks not ahead, not behind, but{" "}
                    <strong className="font-bold text-deep-brown">beside every seeker</strong>.<br />
                    He does not demand followers — he awakens leaders, igniting the same flame that Babaji lit in him.
                  </p>
                </div>

              </div>

              {/* Right: image */}
              <div className="md:col-span-6">
                <Image
                  src="/images/pujyasri_mmheader_v1_mobile.webp"
                  alt="Pujya Sri Gurumurthy Guruji"
                  width={600}
                  height={520}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="w-full h-auto rounded-lg"
                />
              </div>

            </section>

            {/* Why Only 9 Minutes + The Purpose — aligned to right image column */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-14 lg:gap-24 mb-20">
              <div className="md:col-start-7 md:col-span-6">

                {/* Why Only 9 Minutes */}
                <section className="mb-16">
                  <h2 className="font-heading text-3xl font-bold text-deep-brown mb-4" style={{
                      color: "#C2765D",
                    }}>🌿 Why Only 9 Minutes?</h2>
                  <p className="text-deep-brown/80 leading-relaxed text-base mb-4" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    Babaji&rsquo;s blessing is simple, practical, and universal.<br />
                    Nine minutes are enough to:
                  </p>
                  <ul className="space-y-2 mb-6">
                    {nineMinutes.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-deep-brown/85 leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                        <span className="mt-[9px] w-[6px] h-[6px] rounded-full bg-saffron-accent shrink-0" />
                        {m.label}
                      </li>
                    ))}
                  </ul>
                  <p className="text-deep-brown/75 leading-relaxed text-base" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    It is short, sacred, and accessible to all — students, professionals, homemakers, elders.
                  </p>
                </section>

                {/* The Purpose */}
                <section>
                  <h2 className="font-heading text-3xl font-bold text-deep-brown mb-6" style={{
                      color: "#C2765D",
                    }}>
                    🌟 The Purpose of Sanjeevini Kriya
                  </h2>
                  <ul className="space-y-2 mb-8">
                    {purpose.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-deep-brown/85 leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                        <span className="mt-[9px] w-[6px] h-[6px] rounded-full bg-saffron-accent shrink-0" />
                        <span><span className="text-deep-brown/55">{p.from}</span> {p.to}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-base text-deep-brown/80 italic leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
                    ✨ Let your breath become your prayer.<br />
                    Let your silence become your sanctuary.<br />
                    Let your soul become your master.
                  </p>
                </section>

              </div>
            </div>


          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
