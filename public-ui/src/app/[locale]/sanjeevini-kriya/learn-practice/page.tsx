"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotusDivider } from "@/components/ui/lotus-divider";
import { Link } from "@/components/ui/locale-link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Armchair, Target } from "lucide-react";
import Image from "next/image";

const howToBegin = [
  { icon: Clock,    label: "Time Required", value: "Just 9 minutes a day" },
  { icon: MapPin,   label: "Place",         value: "A quiet spot at home or nature — no rituals required" },
  { icon: Armchair, label: "Posture",       value: "Sit comfortably with a straight spine (on floor or chair)" },
  { icon: Target,   label: "Focus",         value: "Awareness of breath + mantra (given during Deeksha)" },
];

type Faq = { q: string; a: string; html?: boolean; bullets?: string[] };
type SubGroup = { title: string; items?: Faq[]; disabled?: boolean };
const faqGroups: { category: string; items: Faq[] }[] = [
  {
    category: "About Sanjeevini Kriya",
    items: [
      {
        q: "Can I start even if I am a beginner?",
        a: "Yes. Sanjeevini Kriya is designed to be simple and accessible. You don't need any prior yoga or meditation background. Guruji teaches from the very basics, beginning with breath awareness — so even a complete beginner can start with confidence.",
      },
      {
        q: "Do I need to change religion or lifestyle?",
        a: "No. Kriya Yoga is not tied to any religion, ritual, or belief system. It is a universal practice of breath and energy. You can continue with your personal faith, puja, or prayer as you always have. In fact, Sanjeevini Kriya will enhance your devotion, making your connection with the Divine deeper and more personal.",
      },
      {
        q: "What if I cannot sit cross-legged?",
        a: "That is not a problem. You can sit on a straight-backed chair or even on a sofa with your spine upright. The body's posture is not the focus — what matters is your awareness and sincerity. Guruji emphasizes that kriya is about the flow of breath and prana, not rigid physical postures.",
      },
      {
        q: "Is it safe for health?",
        a: "Yes, Sanjeevini Kriya is safe and healing. It is gentle and natural, suitable for all age groups. Unlike strenuous yoga poses, this practice works directly with the breath and nervous system, helping to reduce stress, improve sleep, strengthen immunity, and bring emotional balance. Many seekers with lifestyle disorders like diabetes, hypertension, and anxiety have found relief through regular practice.",
      },
      {
        q: "How soon will I see results?",
        a: "Many seekers feel calmness and mental clarity even from the first guided session. Others may notice better sleep, improved digestion, or reduced stress within a few days. Deeper transformation, however, comes gradually through consistency. Guruji says: \"One sincere breath taken daily in awareness can change the direction of your life.\"",
      },
      {
        q: "Can children or elders practice Sanjeevini Kriya?",
        a: "Yes. Children above 12 can start with simple breath awareness and mantra practice, while elders find kriya especially helpful for health, peace, and energy. The practice is gentle enough for seniors and inspiring for young minds. It truly is a practice for all generations.",
      },
    ],
  },

 
];

const detailedFaqGroups: { category: string; items?: Faq[]; subGroups?: SubGroup[] }[] = [
  {
    category: "About Sanjeevini Kriya",
    items: [
      {
        q: "What is Sanjeevini Kriya?",
        a: "Sanjeevini Kriya is a sacred path of breath awareness, mantra, and inner silence, taught and transmitted as <strong>Deeksha (initiation)</strong> by <strong>Pujya Sri Gurumurthy Guruji</strong> with blessings of <strong>Mahavatar Babaji</strong>. It is not just a practice but a living transmission of divine grace that awakens the life-force (<em>prana</em>) and brings balance to body, mind, and soul.",
        html: true,
      },
      {
        q: "How is it different from other yoga practices?",
        a: "Unlike physical yoga (asanas), Sanjeevini Kriya focuses on the <strong>inner journey</strong> — breath, prana, and consciousness. It is simple, gentle, and universal, yet carries profound transformative power.",
        html: true,
      },
    ],
  },
  {
    category: "Eligibility & Requirements",
    items: [
      {
        q: "Who can practice Sanjeevini Kriya?",
        a: "Anyone with sincerity. Students, homemakers, professionals, elders — all can practice. It does not require prior yoga experience.",
      },
      {
        q: "Do I need to change my religion or beliefs?",
        a: "No. Sanjeevini Kriya is universal. It supports and enhances your faith, whatever it may be.",
      },
      {
        q: "What is the minimum age to start?",
        a: "Children above 12 years can begin basic kriya with guidance. Younger children may practice mantra chanting and simple breath awareness.",
      },
      {
        q: "Can elderly people or those with health issues practice?",
        a: "Yes. Since kriya is gentle and focused on breath, it is safe for elders and those with health challenges. Guidance from Guruji ensures it is adapted to each seeker’s capacity.",
      },
    ],
  },
  {
    category: "Time & Practice",
    items: [
      {
        q: "How much time does it take daily?",
        a: "Just 9 minutes a day is enough to begin. As practice deepens, seekers naturally extend time.",
      },
      {
        q: "When is the best time to practice?",
        a: "Morning before sunrise or evening before sleep are ideal. However, it can be done anytime in a quiet setting.",
      },
      {
        q: "What if I miss a day?",
        a: "Do not feel guilty. Resume the next day. Consistency is more important than perfection.",
      },
      {
        q: "Do I need a special place or setup?",
        a: "No. Any clean, quiet spot is enough. A mat, candle, or picture of Guruji/Babaji may help create focus, but it is not mandatory.",
      },
    ],
  },
  {
    category: "Deeksha & Learning",
    items: [
      {
        q: "What happens in Deeksha?",
        a: "Deeksha is a <strong>sacred initiation</strong> where Guruji awakens your inner energy through:",
        html: true,
        bullets: ["Breath awareness techniques", "Mantra initiation", "Silent energy transmission (shaktipath)"],
      },
      {
        q: "Can I learn Sanjeevini Kriya from books or online videos?",
        a: "No. Kriya is a <strong>living transmission</strong>, not theory. Books and videos may inspire, but true kriya is received only through Guruji’s initiation.",
        html: true,
      },
      {
        q: "What if I cannot attend in person?",
        a: "Online Deeksha sessions are available for seekers who cannot travel. Guruji’s blessing reaches beyond physical distance.",
      },
    ],
  },
  {
    category: "Health & Safety",
    items: [
      {
        q: "Is Sanjeevini Kriya safe for health?",
        a: "Yes. It is natural and safe for all. In fact, it has shown benefits for:",
        bullets: ["Stress, anxiety, and depression", "Sleep and digestion issues", "Heart and lung health", "Lifestyle disorders like diabetes and thyroid imbalance."],
      },
      {
        q: "What if I cannot sit cross-legged?",
        a: "You may sit on a chair with spine straight. Comfort is more important than posture.",
      },
      {
        q: "Can women practice during menstruation?",
        a: "Yes, except for advanced breath retention techniques. Gentle kriya and mantra chanting are beneficial.",
      },
      {
        q: "Is it safe during pregnancy?",
        a: "With Guruji’s guidance, expectant mothers may practice gentle breath awareness and mantra chanting. Strenuous techniques are avoided.",
      },
    ],
  },
  {
    category: "Benefits & Experiences",
    items: [
      {
        q: "How soon will I see results?",
        a: "Many seekers feel lightness and calmness from the very first session. Long-term benefits come with <strong>consistent daily practice</strong>.",
        html: true,
      },
      {
        q: "What benefits can I expect?",
        a: "Benefits unfold across body, mind and spirit:",
        bullets: ["Physical: improved sleep, digestion, heart & lung function", "Mental: reduced stress, emotional stability, focus", "Spiritual: inner clarity, intuition, deep silence, awakening"],
      },
      {
        q: "What if I don’t feel anything?",
        a: "Kriya works silently. Some feel immediate changes, others gradually. Guruji says: <em>\"The seed sprouts unseen before the plant rises.\"</em>",
        html: true,
      },
    ],
  },
  {
    category: "Commitment & Lifestyle",
    items: [
      {
        q: "Do I need to renounce worldly life?",
        a: "No. Guruji himself emphasizes kriya is for <strong>householders</strong> — people living normal lives. It brings harmony into work, family, and relationships.",
        html: true,
      },
      {
        q: "Can I continue other practices alongside kriya?",
        a: "Yes. Prayer, meditation, puja, or religious rituals can continue. Kriya enhances devotion in any path.",
      },
      {
        q: "Do I need to become a disciple of Guruji to learn?",
        a: "No outer commitment is demanded. Guruji awakens seekers as leaders, not followers. Your sincerity is enough.",
      },
    ],
  },
  {
    category: "Practical Arrangements",
    items: [
      {
        q: "How do I register for a camp or Deeksha?",
        a: "Through the “Join the Journey” section of the website, or directly at ashram centers.",
      },
      {
        q: "Is there a fee for learning Sanjeevini Kriya?",
        a: "No fixed fee. Learning is offered with Guruji’s blessings. Voluntary donations (<em>seva</em>) are welcome to support the ashram’s spiritual and service activities.",
        html: true,
      },
      {
        q: "Where are camps conducted?",
        a: "At Sai Ashrams in Bangalore, Hassan, Hiriyur, and other spiritual centers in India and abroad.",
      },
      {
        q: "Can international seekers join?",
        a: "Yes. Online sessions and international camps are regularly held. Guidance is available in English and regional languages.",
      },
    ],
  },
];

export default function SanjeeviniKriyaLearnPage() {
  const [open, setOpen] = useState<string | null>("0-0");
  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id));
  const [openGroup, setOpenGroup] = useState<number | null>(0);
  const toggleGroup = (i: number) => setOpenGroup((cur) => (cur === i ? null : i));
  const [openSubGroup, setOpenSubGroup] = useState<string | null>("0-0");
  const toggleSubGroup = (id: string) => setOpenSubGroup((cur) => (cur === id ? null : id));

  return (
    <>
      <Header />
      <main className="flex-1 bg-pearl bg-chakra-texture pt-20 sm:pt-24 lg:pt-32 pb-6 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-saffron-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero image — container aspect matches the photo's own ratio
            (3:2), so the rounded corners sit right on the image edges
            with no empty gap above/below like the old fixed-45vh box had. */}
        <div className="flex justify-center px-4">
          <div className="relative aspect-[3/2] w-full max-w-[820px] overflow-hidden rounded-2xl sm:rounded-[28px]">
            <Image
              src="/images/Sanjivini_L&P_Hero.png"
              alt="Sanjeevini Kriya — Learn & Practice"
              fill
              sizes="(max-width: 768px) 92vw, 820px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Text content — below the border frame */}
        <div className="text-center pt-10 pb-2 px-4">
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-baskervville), 'Baskervville', serif",
              fontWeight: 500,
              textTransform: "uppercase",
              fontSize: "clamp(11px, 3vw, 18px)",
              lineHeight: 1.6,
              letterSpacing: "clamp(1.5px, 1vw, 10px)",
              color: "#CC3366",
            }}
          >
            <span style={{ display: "inline", height: "1em", width: "1em", margin: "0 0.07em", verticalAlign: "-0.1em" }}>🪷</span>
            {" "}Sanjeevini Kriya{" "}
            <span style={{ display: "inline", height: "1em", width: "1em", margin: "0 0.07em", verticalAlign: "-0.1em" }}>🪷</span>
          </p>

          <h1
            className="inline-block mb-1"
            style={{
              fontFamily: "var(--font-baskervville), 'Baskervville', serif",
              fontSize: "clamp(15px, 4.5vw, 29px)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "clamp(1.5px, 1.2vw, 10px)",
              lineHeight: "1.2",
              color: "#000",
            }}
          >
            Learn &amp; Practice
          </h1>

          <div className="flex justify-center mb-4">
            <div style={{
              height: "clamp(2px, 0.5vw, 4px)",
              width: "min(320px, 60vw)",
              background: "linear-gradient(to right, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%)",
              borderRadius: "2px",
            }} />
          </div>

          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-caveat), 'Caveat', cursive",
              fontSize: "clamp(1rem, 4vw, 1.8rem)",
              fontWeight: 300,
              lineHeight: 1.5,
              color: "#C2765D",
            }}
          >
            🌸 Begin the Journey Within 🌸
          </p>

          <p className="text-base text-deep-brown/80 max-w-5xl mx-auto leading-relaxed mb-3" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
            Sanjeevini Kriya is simple, sacred, and universal. It does not ask for outer change — it asks
            only for inner sincerity. With just a few minutes of practice daily, your breath becomes prayer,
            your silence becomes strength, and your soul becomes the master.
          </p>
          <p className="text-base text-deep-brown/70 max-w-5xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
            Here&rsquo;s how you can begin, learn, and deepen your practice under{" "}
            <strong>Pujya Sri Gurumurthy Guruji&rsquo;s guidance</strong>.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

          <LotusDivider className="mb-16" />

          {/* How to Begin + Learning From Guruji — 2 column plain text */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-20">

            {/* Left: How to Begin */}
            <div>
              <h2
                className="mb-2"
                style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "26px", fontWeight: 600, color: "#C2765D" }}
              >
                How To Begin
              </h2>
              <div className="mb-6" style={{ height: "3px", width: "120px", background: "linear-gradient(to right, #d4af37, transparent)", borderRadius: "2px" }} />

              <ul className="space-y-3 mb-8">
                {howToBegin.map((step, idx) => (
                  <li key={idx} style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "15px", lineHeight: "1.75", color: "#3A3A3A" }}>
                    <strong>{step.label}:</strong> {step.value}
                  </li>
                ))}
              </ul>

              <div style={{ borderLeft: "3px solid #E07B4A", paddingLeft: "16px" }}>
                <p style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "15px", fontStyle: "italic", lineHeight: "1.8", color: "#C2765D" }}>
                  🌿 One sincere breath with awareness is more powerful than hours of distraction.
                </p>
              </div>
            </div>

            {/* Right: Learning From Guruji */}
            <div>
              <h2
                className="mb-2"
                style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "26px", fontWeight: 600, color: "#C2765D" }}
              >
                Learning From Guruji
              </h2>
              <div className="mb-6" style={{ height: "3px", width: "120px", background: "linear-gradient(to right, #d4af37, transparent)", borderRadius: "2px" }} />

              <p className="mb-5" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "15px", lineHeight: "1.85", color: "#3A3A3A" }}>
                Sanjeevini Kriya is not learned from books or online videos — it is{" "}
                <strong>received as Deeksha (initiation)</strong> from Guruji. Each seeker is guided
                personally, carrying the grace of Babaji&rsquo;s lineage.
              </p>

              <p className="mb-3" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#2A2A2A" }}>
                🌸 Ways to Learn
              </p>

              <ul className="space-y-4" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "15px", lineHeight: "1.8", color: "#3A3A3A" }}>
                <li>
                  <strong>In-Person Camps</strong>
                  <ul className="mt-1.5 space-y-1 ml-4">
                    {[
                      "9-Day Prana Shuddhi Deeksha (inner cleansing)",
                      "21-Day Atma Jagruti Deeksha (soul awakening)",
                      "48-Day Divya Samadhi Deeksha (divine absorption)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span style={{ color: "#C9A84C", flexShrink: 0 }}>•</span>
                        <span style={{ fontStyle: "italic" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 ml-4" style={{ color: "#5A4030" }}>Conducted at ashrams and spiritual centers.</p>
                </li>
                <li>
                  <strong>Personal Deeksha</strong>
                  <p className="mt-1 ml-4">
                    Guruji gives one-to-one blessings for sincere seekers who long for deeper connection.
                  </p>
                </li>
              </ul>
            </div>

          </section>

          <LotusDivider className="mb-16" />

          {/* FAQ — 2 column: left title/desc, right accordion */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 items-start">

              {/* Left: title + description + button */}
              <div className="md:sticky md:top-32">
                <p
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-caveat), 'Caveat', cursive",
                    fontSize: "1.3rem",
                    color: "#26cc8c",
                    fontWeight: 500,
                  }}
                >
                  🌸 Sanjeevini Kriya Guidance
                </p>
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontSize: "clamp(24px, 6.5vw, 36px)",
                    fontWeight: 700,
                    lineHeight: "1.2",
                    color: "#1A1A1A",
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <p
                  className="mb-8"
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontSize: "15px",
                    lineHeight: "1.85",
                    color: "#5A4030",
                  }}
                >
                  Here are some of the most common questions seekers ask before beginning their journey with
                  Sanjeevini Kriya. If you still have doubts, remember — Guruji says,{" "}
                  <em>&ldquo;When the soul is ready, the path becomes simple.&rdquo;</em>
                </p>
                <button
                  onClick={() => document.getElementById("faq-details")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-block px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-widest cursor-pointer"
                  style={{
                    background: "#E8C547",
                    color: "#2A1A00",
                    fontFamily: "var(--font-lora), Georgia, serif",
                    letterSpacing: "2px",
                    border: "none",
                  }}
                >
                  Learn More
                </button>
              </div>

              {/* Right: accordion — flat list of ALL FAQs from all groups */}
              <div className="space-y-3">
                {faqGroups.flatMap((group, gi) =>
                  group.items.map((faq, ii) => {
                    const id = `${gi}-${ii}`;
                    const isOpen = open === id;
                    return (
                      <div
                        key={id}
                        className="bg-white overflow-hidden transition-all duration-200"
                        style={{
                          borderRadius: "16px",
                          border: isOpen ? "1.5px solid #E07B4A" : "1.5px solid #E8DDD0",
                          boxShadow: isOpen ? "0 4px 16px rgba(224,123,74,0.10)" : "none",
                        }}
                      >
                        <button
                          onClick={() => toggle(id)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-lora), Georgia, serif",
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#1A1A1A",
                              lineHeight: "1.5",
                            }}
                          >
                            {faq.q}
                          </span>
                          <span
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-lg font-bold"
                            style={{ background: isOpen ? "#E07B4A" : "#2A2A2A", transition: "background 0.2s" }}
                          >
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 pt-1">
                                <p
                                  style={{
                                    fontFamily: "var(--font-lora), Georgia, serif",
                                    fontSize: "14px",
                                    lineHeight: "1.85",
                                    color: "#5A4030",
                                  }}
                                >
                                  {faq.a}
                                </p>
                                {faq.bullets && (
                                  <ul className="mt-3 space-y-1.5">
                                    {faq.bullets.map((b, bi) => (
                                      <li key={bi} className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-saffron-accent shrink-0 mt-2" />
                                        <span style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.75", color: "#5A4030" }}>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </section>

          {/* Detailed grouped FAQ — category accordion below flat cards */}
          <section id="faq-details" className="mt-32 mb-0">
            <div className="space-y-0">
              {detailedFaqGroups.map((group, gi) => {
                const isGroupOpen = openGroup === gi;
                return (
                  <div key={gi} style={{ borderBottom: "1px solid #E8DDD0" }}>
                    {/* Category header */}
                    <button
                      onClick={() => toggleGroup(gi)}
                      className="w-full flex items-center gap-3 py-4 text-left cursor-pointer"
                    >
                      <span style={{ color: "#C2765D", fontSize: "13px", flexShrink: 0 }}>
                        {isGroupOpen ? "▲" : "▶"}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-lora), Georgia, serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#C2765D",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {group.category}
                      </span>
                    </button>

                    {/* Questions inside the group */}
                    <AnimatePresence initial={false}>
                      {isGroupOpen && (
                        <motion.div
                          key="group-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 pl-5">
                            {/* Sub-groups (nested dropdowns) */}
                            {group.subGroups && (
                              <div className="space-y-0">
                                {group.subGroups.map((sub, si) => {
                                  const subId = `${gi}-${si}`;
                                  const isSubOpen = openSubGroup === subId;
                                  return (
                                    <div key={si} style={{ borderBottom: "1px solid #F0E8DF" }}>
                                      <button
                                        onClick={() => !sub.disabled && toggleSubGroup(subId)}
                                        disabled={sub.disabled}
                                        className="w-full flex items-center gap-2 py-3 text-left"
                                        style={{ cursor: sub.disabled ? "not-allowed" : "pointer" }}
                                      >
                                        <span style={{ color: sub.disabled ? "#C8B8A8" : "#C2765D", fontSize: "12px", flexShrink: 0 }}>
                                          {isSubOpen ? "▲" : "▶"}
                                        </span>
                                        <span style={{
                                          fontFamily: "var(--font-lora), Georgia, serif",
                                          fontSize: "14px",
                                          fontWeight: 600,
                                          color: sub.disabled ? "#C8B8A8" : "#C2765D",
                                        }}>
                                          {sub.title}
                                        </span>
                                        {sub.disabled && (
                                          <span style={{ fontSize: "11px", color: "#C8B8A8", marginLeft: "6px", fontFamily: "var(--font-lora), Georgia, serif" }}>
                                            (coming soon)
                                          </span>
                                        )}
                                      </button>
                                      <AnimatePresence initial={false}>
                                        {isSubOpen && sub.items && (
                                          <motion.div
                                            key="sub-content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut" }}
                                            className="overflow-hidden"
                                          >
                                            <div className="pb-4 space-y-5 pl-4">
                                              {sub.items.map((faq, ii) => (
                                                <div key={ii}>
                                                  <p className="mb-1.5 flex items-start gap-1.5" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", fontWeight: 700, color: "#C2765D", lineHeight: "1.5" }}>
                                                    <span style={{ flexShrink: 0 }}>?</span>
                                                    {faq.q}
                                                  </p>
                                                  {faq.html ? (
                                                    <p dangerouslySetInnerHTML={{ __html: faq.a }} style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.85", color: "#3A3A3A" }} />
                                                  ) : (
                                                    <p style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.85", color: "#3A3A3A" }}>{faq.a}</p>
                                                  )}
                                                  {faq.bullets && (
                                                    <ul className="mt-2 space-y-1 pl-1">
                                                      {faq.bullets.map((b, bi) => (
                                                        <li key={bi} className="flex items-start gap-2" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.75", color: "#3A3A3A" }}>
                                                          <span style={{ flexShrink: 0, marginTop: "2px" }}>•</span>{b}
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {/* Regular Q&A items */}
                            {group.items && (
                              <div className="space-y-5">
                                {group.items.map((faq, ii) => (
                                  <div key={ii}>
                                    <p className="mb-1.5 flex items-start gap-1.5" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", fontWeight: 700, color: "#C2765D", lineHeight: "1.5" }}>
                                      <span style={{ flexShrink: 0 }}>?</span>
                                      {faq.q}
                                    </p>
                                    {faq.html ? (
                                      <p dangerouslySetInnerHTML={{ __html: faq.a }} style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.85", color: "#3A3A3A" }} />
                                    ) : (
                                      <p style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.85", color: "#3A3A3A" }}>{faq.a}</p>
                                    )}
                                    {faq.bullets && (
                                      <ul className="mt-2 space-y-1 pl-1">
                                        {faq.bullets.map((b, bi) => (
                                          <li key={bi} className="flex items-start gap-2" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "14px", lineHeight: "1.75", color: "#3A3A3A" }}>
                                            <span style={{ flexShrink: 0, marginTop: "2px" }}>•</span>{b}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
