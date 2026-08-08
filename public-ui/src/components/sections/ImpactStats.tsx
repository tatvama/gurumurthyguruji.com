"use client";

import { useEffect, useRef, useState } from "react";
import { sevaStats, ashrams } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { HeartHandshake, Users, Utensils, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats: { value: string; labelKey: UiKey; Icon: LucideIcon }[] = [
  { value: sevaStats[0].value, labelKey: "stats.guided",  Icon: HeartHandshake },
  { value: sevaStats[1].value, labelKey: "stats.reached", Icon: Users },
  { value: sevaStats[2].value, labelKey: "stats.fed",     Icon: Utensils },
  { value: `${ashrams.length}`, labelKey: "stats.ashrams", Icon: MapPin },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function CountUp({ value, run }: { value: string; run: boolean }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!run) return;
    const match = value.match(/[\d,]+/);
    if (!match || prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const target = parseInt(match[0].replace(/,/g, ""), 10);
    if (!Number.isFinite(target) || target === 0) {
      setDisplay(value);
      return;
    }
    const prefix = value.slice(0, match.index ?? 0);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    const duration = 1800;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current.toLocaleString("en-IN")}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);

  return <span>{display}</span>;
}

export function ImpactStats() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-gold-band py-10 sm:py-14">
      <div className="gold-band-border top" />
      <div className="gold-band-border bottom" />
      <div
        ref={ref}
        className="relative z-10 mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 lg:grid-cols-4 lg:gap-5"
      >
        {stats.map((stat) => (
          <div
            key={stat.labelKey}
            className="card-stat corner-ornate flex flex-col items-center justify-center gap-3 px-4 py-9 text-center sm:py-11"
          >
            {/* Icon ring */}
            <div className="stat-icon-ring">
              <stat.Icon className="h-5 w-5" strokeWidth={1.6} />
            </div>

            {/* Count */}
            <span className="stat-display text-[2.5rem] sm:text-[3.1rem]">
              <CountUp value={stat.value} run={run} />
            </span>

            {/* Label */}
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-deep-brown/70 sm:text-[11px]">
              {t(stat.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
