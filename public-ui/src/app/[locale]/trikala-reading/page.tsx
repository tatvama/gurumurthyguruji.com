"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { postTrikalaReading } from "@/lib/api";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type Phase = 1 | 2 | 3 | 4 | "done";
type ServiceType = "horoscope" | "ashta_rekha" | "";

interface FormData {
  fullName: string; mobile: string; email: string;
  gender: string; occupation: string;
  dob: string; tob: string; pob: string;
  service: ServiceType; guidance: string;
}

const BLANK: FormData = {
  fullName: "", mobile: "", email: "",
  gender: "", occupation: "",
  dob: "", tob: "", pob: "",
  service: "", guidance: "",
};

/* ═══════════════════════════════════════════════════════
   PRIMARY ORANGE — matches reference exactly
═══════════════════════════════════════════════════════ */
const KO  = "#FA580C";
const KOL = "#FFF3E8";
const KOG = "rgba(250,88,12,0.38)";

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
  User:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.09-8.63A2 2 0 0 1 3.22 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Gender: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7"/><path d="M21 3l-6 6M15 3h6v6"/></svg>,
  Brief:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Cal:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Clock:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Pin:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Check:  () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Camera: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  ChevDown: () => <svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ═══════════════════════════════════════════════════════
   HERO SECTION  — full screen, dark cosmic bg
   Same structure as reference: left text + right portrait
═══════════════════════════════════════════════════════ */
function KundliHero({ onBegin }: { onBegin: () => void }) {
  const MOTES = [
    { top: "18%", left: "12%", d: 8  },
    { top: "72%", left: "18%", d: 11 },
    { top: "25%", left: "88%", d: 9  },
    { top: "78%", left: "82%", d: 13 },
    { top: "50%", left: "5%",  d: 7  },
  ];

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pb-20 pt-28"
      style={{
        background: "radial-gradient(ellipse at 60% 40%, rgba(110,38,8,0.55) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(80,10,0,0.40) 0%, transparent 55%), linear-gradient(160deg,#110400 0%,#1c0600 30%,#240800 60%,#150400 100%)",
      }}
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
        className="pointer-events-none absolute right-[8%] top-1/2 z-0 h-[650px] w-[650px] -translate-y-1/2 rounded-full blur-[140px]"
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

      {/* Orange border line — visible at bottom of 100vh hero */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
        style={{ height: 2.5, background: `linear-gradient(90deg, transparent 0%, ${KO} 20%, ${KO} 80%, transparent 100%)` }}
      />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: text column */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div className="badge-dark mx-auto mb-7 w-fit lg:mx-0">
              <span style={{ color: KO, fontSize: 9 }}>●</span>
              <span style={{ fontSize: 10.5, letterSpacing: "0.2em" }}>TRUSTED COSMIC GUIDANCE</span>
            </div>

            {/* OM symbol — DM Serif Display, warm orange */}
            <p
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(44px, 6vw, 64px)",
                color: KO,
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              ॐ
            </p>

            {/* Main headline — Cinzel 64px #FFFFFF (exact from inspector) */}
            <h1
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(42px, 5.2vw, 64px)",
                fontWeight: 700,
                lineHeight: 1.1,
                margin: "0 0 16px",
                letterSpacing: "0.015em",
              }}
            >
              <span style={{ display: "block", color: "#FFFFFF" }}>Your Stars</span>
              <span style={{ display: "block", color: "#FFFFFF" }}>
                Have a{" "}
                <span style={{
                  color: "#FA580C",
                  textShadow: "0 0 32px rgba(250,88,12,0.55), 0 0 8px rgba(250,88,12,0.30)",
                }}>Story</span>
              </span>
            </h1>

            {/* Subtitle — DM Serif Display 20.8px #FFDCAA (exact from inspector) */}
            <p
              style={{
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: "clamp(15px, 1.85vw, 20.8px)",
                color: "#FFDCAA",
                lineHeight: 1.78,
                maxWidth: 640,
                margin: "0 auto 28px",
                fontStyle: "italic",
              }}
              className="lg:!mx-0"
            >
              Guruji studies your celestial blueprint and reveals the sacred wisdom written in the cosmos — just for you.
            </p>

            {/* Trust pills — proper case, frosted glass, all on ONE line (no wrap) */}
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "8px",
                justifyContent: "flex-start",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch" as unknown as undefined,
                scrollbarWidth: "none" as const,
                msOverflowStyle: "none" as const,
              }}
              className="justify-center lg:justify-start"
            >
              {[
                { icon: "🔒", label: "100% Confidential" },
                { icon: "⭐", label: "4.9 / 5 Rating" },
                { icon: "∞",  label: "12+ Years of Practice" },
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
            className="relative mx-auto w-full"
            style={{ maxWidth: 560 }}
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
                sizes="(max-width: 768px) 90vw, 560px"
                className="relative z-10 w-full h-auto object-contain"
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
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" }}>BEGIN</span>
        <Ico.ChevDown />
      </button>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR — dark floating pill card, matches reference
═══════════════════════════════════════════════════════ */
function StatsBar() {
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
    { value: `${counts.readings}+`, label: "Readings Given" },
    { value: "4.9★",                label: "Avg Rating" },
    { value: `${counts.years}`,     label: "Years of Wisdom" },
    { value: `${counts.hrs}`,       label: "Hrs Avg Delivery" },
  ];
  return (
    /* light section bg + orange top divider — card floats centered on it */
    <div
      style={{
        background: "linear-gradient(180deg,#FFFDF8 0%,#FFF7EE 100%)",
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
          background: "linear-gradient(135deg, #1e0800 0%, #2a1000 50%, #1e0800 100%)",
          borderRadius: "0 0 14px 14px",
          border: "1px solid rgba(250,88,12,0.20)",
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
              borderLeft: i > 0 ? "1px solid rgba(250,88,12,0.15)" : "none",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(20px, 2.6vw, 28px)",
                fontWeight: 700,
                color: KO,
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
const STEP_META: Record<number, { title: string; sub: string }> = {
  1: { title: "WHO ARE YOU?",          sub: "Step 1 of 4 — Identity" },
  2: { title: "YOUR CELESTIAL ORIGIN", sub: "Step 2 of 4 — Birth Details — Date, time & place" },
  3: { title: "CHOOSE YOUR PATH",      sub: "Step 3 of 4 — Service — Pick your reading type" },
  4: { title: "YOUR SACRED QUESTION",  sub: "Step 4 of 4 — Palm Upload — For Ashta Rekha" },
};

function StepHeader({ phase }: { phase: Phase }) {
  if (phase === "done") return null;
  const step = phase as number;
  const { title, sub } = STEP_META[step];

  return (
    <div style={{ background: "linear-gradient(180deg,#FFFCF5 0%,#FFFAF0 100%)", borderRadius: "16px 16px 0 0", padding: "24px 28px 20px", borderBottom: "2.5px solid #F97316" }}>
      {/* Step circles — flex row with equal-margin connectors */}
      <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: 18 }}>
        {([1, 2, 3, 4] as number[]).map((n, i) => {
          const done   = step > n;
          const active = step === n;
          return (
            <React.Fragment key={n}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: done ? KO : active ? KO : "#FDF6E8",
                border: done ? "none" : active ? "none" : `1.5px solid rgba(210,175,125,0.60)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? `0 4px 18px ${KOG}` : done ? `0 3px 10px ${KOG}` : "none",
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
  flex: 1, border: "none", outline: "none", fontSize: 13.5,
  color: "#2A1C13", background: "transparent", fontFamily: "inherit", minWidth: 0,
};
const fieldWrap: React.CSSProperties = {
  border: "1.5px solid rgba(200,170,130,0.50)", borderRadius: 12,
  padding: "12px 16px", background: "#fff",
  display: "flex", alignItems: "center", gap: 10,
  boxShadow: "0 1px 6px rgba(42,28,19,0.05)", transition: "border-color 0.15s",
};

function FieldBox({ hint, children, error }: { hint?: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <div style={{ ...fieldWrap, borderColor: error ? "#fca5a5" : "rgba(200,170,130,0.50)" }}>{children}</div>
      {hint && !error && <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(217,119,6,0.70)", marginTop: 6, paddingLeft: 14 }}>{hint}</p>}
      {error         && <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, marginLeft: 2 }}>{error}</p>}
    </div>
  );
}

function LabeledBox({ label, hint, icon, iconRight, onIconRightClick, children }: { label: string; hint?: string; icon: React.ReactNode; iconRight?: boolean; onIconRightClick?: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ border: "1.5px solid rgba(200,170,130,0.50)", borderRadius: 12, padding: "9px 14px", background: "#fff", boxShadow: "0 1px 6px rgba(42,28,19,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Left icon */}
          <span style={{ color: KO, flexShrink: 0, display: "flex" }}>{icon}</span>
          {/* Label + input stacked */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: KO, margin: "0 0 2px" }}>{label}</p>
            {children}
          </div>
          {/* Right icon (date/time only) — clickable button that opens picker */}
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
      {hint && <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(217,119,6,0.70)", marginTop: 6, paddingLeft: 14 }}>{hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TRUST BADGES + TESTIMONIAL
═══════════════════════════════════════════════════════ */
function TrustBadges() {
  const badges = [
    { icon: "🔒", text: "SSL Secured" },
    { icon: "🧾", text: "Fully Confidential" },
    { icon: "✦",  text: "Verified Guruji" },
    { icon: "⏰", text: "48hr Response" },
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
  return (
    <div style={{ background: "linear-gradient(135deg, #FFFDF5 0%, #FFF6E0 50%, #FFF2D4 100%)", border: "1px solid rgba(216,183,106,0.45)", borderRadius: 18, padding: "20px 22px", boxShadow: "0 4px 18px rgba(216,183,106,0.18)" }}>
      <div className="flex gap-4 items-start">
        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${KO},#F5A040)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 700, boxShadow: `0 4px 12px ${KOG}` }}>P</div>
        <div>
          <p style={{ color: KO, fontSize: 14, marginBottom: 6 }}>★★★★★</p>
          <p style={{ fontSize: 13, color: "rgba(42,28,19,0.72)", lineHeight: 1.72, fontStyle: "italic" }}>
            &ldquo;Guruji&apos;s reading was truly eye-opening. He described my life situation with uncanny accuracy. I feel guided and at peace after receiving my report.&rdquo;
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(42,28,19,0.38)", marginTop: 8 }}>— Priya S., Mumbai</p>
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
        fontSize: 26, boxShadow: `0 4px 20px rgba(250,88,12,0.15), inset 0 1px 0 rgba(255,255,255,0.90)`,
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
  return (
    <button onClick={onClick} style={{ padding: "0 18px", height: 50, borderRadius: 11, flexShrink: 0, border: "1.5px solid rgba(200,170,130,0.45)", background: "#fff", cursor: "pointer", color: "rgba(42,28,19,0.55)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(42,28,19,0.05)" }}>✕ Skip</button>
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
const orangeBtnDisabled: React.CSSProperties = { ...orangeBtn, background: "rgba(250,88,12,0.32)", boxShadow: "none", cursor: "not-allowed" };

/* ═══════════════════════════════════════════════════════
   STEP 1 — IDENTITY
═══════════════════════════════════════════════════════ */
function Step1({ form, set, next }: { form: FormData; set: (k: keyof FormData, v: string) => void; next: () => void }) {
  const [errs, setErrs] = useState<Partial<Record<keyof FormData, string>>>({});

  function validate() {
    const e: typeof errs = {};
    if (!form.fullName.trim())            e.fullName   = "Full name is required";
    if (!/^\d{10}$/.test(form.mobile))    e.mobile     = "Valid 10-digit number required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email      = "Valid email required";
    if (!form.gender)                     e.gender     = "Please select gender";
    if (!form.occupation.trim())          e.occupation = "Occupation is required";
    setErrs(e); return Object.keys(e).length === 0;
  }

  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>🙏</StepIcon>
      <StepTitle title="Who Are You, Seeker?" sub="Your identity helps Guruji connect with your cosmic energy" />
      <div className="flex flex-col gap-4">
        <FieldBox hint="To personalize your cosmic journey" error={errs.fullName}>
          <span style={{ color: KO }}><Ico.User /></span>
          <input style={iBase} placeholder="Full Name *" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
        </FieldBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 kundli-grid-2">
          <FieldBox hint="To route your Kundli PDF securely" error={errs.mobile}>
            <span style={{ color: KO }}><Ico.Phone /></span>
            <input style={iBase} placeholder="Mobile Number *" inputMode="numeric" maxLength={10} value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))} />
          </FieldBox>
          <FieldBox hint="For backup access to your spiritual report" error={errs.email}>
            <span style={{ color: KO }}><Ico.Mail /></span>
            <input style={iBase} type="email" placeholder="Email Address *" value={form.email} onChange={e => set("email", e.target.value)} />
          </FieldBox>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 kundli-grid-2">
          <FieldBox hint="Astrological calculations vary by gender paths" error={errs.gender}>
            <span style={{ color: KO }}><Ico.Gender /></span>
            <select style={{ ...iBase, cursor: "pointer" }} value={form.gender} onChange={e => set("gender", e.target.value)}>
              <option value="">Gender *</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FieldBox>
          <FieldBox hint="Helps Guruji understand your career houses" error={errs.occupation}>
            <span style={{ color: KO }}><Ico.Brief /></span>
            <input style={iBase} placeholder="Occupation *" value={form.occupation} onChange={e => set("occupation", e.target.value)} />
          </FieldBox>
        </div>
      </div>
      <button onClick={() => validate() && next()} style={{ ...orangeBtn, width: "100%", marginTop: 26, padding: "15px", flex: "none" }}>
        Continue <span style={{ fontSize: 18 }}>→</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PLACE OF BIRTH — autocomplete via OpenStreetMap Nominatim
═══════════════════════════════════════════════════════ */
function PlaceAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  /* close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (skipNextFetch.current) { skipNextFetch.current = false; return; }
    const q = value.trim();
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=6&q=${encodeURIComponent(q)}`,
          { signal: abortRef.current.signal, headers: { "Accept-Language": "en" } }
        );
        const data: any[] = await res.json();
        const names = Array.from(new Set(data.map(d => d.display_name as string))).slice(0, 6);
        setSuggestions(names);
        setOpen(names.length > 0);
        setHighlight(-1);
      } catch { /* aborted or network error — ignore */ }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value]);

  function pick(name: string) {
    skipNextFetch.current = true;
    onChange(name);
    setOpen(false);
    setSuggestions([]);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => (h + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => (h - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === "Enter" && highlight >= 0) { e.preventDefault(); pick(suggestions[highlight]); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <input
        style={{ ...iBase, fontSize: 13, width: "100%" }}
        placeholder=""
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        autoComplete="off"
      />
      {open && (
        <ul style={{
          position: "absolute", left: -38, right: -14, top: "calc(100% + 14px)", zIndex: 500,
          background: "#fff", borderRadius: 12, border: "1.5px solid rgba(200,170,130,0.50)",
          boxShadow: "0 12px 36px rgba(42,28,19,0.16)", maxHeight: 230, overflowY: "auto",
          padding: "6px 0", margin: 0, listStyle: "none",
        }}>
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setHighlight(i)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                padding: "9px 14px", cursor: "pointer", fontSize: 12.5, lineHeight: 1.45,
                color: "#2A1C13",
                background: highlight === i ? KOL : "transparent",
                transition: "background 0.12s",
              }}
            >
              <span style={{ color: KO, flexShrink: 0, marginTop: 1 }}><Ico.Pin /></span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 2 — BIRTH DETAILS
═══════════════════════════════════════════════════════ */
function Step2({ form, set, next, back }: { form: FormData; set: (k: keyof FormData, v: string) => void; next: () => void; back: () => void }) {
  const [err, setErr] = useState("");
  const dobRef = useRef<HTMLInputElement>(null);
  const tobRef = useRef<HTMLInputElement>(null);

  function validate() {
    if (!form.dob || !form.pob.trim()) { setErr("Date and place of birth are required"); return false; }
    setErr(""); return true;
  }
  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>🌟</StepIcon>
      <StepTitle title="Your Celestial Origin" sub="Birth details allow Guruji to map your unique cosmic chart" />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 kundli-grid-2">
          <LabeledBox label="Date of Birth *" hint="The foundation of your natal chart" icon={<Ico.Cal />} iconRight onIconRightClick={() => { try { (dobRef.current as any)?.showPicker(); } catch { dobRef.current?.click(); } }}>
            <input ref={dobRef} type="date" style={{ ...iBase, fontSize: 13, WebkitAppearance: "none" as const }} value={form.dob} onChange={e => set("dob", e.target.value)} />
          </LabeledBox>
          <LabeledBox label="Time of Birth *" hint="Crucial for determining your Ascendant (Lagna)" icon={<Ico.Clock />} iconRight onIconRightClick={() => { try { (tobRef.current as any)?.showPicker(); } catch { tobRef.current?.click(); } }}>
            <input ref={tobRef} type="time" style={{ ...iBase, fontSize: 13, WebkitAppearance: "none" as const }} value={form.tob} onChange={e => set("tob", e.target.value)} />
          </LabeledBox>
        </div>
        <LabeledBox label="Place of Birth *" hint="Required to map the exact planetary alignments" icon={<Ico.Pin />}>
          <PlaceAutocomplete value={form.pob} onChange={v => set("pob", v)} />
        </LabeledBox>
        {err && <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center" }}>{err}</p>}
      </div>
      <div className="flex gap-3 mt-7">
        <BackBtn onClick={back} />
        <button onClick={() => validate() && next()} style={orangeBtn}>Continue <span style={{ fontSize: 18 }}>→</span></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 3 — CHOOSE PATH
═══════════════════════════════════════════════════════ */
const SERVICES = [
  { id: "horoscope",   icon: "✨", title: "General Horoscope", desc: "In-depth life path reading based on planetary alignments" },
  { id: "ashta_rekha", icon: "🖐️", title: "Ashta Rekha",       desc: "Palm reading combining celestial & physical life lines" },
] as const;

function Step3({ form, set, next, back }: { form: FormData; set: (k: keyof FormData, v: string) => void; next: () => void; back: () => void }) {
  const ready = !!form.service && form.guidance.trim().length >= 5;
  const [err, setErr] = useState("");

  function go() {
    if (!form.service) { setErr("Please select a service type"); return; }
    if (form.guidance.trim().length < 5) { setErr("Please describe your query in at least 5 characters"); return; }
    setErr(""); next();
  }

  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>🕉️</StepIcon>
      <StepTitle title="Choose Your Path" sub="Select your heavenly reading and specify your sacred query" />
      <div className="grid grid-cols-2 gap-3 mb-4 kundli-card-grid">
        {SERVICES.map(s => {
          const sel = form.service === s.id;
          return (
            <button key={s.id} onClick={() => set("service", s.id)} style={{ padding: "22px 14px 18px", borderRadius: 16, textAlign: "center", cursor: "pointer", border: `2px solid ${sel ? KO : "rgba(200,170,130,0.38)"}`, background: sel ? KOL : "#FFFAF5", position: "relative", transition: "all 0.2s", boxShadow: sel ? `0 4px 18px rgba(250,88,12,0.18)` : "0 2px 8px rgba(42,28,19,0.06)" }}>
              {sel && <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: KO, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.Check /></div>}
              {/* Icon box — warm peach, rounded square */}
              <div style={{ width: 58, height: 58, borderRadius: 16, margin: "0 auto 13px", background: sel ? "linear-gradient(135deg,#FFE0B8,#FFCF96)" : "linear-gradient(135deg,#FFF0E0,#FFE5D0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: sel ? `0 3px 12px rgba(250,88,12,0.20)` : "0 2px 6px rgba(42,28,19,0.08)" }}>{s.icon}</div>
              {/* Title — always Cinzel orange */}
              <p style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 14, fontWeight: 700, marginBottom: 7, color: KO, lineHeight: 1.25 }}>{s.title}</p>
              <p style={{ fontSize: 11.5, color: "rgba(42,28,19,0.44)", lineHeight: 1.55, textAlign: "center" }}>{s.desc}</p>
            </button>
          );
        })}
      </div>
      {/* Textarea — with orange hint text matching other fields */}
      <div style={{ border: "1.5px solid rgba(200,170,130,0.45)", borderRadius: 12, padding: "12px 14px", background: "#fff", boxShadow: "0 1px 6px rgba(42,28,19,0.05)" }}>
        <div className="flex gap-3">
          <span style={{ color: KO, marginTop: 2, fontSize: 15, flexShrink: 0 }}>🧎</span>
          <textarea style={{ ...iBase, resize: "vertical", minHeight: 96, lineHeight: 1.7 }} placeholder="What guidance are you seeking? *" value={form.guidance} onChange={e => set("guidance", e.target.value)} />
        </div>
      </div>
      <p style={{ fontSize: 11.52, fontFamily: "var(--font-nunito), Nunito, sans-serif", color: "rgba(217,119,6,0.70)", marginTop: 6, paddingLeft: 14 }}>Focus your intention so Guruji can seek specific divine guidance</p>
      {err && <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center", marginTop: 10 }}>{err}</p>}
      <p style={{ textAlign: "center", color: "rgba(200,170,130,0.55)", fontSize: 18, letterSpacing: "10px", margin: "13px 0 6px" }}>+ + +</p>
      <div className="flex gap-3">
        <BackBtn onClick={back} />
        <button onClick={go} style={ready ? { ...orangeBtn, letterSpacing: "0.06em", fontSize: 13.5 } : { ...orangeBtnDisabled, letterSpacing: "0.06em", fontSize: 13.5 }}>
          <span style={{ fontSize: 15 }}>⚙️</span> GENERATE 1ST STAGE REPORT
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 4 — ENHANCE YOUR READING (Palm Upload)
═══════════════════════════════════════════════════════ */
function Step4({ back, next, skip, loading, submitErr, onImage }: { back: () => void; next: () => void; skip: () => void; loading?: boolean; submitErr?: string; onImage: (b64: string | null) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ padding: "28px 22px 28px" }}>
      <StepIcon>✦</StepIcon>
      <StepTitle title="Enhance Your Reading" sub="Upload your palm photo for an advanced Ashta Rekha analysis (Optional)" />
      <p style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: KO, marginBottom: 12 }}>🖐️ Upload Palm Image</p>
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
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "#2A1C13", marginBottom: 4 }}>Tap to upload your palm photo</p>
            <p style={{ fontSize: 11.5, color: "rgba(42,28,19,0.40)" }}>Clear image of dominant hand · JPG, PNG, WEBP</p>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFile} />
      {submitErr && <p style={{ fontSize: 12.5, color: "#ef4444", textAlign: "center", marginBottom: 10, padding: "9px 14px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>{submitErr}</p>}
      <div className="flex gap-3">
        <BackBtn onClick={back} />
        <SkipBtn onClick={skip} />
        <button onClick={next} disabled={loading} style={{ ...orangeBtn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Submitting…" : <><span>Upload &amp; Continue</span><span style={{ fontSize: 18 }}>→</span></>}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════════════════ */
function SuccessScreen({ caseRef, reset }: { caseRef: string; reset: () => void }) {
  return (
    <div style={{ padding: "50px 24px 46px", textAlign: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 20, lineHeight: 1, position: "relative", display: "inline-block" }}>
        <span style={{ position: "absolute", top: -8, left: -14, fontSize: 24, opacity: 0.7 }}>✦</span>
        ✦
        <span style={{ position: "absolute", top: -10, right: -14, fontSize: 20, opacity: 0.55 }}>✦</span>
      </div>
      <h2 className="font-heading" style={{ fontSize: 31, fontWeight: 700, color: KO, marginBottom: 14, lineHeight: 1.2 }}>Connection Established!</h2>
      <p style={{ fontSize: 14, color: "rgba(42,28,19,0.58)", lineHeight: 1.78, maxWidth: 370, margin: "0 auto 30px", fontStyle: "italic" }}>
        Your cosmic details have been received. Guruji will personally prepare your sacred reading with divine care and wisdom.
      </p>
      <div style={{ display: "inline-block", border: "1.5px solid rgba(200,170,130,0.50)", borderRadius: 14, padding: "16px 36px", background: "#FFFBF6", marginBottom: 32, boxShadow: "0 4px 20px rgba(250,88,12,0.10)" }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(42,28,19,0.42)", marginBottom: 8 }}>Your Case Reference</p>
        <p className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: KO, letterSpacing: "0.06em" }}>{caseRef}</p>
      </div>
      <div>
        <button onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 50, border: `2px solid ${KO}`, background: "#fff", color: KO, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          ✚ Submit Another Request
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function KundliPage() {
  const formRef  = useRef<HTMLDivElement>(null);
  const [phase,   setPhase]   = useState<Phase>(1);
  const [form,    setForm]    = useState<FormData>(BLANK);
  const [caseRef, setCaseRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [palmImage, setPalmImage] = useState<string | null>(null);

  function set(k: keyof FormData, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function submit() {
    setLoading(true);
    setSubmitErr("");
    try {
      const result = await postTrikalaReading({
        fullName:     form.fullName,
        mobile:       form.mobile,
        email:        form.email,
        gender:       form.gender,
        occupation:   form.occupation,
        dob:          form.dob,
        tob:          form.tob || undefined,
        pob:          form.pob,
        serviceType:  form.service,
        guidanceQuery: form.guidance,
        palmImage:    palmImage || undefined,
      });
      setCaseRef(result.caseReference);
      setPhase("done");
    } catch (err: any) {
      console.error("Submit error:", err);
      const fieldErrors = Array.isArray(err?.errors)
        ? err.errors.map((e: any) => e.message).join(". ")
        : null;
      const msg = fieldErrors || err?.message || "Submission failed. Please try again.";
      setSubmitErr(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() { setForm(BLANK); setCaseRef(""); setPhase(1); setSubmitErr(""); setPalmImage(null); }

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
              @media (max-width: 420px) {
                .kundli-grid-2    { grid-template-columns: 1fr !important; }
                .kundli-card-grid { grid-template-columns: 1fr !important; }
              }
              input[type="date"]::-webkit-calendar-picker-indicator,
              input[type="time"]::-webkit-calendar-picker-indicator { display: none; }
              input[type="date"], input[type="time"] { cursor: pointer; }
            `}</style>

            <div className="mx-auto px-4 py-10 pb-16" style={{ maxWidth: 760 }}>

              {/* Main card — trust badges are OUTSIDE this card */}
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(249,115,22,0.22)", boxShadow: "0 8px 40px rgba(249,115,22,0.14), 0 3px 14px rgba(249,115,22,0.08)", overflow: "visible", marginBottom: 0 }}>
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
                    {phase === 4      && <Step4 back={() => setPhase(3)} next={submit} skip={submit} loading={loading} submitErr={submitErr} onImage={setPalmImage} />}
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
