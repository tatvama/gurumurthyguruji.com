"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/locale-link";
import Image from "next/image";
import { Sparkles, Users, Flower2, Infinity as InfinityIcon, CalendarHeart, Play } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";

const trustItems: { icon: typeof Users; key: UiKey }[] = [
  { icon: Users, key: "hero.trust.guided" },
  { icon: Flower2, key: "hero.trust.blessed" },
  { icon: InfinityIcon, key: "hero.trust.free" },
];

/* ══════════════════════════════════════════════════════════════════
   TYPEWRITER HERO NAME
   Classic type-in / pause / delete-out / retype loop with a blinking
   caret — the "TxtType" style effect, adapted to React timers instead
   of a global class + DOM class toggling.
══════════════════════════════════════════════════════════════════ */
function TypewriterHeroName({ text }: { text: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const PAUSE_FULL = 2200;
    const PAUSE_EMPTY = 500;

    function tick() {
      if (isDeleting) {
        i -= 1;
      } else {
        i += 1;
      }
      setDisplay(text.slice(0, i));

      let delta = isDeleting ? 35 : 75 - Math.random() * 35;

      if (!isDeleting && i === text.length) {
        isDeleting = true;
        delta = PAUSE_FULL;
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        delta = PAUSE_EMPTY;
      }

      timeoutId = setTimeout(tick, delta);
    }

    timeoutId = setTimeout(tick, 400);
    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <span className="hero-typewrite" aria-label={text}>
      {display}
    </span>
  );
}

export function HeroSection() {
  const { t } = useLanguage();

  // Make the "Discover" button match the "Book" button's own rendered
  // width exactly, at any screen size / font-size — measured at runtime
  // rather than guessed, since both buttons use fluid clamp() sizing.
  const bookBtnRef = useRef<HTMLAnchorElement>(null);
  const [bookBtnWidth, setBookBtnWidth] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      if (bookBtnRef.current) {
        setBookBtnWidth(bookBtnRef.current.getBoundingClientRect().width);
      }
    }
    measure();
    document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [t]);

  return (
    <section className="section-cosmic relative flex min-h-[68vh] items-center justify-center overflow-hidden pb-10 pt-20 sm:pb-12 sm:pt-24">
      {/* Soft top-down divine spotlight — adds depth above the plain gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70%] bg-[radial-gradient(ellipse_60%_100%_at_50%_-10%,rgba(216,183,106,0.16),transparent_70%)]" />

      {/* Vignette — darkens the corners so the eye settles on the content */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_55%,rgba(20,4,6,0.35)_100%)]" />

      {/* Sacred pattern texture */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/pattern-chakras.png')] bg-[size:220px] bg-repeat opacity-[0.06]" />

      {/* Gold glow — right side, behind portrait */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.16, 0.3, 0.16] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] top-1/2 z-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-champagne blur-[120px]"
      />
      {/* Secondary glow — left accent */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="pointer-events-none absolute left-0 top-1/4 z-0 h-[340px] w-[340px] rounded-full bg-maroon-accent blur-[105px]"
      />
      {/* Third accent glow — warm gold low-left, ties the palette together */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="pointer-events-none absolute -bottom-16 left-[20%] z-0 h-[290px] w-[290px] rounded-full bg-antique-gold blur-[95px]"
      />

      {/* Floating motes */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[
          { top: "18%", left: "12%", d: 8 },
          { top: "72%", left: "18%", d: 11 },
          { top: "25%", left: "88%", d: 9 },
          { top: "78%", left: "82%", d: 13 },
          { top: "50%", left: "5%",  d: 7  },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-champagne/50"
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -24, 0], opacity: [0.1, 0.55, 0.1] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
          />
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Left: text — centered while stacked (mobile/tablet, matching the
              centered portrait below it), left-aligned once the 2-column
              layout kicks in at lg. */}
          <div className="text-center lg:text-left">
            {/* Outline badge */}
            <div className="mb-5 inline-flex max-w-[90vw] flex-wrap items-center gap-x-[0.4rem] gap-y-1 rounded-full border border-champagne/40 bg-transparent px-3 py-1 text-[8px] font-bold uppercase leading-snug tracking-[0.18em] text-champagne sm:text-[9px]">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Display headline */}
            <h1 className="font-heading mb-3 leading-tight">
              <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-champagne/70 sm:text-[10px] lg:text-[11px] xl:text-[12px]">
                {t("hero.h1.line1")}
              </span>
              <span className="block whitespace-nowrap text-[clamp(0.85rem,5.5vw,1.5rem)] font-bold tracking-normal text-pearl leading-[1.15] sm:text-[1.75rem] lg:text-[2.05rem] xl:text-[2.35rem]">
                <TypewriterHeroName text={t("hero.h1.name")} />
              </span>
              {/* Ornamental flourish — centered in the full text column,
                  independent of the (left-anchored) name's own width. */}
              <span aria-hidden="true" className="mx-auto mt-2 flex w-fit items-center justify-center gap-2">
                <span className="h-px w-7 bg-gradient-to-r from-transparent to-champagne/70 sm:w-10" />
                <Sparkles className="h-3 w-3 shrink-0 text-champagne/90" />
                <span className="h-px w-7 bg-gradient-to-l from-transparent to-champagne/70 sm:w-10" />
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-gradient-gold mb-3 text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] lg:text-[11px]">
              {t("hero.tagline")}
            </p>

            {/* Body — width tuned to wrap in exactly 3 lines. */}
            <p className="mx-auto mb-4 max-w-lg text-[11px] leading-[1.65] text-pearl/80 sm:text-[13px] lg:mx-0">
              {t("hero.body")}
            </p>

            {/* Pull quote — elegant card with quote icon */}
            <blockquote className="relative mx-auto mb-6 max-w-lg rounded-xl border border-champagne/25 bg-champagne/[0.05] px-4 py-3 text-[10px] italic leading-relaxed text-pearl/75 shadow-[0_8px_24px_-16px_rgba(216,183,106,0.22)] sm:text-[12px] lg:mx-0">
                <span aria-hidden="true" className="font-heading mr-1 inline align-middle text-[1.5rem] font-bold leading-none text-champagne sm:text-[1.75rem]">
                  &ldquo;
                </span>
                {t("hero.quote")}
            </blockquote>

            {/* CTAs — always in one row (even on mobile), auto-width (hug
                their own text, never stretched edge-to-edge), centered as a
                group below lg. flex-wrap is just a safety net for very
                narrow screens. */}
            <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2 lg:max-w-lg lg:justify-start">
              {/* Wrapper span only exists to measure the Book button's
                  rendered width (Link doesn't forward refs) — it's
                  inline-block so it hugs the Link exactly, no visual effect. */}
              <span ref={bookBtnRef} className="inline-block shrink-0">
                <Link
                  href="/meet-guruji"
                  className="btn-champagne-pill w-full shrink-0 whitespace-nowrap"
                  style={{ padding: "0 clamp(0.9rem, 3vw, 1.6rem)", fontSize: "clamp(0.72rem, 3vw, 0.85rem)", height: "clamp(1.9rem, 7vw, 2.75rem)" }}
                >
                  <CalendarHeart className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {t("cta.book")}
                </Link>
              </span>
              <Link
                href="/trikala-jnana"
                className="btn-outline-pill-dark shrink-0 justify-center whitespace-nowrap"
                style={{
                  padding: "0 clamp(0.8rem, 2.7vw, 1.4rem)",
                  fontSize: "clamp(0.68rem, 2.8vw, 0.8rem)",
                  height: "clamp(1.9rem, 7vw, 2.75rem)",
                  width: bookBtnWidth ? `${bookBtnWidth}px` : undefined,
                }}
              >
                <Play className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                {t("cta.discoverTrikala")}
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-pearl/8 pt-5 lg:justify-start">
              {trustItems.map((item) => (
                <span key={item.key} className="inline-flex items-center gap-1.5 text-[9px] text-pearl/65 sm:text-[9.5px]">
                  <item.icon className="h-3 w-3 shrink-0 text-champagne/70" aria-hidden="true" />
                  {t(item.key)}
                </span>
              ))}
            </div>
          </div>

          {/* Right: portrait */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[224px] sm:max-w-[310px] lg:max-w-[336px]">
            <div className="relative h-full w-full">
              {/* Outer champagne halo */}
              <div className="absolute -inset-6 z-0 rounded-full bg-champagne/18 blur-[55px]" />

              {/* Rotating Mandala Background — larger, nudged up, slow spin.
                  The rotating element is forced to aspect-square and centered
                  by its flex parent so it always spins around its own true
                  center — no drift, no orbiting. Only this static flex
                  parent carries the positional nudge (translate); the
                  motion.div inside carries only the rotation transform. */}
              <div className="absolute -inset-16 sm:-inset-22 z-0 flex items-center justify-center -translate-x-1.5 -translate-y-8 sm:-translate-x-2.5 sm:-translate-y-11 opacity-60 pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "50% 50%" }}
                  className="relative aspect-square h-full max-w-full"
                >
                  <Image
                    src="/images/GurujiHeroBackgroundImg.png"
                    alt="Mandala Background"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>

              {/* Mandala glow */}
              <div className="golden-aura animate-mandala-glow absolute -inset-4 z-0" />

              {/* Portrait */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/images/GuruJiHeroImg1.png"
                  alt="Pujya Sri Gurumurthy Guruji"
                  fill
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 310px, 336px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>

            {/* Floating OM chip */}
            <div className="absolute -bottom-1.5 left-1.5 z-20 rounded-xl border border-champagne/22 bg-deep-brown/85 px-2.5 py-2 shadow-xl backdrop-blur-xl sm:-bottom-0 sm:left-0 sm:px-3 sm:py-2.5 lg:-left-5">
              <p className="font-heading text-lg leading-none text-champagne sm:text-xl">ॐ</p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-pearl/65 sm:text-[9px]">
                {t("hero.chip")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-pearl/8 to-transparent" />

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5 text-pearl/35">
        <span className="text-[8.5px] font-bold uppercase tracking-[0.22em]">Scroll</span>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="text-pearl/40">
          <path d="M1 1L9 9L17 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
