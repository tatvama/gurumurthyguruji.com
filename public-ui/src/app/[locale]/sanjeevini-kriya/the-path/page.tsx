"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/locale-link";
import { Gift, Sparkles, Check, Quote, ArrowRight } from "lucide-react";
import Image from "next/image";

const stages = [
  {
    num: "01",
    days: "9 Days",
    title: "Prana Shuddhi Deeksha",
    subtitle: "Inner Awakening",
    image: "/images/pranaShuddhiDeeksha.webp",
    intro:
      "The seeker's first step. Guruji initiates seekers into basic kriya practices — awakening awareness of breath, cleansing energy channels, and preparing the mind for deeper transformation.",
    gives: [
      "Initiation into sacred breathing awareness",
      "A mantra for inner cleansing and focus",
      "Blessing to awaken prana shakti (life-energy)",
    ],
    experience: [
      "Stress melting into peace",
      "Restless thoughts settling into silence",
      "The first spark of inner strength",
    ],
    closing: "✨ This is where seekers realize: “even 9 minutes a day can change life forever.”",
  },
  {
    num: "02",
    days: "21 Days",
    title: "Atma Jagruti Deeksha",
    subtitle: "Balance & Depth",
    image: "/images/atmaJagrutiDeeksha.webp",
    intro:
      "Once the foundation is steady, Guruji bestows the second deeksha — balancing body, mind and energy in harmony.",
    gives: [
      "Guidance in deeper breath regulation (nadi shuddhi, kumbhaka)",
      "Subtle mantra practice for inner clarity",
      "Transmission of discipline — building rhythm in life",
    ],
    experience: [
      "Emotional stability and mental sharpness",
      "Renewed health and vitality",
      "A sense of divine presence in daily living",
    ],
    closing: "✨ This stage feels like returning home to your true Self, with Guruji's hand guiding every breath.",
  },
  {
    num: "03",
    days: "48 Days",
    title: "Divya Samadhi Deeksha",
    subtitle: "Divine Absorption",
    image: "/images/divyaSamadhiDeeksha.webp",
    intro:
      "The highest kriya initiation. Here, Guruji leads seekers into the sacred silence of sahaj samadhi — where breath dissolves, mind melts, and the soul shines in its fullness.",
    gives: [
      "Transmission of effortless meditation (antar mouna, inner silence)",
      "The kriya of sahaj samadhi — dissolving into divine stillness",
      "Direct energy awakening through Guruji's silent presence",
    ],
    experience: [
      "A life transformed at every level — physical, emotional, spiritual",
      "Fearlessness, clarity and deep devotion",
      "The eternal truth: I am one with the Divine",
    ],
    closing: "✨ This is not the end of practice — it is the beginning of living as a soul awakened.",
  },
];

const whyJoin = [
  "To release years of stress, anxiety and inner conflict",
  "To find peace, vitality and divine strength",
  "To walk hand-in-hand with a living master in Babaji's lineage",
  "To awaken the soul's purpose and taste samadhi",
];

export default function SanjeeviniKriyaPathPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-32 pb-24 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">

          {/* Hero */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-14">

            {/* Top Hero Image — cinematic banner: ambient glow behind a
                gold-rimmed frame, with the "Sanjeevini Kriya" label overlaid
                on the image itself (bottom scrim) instead of sitting below
                it, so the whole thing reads as one polished visual moment. */}
            <div className="relative mx-auto mb-6 max-w-[1020px] sm:mb-8 lg:mb-10">
              <div className="pointer-events-none absolute -inset-4 rounded-[2.25rem] bg-antique-gold/15 blur-3xl sm:-inset-8" />
              <div className="relative overflow-hidden rounded-2xl border border-antique-gold/30 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.45)] sm:rounded-3xl">
                <Image
                  src="/images/sanjivini_Hero_Img.png"
                  alt="A seeker in silent meditation at sunrise on Sanjeevini Kriya's path"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 768px) 100vw, 1020px"
                  className="aspect-[2/1] w-full object-cover"
                />
                {/* Bottom scrim — keeps the overlaid label legible against any part of the photo */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                {/* Overlaid label */}
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2.5 px-4 sm:bottom-7 sm:gap-4">
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-antique-gold sm:w-14" />
                  <p
                    className="whitespace-nowrap text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                    style={{
                      fontFamily: "var(--font-baskervville), 'Baskervville', serif",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      fontSize: "clamp(11px, 3vw, 17px)",
                      letterSpacing: "clamp(2px, 1.4vw, 8px)",
                    }}
                  >
                    <span style={{ display: "inline", margin: "0 0.15em", verticalAlign: "-0.1em" }}>🔱</span>
                    Sanjeevini Kriya
                    <span style={{ display: "inline", margin: "0 0.15em", verticalAlign: "-0.1em" }}>🔱</span>
                  </p>
                  <span className="h-px w-6 bg-gradient-to-l from-transparent to-antique-gold sm:w-14" />
                </div>
              </div>
            </div>

          </div>

          <LotusDivider className="mb-6 sm:mb-8 lg:mb-10" />

          {/* THE PATH heading + gold underline — above From Breath to Bliss */}
          <div className="text-center mb-4">
            <h1
              className="inline-block mb-1"
              style={{
                fontFamily: "var(--font-baskervville), 'Baskervville', serif",
                fontSize: "clamp(22px, 7vw, 47px)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "clamp(2px, 1.4vw, 10px)",
                wordSpacing: 0,
                color: "#000",
              }}
            >
              The Path
            </h1>
            <div className="flex justify-center mb-2">
              <div style={{
                height: "4px",
                width: "min(260px, 70%)",
                background: "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
                borderRadius: "2px",
              }} />
            </div>
          </div>

          {/* Subtitle — above intro */}
          <p
            className="mb-8"
            style={{
              textAlign: "center",
              fontFamily: "var(--font-caveat), 'Caveat', cursive",
              fontSize: "clamp(1rem, 4vw, 1.8rem)",
              fontWeight: 300,
              lineHeight: 1.5,
              color: "#C2765D",
            }}
          >
            🌸 From Breath to Bliss: The Journey of Diksha with Guruji 🌸
          </p>

          {/* Intro */}
          <section className="w-full text-center space-y-6 mb-20">
            <p className="font-bold text-deep-brown text-base" style={{ fontFamily: "var(--font-lora), Georgia, serif", lineHeight: "1.7" }}>
              Sanjeevini Kriya is not studied from books nor grasped as mere theory it is a living current
              of divine energy, flowing through the grace and presence of Pujya Sri Gurumurthy Guruji.
            </p>
            <p className="text-base" style={{ fontFamily: "var(--font-lora), Georgia, serif", lineHeight: "1.7", color: "#2A3A3A" }}>
              Every stage of this sacred path is received as <em>Deeksha</em> (initiation), carrying the blessing of
              Mahavatar Babaji and the ancient Siddha lineage. Sanjeevini Kriya is not something you
              &ldquo;learn,&rdquo; it is something you <em>receive</em>.
            </p>
            <p className="text-base" style={{ fontFamily: "var(--font-lora), Georgia, serif", lineHeight: "1.7", color: "#2A3A3A" }}>
              Each step unfolds as a sacred transmission, where Pujya Sri Gurumurthy Guruji awakens the hidden life-force within
              you and gently guides you into the inner mystery of your own Self.
            </p>
            <p className="font-bold text-deep-brown text-base pt-2" style={{ fontFamily: "var(--font-lora), Georgia, serif", lineHeight: "1.9" }}>
              This is not about collecting information.<br />
              It is about experiencing transformation.
            </p>
          </section>

          {/* Stages — 3 column grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {stages.map((stage) => (
              <div
                key={stage.num}
                className="bg-white border border-champagne/30 shadow-sm hover:shadow-[0_14px_40px_rgba(201,130,43,0.12)] transition-all duration-300 overflow-hidden flex flex-col"
                style={{ borderRadius: "18px" }}
              >
                {/* Card title */}
                <div className="pt-7 pb-3 px-6 text-center">
                  <h2
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#C2765D",
                      lineHeight: "1.4",
                    }}
                  >
                    {stage.num}. {stage.title}
                  </h2>
                  {/* Gold underline */}
                  <div className="flex justify-center mt-3 mb-4">
                    <div style={{
                      height: "3px",
                      width: "80px",
                      background: "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
                      borderRadius: "2px",
                    }} />
                  </div>
                </div>

                {/* Image placeholder */}
                {/* Stage Image */}
<div
  className="mx-6 mb-5 relative overflow-hidden group"
  style={{
    aspectRatio: "4/3",
    background: "linear-gradient(135deg, #fdf8f0 0%, #f0e8d8 50%, #fdf6ec 100%)",
    border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(201,130,43,0.10)",
  }}
>
  <Image
    src={stage.image}
    alt={stage.title}
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
  />

  {/* Soft hover glow */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
</div>

                {/* Days label */}
                <p
                  className="text-center mb-4 px-6"
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#2A2A2A",
                  }}
                >
                  {stage.days} of {stage.subtitle}
                </p>

                {/* Intro text with left orange border */}
                <div
                  className="mx-6 mb-5"
                  style={{
                    borderLeft: "3px solid #E07B4A",
                    paddingLeft: "12px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      fontSize: "13px",
                      lineHeight: "1.75",
                      color: "#C2765D",
                    }}
                  >
                    {stage.intro}
                  </p>
                </div>

                {/* Know More divider */}
                <div className="mx-6 mb-5 flex items-center gap-3">
                  <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.35)" }} />
                  <span
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "#C9A84C",
                    }}
                  >
                    Know More
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.35)" }} />
                </div>

                {/* What Guruji Gives */}
                <div className="px-6 mb-4">
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#2A2A2A",
                    }}
                  >
                    🌿 What Guruji Gives
                  </p>
                  <ul className="space-y-1.5">
                    {stage.gives.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2"
                        style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "12px", lineHeight: "1.65", color: "#3A3A3A" }}
                      >
                        <span style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What You Experience */}
                <div className="px-6 mb-6 flex-1">
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#2A2A2A",
                    }}
                  >
                    🌿 What You Experience
                  </p>
                  <ul className="space-y-1.5">
                    {stage.experience.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2"
                        style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "12px", lineHeight: "1.65", color: "#3A3A3A" }}
                      >
                        <span style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Closing quote */}
                <div
                  className="mx-6 mb-6 px-4 py-3"
                  style={{
                    background: "rgba(240,232,218,0.4)",
                    borderRadius: "8px",
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontSize: "11.5px",
                    fontStyle: "italic",
                    lineHeight: "1.7",
                    color: "#5A4030",
                  }}
                >
                  {stage.closing}
                </div>
              </div>
            ))}
          </section>

          {/* Guruji's Living Transmission */}
          <section className="mb-24">
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "29px",
                fontWeight: 700,
                color: "#2A2A2A",
              }}
            >
              🌸 Guruji&rsquo;s Living Transmission
            </h2>
            <p
              className="mb-5"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "17.6px", lineHeight: "1.85", color: "#3A3A3A" }}
            >
              Pujya Sri Gurumurthy Guruji does not simply instruct — he <strong>infuses seekers with kriya</strong>.
              His silence is initiation. His presence is transmission. His gaze is blessing. Every deeksha
              is an <strong>entry into Babaji&rsquo;s grace</strong>, where the seeker feels carried, guided, and uplifted into
              realms beyond words.
            </p>
            <div
              style={{
                borderLeft: "3px solid #E07B4A",
                paddingLeft: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "18px",
                  fontStyle: "italic",
                  lineHeight: "1.8",
                  color: "#C2765D",
                }}
              >
                &ldquo;When Guruji gives kriya, it is not just breath that changes — it is destiny that changes.&rdquo;
              </p>
            </div>
          </section>

          {/* Why Seekers Join + The Call is Here — 2 column */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

            {/* Left: Why Seekers Join */}
            <div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "29px",
                  fontWeight: 700,
                  color: "#2A2A2A",
                }}
              >
                🌟 Why Seekers Join
              </h2>
              <ul className="space-y-3">
                {whyJoin.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5"
                    style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "17.6px", lineHeight: "1.75", color: "#3A3A3A" }}
                  >
                    <span style={{ color: "#C9A84C", marginTop: "3px", flexShrink: 0, fontSize: "18px" }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: The Call is Here */}
            <div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "29px",
                  fontWeight: 700,
                  color: "#2A2A2A",
                }}
              >
                ✨ The Call is Here
              </h2>
              <p
                className="mb-4"
                style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "17.6px", lineHeight: "1.75", color: "#3A3A3A" }}
              >
                This is your invitation to walk the path. Not tomorrow. Not someday. <strong>Now.</strong>
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Come, receive Guruji’s Deeksha.",
                  "Come, remember the eternal truth within you.",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5"
                    style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "17.6px", lineHeight: "1.75", color: "#5A4030", fontStyle: "italic" }}
                  >
                    <span style={{ color: "#C9A84C", marginTop: "3px", flexShrink: 0, fontSize: "18px" }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "17.6px",
                  fontWeight: 700,
                  lineHeight: "2",
                  color: "#2A2A2A",
                }}
              >
                Your breath is waiting to become prayer.<br />
                Your silence is waiting to become sanctuary.<br />
                Your soul is waiting to become free.
              </p>
            </div>

          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
