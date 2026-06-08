"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five-star row — all gold for now (all devotees are 5-star by default). */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          fill="currentColor"
          className={cn("h-3.5 w-3.5", i < count ? "star-gold" : "star-dim")}
          aria-hidden
        >
          <path d="M8 1.25l1.84 3.73 4.11.6-2.97 2.89.7 4.09L8 10.5l-3.68 1.93.7-4.09L2.05 5.58l4.11-.6L8 1.25z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCarousel() {
  const { tr } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const showNavigation = testimonials.length > 3;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-scroll — pauses on hover / touch
  useEffect(() => {
    if (!emblaApi) return;
    let interval: ReturnType<typeof setInterval>;
    let paused = false;

    const start = () => {
      if (paused) return;
      interval = setInterval(() => { if (!paused) emblaApi.scrollNext(); }, 4800);
    };
    const stop = () => clearInterval(interval);
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

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-[80vw] max-w-[80vw] px-12 md:px-16"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-0 flex-[0_0_100%] px-3 md:flex-[0_0_80%] lg:flex-[0_0_33%]"
            >
              <div className="corner-ornate relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-champagne/32 bg-white px-8 py-10 text-center md:px-12">
                {/* Subtle background patterns */}
                <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-[size:90px] bg-repeat opacity-[0.04]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-champagne/[0.05] via-transparent to-saffron-accent/[0.03]" />

                {/* Large faint OM */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[10rem] leading-none text-antique-gold opacity-[0.028]"
                >
                  ॐ
                </div>

                {/* Stars */}
                <div className="relative z-10 mb-5">
                  <Stars />
                </div>

                {/* Quote glyph */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="relative z-10 mb-4 h-8 w-8 text-saffron-accent/25"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>

                {/* Quote text */}
                <p className="font-heading relative z-10 mb-7 px-2 text-xl italic leading-relaxed text-deep-brown md:px-6 md:text-2xl">
                  &ldquo;{tr(testimonial.quote)}&rdquo;
                </p>

                {/* Author */}
                <div className="relative z-10">
                  <div className="mb-1 h-px w-12 mx-auto bg-gradient-to-r from-transparent via-champagne/55 to-transparent" />
                  <p className="font-heading text-base font-bold tracking-wide text-deep-brown">
                    {testimonial.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-saffron-accent">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next */}
      {showNavigation &&
  (["prev", "next"] as const).map((dir) => (
    <button
      key={dir}
      onClick={dir === "prev" ? scrollPrev : scrollNext}
      aria-label={dir === "prev" ? "Previous testimonial" : "Next testimonial"}
      className={cn(
        "absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-champagne/40 bg-white text-deep-brown shadow-md transition-all hover:border-transparent hover:bg-saffron-accent hover:text-white",
        dir === "prev" ? "left-0" : "right-0",
      )}
    >
      {dir === "prev" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  ))}

      {/* Dot indicators */}
      {showNavigation && (
  <div className="relative z-20 mt-7 flex items-center justify-center gap-2">
    {testimonials.map((_, i) => (
      <button
        key={i}
        onClick={() => emblaApi?.scrollTo(i)}
        aria-label={`Go to slide ${i + 1}`}
        className={cn(
          "h-2 cursor-pointer rounded-full transition-all duration-300",
          selectedIndex === i
            ? "w-6 bg-saffron-accent"
            : "w-2 bg-champagne/30 hover:bg-champagne/60",
        )}
      />
    ))}
  </div>
)}
    </div>
  );
}
