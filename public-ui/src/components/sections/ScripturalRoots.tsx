"use client";

import { BookOpenText } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { Reveal } from "@/components/ui/reveal";

// The Sanskrit (Devanāgarī + IAST) is language-neutral and shown as-is.
// Translations of the meaning/gloss come from the dictionary.
const verses: {
  refKey: UiKey;
  devanagari: string;
  iast: string;
  meaningKey: UiKey;
  glossKey: UiKey;
}[] = [
  {
    refKey: "scripture.bg.ref",
    devanagari: "वेदाहं समतीतानि वर्तमानानि चार्जुन। भविष्याणि च भूतानि॥",
    iast: "vedāhaṁ samatītāni vartamānāni cārjuna · bhaviṣyāṇi ca bhūtāni",
    meaningKey: "scripture.bg.meaning",
    glossKey: "scripture.bg.gloss",
  },
  {
    refKey: "scripture.ys.ref",
    devanagari: "परिणामत्रयसंयमादतीतानागतज्ञानम्॥",
    iast: "pariṇāma-traya-saṁyamād atīta-anāgata-jñānam",
    meaningKey: "scripture.ys.meaning",
    glossKey: "scripture.ys.gloss",
  },
];

export function ScripturalRoots() {
  const { t } = useLanguage();

  return (
    <section className="section-pearl relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-champagne/12 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow eyebrow-center">{t("scripture.eyebrow")}</span>
          <h2 className="font-heading mt-4 text-4xl font-medium leading-[1.08] tracking-tight text-deep-brown sm:text-5xl">
            {t("scripture.title")}
          </h2>
          <p className="mx-auto mt-5 text-[16.5px] leading-relaxed text-deep-brown/72">
            {t("scripture.intro")}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2">
          {verses.map((v, i) => (
            <Reveal key={v.refKey} delay={i * 0.1} className="flex w-full flex-col">
              <div className="card-glass flex flex-1 flex-col p-7 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-antique-gold/10 text-antique-gold ring-1 ring-antique-gold/20">
                    <BookOpenText className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-antique-gold">
                    {t(v.refKey)}
                  </span>
                </div>

                {/* Sanskrit verse — Devanāgarī */}
                <p
                  lang="sa"
                  className="font-heading text-[1.45rem] leading-[1.6] text-deep-brown"
                  style={{ fontFamily: "var(--font-cormorant), 'Noto Serif Devanagari', serif" }}
                >
                  {v.devanagari}
                </p>
                <p className="mt-2 text-[13px] italic tracking-wide text-deep-brown/55">{v.iast}</p>

                <div className="divider-gold my-5" />

                <p className="font-heading text-lg italic leading-relaxed text-deep-brown/90">
                  {t(v.meaningKey)}
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-deep-brown/60">{t(v.glossKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="quote-accent mx-auto mt-12 max-w-2xl text-center text-[16px] italic leading-relaxed text-deep-brown/80">
            {t("scripture.close")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
