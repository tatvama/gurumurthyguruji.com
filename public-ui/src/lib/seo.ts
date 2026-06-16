import type { Metadata } from "next";
import type { Lang, Bilingual } from "./locales";

// Per-page SEO copy (EN + KN) + a builder that emits localized title/description
// and reciprocal hreflang alternates so both language URLs are linked for Google.

const BRAND: Bilingual = {
  en: "Pujya Sri Gurumurthy Guruji",
  kn: "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ",
};

type PageMeta = { title: Bilingual; description: Bilingual };

export const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: {
      en: "Spiritual Master & Kriya Yoga Guide",
      kn: "ಆಧ್ಯಾತ್ಮಿಕ ಗುರು ಮತ್ತು ಕ್ರಿಯಾ ಯೋಗ ಮಾರ್ಗದರ್ಶಿ",
    },
    description: {
      en: "Trikāla Jñāna (divine sight of past, present & future), Sanjeevini Kriya & free spiritual guidance from Pujya Sri Gurumurthy Guruji — blessed by Shri Thrayambak Babaji & Shirdi Sai Baba, Karnataka.",
      kn: "ತ್ರಿಕಾಲ ಜ್ಞಾನ, ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ಮತ್ತು ಉಚಿತ ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ — ಶ್ರೀ ತ್ರ್ಯಂಬಕ ಬಾಬಾಜಿ ಮತ್ತು ಶಿರಡಿ ಸಾಯಿಬಾಬಾ ಅವರ ಆಶೀರ್ವಾದ ಪಡೆದ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ, ಕರ್ನಾಟಕ.",
    },
  },
  "/about": {
    title: {
      en: "About Guruji — Life, Gifts & Mission",
      kn: "ಗುರೂಜಿ ಪರಿಚಯ — ಜೀವನ, ವರ ಮತ್ತು ಧ್ಯೇಯ",
    },
    description: {
      en: "The life, divine gifts and mission of Pujya Sri Gurumurthy Guruji — Sanjeevini Kriya, Trikāla Jñāna, antaryami guidance, and selfless seva across Karnataka.",
      kn: "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ಜೀವನ, ದಿವ್ಯ ವರಗಳು ಮತ್ತು ಧ್ಯೇಯ — ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ, ತ್ರಿಕಾಲ ಜ್ಞಾನ, ಅಂತರ್ಯಾಮಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ನಿಸ್ವಾರ್ಥ ಸೇವೆ.",
    },
  },
  "/trikala-jnana": {
    title: {
      en: "Trikāla Jñāna — Divine Sight of Past, Present & Future",
      kn: "ತ್ರಿಕಾಲ ಜ್ಞಾನ — ಭೂತ, ವರ್ತಮಾನ, ಭವಿಷ್ಯದ ದಿವ್ಯ ದೃಷ್ಟಿ",
    },
    description: {
      en: "Trikāla Jñāna (Trikāla-Mukha Vidyā): Guruji's realised perception of a soul's past, present & future — rooted in the Bhagavad Gītā and Yoga Sūtras, not astrology. Free appointment.",
      kn: "ತ್ರಿಕಾಲ ಜ್ಞಾನ: ಆತ್ಮದ ಭೂತ, ವರ್ತಮಾನ ಮತ್ತು ಭವಿಷ್ಯವನ್ನು ಕಾಣುವ ಗುರೂಜಿಯ ದಿವ್ಯ ದೃಷ್ಟಿ — ಭಗವದ್ಗೀತೆ ಮತ್ತು ಯೋಗಸೂತ್ರಗಳಲ್ಲಿ ಬೇರೂರಿದೆ, ಜ್ಯೋತಿಷ್ಯವಲ್ಲ. ಉಚಿತ ದರ್ಶನ.",
    },
  },
  "/sanjeevini-kriya": {
    title: {
      en: "Sanjeevini Kriya — Sacred Path of Inner Awakening",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ — ಆಂತರಿಕ ಜಾಗೃತಿಯ ಪವಿತ್ರ ಪಥ",
    },
    description: {
      en: "Learn Sanjeevini Kriya — the ancient Kriya Yoga science of breath, silence and Guru's grace taught by Pujya Sri Gurumurthy Guruji. Request free initiation.",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ — ಶ್ವಾಸ, ಮೌನ ಮತ್ತು ಗುರು ಕೃಪೆಯ ಪ್ರಾಚೀನ ಕ್ರಿಯಾ ಯೋಗ ವಿದ್ಯೆ. ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರಿಂದ ಉಚಿತ ದೀಕ್ಷೆ ಕೋರಿ.",
    },
  },
  "/guru-parampara": {
    title: {
      en: "Guru Parampara — The Sacred Kriya Lineage",
      kn: "ಗುರು ಪರಂಪರೆ — ಪವಿತ್ರ ಕ್ರಿಯಾ ವಂಶಾವಳಿ",
    },
    description: {
      en: "The unbroken Kriya Yoga lineage — from Adi Guru Shiva and Mahavatar Babaji to Pujya Sri Gurumurthy Guruji.",
      kn: "ಆದಿ ಗುರು ಶಿವ ಮತ್ತು ಮಹಾವತಾರ ಬಾಬಾಜಿಯಿಂದ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರೆಗಿನ ಅಖಂಡ ಕ್ರಿಯಾ ಯೋಗ ಪರಂಪರೆ.",
    },
  },
  "/ashrams": {
    title: {
      en: "Ashrams & Mandirs Across Karnataka",
      kn: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಆಶ್ರಮಗಳು ಮತ್ತು ಮಂದಿರಗಳು",
    },
    description: {
      en: "Visit the Sai Baba mandirs and ashrams established by Pujya Sri Gurumurthy Guruji across Karnataka — centres of darshan, satsang and seva.",
      kn: "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ಸ್ಥಾಪಿಸಿದ ಸಾಯಿಬಾಬಾ ಮಂದಿರಗಳು ಮತ್ತು ಆಶ್ರಮಗಳು — ದರ್ಶನ, ಸತ್ಸಂಗ ಮತ್ತು ಸೇವೆಯ ಕೇಂದ್ರಗಳು.",
    },
  },
  "/seva": {
    title: {
      en: "Seva & Annadana — Feeding 1,000+ Daily",
      kn: "ಸೇವೆ ಮತ್ತು ಅನ್ನದಾನ — ನಿತ್ಯ 1,000+ ಜನರಿಗೆ ಊಟ",
    },
    description: {
      en: "Through the Sadhguru Sai Samsthana Trust, over 1,000 people are fed every day. Support compassionate seva and annadana.",
      kn: "ಸದ್ಗುರು ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್ ಮೂಲಕ ಪ್ರತಿದಿನ 1,000ಕ್ಕೂ ಹೆಚ್ಚು ಜನರಿಗೆ ಅನ್ನದಾನ. ಕರುಣಾಮಯ ಸೇವೆ ಮತ್ತು ಅನ್ನದಾನಕ್ಕೆ ನೆರವಾಗಿರಿ.",
    },
  },
  "/guruvani": {
    title: {
      en: "Guruvani — Teachings & Words of Wisdom",
      kn: "ಗುರುವಾಣಿ — ಬೋಧನೆಗಳು ಮತ್ತು ಜ್ಞಾನದ ನುಡಿಗಳು",
    },
    description: {
      en: "Timeless teachings, sacred quotes and spiritual wisdom from Pujya Sri Gurumurthy Guruji to illuminate your path.",
      kn: "ನಿಮ್ಮ ಪಥವನ್ನು ಬೆಳಗಿಸುವ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ಕಾಲಾತೀತ ಬೋಧನೆಗಳು ಮತ್ತು ಪವಿತ್ರ ನುಡಿಮುತ್ತುಗಳು.",
    },
  },
  "/meet-guruji": {
    title: {
      en: "Meet Guruji — Book a Free Sacred Appointment",
      kn: "ಗುರೂಜಿಯನ್ನು ಭೇಟಿಯಾಗಿ — ಉಚಿತ ದಿವ್ಯ ದರ್ಶನ ಕಾಯ್ದಿರಿಸಿ",
    },
    description: {
      en: "Request a free personal appointment with Pujya Sri Gurumurthy Guruji for Trikāla Jñāna darshan, Sanjeevini Kriya initiation, healing and spiritual guidance.",
      kn: "ತ್ರಿಕಾಲ ಜ್ಞಾನ ದರ್ಶನ, ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ದೀಕ್ಷೆ, ಗುಣಪಡಿಸುವಿಕೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರೊಂದಿಗೆ ಉಚಿತ ವೈಯಕ್ತಿಕ ದರ್ಶನ ಕೋರಿ.",
    },
  },
  "/contact": {
    title: {
      en: "Contact — Reach the Sai Samsthana Trust",
      kn: "ಸಂಪರ್ಕ — ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ",
    },
    description: {
      en: "Reach the Sadhguru Sai Samsthana Trust for general inquiries, seva, or to connect with an ashram near you.",
      kn: "ಸಾಮಾನ್ಯ ವಿಚಾರಣೆಗಳಿಗೆ, ಸೇವೆಗೆ, ಅಥವಾ ಸಮೀಪದ ಆಶ್ರಮವನ್ನು ಸಂಪರ್ಕಿಸಲು ಸದ್ಗುರು ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್ ಅನ್ನು ತಲುಪಿ.",
    },
  },
};

/** Build localized metadata + reciprocal hreflang alternates for a route. */
export function buildMetadata(path: string, locale: Lang): Metadata {
  const meta = pageMeta[path] ?? pageMeta["/"];
  const suffix = path === "/" ? "" : path;
  const enPath = `/en${suffix}`;
  const knPath = `/kn${suffix}`;
  const canonical = locale === "kn" ? knPath : enPath;
  const title = `${meta.title[locale]} | ${BRAND[locale]}`;
  const description = meta.description[locale];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: enPath,
        kn: knPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "kn" ? "kn_IN" : "en_IN",
      url: canonical,
      title,
      description,
      images: [{ url: "/images/guruji-portrait.png", alt: meta.title.en }],
    },
  };
}
