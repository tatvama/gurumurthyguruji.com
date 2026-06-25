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
  "/journey-of-awakening": {
    title: {
      en: "About Guruji — Life, Gifts & Mission",
      kn: "ಗುರೂಜಿ ಪರಿಚಯ — ಜೀವನ, ವರ ಮತ್ತು ಧ್ಯೇಯ",
    },
    description: {
      en: "The life, divine gifts and mission of Pujya Sri Gurumurthy Guruji — Sanjeevini Kriya, Trikāla Jñāna, antaryami guidance, and selfless seva across Karnataka.",
      kn: "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ಜೀವನ, ದಿವ್ಯ ವರಗಳು ಮತ್ತು ಧ್ಯೇಯ — ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ, ತ್ರಿಕಾಲ ಜ್ಞಾನ, ಅಂತರ್ಯಾಮಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ನಿಸ್ವಾರ್ಥ ಸೇವೆ.",
    },
  },
  "/the-turning-point": {
    title: {
      en: "The Turning Point — Direct Initiation from Mahavatar Babaji",
      kn: "ತಿರುವಿನ ಕ್ಷಣ — ಮಹಾವತಾರ ಬಾಬಾಜಿಯಿಂದ ನೇರ ದೀಕ್ಷೆ",
    },
    description: {
      en: "At 18 years of age, Pujya Sri Gurumurthy Guruji received a direct, divine initiation into Kriya Yoga from Mahavatar Babaji — a living transmission that transformed his life and mission.",
      kn: "18 ವರ್ಷ ವಯಸ್ಸಿನಲ್ಲಿ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ಮಹಾವತಾರ ಬಾಬಾಜಿಯಿಂದ ಕ್ರಿಯಾ ಯೋಗದಲ್ಲಿ ನೇರ ದಿವ್ಯ ದೀಕ್ಷೆ ಪಡೆದರು — ಅವರ ಜೀವನ ಮತ್ತು ಧ್ಯೇಯವನ್ನು ಬದಲಿಸಿದ ಜೀವಂತ ಪ್ರಸಾರ.",
    },
  },
  "/mahavatar-babaji-grace": {
    title: {
      en: "Mahavatar Babaji's Grace — The Call of the Himalayas",
      kn: "ಮಹಾವತಾರ ಬಾಬಾಜಿಯ ಕೃಪೆ — ಹಿಮಾಲಯದ ಕರೆ",
    },
    description: {
      en: "The 1996 divine vision of Mahavatar Babaji at Basavana Betta, Kanakapura — Guruji receives Jnana Deeksha and the call to carry the flame of Kriya Yoga to the world.",
      kn: "1996ರಲ್ಲಿ ಕನಕಪುರದ ಬಸವನ ಬೆಟ್ಟದಲ್ಲಿ ಮಹಾವತಾರ ಬಾಬಾಜಿಯ ದಿವ್ಯ ದರ್ಶನ — ಗುರೂಜಿ ಜ್ಞಾನ ದೀಕ್ಷೆ ಪಡೆದು ಕ್ರಿಯಾ ಯೋಗವನ್ನು ಜಗತ್ತಿಗೆ ತಲುಪಿಸುವ ಕರೆ ಸ್ವೀಕರಿಸುತ್ತಾರೆ.",
    },
  },
  "/the-divine-birth": {
    title: {
      en: "The Divine Birth & Spiritual Journey of Pujya Sri Gurumurthy Guruji",
      kn: "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ದಿವ್ಯ ಜನನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಪಯಣ",
    },
    description: {
      en: "The divine birth of Pujya Sri Gurumurthy Guruji at Kottanagatta, the rare planetary yoga of February 1978, the 1994 darshan of Shirdi Sai Baba at Puttenahalli, and the call of the Himalayan Sadhguru.",
      kn: "ಕೊಟ್ಟನಗಟ್ಟದಲ್ಲಿ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ದಿವ್ಯ ಜನನ, ಫೆಬ್ರವರಿ 1978ರ ಅಪರೂಪದ ಗ್ರಹಯೋಗ, 1994ರಲ್ಲಿ ಪುಟ್ಟೇನಹಳ್ಳಿಯಲ್ಲಿ ಶಿರಡಿ ಸಾಯಿಬಾಬಾ ದರ್ಶನ ಮತ್ತು ಹಿಮಾಲಯದ ಸದ್ಗುರುವಿನ ಕರೆ.",
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
      en: "The Essence of Sanjeevini Kriya — A Divine Connection",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಸಾರ — ಒಂದು ದಿವ್ಯ ಸಂಪರ್ಕ",
    },
    description: {
      en: "The essence of Sanjeevini Kriya — a living stream of divine energy blessed by Mahavatar Babaji and shared by Pujya Sri Gurumurthy Guruji. Breath, silence and Guru's grace.",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಸಾರ — ಮಹಾವತಾರ ಬಾಬಾಜಿಯ ಆಶೀರ್ವಾದ ಪಡೆದ, ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ಹಂಚಿಕೊಂಡ ದಿವ್ಯ ಶಕ್ತಿಯ ಜೀವಂತ ಪ್ರವಾಹ. ಶ್ವಾಸ, ಮೌನ ಮತ್ತು ಗುರು ಕೃಪೆ.",
    },
  },
  "/sanjeevini-kriya/the-path": {
    title: {
      en: "Sanjeevini Kriya — The Path of Dīkṣā",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ — ದೀಕ್ಷೆಯ ಪಥ",
    },
    description: {
      en: "From breath to bliss — the journey of Dīkṣā with Pujya Sri Gurumurthy Guruji. The three sacred initiations: Prana Shuddhi, Atma Jagruti and Divya Samadhi.",
      kn: "ಶ್ವಾಸದಿಂದ ಆನಂದದೆಡೆಗೆ — ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರೊಂದಿಗೆ ದೀಕ್ಷೆಯ ಪಯಣ. ಮೂರು ಪವಿತ್ರ ದೀಕ್ಷೆಗಳು: ಪ್ರಾಣ ಶುದ್ಧಿ, ಆತ್ಮ ಜಾಗೃತಿ ಮತ್ತು ದಿವ್ಯ ಸಮಾಧಿ.",
    },
  },
  "/sanjeevini-kriya/learn-practice": {
    title: {
      en: "Sanjeevini Kriya — Learn & Practice",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ — ಕಲಿಕೆ ಮತ್ತು ಅಭ್ಯಾಸ",
    },
    description: {
      en: "Begin, learn and deepen Sanjeevini Kriya — just 9 minutes a day. How to begin, ways to learn through Dīkṣā, and answers to common questions.",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾವನ್ನು ಪ್ರಾರಂಭಿಸಿ, ಕಲಿಯಿರಿ ಮತ್ತು ಆಳಗೊಳಿಸಿ — ದಿನಕ್ಕೆ ಕೇವಲ 9 ನಿಮಿಷ. ಹೇಗೆ ಪ್ರಾರಂಭಿಸುವುದು, ದೀಕ್ಷೆಯ ಮೂಲಕ ಕಲಿಯುವ ಮಾರ್ಗಗಳು ಮತ್ತು ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಗಳು.",
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
