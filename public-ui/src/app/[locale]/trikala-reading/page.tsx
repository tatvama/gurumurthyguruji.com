"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { postTrikalaReading } from "@/lib/api";
import { usePlacesAutocomplete } from "@/lib/googlePlaces";
import { useLanguage } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type Phase = 1 | 2 | 3 | 4 | "done";
type ServiceType = "horoscope" | "ashta_rekha" | "";

interface FormData {
  fullName: string; mobile: string; whatsapp: string; email: string;
  gender: string; occupation: string; address: string; city: string; district: string; state: string; pincode: string;
  preferredLanguage: string;
  dob: string; tob: string; pob: string;
  service: ServiceType; guidance: string;
}

const BLANK: FormData = {
  fullName: "", mobile: "", whatsapp: "", email: "",
  gender: "", occupation: "", address: "", city: "", district: "", state: "", pincode: "",
  preferredLanguage: "",
  dob: "", tob: "", pob: "",
  service: "", guidance: "",
};

/* ═══════════════════════════════════════════════════════
   PRIMARY ORANGE — matches reference exactly
═══════════════════════════════════════════════════════ */
const KO   = "#6B121C";                    // deep maroon — primary accent on light bg
const KOL  = "#F7ECEA";                    // light maroon tint
const KOG  = "rgba(107,18,28,0.35)";       // maroon glow
const GOLD = "#D8B76A";                    // champagne gold — accent on dark maroon bg

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function mkRef() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits  = "0123456789";
  const parts = [
    ...Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * digits.length)]),
    ...Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]),
  ];
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]];
  }
  return parts.join("");
}

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const Ico = {
  User:   () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  Phone:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.09-8.63A2 2 0 0 1 3.22 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail:   () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  Gender: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7"/><path d="M21 3l-6 6M15 3h6v6"/></svg>,
  Brief:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
  Cal:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z"/></svg>,
  Clock:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6.5v5.5l3.8 2.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>,
  Pin:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>,
  Check:  () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Camera: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  ChevDown: () => <svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Globe:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  SpeakLang: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="8" r="3"/><path d="M2 20v-1a6 6 0 0 1 6-6h0a6 6 0 0 1 3.38 1.04"/><path d="M15 9.5a2.5 2.5 0 0 0 0-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><path d="M18 12a6 6 0 0 0 0-9" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>,
};

/* ═══════════════════════════════════════════════════════
   HERO SECTION  — full screen, dark cosmic bg
   Same structure as reference: left text + right portrait
═══════════════════════════════════════════════════════ */
function KundliHero({ onBegin }: { onBegin: () => void }) {
  const { t } = useLanguage();
  const MOTES = [
    { top: "18%", left: "12%", d: 8  },
    { top: "72%", left: "18%", d: 11 },
    { top: "25%", left: "88%", d: 9  },
    { top: "78%", left: "82%", d: 13 },
    { top: "50%", left: "5%",  d: 7  },
  ];

  return (
    <section
      className="section-cosmic relative flex items-center justify-center overflow-hidden pb-10 pt-20 sm:pb-12 sm:pt-24 lg:h-[60vh] lg:max-h-[60vh] lg:pb-4 lg:pt-16"
    >

      {/* Chakra texture pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/pattern-chakras.png')",
          backgroundSize: "220px",
          backgroundRepeat: "repeat",
          opacity: 0.06,
        }}
      />

      {/* Gold glow — right side behind portrait */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.13, 0.24, 0.13] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[8%] top-1/2 z-0 h-[400px] w-[400px] lg:h-[50vh] lg:w-[50vh] -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: "rgba(216,183,106,0.18)" }}
      />
      {/* Secondary glow — left accent */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="pointer-events-none absolute left-0 top-1/4 z-0 h-[400px] w-[400px] rounded-full blur-[120px]"
        style={{ background: "rgba(110,18,32,0.2)" }}
      />

      {/* Floating motes */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {MOTES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full"
            style={{ top: p.top, left: p.left, background: "rgba(216,183,106,0.55)" }}
            animate={{ y: [0, -24, 0], opacity: [0.1, 0.55, 0.1] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
          />
        ))}
      </div>

      {/* Gold sweep border — same as ImpactStats section */}
      <div className="gold-band-border hero bottom" />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">

          {/* Left: text column */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div className="badge-dark mx-auto mb-4 w-fit lg:mx-0">
              <span style={{ color: GOLD, fontSize: 9 }}>●</span>
              <span style={{ fontSize: 10.5, letterSpacing: "0.2em" }}>{t("reading.hero.eyebrow")}</span>
            </div>

            {/* OM symbol — DM Serif Display, warm orange */}
            <p
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(36px, 4.5vw, 52px)",
                color: GOLD,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              ॐ
            </p>

            {/* Main headline */}
            <h1
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(28px, 4vw, 54px)",
                fontWeight: 700,
                lineHeight: 1.1,
                margin: "0 0 10px",
                letterSpacing: "0.015em",
              }}
            >
              <span style={{ display: "block", color: "#FFFFFF" }}>{t("reading.hero.title1")}</span>
              <span style={{ display: "block", color: "#FFFFFF" }}>
                {t("reading.hero.title2")}{" "}
                <span style={{
                  color: GOLD,
                  textShadow: "0 0 32px rgba(216,183,106,0.55), 0 0 8px rgba(216,183,106,0.30)",
                }}>{t("reading.hero.titleAccent")}</span>
              </span>
            </h1>

            {/* Subtitle — DM Serif Display 20.8px #FFDCAA (exact from inspector) */}
            <p
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(13px, 1.5vw, 18px)",
                color: "#FFDCAA",
                lineHeight: 1.65,
                maxWidth: 560,
                margin: "0 auto 14px",
                fontStyle: "italic",
              }}
              className="lg:!mx-0"
            >
              {t("reading.hero.subtitle")}
            </p>

            {/* Trust pills — proper case, frosted glass, wraps & centers on small screens */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
              className="justify-center lg:justify-start"
            >
              {[
                { icon: "🔒", label: t("reading.hero.pill1") },
                { icon: "⭐", label: t("reading.hero.pill2") },
                { icon: "∞",  label: t("reading.hero.pill3") },
              ].map(p => (
                <div
                  key={p.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                    gap: "0.4rem",
                    padding: "7px 13px",
                    borderRadius: "9999px",
                    background: "rgba(20,8,2,0.45)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "rgba(254,252,247,0.88)",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{p.icon}</span>
                  {p.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: portrait column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full max-w-[75vw] sm:max-w-[55vw] lg:max-w-[440px]"
          >
            <div className="relative flex flex-col items-center">
              {/* Golden radial glow behind image */}
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: "radial-gradient(ellipse at 50% 40%, rgba(216,183,106,0.38) 0%, rgba(216,150,60,0.18) 45%, transparent 75%)",
                  filter: "blur(28px)",
                }}
              />

              {/* Plain image — no clip, no frame */}
              <Image
                src="/images/Guruji-Head-Image.png"
                alt="Pujya Sri Gurumurthy Guruji"
                width={560}
                height={650}
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 480px"
                className="relative z-10 w-full h-auto object-contain lg:max-h-[44vh]"
                priority
              />

              {/* Name text below */}
              {/* <div className="relative z-10 text-center mt-3">
                <p className="font-heading" style={{ color: "#FEFCF7", fontWeight: 700, letterSpacing: "0.18em", fontSize: 13.5, marginBottom: 3, textTransform: "uppercase" }}>
                  Guruji
                </p>
                <p style={{ color: "rgba(255,210,155,0.62)", fontSize: 10.5, fontStyle: "italic" }}>
                  Vedic Astrologer &amp; Spiritual Guide · 12+ Years
                </p>
              </div> */}
            </div>
          </motion.div>

        </div>
      </div>

      {/* BEGIN scroll indicator — centered at bottom */}
      <button
        onClick={onBegin}
        className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(254,252,247,0.50)" }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" }}>{t("reading.begin")}</span>
        <Ico.ChevDown />
      </button>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR — dark floating pill card, matches reference
═══════════════════════════════════════════════════════ */
function StatsBar() {
  const { t } = useLanguage();
  const [counts, setCounts] = useState({ readings: 0, years: 0, hrs: 0 });

  useEffect(() => {
    const DURATION = 2200;
    const targets = { readings: 5800, years: 12, hrs: 48 };
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / DURATION, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts({
        readings: Math.floor(ease * targets.readings),
        years:    Math.floor(ease * targets.years),
        hrs:      Math.floor(ease * targets.hrs),
      });
      if (p < 1) requestAnimationFrame(tick);
      else setCounts(targets);
    }
    requestAnimationFrame(tick);
  }, []);

  const items = [
    { value: `${counts.readings}+`, label: t("reading.stats.readings") },
    { value: "4.9★",                label: t("reading.stats.rating")   },
    { value: `${counts.years}`,     label: t("reading.stats.wisdom")   },
    { value: `${counts.hrs}`,       label: t("reading.stats.delivery") },
  ];
  return (
    /* light section bg + orange top divider — card floats centered on it */
    <div
      style={{
        padding: "0 16px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* centered dark rounded card — matches image 2 */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          background: "linear-gradient(135deg, #4b0d13 0%, #5b1118 30%, #65161c 50%, #571116 75%, #430a10 100%)",
          borderRadius: "0 0 14px 14px",
          border: "1px solid rgba(216,183,106,0.25)",
          borderTop: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          overflow: "hidden",
          width: "100%",
          maxWidth: 728,
        }}
      >
        {items.map(({ value, label }, i) => (
          <div
            key={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 8px",
              borderLeft: i > 0 ? "1px solid rgba(216,183,106,0.18)" : "none",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(20px, 2.6vw, 28px)",
                fontWeight: 700,
                color: GOLD,
                lineHeight: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "clamp(10px, 1.1vw, 12px)",
                color: "rgba(255,210,160,0.55)",
                lineHeight: 1.3,
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP HEADER
═══════════════════════════════════════════════════════ */
function StepHeader({ phase }: { phase: Phase }) {
  const { t } = useLanguage();
  if (phase === "done") return null;
  const step = phase as number;
  const STEP_META: Record<number, { title: string; sub: string }> = {
    1: { title: t("reading.step1.meta"), sub: t("reading.step1.metasub") },
    2: { title: t("reading.step2.meta"), sub: t("reading.step2.metasub") },
    3: { title: t("reading.step3.meta"), sub: t("reading.step3.metasub") },
    4: { title: t("reading.step4.meta"), sub: t("reading.step4.metasub") },
  };
  const { title, sub } = STEP_META[step];

  return (
    <div style={{ background: "linear-gradient(180deg,#FFFCF5 0%,#FFFAF0 100%)", borderRadius: "16px 16px 0 0", padding: "24px 28px 20px", borderBottom: `2.5px solid ${KO}` }}>
      {/* Step circles — flex row with equal-margin connectors */}
      <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: 18 }}>
        {([1, 2, 3, 4] as number[]).map((n, i) => {
          const done   = step > n;
          const active = step === n;
          return (
            <React.Fragment key={n}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: done ? "#22a84a" : active ? KO : "#FDF6E8",
                border: done ? "none" : active ? "none" : `1.5px solid rgba(210,175,125,0.60)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? `0 4px 18px ${KOG}` : done ? "0 3px 10px rgba(34,168,74,0.35)" : "none",
                transition: "all 0.3s",
              }}>
                {done
                  ? <Ico.Check />
                  : <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 13, fontWeight: 700, color: active ? "#fff" : "rgba(180,130,75,0.75)" }}>{n}</span>
                }
              </div>
              {i < 3 && (
                <div style={{
                  flex: 1, height: 1.5, margin: "0 14px",
                  background: done ? KO : "rgba(200,170,130,0.40)",
                  transition: "background 0.3s",
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Title */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 13, fontWeight: 700, letterSpacing: "0.18em",
          color: KO, textTransform: "uppercase", marginBottom: 4,
        }}>{title}</p>
        <p style={{ fontSize: 12.5, color: "rgba(42,28,19,0.42)" }}>{sub}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED INPUT STYLES
═══════════════════════════════════════════════════════ */
const iBase: React.CSSProperties = {
  flex: 1, border: "none", outline: "none", fontSize: 13.5, fontWeight: 600,
  color: "#2A1C13", background: "transparent",
  fontFamily: "var(--font-nunito), Nunito, 'Segoe UI', sans-serif", minWidth: 0,
};
const fieldWrap: React.CSSProperties = {
  border: "1.5px solid rgba(200,170,130,0.50)", borderRadius: 12,
  padding: "16px 16px", background: "#fff",
  display: "flex", alignItems: "center", gap: 10,
  boxSizing: "border-box", width: "100%", minWidth: 0,
  boxShadow: "0 1px 6px rgba(42,28,19,0.05)", transition: "border-color 0.15s",
};

function FieldBox({ hint, children, error, label, value, icon }: {
  hint?: string; children: React.ReactNode; error?: string;
  label?: string; value?: string;
  /** Pass the icon element here (separate from children) when using a floating label */
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active   = focused;
  const floating = !!label && (!!value || focused);
  const borderColor = error ? "#fca5a5" : active ? KO : hovered ? "rgba(107,18,28,0.38)" : "rgba(200,170,130,0.50)";
  const shadow = active
    ? `0 0 0 3px rgba(107,18,28,0.11), 0 2px 10px rgba(42,28,19,0.07)`
    : hovered
    ? `0 2px 12px rgba(107,18,28,0.09)`
    : "0 1px 6px rgba(42,28,19,0.05)";

  /* Label left = 16px pad + 20px fixed icon slot + 12px gap = 48px (with icon)
     Without icon it starts at the same left as the input text = 16px           */
  const labelLeft = label ? (icon !== undefined ? 48 : 16) : 0;

  return (
    <div
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={containerRef}
        onClick={() => containerRef.current?.querySelector<HTMLElement>("input, textarea, select")?.focus()}
        style={{
          position: "relative",
          border: `1.5px solid ${borderColor}`,
          borderRadius: 12,
          /* extra top padding reserves space for the floating label */
          padding: label ? "22px 16px 10px" : "12px 16px",
          background: hovered && !active ? "#FFFCF7" : "#fff",
          boxShadow: shadow,
          transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
          display: "flex", alignItems: "center", gap: 12,
          cursor: "text",
        }}>
        {/* Fixed-width icon slot so label offset is exact */}
        {label && icon && (
          <span style={{ width: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: KO }}>
            {icon}
          </span>
        )}

        {/* Absolutely positioned floating label — smooth CSS transition */}
        {label && (
          <span style={{
            position: "absolute",
            left: labelLeft,
            top: floating ? 6 : "50%",
            transform: floating ? "none" : "translateY(-50%)",
            fontSize: floating ? 9.5 : 13.5,
            fontWeight: floating ? 800 : 400,
            letterSpacing: floating ? "0.14em" : 0,
            textTransform: floating ? "uppercase" : "none",
            color: floating ? KO : "rgba(42,28,19,0.38)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1.2,
            transition: "top 0.2s ease, transform 0.2s ease, font-size 0.18s ease, color 0.18s ease, letter-spacing 0.18s ease",
          }}>
            {label}
          </span>
        )}

        {/* Input (children). Old-style icon+input combo still works when label is absent */}
        {children}
      </div>
      {hint && !error && <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(107,18,28,0.60)", marginTop: 6, paddingLeft: 14 }}>{hint}</p>}
      {error         && <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, marginLeft: 2 }}>{error}</p>}
    </div>
  );
}

function LabeledBox({ label, hint, icon, iconRight, onIconRightClick, children }: { label: string; hint?: string; icon: React.ReactNode; iconRight?: boolean; onIconRightClick?: () => void; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = focused;
  const borderColor = active ? KO : hovered ? "rgba(107,18,28,0.38)" : "rgba(200,170,130,0.50)";
  const shadow = active
    ? `0 0 0 3px rgba(107,18,28,0.11), 0 2px 10px rgba(42,28,19,0.07)`
    : hovered
    ? `0 2px 12px rgba(107,18,28,0.09)`
    : "0 1px 6px rgba(42,28,19,0.05)";
  return (
    <div
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12, padding: "13px 14px",
        background: hovered && !active ? "#FFFCF7" : "#fff",
        boxShadow: shadow,
        transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: KO, flexShrink: 0, display: "flex" }}>{icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: KO, margin: "0 0 2px" }}>{label}</p>
            {children}
          </div>
          {iconRight && (
            <button
              type="button"
              onClick={onIconRightClick}
              style={{ color: KO, flexShrink: 0, display: "flex", opacity: 0.65, background: "none", border: "none", cursor: "pointer", padding: 4, margin: -4, borderRadius: 6 }}
            >
              {icon}
            </button>
          )}
        </div>
      </div>
      {hint && <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(107,18,28,0.60)", marginTop: 6, paddingLeft: 14 }}>{hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CUSTOM SELECT FIELD — styled dropdown like Places autocomplete
═══════════════════════════════════════════════════════ */
interface SelectOption { value: string; label: string; icon: string; sub?: string; }

function SelectField({
  fieldIcon, options, value, onChange, placeholder, hint, error, scrollRows, pinLastOption,
}: {
  fieldIcon: React.ReactNode;
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint?: string;
  error?: string;
  /** Max rows visible before scroll kicks in */
  scrollRows?: number;
  /** Pin the last option outside the scroll area, fixed at the bottom */
  pinLastOption?: boolean;
}) {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);
  const selected   = options.find(o => o.value === value);

  const borderColor = error ? "#fca5a5" : open ? KO : hovered ? "rgba(107,18,28,0.38)" : "rgba(200,170,130,0.50)";
  const shadow = open
    ? `0 0 0 3px rgba(107,18,28,0.11), 0 2px 10px rgba(42,28,19,0.07)`
    : hovered ? `0 2px 12px rgba(107,18,28,0.09)` : "0 1px 6px rgba(42,28,19,0.05)";

  function handleToggle() {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
    setOpen(p => !p);
  }

  useEffect(() => {
    function outside(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || dropRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onScroll(e: Event) {
      // Only close when the scroll happens outside the dropdown (e.g. page scroll)
      if (dropRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  /* Split options when pinLastOption is set */
  const mainOpts  = pinLastOption ? options.slice(0, -1) : options;
  const pinnedOpt = pinLastOption ? options[options.length - 1] : null;
  /* Each row: 32px icon + 12px pad top + 12px pad bottom = 56px; +1px border = 57px */
  const ITEM_H = 57;

  function renderRow(opt: SelectOption, idx: number, topBorder = idx > 0) {
    const isSel = value === opt.value;
    return (
      <div
        key={opt.value}
        onClick={() => { onChange(opt.value); setOpen(false); }}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", cursor: "pointer",
          borderTop: topBorder ? "1px solid rgba(200,170,130,0.15)" : "none",
          background: isSel ? "#FFF4EC" : "transparent",
          transition: "background 0.12s",
        }}
        onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "#FFF8F2"; }}
        onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = isSel ? "#FFF4EC" : "transparent"; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: isSel ? KO : "rgba(107,18,28,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
        }}>
          <span style={{ filter: isSel ? "brightness(10)" : "none" }}>{opt.icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: isSel ? KO : "#2A1C13" }}>{opt.label}</span>
          {opt.sub && <span style={{ fontSize: 11.5, color: "rgba(42,28,19,0.42)", marginLeft: 8 }}>{opt.sub}</span>}
        </div>
        {isSel && <span style={{ color: KO, fontSize: 14, fontWeight: 700 }}>✓</span>}
      </div>
    );
  }

  /* Dropdown rendered at document.body via portal — immune to parent
     overflow / transform / stacking-context issues               */
  const dropdown = open ? (
    <div ref={dropRef} style={{
      position: "fixed",
      top: pos.top, left: pos.left, width: pos.width,
      zIndex: 9999,
      background: "#fff", borderRadius: 12,
      border: "1px solid rgba(200,170,130,0.35)",
      boxShadow: "0 8px 32px rgba(42,28,19,0.14), 0 2px 8px rgba(42,28,19,0.06)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Scrollable list — capped at scrollRows if provided */}
      <div style={{
        overflowY: "auto",
        maxHeight: scrollRows ? scrollRows * ITEM_H : undefined,
        /* thin scrollbar on webkit */
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(107,18,28,0.20) transparent",
      } as React.CSSProperties}>
        {mainOpts.map((opt, i) => renderRow(opt, i))}
      </div>

      {/* Pinned last option — sits outside the scroll area */}
      {pinnedOpt && (
        <div style={{ flexShrink: 0, borderTop: "1.5px solid rgba(200,170,130,0.30)" }}>
          {renderRow(pinnedOpt, 0, false)}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            border: `1.5px solid ${borderColor}`, borderRadius: 12,
            padding: "16px 16px", background: hovered && !open ? "#FFFCF7" : "#fff",
            boxShadow: shadow, cursor: "pointer", fontFamily: "inherit",
            transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
          }}
        >
          <span style={{ color: KO, flexShrink: 0, display: "flex" }}>{fieldIcon}</span>
          <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, color: selected ? "#2A1C13" : "rgba(42,28,19,0.38)" }}>
            {selected ? selected.label : placeholder}
          </span>
          <span style={{
            color: KO, opacity: 0.55, fontSize: 10, display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
          }}>▼</span>
        </button>
      </div>
      {/* Portal: renders outside any positioned/transformed ancestor */}
      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
      {hint  && !error && <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(107,18,28,0.60)", marginTop: 6, paddingLeft: 14 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, marginLeft: 2 }}>{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TRUST BADGES + TESTIMONIAL
═══════════════════════════════════════════════════════ */
function TrustBadges() {
  const { t } = useLanguage();
  const badges = [
    { icon: "🔒", text: t("reading.trust.ssl")      },
    { icon: "🧾", text: t("reading.trust.conf")     },
    { icon: "✦",  text: t("reading.trust.guruji")   },
    { icon: "⏰", text: t("reading.trust.response") },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 20px", padding: "14px 16px" }}>
      {badges.map(b => (
        <span key={b.text} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 12, color: "rgba(42,28,19,0.45)", fontWeight: 500,
        }}>
          <span style={{ fontSize: 13 }}>{b.icon}</span>
          {b.text}
        </span>
      ))}
    </div>
  );
}

function Testimonial() {
  const { t } = useLanguage();
  return (
    <div style={{ background: "linear-gradient(135deg, #FFFDF5 0%, #FFF6E0 50%, #FFF2D4 100%)", border: "1px solid rgba(216,183,106,0.45)", borderRadius: 18, padding: "20px 22px", boxShadow: "0 4px 18px rgba(216,183,106,0.18)" }}>
      <div className="flex gap-4 items-start">
        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${KO},#9B3B44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 700, boxShadow: `0 4px 12px ${KOG}` }}>P</div>
        <div>
          <p style={{ color: KO, fontSize: 14, marginBottom: 6 }}>★★★★★</p>
          <p style={{ fontSize: 13, color: "rgba(42,28,19,0.72)", lineHeight: 1.72, fontStyle: "italic" }}>
            &ldquo;{t("reading.testimonial.quote")}&rdquo;
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(42,28,19,0.38)", marginTop: 8 }}>{t("reading.testimonial.by")}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP ICON + TITLE
═══════════════════════════════════════════════════════ */
function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, margin: "0 auto",
        background: "linear-gradient(135deg,#FFF0D6,#FFE4B5)",
        border: "2.5px solid rgba(210,170,100,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, boxShadow: `0 4px 20px rgba(107,18,28,0.15), inset 0 1px 0 rgba(255,255,255,0.90)`,
      }}>
        {children}
      </div>
    </div>
  );
}

function StepTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 26 }}>
      <h2 style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "clamp(20px, 2.5vw, 26px)",
        fontWeight: 700, color: KO, marginBottom: 8, lineHeight: 1.25,
      }}>{title}</h2>
      <p style={{ fontSize: 13.5, color: "rgba(42,28,19,0.46)", fontStyle: "italic" }}>{sub}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED BUTTONS
═══════════════════════════════════════════════════════ */
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: 50, height: 50, borderRadius: 11, flexShrink: 0, border: "1.5px solid rgba(200,170,130,0.45)", background: "#fff", cursor: "pointer", color: "#2A1C13", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(42,28,19,0.05)" }}>←</button>
  );
}

function SkipBtn({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <button onClick={onClick} style={{ padding: "0 18px", height: 50, borderRadius: 11, flexShrink: 0, border: "1.5px solid rgba(200,170,130,0.45)", background: "#fff", cursor: "pointer", color: "rgba(42,28,19,0.55)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(42,28,19,0.05)" }}>{t("reading.btn.skip")}</button>
  );
}

const orangeBtn: React.CSSProperties = {
  flex: 1, padding: "15px 20px", borderRadius: 12, border: "none",
  background: KO,
  color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  boxShadow: `0 4px 18px ${KOG}`,
  transition: "all 0.2s", letterSpacing: "0.03em",
};
const orangeBtnDisabled: React.CSSProperties = { ...orangeBtn, background: "rgba(107,18,28,0.32)", boxShadow: "none", cursor: "not-allowed" };

/* ═══════════════════════════════════════════════════════
   STEP 1 — IDENTITY
═══════════════════════════════════════════════════════ */
const LANGUAGES = ["Kannada", "English", "Hindi", "Telugu", "Tamil", "Malayalam", "Marathi", "Bengali", "Other"];

function Step1({ form, set, next }: { form: FormData; set: (k: keyof FormData, v: string) => void; next: () => void }) {
  const { t } = useLanguage();
  const [errs, setErrs] = useState<Partial<Record<keyof FormData, string>>>({});
  const addressRef = useRef<HTMLInputElement>(null);
  usePlacesAutocomplete(addressRef, (p) => {
    set("address", p.formatted || [p.city, p.district, p.state, p.pincode].filter(Boolean).join(", "));
    set("city",     p.city);
    set("district", p.district);
    set("state",    p.state);
    set("pincode",  p.pincode);
  });

  function validate() {
    const e: typeof errs = {};
    if (!form.fullName.trim())            e.fullName   = t("reading.s1.fullname.err");
    if (!/^\d{10}$/.test(form.mobile))    e.mobile     = t("reading.s1.mobile.err");
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email      = t("reading.s1.email.err");
    if (!form.gender)                     e.gender     = t("reading.s1.gender.err");
    if (!form.occupation.trim())          e.occupation = t("reading.s1.occupation.err");
    setErrs(e); return Object.keys(e).length === 0;
  }

  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>🙏</StepIcon>
      <StepTitle title={t("reading.s1.title")} sub={t("reading.s1.sub")} />
      <div className="flex flex-col gap-4">
        <FieldBox hint={t("reading.s1.fullname.hint")} error={errs.fullName} label={t("reading.s1.fullname")} value={form.fullName} icon={<Ico.User />}>
          <input style={iBase} placeholder="" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
        </FieldBox>
        <div className="kundli-grid-2">
          <FieldBox hint={t("reading.s1.mobile.hint")} error={errs.mobile} label={t("reading.s1.mobile")} value={form.mobile} icon={<Ico.Phone />}>
            <input style={iBase} placeholder="" inputMode="numeric" maxLength={10} value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))} />
          </FieldBox>
          <FieldBox hint={t("reading.s1.whatsapp.hint")} label={t("reading.s1.whatsapp")} value={form.whatsapp} icon={<span style={{ fontSize: 16 }}>💬</span>}>
            <input style={iBase} placeholder="" inputMode="numeric" maxLength={10} value={form.whatsapp} onChange={e => set("whatsapp", e.target.value.replace(/\D/g, ""))} />
          </FieldBox>
        </div>
        <FieldBox hint={t("reading.s1.email.hint")} error={errs.email} label={t("reading.s1.email")} value={form.email} icon={<Ico.Mail />}>
          <input style={iBase} type="email" placeholder="" value={form.email} onChange={e => set("email", e.target.value)} />
        </FieldBox>
        <div className="kundli-grid-2">
          <SelectField
            fieldIcon={<Ico.Gender />}
            options={[
              { value: "male",   label: t("reading.s1.gender.male"),   icon: "♂", sub: t("reading.s1.gender.male.sub")   },
              { value: "female", label: t("reading.s1.gender.female"), icon: "♀", sub: t("reading.s1.gender.female.sub") },
              { value: "other",  label: t("reading.s1.gender.other"),  icon: "⚧", sub: t("reading.s1.gender.other.sub")  },
            ]}
            value={form.gender}
            onChange={v => set("gender", v)}
            placeholder={t("reading.s1.gender")}
            hint={t("reading.s1.gender.hint")}
            error={errs.gender}
          />
          <FieldBox hint={t("reading.s1.occupation.hint")} error={errs.occupation} label={t("reading.s1.occupation")} value={form.occupation} icon={<Ico.Brief />}>
            <input style={iBase} placeholder="" value={form.occupation} onChange={e => set("occupation", e.target.value)} />
          </FieldBox>
        </div>
        <FieldBox hint={t("reading.s1.address.hint")} label="Address" value={form.address} icon={<Ico.Pin />}>
          <input
            ref={addressRef}
            style={iBase}
            placeholder=""
            value={form.address}
            autoComplete="off"
            onChange={e => set("address", e.target.value)}
          />
        </FieldBox>
        <SelectField
          fieldIcon={<Ico.SpeakLang />}
          options={LANGUAGES.map(l => ({
            value: l, label: l, icon: "🌐",
          }))}
          value={form.preferredLanguage}
          onChange={v => set("preferredLanguage", v)}
          placeholder={t("reading.s1.language")}
          hint={t("reading.s1.language.hint")}
          scrollRows={3}
          pinLastOption
        />

      </div>
      <button onClick={() => validate() && next()} style={{ ...orangeBtn, width: "100%", marginTop: 26, padding: "15px", flex: "none" }}>
        {t("reading.btn.continue")} <span style={{ fontSize: 18 }}>→</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PLACE OF BIRTH — Google Places autocomplete (fills the place text)
═══════════════════════════════════════════════════════ */
function PlaceAutocomplete({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  usePlacesAutocomplete(ref, (p) => {
    onChange(p.formatted || [p.city, p.district, p.state, p.country].filter(Boolean).join(", "));
  });
  return (
    <input
      ref={ref}
      style={{ ...iBase, fontSize: 13, width: "100%" }}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoComplete="off"
    />
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 2 — BIRTH DETAILS
═══════════════════════════════════════════════════════ */
function Step2({ form, set, next, back }: { form: FormData; set: (k: keyof FormData, v: string) => void; next: () => void; back: () => void }) {
  const { t } = useLanguage();
  const [err, setErr] = useState("");
  const dobRef = useRef<HTMLInputElement>(null);
  const tobRef = useRef<HTMLInputElement>(null);

  function validate() {
    if (!form.dob || !form.pob.trim()) { setErr(t("reading.s2.err")); return false; }
    setErr(""); return true;
  }
  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>🌟</StepIcon>
      <StepTitle title={t("reading.s2.title")} sub={t("reading.s2.sub")} />
      <div className="flex flex-col gap-4">
        <div className="kundli-grid-2">
          <LabeledBox label={t("reading.s2.dob")} hint={t("reading.s2.dob.hint")} icon={<Ico.Cal />} iconRight onIconRightClick={() => { try { (dobRef.current as any)?.showPicker(); } catch { dobRef.current?.click(); } }}>
            <input ref={dobRef} type="date" style={{ ...iBase, fontSize: 13, WebkitAppearance: "none" as const }} value={form.dob} onChange={e => set("dob", e.target.value)} />
          </LabeledBox>
          <LabeledBox label={t("reading.s2.tob")} hint={t("reading.s2.tob.hint")} icon={<Ico.Clock />} iconRight onIconRightClick={() => { try { (tobRef.current as any)?.showPicker(); } catch { tobRef.current?.click(); } }}>
            <input ref={tobRef} type="time" style={{ ...iBase, fontSize: 13, WebkitAppearance: "none" as const }} value={form.tob} onChange={e => set("tob", e.target.value)} />
          </LabeledBox>
        </div>
        <LabeledBox label={t("reading.s2.pob")} hint={t("reading.s2.pob.hint")} icon={<Ico.Pin />}>
          <PlaceAutocomplete value={form.pob} onChange={v => set("pob", v)} placeholder={t("reading.s2.pob.placeholder")} />
        </LabeledBox>
        {err && <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center" }}>{err}</p>}
      </div>
      <div className="flex gap-3 mt-7">
        <BackBtn onClick={back} />
        <button onClick={() => validate() && next()} style={orangeBtn}>{t("reading.btn.continue")} <span style={{ fontSize: 18 }}>→</span></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 3 — CHOOSE PATH
═══════════════════════════════════════════════════════ */

function Step3({ form, set, next, back }: { form: FormData; set: (k: keyof FormData, v: string) => void; next: () => void; back: () => void }) {
  const { t } = useLanguage();
  const ready = !!form.service && form.guidance.trim().length >= 5;
  const [err, setErr] = useState("");

  const SERVICES = [
    { id: "horoscope",   icon: "✨", title: t("reading.s3.horoscope.title"), desc: t("reading.s3.horoscope.desc") },
    { id: "ashta_rekha", icon: "🖐️", title: t("reading.s3.ashta.title"),     desc: t("reading.s3.ashta.desc")    },
  ];

  function go() {
    if (!form.service) { setErr(t("reading.s3.err.service")); return; }
    if (form.guidance.trim().length < 5) { setErr(t("reading.s3.err.guidance")); return; }
    setErr(""); next();
  }

  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>🕉️</StepIcon>
      <StepTitle title={t("reading.s3.title")} sub={t("reading.s3.sub")} />


      <div className="mb-4 kundli-card-grid">
        {SERVICES.map(s => {
          const sel = form.service === s.id;
          return (
            <button key={s.id} onClick={() => set("service", s.id)} style={{ padding: "22px 14px 18px", borderRadius: 16, textAlign: "center", cursor: "pointer", border: `2px solid ${sel ? KO : "rgba(200,170,130,0.38)"}`, background: sel ? KOL : "#FFFAF5", position: "relative", transition: "all 0.2s", boxShadow: sel ? `0 4px 18px rgba(107,18,28,0.18)` : "0 2px 8px rgba(42,28,19,0.06)" }}>
              {sel && <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: KO, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.Check /></div>}
              <div style={{ width: 58, height: 58, borderRadius: 16, margin: "0 auto 13px", background: sel ? "linear-gradient(135deg,#FFE0B8,#FFCF96)" : "linear-gradient(135deg,#FFF0E0,#FFE5D0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: sel ? `0 3px 12px rgba(107,18,28,0.20)` : "0 2px 6px rgba(42,28,19,0.08)" }}>{s.icon}</div>
              <p style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 14, fontWeight: 700, marginBottom: 7, color: KO, lineHeight: 1.25 }}>{s.title}</p>
              <p style={{ fontSize: 11.5, color: "rgba(42,28,19,0.44)", lineHeight: 1.55, textAlign: "center" }}>{s.desc}</p>
            </button>
          );
        })}
      </div>
      {/* Textarea */}
      <div style={{ border: "1.5px solid rgba(200,170,130,0.45)", borderRadius: 12, padding: "12px 14px", background: "#fff", boxShadow: "0 1px 6px rgba(42,28,19,0.05)" }}>
        <div className="flex gap-3">
          <span style={{ color: KO, marginTop: 2, fontSize: 15, flexShrink: 0 }}>🧎</span>
          <textarea style={{ ...iBase, resize: "vertical", minHeight: 96, lineHeight: 1.7 }} placeholder={t("reading.s3.guidance")} value={form.guidance} onChange={e => set("guidance", e.target.value)} />
        </div>
      </div>
      <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(107,18,28,0.60)", marginTop: 6, paddingLeft: 14 }}>{t("reading.s3.guidance.hint")}</p>
      {err && <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center", marginTop: 10 }}>{err}</p>}
      <p style={{ textAlign: "center", color: "rgba(200,170,130,0.55)", fontSize: 18, letterSpacing: "10px", margin: "13px 0 6px" }}>+ + +</p>
      <div className="flex gap-3">
        <BackBtn onClick={back} />
        <button onClick={go} style={ready ? { ...orangeBtn, letterSpacing: "0.06em", fontSize: 13.5 } : { ...orangeBtnDisabled, letterSpacing: "0.06em", fontSize: 13.5 }}>
          <span style={{ fontSize: 15 }}>⚙️</span> {t("reading.s3.generate")}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 4 — ENHANCE YOUR READING (Palm Upload)
═══════════════════════════════════════════════════════ */
function Step4({ back, next, skip, loading, submitErr, onImage, consent, onConsent }: {
  back: () => void; next: () => void; skip: () => void; loading?: boolean; submitErr?: string;
  onImage: (b64: string | null) => void; consent: boolean; onConsent: (v: boolean) => void;
}) {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [consentErr, setConsentErr] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function attemptSubmit() {
    if (!consent) { setConsentErr(true); return; }
    setConsentErr(false); next();
  }
  function attemptSkip() {
    if (!consent) { setConsentErr(true); return; }
    setConsentErr(false); skip();
  }

  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>✦</StepIcon>
      <StepTitle title={t("reading.s4.title")} sub={t("reading.s4.sub")} />
      <p style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: KO, marginBottom: 12 }}>{t("reading.s4.upload.title")}</p>
      <div
        onClick={() => fileRef.current?.click()}
        style={{ border: `1.8px dashed ${KO}`, borderRadius: 12, padding: "42px 24px", textAlign: "center", cursor: "pointer", background: KOL, marginBottom: 20, transition: "background 0.2s" }}
      >
        {preview ? (
          <div>
            <img src={preview} alt="Palm preview" style={{ maxHeight: 180, borderRadius: 10, margin: "0 auto 10px", display: "block" }} />
            <p style={{ fontSize: 12, color: "rgba(42,28,19,0.50)" }}>{fileName}</p>
          </div>
        ) : (
          <>
            <div style={{ color: "rgba(42,28,19,0.40)", marginBottom: 12 }}><Ico.Camera /></div>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "#2A1C13", marginBottom: 4 }}>{t("reading.s4.upload.tap")}</p>
            <p style={{ fontSize: 11.5, color: "rgba(42,28,19,0.40)" }}>{t("reading.s4.upload.hint")}</p>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFile} />

      {/* Consent checkbox — required */}
      <div onClick={() => { onConsent(!consent); setConsentErr(false); }}
        style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${consentErr ? "#fca5a5" : consent ? KO : "rgba(200,170,130,0.45)"}`, background: consent ? KOL : "#fff", cursor: "pointer", marginBottom: 14, transition: "all 0.15s", userSelect: "none" }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${consent ? KO : "rgba(200,170,130,0.60)"}`, background: consent ? KO : "#fff", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          {consent && <Ico.Check />}
        </div>
        <p style={{ fontSize: 12.5, color: "rgba(42,28,19,0.72)", lineHeight: 1.65, margin: 0 }}>
          {t("reading.s4.consent")} <span style={{ color: KO, fontWeight: 700 }}>*</span>
        </p>
      </div>
      {consentErr && <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 10 }}>{t("reading.s4.consent.err")}</p>}

      {submitErr && <p style={{ fontSize: 12.5, color: "#ef4444", textAlign: "center", marginBottom: 10, padding: "9px 14px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>{submitErr}</p>}
      <div className="flex gap-3">
        <BackBtn onClick={back} />
        <SkipBtn onClick={attemptSkip} />
        <button onClick={attemptSubmit} disabled={loading} style={{ ...orangeBtn, opacity: loading ? 0.7 : 1 }}>
          {loading ? t("reading.btn.submitting") : <><span>{t("reading.btn.submit")}</span><span style={{ fontSize: 18 }}>→</span></>}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════════════════ */
function SuccessScreen({ caseRef, reset }: { caseRef: string; reset: () => void }) {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "50px 24px 46px", textAlign: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 20, lineHeight: 1, position: "relative", display: "inline-block" }}>
        <span style={{ position: "absolute", top: -8, left: -14, fontSize: 24, opacity: 0.7 }}>✦</span>
        ✦
        <span style={{ position: "absolute", top: -10, right: -14, fontSize: 20, opacity: 0.55 }}>✦</span>
      </div>
      <h2 className="font-heading" style={{ fontSize: 31, fontWeight: 700, color: KO, marginBottom: 14, lineHeight: 1.2 }}>{t("reading.success.title")}</h2>
      <p style={{ fontSize: 14, color: "rgba(42,28,19,0.58)", lineHeight: 1.78, maxWidth: 370, margin: "0 auto 30px", fontStyle: "italic" }}>
        {t("reading.success.body")}
      </p>
      <div style={{ display: "inline-block", border: "1.5px solid rgba(200,170,130,0.50)", borderRadius: 14, padding: "16px 36px", background: "#FFFBF6", marginBottom: 32, boxShadow: "0 4px 20px rgba(107,18,28,0.10)" }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(42,28,19,0.42)", marginBottom: 8 }}>{t("reading.success.ref")}</p>
        <p className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: KO, letterSpacing: "0.06em" }}>{caseRef}</p>
      </div>
      <div>
        <button onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 50, border: `2px solid ${KO}`, background: "#fff", color: KO, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          {t("reading.btn.again")}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function KundliPage() {
  const { t } = useLanguage();
  const formRef  = useRef<HTMLDivElement>(null);
  const [phase,   setPhase]   = useState<Phase>(1);
  const [form,    setForm]    = useState<FormData>(BLANK);
  const [caseRef, setCaseRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  function set(k: keyof FormData, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  // Gold/maroon Places-autocomplete theme while this public page is mounted
  useEffect(() => {
    document.body.classList.add("pac-theme-gold");
    return () => document.body.classList.remove("pac-theme-gold");
  }, []);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function submit() {
    setLoading(true);
    setSubmitErr("");
    try {
      const result = await postTrikalaReading({
        fullName:         form.fullName,
        mobile:           form.mobile,
        whatsapp:         form.whatsapp || undefined,
        email:            form.email,
        gender:           form.gender,
        occupation:       form.occupation,
        city:             form.city || form.address || undefined,
        district:         form.district || undefined,
        state:            form.state || undefined,
        pincode:          form.pincode || undefined,
        preferredLanguage: form.preferredLanguage || undefined,
        dob:              form.dob,
        tob:              form.tob || undefined,

        pob:              form.pob,
        serviceType:      form.service,

        guidanceQuery:    form.guidance,
        palmImage:        palmImage || undefined,
        consent:          consent,
      });
      setCaseRef(result.caseReference);
      setPhase("done");
    } catch (err: any) {
      console.error("Submit error:", err);
      const fieldErrors = Array.isArray(err?.errors)
        ? err.errors.map((e: any) => e.message).join(". ")
        : null;
      const msg = fieldErrors || err?.message || t("reading.s4.err");
      setSubmitErr(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() { setForm(BLANK); setCaseRef(""); setPhase(1); setSubmitErr(""); setPalmImage(null); setConsent(false); }

  return (
    <>
      <Header />
      <main>
        {/* ── HERO SECTION ─────────────────────────────── */}
        <KundliHero onBegin={scrollToForm} />

        {/* ── FORM SECTION ─────────────────────────────── */}
        <div ref={formRef}>
          <StatsBar />

          <div
            style={{ minHeight: "60vh", background: "linear-gradient(180deg,#FFFDF8 0%,#FFF7EE 100%)", fontFamily: "var(--font-inter,system-ui,sans-serif)" }}
          >
            <style>{`
              .kundli-grid-2 {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                min-width: 0;
              }
              .kundli-grid-2 > * { min-width: 0; }
              @media (min-width: 560px) {
                .kundli-grid-2 { grid-template-columns: repeat(2, 1fr); }
              }
              .kundli-card-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                min-width: 0;
              }
              .kundli-card-grid > * { min-width: 0; }
              @media (min-width: 560px) {
                .kundli-card-grid { grid-template-columns: repeat(2, 1fr); }
              }
              input[type="date"]::-webkit-calendar-picker-indicator,
              input[type="time"]::-webkit-calendar-picker-indicator { display: none; }
              input[type="date"], input[type="time"] { cursor: pointer; }
              select:focus { outline: none !important; box-shadow: none !important; }
              select { -webkit-appearance: none; appearance: none; }
            `}</style>

            <div className="mx-auto px-4 py-10 pb-16" style={{ maxWidth: 760 }}>

              {/* Main card — trust badges are OUTSIDE this card */}
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(107,18,28,0.18)", boxShadow: "0 8px 40px rgba(107,18,28,0.12), 0 3px 14px rgba(107,18,28,0.07)", overflow: "visible", marginBottom: 0 }}>
                <StepHeader phase={phase} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -26 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {phase === 1      && <Step1 form={form} set={set} next={() => setPhase(2)} />}
                    {phase === 2      && <Step2 form={form} set={set} next={() => setPhase(3)} back={() => setPhase(1)} />}
                    {phase === 3      && <Step3 form={form} set={set} next={() => setPhase(4)} back={() => setPhase(2)} />}
                    {phase === 4      && <Step4 back={() => setPhase(3)} next={submit} skip={submit} loading={loading} submitErr={submitErr} onImage={setPalmImage} consent={consent} onConsent={setConsent} />}
                    {phase === "done" && <SuccessScreen caseRef={caseRef} reset={reset} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Trust badges outside the card — below with thin separator */}
              {phase !== "done" && (
                <div style={{ borderTop: "1px solid rgba(200,170,130,0.28)", marginTop: 6 }}>
                  <TrustBadges />
                </div>
              )}

              {/* Testimonial below trust badges — all steps except done */}
              {phase !== "done" && (
                <div style={{ marginTop: 16 }}>
                  <Testimonial />
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
