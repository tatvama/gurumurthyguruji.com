"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Stars() {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-amber-400" aria-hidden>
          <path d="M8 1.25l1.84 3.73 4.11.6-2.97 2.89.7 4.09L8 10.5l-3.68 1.93.7-4.09L2.05 5.58l4.11-.6L8 1.25z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-saffron-accent to-antique-gold text-white font-bold text-base shadow-md select-none">
      {initials}
    </div>
  );
}

export function TestimonialCarousel() {
  const { tr } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("scroll", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("scroll", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll, pauses on hover / touch
  useEffect(() => {
    if (!emblaApi) return;
    let timer: ReturnType<typeof setInterval>;
    let paused = false;

    const tick = () => { if (!paused) emblaApi.scrollNext(); };
    const start = () => { timer = setInterval(tick, 4500); };
    const stop = () => clearInterval(timer);
    const pause = () => { paused = true; stop(); };
    const resume = () => { paused = false; start(); };

    start();
    const el = containerRef.current;
    el?.addEventListener("mouseenter", pause);
    el?.addEventListener("mouseleave", resume);
    el?.addEventListener("touchstart", pause, { passive: true });
    el?.addEventListener("touchend", resume, { passive: true });
    return () => {
      stop();
      el?.removeEventListener("mouseenter", pause);
      el?.removeEventListener("mouseleave", resume);
      el?.removeEventListener("touchstart", pause);
      el?.removeEventListener("touchend", resume);
    };
  }, [emblaApi]);

  const total = testimonials.length;
  const activeDot = selectedIndex;

  const getPosition = (index: number) => {
    const diff = ((index - selectedIndex) % total + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  return (
    /*
     * Outer wrapper: padding reserves space for prev/next buttons on every
     * breakpoint so they never overlap the slide cards.
     *
     *  mobile  : px-12 (48 px)  — button 44 px + 4 px breathing room
     *  md      : px-16 (64 px)  — slightly more gap
     *  lg      : px-20 (80 px)  — comfortable on wide screens
     */
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-6xl px-12 md:px-16 lg:px-20"
    >
      {/* ── Embla viewport ────────────────────────────────────────────── */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y items-center">

          {testimonials.map((testimonial, index) => {
            const pos = getPosition(index);
            return (
              <div
                key={testimonial.id}
                /*
                 * Slide flex-basis by breakpoint:
                 *   mobile  100 % → 1 full card, clean single-card view
                 *   sm  80 % → center card + tiny peek of neighbours
                 *   md  62 % → center + visible side peeks
                 *   lg  34 % → full 3-up layout, side cards show completely
                 *
                 * Fixed height prevents the section below from shifting when
                 * the active card changes.
                 */
                className="min-w-0 flex-[0_0_100%] px-2
                           sm:flex-[0_0_80%]
                           md:flex-[0_0_62%]
                           lg:flex-[0_0_34%]
                           h-[360px] sm:h-[380px] lg:h-[420px]
                           flex items-center"
              >
                {/* ── Card ──────────────────────────────────────────── */}
                <div
                  className={cn(
                    "relative flex h-full w-full flex-col items-center overflow-hidden rounded-[2rem] border text-center",
                    "transition-[opacity,transform,box-shadow,border-color,padding,background-color] duration-500 ease-in-out",
                    pos === "center"
                      ? "translate-y-0 scale-100 border-antique-gold/50 bg-white px-6 py-8 md:px-8 md:py-10 shadow-2xl opacity-100 z-10"
                      : pos === "left" || pos === "right"
                      ? "translate-y-4 scale-95 border-champagne/30 bg-white/70 px-5 py-7 shadow-md opacity-55 z-0"
                      : "opacity-0 scale-90 pointer-events-none border-transparent bg-white/70 px-5 py-7"
                  )}
                >
                  {/* Top accent bar — active only */}
                  {pos === "center" && (
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-[2rem] bg-gradient-to-r from-saffron-accent via-antique-gold to-saffron-accent" />
                  )}

                  {/* Background chakra pattern */}
                  <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-[size:90px] bg-repeat opacity-[0.035]" />

                  {/* Faint OM watermark */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[9rem] leading-none text-antique-gold opacity-[0.04]"
                  >
                    ॐ
                  </div>

                  {/* Decorative quote mark */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-5 top-5 font-heading text-6xl leading-none text-saffron-accent/15 select-none"
                  >
                    "
                  </div>

                  {/* Stars */}
                  <div className="relative z-10 mb-3 mt-1">
                    <Stars />
                  </div>

                  {/* Quote — consistent size across all positions prevents reflow */}
                  <p className="font-heading relative z-10 italic leading-relaxed text-deep-brown mb-6 px-2 text-sm md:text-base lg:text-[1.05rem]">
                    &ldquo;{tr(testimonial.quote)}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="relative z-10 mb-4 h-px w-16 bg-gradient-to-r from-transparent via-antique-gold/40 to-transparent" />

                  {/* Author — Avatar always rendered (invisible when not center)
                      so card height stays constant and there's no layout jump */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={pos === "center" ? "" : "invisible"}>
                      <Avatar name={testimonial.name} />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold tracking-wide text-deep-brown">
                        {testimonial.name}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-accent">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* ── Prev button — lives inside the padding zone, never over a card ── */}
      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-0 top-1/2 z-20
                   flex h-9 w-9 md:h-11 md:w-11
                   -translate-y-1/2 cursor-pointer items-center justify-center
                   rounded-full border border-champagne/40 bg-white text-deep-brown shadow-md
                   transition-all hover:bg-saffron-accent hover:text-white hover:border-transparent"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* ── Next button ──────────────────────────────────────────────── */}
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-0 top-1/2 z-20
                   flex h-9 w-9 md:h-11 md:w-11
                   -translate-y-1/2 cursor-pointer items-center justify-center
                   rounded-full border border-champagne/40 bg-white text-deep-brown shadow-md
                   transition-all hover:bg-saffron-accent hover:text-white hover:border-transparent"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* ── Dots — 1 per testimonial ─────────────────────────────────── */}
      <div className="relative z-20 mt-6 md:mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={cn(
              "h-2 cursor-pointer rounded-full transition-all duration-300",
              activeDot === i
                ? "w-7 bg-saffron-accent"
                : "w-2 bg-champagne/50 hover:bg-champagne/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
