"use client";

import Image from "next/image";
import { Link } from "@/components/ui/locale-link";
import { History, Eye, Sunrise, Sparkles, ShieldCheck, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { AntaryamiSection } from "@/components/sections/AntaryamiSection";
import { ScripturalRoots } from "@/components/sections/ScripturalRoots";
import { trikalaJnana } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";

const times: { icon: typeof History; key: UiKey; lineKey: UiKey; sanskrit: string }[] = [
  { icon: History, key: "trikala.past", lineKey: "trikala.past.line", sanskrit: "Bhūta" },
  { icon: Eye, key: "trikala.present", lineKey: "trikala.present.line", sanskrit: "Vartamāna" },
  { icon: Sunrise, key: "trikala.future", lineKey: "trikala.future.line", sanskrit: "Bhaviṣya" },
];

const blessings: UiKey[] = [
  "trikalapage.receive.b1",
  "trikalapage.receive.b2",
  "trikalapage.receive.b3",
  "trikalapage.receive.b4",
];

export default function TrikalaJnanaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="section-ivory bg-mandala-soft relative overflow-hidden px-4 pb-20 pt-36 text-center md:px-8">
          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="eyebrow eyebrow-center">{t("trikalapage.hero.eyebrow")}</span>
            <h1 className="font-heading mt-5 text-5xl font-medium leading-none sm:text-6xl lg:text-7xl">
              <span className="text-gradient-gold">{trikalaJnana.name}</span>
            </h1>
            <p className="mt-4 font-heading text-xl italic text-deep-brown/70">
              {trikalaJnana.sanskrit} · {trikalaJnana.formal}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-antique-gold">
              {t("trikala.subtitle")}
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-deep-brown/80">
              {t("trikala.intro")}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/meet-guruji">{t("cta.book")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sanjeevini-kriya">{t("trikalapage.hero.cta2")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* The Three Times */}
        <section className="section-pearl px-4 py-20 sm:py-28 md:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow={t("trikalapage.times.eyebrow")}
              title={t("trikalapage.times.title")}
              subtitle={t("trikalapage.times.subtitle")}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {times.map((time, i) => {
                const Icon = time.icon;
                return (
                  <Reveal key={time.key} delay={i * 0.1} className="h-full">
                    <div className="card-elegant flex h-full flex-col items-center p-8 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-champagne/25 to-antique-gold/15 text-antique-gold ring-1 ring-champagne/40">
                        <Icon className="h-8 w-8" strokeWidth={1.5} />
                      </span>
                      <h3 className="font-heading mt-6 text-2xl font-medium text-deep-brown">
                        {t(time.key)}
                      </h3>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-antique-gold">
                        {time.sanskrit}
                      </p>
                      <p className="mt-4 text-[15px] leading-relaxed text-deep-brown/70">{t(time.lineKey)}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* How Guruji sees */}
        <section className="section-ivory bg-chakra-texture relative overflow-hidden px-4 py-20 sm:py-28 md:px-8">
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <div className="relative mx-auto w-full max-w-sm">
                <div className="golden-aura animate-mandala-glow absolute -inset-6" />
                <div className="arch-frame relative aspect-[3/4] bg-lotus">
                  <Image
                    src="/images/guruji-portrait.png"
                    alt="Pujya Sri Gurumurthy Guruji offering divine darshan"
                    fill
                    sizes="(max-width: 1024px) 80vw, 400px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="order-1 lg:order-2">
              <span className="eyebrow">{t("trikalapage.sight.eyebrow")}</span>
              <h2 className="font-heading mt-4 text-3xl font-medium leading-tight text-deep-brown sm:text-4xl">
                {t("trikalapage.sight.title")}
              </h2>
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-deep-brown/80">
                <p>{t("trikalapage.sight.p1")}</p>
                <p>{t("trikalapage.sight.p2")}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The antaryami phenomenon — the unspoken known */}
        <AntaryamiSection variant="full" />

        {/* Not astrology — clarifier */}
        <section className="section-cream px-4 py-20 sm:py-24 md:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="card-elegant relative overflow-hidden p-8 text-center sm:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-champagne/20 text-antique-gold">
                  <ShieldCheck className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h2 className="font-heading mt-5 text-2xl font-medium text-deep-brown sm:text-3xl">
                  {t("trikalapage.clarifier.title")}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[16px] italic leading-relaxed text-deep-brown/75">
                  {t("trikala.clarifier")}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Scriptural roots — BG 7.26 + YS III.16 (research-verified) */}
        <ScripturalRoots />

        {/* What you receive */}
        <section className="section-pearl bg-mandala-soft relative overflow-hidden px-4 py-20 sm:py-28 md:px-8">
          <div className="relative z-10 mx-auto max-w-3xl">
            <SectionHeading
              eyebrow={t("trikalapage.receive.eyebrow")}
              title={t("trikalapage.receive.title")}
              subtitle={t("trikalapage.receive.subtitle")}
            />
            <ul className="mx-auto mt-12 max-w-xl space-y-4">
              {blessings.map((b, i) => (
                <Reveal as="li" key={b} delay={i * 0.06}>
                  <div className="flex items-start gap-4 rounded-2xl border border-champagne/30 bg-white/70 p-5 backdrop-blur-sm">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-antique-gold text-pearl">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <p className="text-[16px] leading-relaxed text-deep-brown/85">{t(b)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="sacred-burgundy-bg relative overflow-hidden bg-maroon-gradient px-4 py-24 text-center text-pearl md:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-chakras.png')] bg-[size:130px] bg-repeat opacity-[0.05]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">
              <Sparkles className="h-3.5 w-3.5" /> {t("final.badge")}
            </span>
            <h2 className="font-heading mb-6 text-3xl font-medium text-champagne text-gold-glow sm:text-4xl lg:text-5xl">
              {t("trikalapage.cta.title")}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-pearl/85">
              {t("trikalapage.cta.body")}
            </p>
            <Button size="lg" className="h-auto px-8 py-4 text-lg" asChild>
              <Link href="/meet-guruji">{t("cta.book")}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
