// Primary navigation — kept to an elegant set for the header.
export const navigation = [
  { name: "Home", href: "/" },
  { name: "About Guruji", href: "/journey-of-awakening" },
  { name: "Trikāla Jñāna", href: "/trikala-jnana" },
  { name: "Sanjeevini Kriya", href: "/sanjeevini-kriya" },
  { name: "Ashrams", href: "/ashrams" },
  { name: "Guruvani", href: "/guruvani" },
  { name: "Contact", href: "/contact" },
];

// Secondary links — surfaced in the footer and within relevant pages.
export const secondaryNav = [
  { name: "Guru Parampara", href: "/guru-parampara" },
  { name: "Seva & Annadana", href: "/seva" },
  { name: "Meet Guruji", href: "/meet-guruji" },
];

export const ashrams = [
  {
    id: 1,
    name: "Sadhguru Shirdi Sai Baba Mandir",
    location: "Srirangapatna, Mandya Dist",
    status: "Active",
    description: "A serene space dedicated to Sai Baba devotion and spiritual practices.",
    description_kn: "ಸಾಯಿಬಾಬಾ ಭಕ್ತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಗಳಿಗೆ ಮೀಸಲಾದ ಪ್ರಶಾಂತ ಸ್ಥಳ.",
  },
  {
    id: 2,
    name: "Sri Sadhguru Sai Sidhashrama",
    location: "Hirisave, Hassan Dist",
    status: "Active",
    description: "A peaceful sanctuary for Sanjeevini Kriya and meditation.",
    description_kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ಮತ್ತು ಧ್ಯಾನಕ್ಕಾಗಿ ಶಾಂತ ಆಶ್ರಯ.",
  },
  {
    id: 3,
    name: "Sri Sadhguru Sai Dattashrama",
    location: "Hiriyur, Chitradurga Dist",
    status: "Active",
    description: "Dedicated to the teachings of the Guru Parampara and serving the local community.",
    description_kn: "ಗುರು ಪರಂಪರೆಯ ಬೋಧನೆಗಳಿಗೆ ಮತ್ತು ಸ್ಥಳೀಯ ಸಮುದಾಯದ ಸೇವೆಗೆ ಮೀಸಲಾಗಿದೆ.",
  },
  {
    id: 4,
    name: "Sai Sadhguru Shirdi Sai Baba Mandir",
    location: "Puttenahalli, Bangalore",
    status: "Active",
    description: "A major center for urban devotees to find peace and guidance.",
    description_kn: "ನಗರ ಭಕ್ತರು ಶಾಂತಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ಕಾಣುವ ಪ್ರಮುಖ ಕೇಂದ್ರ.",
  },
  {
    id: 5,
    name: "Sai Sadhguru Shirdi Sai Baba Mandir",
    location: "M.S.R City, J.P. Nagar 7th Phase, Bangalore",
    status: "Active",
    description: "Serving seekers with daily satsangs and spiritual teachings.",
    description_kn: "ನಿತ್ಯ ಸತ್ಸಂಗ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಬೋಧನೆಗಳಿಂದ ಸಾಧಕರ ಸೇವೆ.",
  },
  {
    id: 6,
    name: "Upcoming Ashram",
    location: "Bellary",
    status: "Planning Stage",
    description: "Future sanctuary to expand Guruji's mission and teachings.",
    description_kn: "ಗುರೂಜಿಯ ಧ್ಯೇಯ ಮತ್ತು ಬೋಧನೆಗಳನ್ನು ವಿಸ್ತರಿಸುವ ಭವಿಷ್ಯದ ಆಶ್ರಯ.",
  },
  {
    id: 7,
    name: "Upcoming Ashram",
    location: "Kolar",
    status: "Planning Stage",
    description: "Future sanctuary to expand Guruji's mission and teachings.",
    description_kn: "ಗುರೂಜಿಯ ಧ್ಯೇಯ ಮತ್ತು ಬೋಧನೆಗಳನ್ನು ವಿಸ್ತರಿಸುವ ಭವಿಷ್ಯದ ಆಶ್ರಯ.",
  },
  {
    id: 8,
    name: "Upcoming Ashram",
    location: "Mysore",
    status: "Planning Stage",
    description: "Future sanctuary to expand Guruji's mission and teachings.",
    description_kn: "ಗುರೂಜಿಯ ಧ್ಯೇಯ ಮತ್ತು ಬೋಧನೆಗಳನ್ನು ವಿಸ್ತರಿಸುವ ಭವಿಷ್ಯದ ಆಶ್ರಯ.",
  },
];

// Kannada labels for ashram status (English status is the data/style key).
export const ashramStatusKn: Record<string, string> = {
  "Active": "ಸಕ್ರಿಯ",
  "Planning Stage": "ಯೋಜನಾ ಹಂತ",
};

export const testimonials = [
  {
    id: 1,
    name: "Ramesh Kumar",
    location: "Bangalore",
    quote: {
      en: "Through Sanjeevini Kriya, I have found a profound silence within myself that I never knew existed.",
      kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಮೂಲಕ, ನನ್ನೊಳಗೆ ಎಂದೂ ಅರಿಯದ ಆಳವಾದ ಮೌನವನ್ನು ನಾನು ಕಂಡುಕೊಂಡೆ.",
    },
  },
  {
    id: 2,
    name: "Lakshmi Devi",
    location: "Mysore",
    quote: {
      en: "Guruji’s grace has transformed my family's life. His teachings on Sai Baba bring us daily peace.",
      kn: "ಗುರೂಜಿಯ ಕೃಪೆ ನನ್ನ ಕುಟುಂಬದ ಬಾಳನ್ನು ಬದಲಾಯಿಸಿದೆ. ಸಾಯಿಬಾಬಾ ಕುರಿತ ಅವರ ಬೋಧನೆಗಳು ನಮಗೆ ನಿತ್ಯ ಶಾಂತಿಯನ್ನು ತರುತ್ತವೆ.",
    },
  },
  {
    id: 3,
    name: "Anita Rao",
    location: "Hyderabad",
    quote: {
      en: "Attending the ashram and receiving Guruji's blessings has been the most beautiful turning point in my spiritual journey.",
      kn: "ಆಶ್ರಮಕ್ಕೆ ಬಂದು ಗುರೂಜಿಯ ಆಶೀರ್ವಾದ ಪಡೆದದ್ದು ನನ್ನ ಆಧ್ಯಾತ್ಮಿಕ ಪಯಣದ ಅತ್ಯಂತ ಸುಂದರ ತಿರುವು.",
    },
  },
  {
    id: 4,
    name: "Aman Singh",
    location: "odisha",
    quote: {
      en: "Attending the ashram and receiving Guruji's blessings has been the most beautiful turning point in my spiritual journey.",
      kn: "ಆಶ್ರಮಕ್ಕೆ ಬಂದು ಗುರೂಜಿಯ ಆಶೀರ್ವಾದ ಪಡೆದದ್ದು ನನ್ನ ಆಧ್ಯಾತ್ಮಿಕ ಪಯಣದ ಅತ್ಯಂತ ಸುಂದರ ತಿರುವು.",
    },
  },
];

export const teachings = [
  {
    id: 1,
    category: "Meditation",
    quote: "Silence of the mind is true worship.",
    quote_kn: "ಮನಸ್ಸಿನ ಮೌನವೇ ನಿಜವಾದ ಪೂಜೆ.",
  },
  {
    id: 2,
    category: "Inner Awakening",
    quote: "The journey within is the path to enlightenment.",
    quote_kn: "ಅಂತರಂಗದ ಪಯಣವೇ ಜ್ಞಾನೋದಯದ ಮಾರ್ಗ.",
  },
  {
    id: 3,
    category: "Guru Bhakti",
    quote: "Faith, humility, and seva open the heart to grace.",
    quote_kn: "ಶ್ರದ್ಧೆ, ವಿನಯ ಮತ್ತು ಸೇವೆ ಹೃದಯವನ್ನು ಕೃಪೆಗೆ ತೆರೆಯುತ್ತವೆ.",
  },
  {
    id: 4,
    category: "Guru Bhakti",
    quote: "Guru’s presence awakens what words cannot explain.",
    quote_kn: "ಮಾತುಗಳು ವಿವರಿಸಲಾಗದ್ದನ್ನು ಗುರುವಿನ ಸಾನ್ನಿಧ್ಯ ಜಾಗೃತಗೊಳಿಸುತ್ತದೆ.",
  },
  {
    id: 5,
    category: "Kriya",
    quote: "Divine experience requires purity of heart.",
    quote_kn: "ದಿವ್ಯ ಅನುಭವಕ್ಕೆ ಹೃದಯದ ಶುದ್ಧತೆ ಬೇಕು.",
  },
];

// Kannada labels for teaching categories (English category is the data key).
export const teachingCategoryKn: Record<string, string> = {
  "Meditation": "ಧ್ಯಾನ",
  "Inner Awakening": "ಆಂತರಿಕ ಜಾಗೃತಿ",
  "Guru Bhakti": "ಗುರು ಭಕ್ತಿ",
  "Kriya": "ಕ್ರಿಯಾ",
};

export const guruParampara = [
  { name: "Adi Guru Ishwara / Shiva", description: "The supreme source of all yogic wisdom.", description_kn: "ಸಕಲ ಯೋಗ ಜ್ಞಾನದ ಪರಮ ಮೂಲ." },
  { name: "Saptarishis", description: "The seven seers who transmitted divine knowledge.", description_kn: "ದಿವ್ಯ ಜ್ಞಾನವನ್ನು ಪ್ರಸಾರ ಮಾಡಿದ ಸಪ್ತ ಋಷಿಗಳು." },
  { name: "Sage Agastya", description: "The revered sage of the Siddha tradition.", description_kn: "ಸಿದ್ಧ ಪರಂಪರೆಯ ಪೂಜ್ಯ ಋಷಿ." },
  { name: "Siddha tradition", description: "The lineage of immortal masters.", description_kn: "ಅಮರ ಗುರುಗಳ ಪರಂಪರೆ." },
  { name: "Bogar Siddha", description: "A great Siddha who mastered alchemy and medicine.", description_kn: "ರಸವಿದ್ಯೆ ಮತ್ತು ವೈದ್ಯಶಾಸ್ತ್ರವನ್ನು ಕರಗತ ಮಾಡಿಕೊಂಡ ಮಹಾನ್ ಸಿದ್ಧ." },
  { name: "Mahavatar Babaji", description: "The deathless master who revived Kriya Yoga.", description_kn: "ಕ್ರಿಯಾ ಯೋಗವನ್ನು ಪುನರುಜ್ಜೀವನಗೊಳಿಸಿದ ಮೃತ್ಯುಂಜಯ ಗುರು." },
  { name: "Lahiri Mahasaya", description: "The householder yogi who spread Kriya Yoga to the masses.", description_kn: "ಕ್ರಿಯಾ ಯೋಗವನ್ನು ಜನಸಾಮಾನ್ಯರಿಗೆ ಹರಡಿದ ಗೃಹಸ್ಥ ಯೋಗಿ." },
  { name: "Sri Yukteswar", description: "The Jñāna Avatar, master of the sacred sciences and inner illumination.", description_kn: "ಜ್ಞಾನ ಅವತಾರ, ಪವಿತ್ರ ಶಾಸ್ತ್ರಗಳ ಮತ್ತು ಆಂತರಿಕ ಪ್ರಕಾಶದ ಗುರು." },
  { name: "Paramahansa Yogananda", description: "The Prem Avatar who brought Kriya Yoga to the West.", description_kn: "ಕ್ರಿಯಾ ಯೋಗವನ್ನು ಪಶ್ಚಿಮಕ್ಕೆ ಕೊಂಡೊಯ್ದ ಪ್ರೇಮ ಅವತಾರ." },
  { name: "Pujya Sri Gurumurthy Guruji", description: "The present living guide of Sanjeevini Kriya.", description_kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಪ್ರಸ್ತುತ ಜೀವಂತ ಮಾರ್ಗದರ್ಶಕ." },
];

export const sevaStats = [
  { label: "Devotees Guided", value: "5,000+" },
  { label: "People Reached", value: "2–3 Lakh" },
  { label: "Fed Daily", value: "1000+" },
];

// ─────────────────────────────────────────────────────────────────────────
// Site-wide configuration. NOTE: contact values are PLACEHOLDERS — replace
// the phone / WhatsApp / email / social handles with the real details.
// ─────────────────────────────────────────────────────────────────────────
export const siteConfig = {
  name: "Pujya Sri Gurumurthy Guruji",
  shortName: "Gurumurthy Guruji",
  role: "Spiritual Master & Kriya Yoga Guide",
  tagline: "Blessed by Shri Thrayambak Babaji & Shirdi Sai Baba · Guiding 5,000+ Seekers",
  url: "https://www.gurumurthyguruji.com",
  trust: "Sai Samsthana Trust",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+91 XXXXX XXXXX",
  phoneHref: process.env.NEXT_PUBLIC_PHONE_HREF || "tel:+91XXXXXXXXXX",
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+91 XXXXX XXXXX",
  whatsappHref: process.env.NEXT_PUBLIC_WHATSAPP_HREF || "https://wa.me/91XXXXXXXXXX",
  email: process.env.NEXT_PUBLIC_EMAIL || "contact@gurumurthyguruji.com",
  ashramName: process.env.NEXT_PUBLIC_ASHRAM_NAME || "Sadhguru Shirdi Sai Baba Mandir",
  ashramLocation: process.env.NEXT_PUBLIC_ASHRAM_LOCATION || "Srirangapatna, Mandya Dist, Karnataka",
  addressMain: `${process.env.NEXT_PUBLIC_ASHRAM_NAME || "Sadhguru Shirdi Sai Baba Mandir"}, ${process.env.NEXT_PUBLIC_ASHRAM_LOCATION || "Srirangapatna, Mandya Dist, Karnataka"}, India`,
  social: {
    youtube: "#",
    instagram: "#",
    facebook: "#",
  },
};

// The signature divine gift — used on the homepage and /trikala-jnana.
export const trikalaJnana = {
  name: "Trikāla Jñāna",
  sanskrit: "त्रिकाल ज्ञान",
  formal: "Trikāla-Mukha Vidyā",
  tagline: "The Divine Sight of Past, Present & Future",
  intro:
    "Guruji is blessed with the rare spiritual gift of Trikāla Jñāna — the divine perception of a soul's past, present, and future. With a single compassionate glance, Guruji perceives the karmic patterns, hidden blockages, and the destined path that lead a seeker gently toward their highest good.",
  clarifier:
    "This is not astrology, palmistry, or prediction. Trikāla Jñāna arises from inner realisation and the Guru's grace — a direct seeing of the soul, offered only to guide you toward peace and dharma, never to instil fear.",
  times: [
    {
      key: "Past",
      sanskrit: "Bhūta",
      line: "The karmic roots and bonds carried across lifetimes — gently understood, never judged.",
    },
    {
      key: "Present",
      sanskrit: "Vartamāna",
      line: "The true cause behind your present struggles, revealed with clarity and compassion.",
    },
    {
      key: "Future",
      sanskrit: "Bhaviṣya",
      line: "The path that leads to your highest good, and the sadhana that prepares you for it.",
    },
  ],
};

// Frequently asked questions.
export const faqs = [
  {
    q: "Is the appointment with Guruji really free of charge?",
    a: "Yes. Guruji offers darshan, Trikāla Jñāna and spiritual guidance entirely free of charge. Seekers come only with sincerity and devotion.",
  },
  {
    q: "What is Trikāla Jñāna?",
    a: "Trikāla Jñāna (Trikāla-Mukha Vidyā) is Guruji's divine sight — the realised perception of a soul's past, present and future, used solely to guide you toward peace and dharma.",
  },
  {
    q: "Is this astrology or fortune-telling?",
    a: "No. It is not astrology, palmistry or prediction. It is a direct inner seeing born of Kriya sadhana and the Guru's grace, offered with compassion and never to instil fear.",
  },
  {
    q: "What is Sanjeevini Kriya?",
    a: "Sanjeevini Kriya is a sacred technique of breath, silence and grace in the lineage of Mahavatar Babaji that purifies the mind and awakens the soul.",
  },
  {
    q: "Do I need any experience to meet Guruji?",
    a: "None at all. Seekers of every background and faith are welcomed with the same love.",
  },
  {
    q: "Where can I meet Guruji?",
    a: "At the ashrams and Shirdi Sai Baba mandirs established across Karnataka. Request an appointment and our team will guide you to the nearest centre.",
  },
  {
    q: "Can I receive guidance if I live far away or abroad?",
    a: "Yes. Many seekers connect from across India and the world. Mention your location when you request an appointment and we will do our best to assist.",
  },
  {
    q: "How can I support the mission?",
    a: "Through seva and by joining the daily Annadana that feeds over 1,000 people. Every act of selfless service is a prayer.",
  },
];

// ── Gallery ──────────────────────────────────────────────────────────────
// Using existing site imagery as defaults — swap `src` for original event
// photos whenever they're ready, the grid/lightbox needs no other changes.
export const galleryCategoryKn: Record<string, string> = {
  "Guruji": "ಗುರೂಜಿ",
  "Sanjeevini Kriya": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ",
  "Ashrams": "ಆಶ್ರಮಗಳು",
  "Deeksha": "ದೀಕ್ಷೆ",
};

export const galleryImages = [
  {
    id: 1,
    src: "/images/GuruJiHeroImg1.png",
    category: "Guruji",
    caption: "Pujya Sri Gurumurthy Guruji in silent meditation",
    caption_kn: "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ಮೌನ ಧ್ಯಾನದಲ್ಲಿ",
  },
  {
    id: 2,
    src: "/images/sanjivini_Hero_Img.png",
    category: "Sanjeevini Kriya",
    caption: "A seeker in silent meditation at sunrise",
    caption_kn: "ಸೂರ್ಯೋದಯದಲ್ಲಿ ಮೌನ ಧ್ಯಾನದಲ್ಲಿ ಒಬ್ಬ ಸಾಧಕ",
  },
  {
    id: 3,
    src: "/images/Sanjivini_L&P_Hero.png",
    category: "Sanjeevini Kriya",
    caption: "The sacred path of Sanjeevini Kriya",
    caption_kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಪವಿತ್ರ ಪಥ",
  },
  {
    id: 4,
    src: "/ashramImg.png",
    category: "Ashrams",
    caption: "Sadhguru Sai Samsthana Ashram at sunrise",
    caption_kn: "ಸೂರ್ಯೋದಯದಲ್ಲಿ ಸದ್ಗುರು ಸಾಯಿ ಸಂಸ್ಥಾನ ಆಶ್ರಮ",
  },
  {
    id: 5,
    src: "/images/pranaShuddhiDeeksha.webp",
    category: "Deeksha",
    caption: "Prana Shuddhi Deeksha — the seeker's first step",
    caption_kn: "ಪ್ರಾಣ ಶುದ್ಧಿ ದೀಕ್ಷೆ — ಸಾಧಕನ ಮೊದಲ ಹೆಜ್ಜೆ",
  },
  {
    id: 6,
    src: "/images/atmaJagrutiDeeksha.webp",
    category: "Deeksha",
    caption: "Atma Jagruti Deeksha — balance and depth",
    caption_kn: "ಆತ್ಮ ಜಾಗೃತಿ ದೀಕ್ಷೆ — ಸಮತೋಲನ ಮತ್ತು ಆಳ",
  },
  {
    id: 7,
    src: "/images/divyaSamadhiDeeksha.webp",
    category: "Deeksha",
    caption: "Divya Samadhi Deeksha — divine absorption",
    caption_kn: "ದಿವ್ಯ ಸಮಾಧಿ ದೀಕ್ಷೆ — ದಿವ್ಯ ಲೀನತೆ",
  },
  {
    id: 8,
    src: "/images/guruji-meditating.png",
    category: "Guruji",
    caption: "Guruji in deep meditation",
    caption_kn: "ಆಳ ಧ್ಯಾನದಲ್ಲಿ ಗುರೂಜಿ",
  },
  {
    id: 9,
    src: "/images/guru-parampara-tree.jpg",
    category: "Guruji",
    caption: "The unbroken Guru Parampara lineage",
    caption_kn: "ಅಖಂಡ ಗುರು ಪರಂಪರೆಯ ವಂಶಾವಳಿ",
  },
  {
    id: 10,
    src: "/images/sadhguru_darshan_guruji_tumbnail-scaled.webp",
    category: "Guruji",
    caption: "Seekers in darshan with Guruji",
    caption_kn: "ಗುರೂಜಿಯ ದರ್ಶನದಲ್ಲಿ ಸಾಧಕರು",
  },
  {
    id: 11,
    src: "/images/basavana-betta-mountains.webp",
    category: "Ashrams",
    caption: "Basavana Betta — the sacred hills",
    caption_kn: "ಬಸವನ ಬೆಟ್ಟ — ಪವಿತ್ರ ಗುಡ್ಡಗಳು",
  },
  {
    id: 12,
    src: "/images/arshamCartImg.png",
    category: "Ashrams",
    caption: "A quiet moment of devotion",
    caption_kn: "ಭಕ್ತಿಯ ಒಂದು ಶಾಂತ ಕ್ಷಣ",
  },
];

// ── Articles ─────────────────────────────────────────────────────────────
// Cover images reuse existing site photography as placeholders — swap
// `cover` per article whenever original photos are ready.
export const articleCategoryKn: Record<string, string> = {
  "Meditation": "ಧ್ಯಾನ",
  "Sanjeevini Kriya": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ",
  "Guru Parampara": "ಗುರು ಪರಂಪರೆ",
  "Seva": "ಸೇವೆ",
  "Deeksha": "ದೀಕ್ಷೆ",
};

export const articles = [
  {
    id: 1,
    slug: "silence-within-meditation-begins-with-stillness",
    category: "Meditation",
    cover: "/images/guruji-meditating.png",
    date: "2026-01-08",
    title: "The Silence Within: Why Meditation Begins With Stillness",
    title_kn: "ಆಂತರಿಕ ಮೌನ: ಧ್ಯಾನ ಸ್ಥಿರತೆಯಿಂದ ಏಕೆ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ",
    excerpt:
      "Before the mind can awaken, it must first learn to rest. A reflection on why stillness — not effort — is the true starting point of every meditative practice.",
    excerpt_kn:
      "ಮನಸ್ಸು ಜಾಗೃತವಾಗುವ ಮೊದಲು, ಅದು ಮೊದಲು ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು ಕಲಿಯಬೇಕು. ಪ್ರಯತ್ನವಲ್ಲ, ಸ್ಥಿರತೆಯೇ ಪ್ರತಿ ಧ್ಯಾನ ಅಭ್ಯಾಸದ ನಿಜವಾದ ಆರಂಭ ಬಿಂದು ಏಕೆ ಎಂಬುದರ ಚಿಂತನೆ.",
    content: [
      "Most seekers begin their meditation practice searching for an experience — a light, a vision, a feeling of peace that announces itself. But the mind that searches is still a mind in motion, and motion cannot see itself clearly.",
      "Guruji often reminds seekers that silence is not the absence of thought, but the space in which thought is finally seen for what it is — passing, temporary, not the Self. The first sittings of any sadhana are rarely about achieving stillness; they are about noticing how rarely the mind is still at all.",
      "This is not a discouragement — it is the doorway. Every seeker who has walked the path of Sanjeevini Kriya begins exactly here, with the honest recognition of restlessness. From that recognition, and only from it, does true stillness begin to grow.",
      "Sit for a few minutes today with no goal other than to notice. Not to fix, not to force — simply to notice. That noticing, practiced gently and daily, is the seed of everything that follows.",
    ],
  },
  {
    id: 2,
    slug: "understanding-sanjeevini-kriya-path-of-breath-and-grace",
    category: "Sanjeevini Kriya",
    cover: "/images/sanjivini_Hero_Img.png",
    date: "2026-01-15",
    title: "Understanding Sanjeevini Kriya: A Path of Breath and Grace",
    title_kn: "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು: ಶ್ವಾಸ ಮತ್ತು ಕೃಪೆಯ ಪಥ",
    excerpt:
      "Sanjeevini Kriya asks for no outer change, only inner sincerity. A gentle introduction to what this practice is, and why it can be received by seekers of any background.",
    excerpt_kn:
      "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ಯಾವುದೇ ಬಾಹ್ಯ ಬದಲಾವಣೆಯನ್ನು ಕೇಳುವುದಿಲ್ಲ, ಕೇವಲ ಆಂತರಿಕ ಪ್ರಾಮಾಣಿಕತೆಯನ್ನು ಮಾತ್ರ. ಈ ಅಭ್ಯಾಸ ಏನೆಂಬುದರ ಸೌಮ್ಯ ಪರಿಚಯ.",
    content: [
      "In the lineage of Mahavatar Babaji, Sanjeevini Kriya is offered not as a technique to be mastered through effort, but as a grace to be received through sincerity. It asks nothing of the seeker's outer life — no particular diet, no renunciation, no change of circumstance.",
      "What it asks for is a few honest minutes each day: a willingness to sit, to breathe with awareness, and to let the practice work quietly beneath the surface of daily life. Over time, seekers describe this as breath becoming prayer, and silence becoming strength.",
      "The path unfolds in stages — each a deeksha, a transmission received directly rather than learned from a book. This is why the guidance of a living master matters: Sanjeevini Kriya is a current of energy and grace as much as it is a technique of breath.",
      "If you feel drawn to begin, know that no prior experience is needed. Every seeker starts exactly where they are.",
    ],
  },
  {
    id: 3,
    slug: "unbroken-lineage-kriya-yoga-babaji-to-today",
    category: "Guru Parampara",
    cover: "/images/guru-parampara-tree.jpg",
    date: "2026-01-22",
    title: "The Unbroken Lineage: Kriya Yoga From Babaji to Today",
    title_kn: "ಅಖಂಡ ಪರಂಪರೆ: ಬಾಬಾಜಿಯಿಂದ ಇಂದಿನವರೆಗೆ ಕ್ರಿಯಾ ಯೋಗ",
    excerpt:
      "From Mahavatar Babaji to Lahiri Mahasaya, Sri Yukteswar, and beyond — a look at how one unbroken chain of transmission carries Kriya Yoga's wisdom forward.",
    excerpt_kn:
      "ಮಹಾವತಾರ ಬಾಬಾಜಿಯಿಂದ ಲಾಹಿರಿ ಮಹಾಶಯ, ಶ್ರೀ ಯುಕ್ತೇಶ್ವರ ಮತ್ತು ಅದರಾಚೆಗೆ — ಕ್ರಿಯಾ ಯೋಗದ ಜ್ಞಾನವನ್ನು ಮುಂದಕ್ಕೆ ಒಯ್ಯುವ ಒಂದು ಅಖಂಡ ಪ್ರಸರಣ ಸರಪಳಿಯ ನೋಟ.",
    content: [
      "A guru parampara is not a list of names — it is a living current, passed from one awakened being to the next, each carrying forward what was received without dilution.",
      "The chain begins, in this tradition, with Adi Guru Ishwara and the Saptarishis, moves through the Siddha tradition and Sage Agastya, and reaches the modern world through the deathless Mahavatar Babaji, who revived Kriya Yoga for this age.",
      "From Babaji, the transmission passed to Lahiri Mahasaya, the householder yogi who made Kriya accessible to ordinary seekers; to Sri Yukteswar, the Jñāna Avatar; and to Paramahansa Yogananda, who carried this light to the West.",
      "Today, that same current continues through Pujya Sri Gurumurthy Guruji — not as history to be studied, but as a living transmission still available to any sincere seeker who comes forward.",
    ],
  },
  {
    id: 4,
    slug: "living-a-life-of-seva-quiet-power-of-selfless-service",
    category: "Seva",
    cover: "/ashramImg.png",
    date: "2026-01-29",
    title: "Living a Life of Seva: The Quiet Power of Selfless Service",
    title_kn: "ಸೇವಾಮಯ ಜೀವನ: ನಿಸ್ವಾರ್ಥ ಸೇವೆಯ ಮೌನ ಶಕ್ತಿ",
    excerpt:
      "Every day, Annadana feeds over a thousand people — not as charity, but as prayer. On why selfless service is treated as a spiritual practice in its own right.",
    excerpt_kn:
      "ಪ್ರತಿದಿನ, ಅನ್ನದಾನವು ಸಾವಿರಕ್ಕೂ ಹೆಚ್ಚು ಜನರಿಗೆ ಆಹಾರ ನೀಡುತ್ತದೆ — ದಾನವಾಗಿ ಅಲ್ಲ, ಪ್ರಾರ್ಥನೆಯಾಗಿ.",
    content: [
      "It is easy to think of meditation and service as two separate paths — one turned inward, the other turned outward. But in this tradition, they are understood as one and the same practice, wearing different clothes.",
      "Seva asks the seeker to offer effort without attachment to the outcome, and without seeking recognition for it. Annadana — the daily feeding of those in need — is one of the clearest expressions of this: food offered simply because someone is hungry, with no question asked in return.",
      "Guruji often says that a mind trained in silent meditation but closed to another's suffering has not yet understood stillness at all. True inner peace naturally overflows into compassion for others.",
      "Whether through Annadana, through supporting an ashram's daily work, or through a small act of kindness in your own home, seva is available to every seeker, every day — no special qualification required, only willingness.",
    ],
  },
  {
    id: 5,
    slug: "three-signs-you-are-ready-for-deeksha",
    category: "Deeksha",
    cover: "/images/pranaShuddhiDeeksha.webp",
    date: "2026-02-05",
    title: "Three Signs You Are Ready for Deeksha",
    title_kn: "ನೀವು ದೀಕ್ಷೆಗೆ ಸಿದ್ಧರಿದ್ದೀರಿ ಎಂಬುದರ ಮೂರು ಸೂಚನೆಗಳು",
    excerpt:
      "Deeksha is not earned through years of preparation — it is received through sincerity. Some gentle signs that a seeker is ready to take the next step.",
    excerpt_kn:
      "ದೀಕ್ಷೆಯನ್ನು ವರ್ಷಗಳ ಸಿದ್ಧತೆಯಿಂದ ಗಳಿಸಲಾಗುವುದಿಲ್ಲ — ಅದನ್ನು ಪ್ರಾಮಾಣಿಕತೆಯಿಂದ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.",
    content: [
      "Many seekers wait, believing they must first become 'ready' in some measurable way before approaching a Guru for deeksha. In truth, readiness rarely looks the way we expect.",
      "The first sign is simple honesty — an admission, even quietly to oneself, that the mind is restless and seeking something it cannot name. This honesty, not achievement, is the true starting point.",
      "The second sign is a longing for guidance rather than more information — a sense that reading and thinking alone have reached their limit, and that what is needed now is direct transmission from a living master.",
      "The third sign is simply the willingness to begin with just a few minutes a day. Deeksha does not ask for a transformed life in advance — it offers the very grace that makes transformation possible. If these signs feel familiar, the path is already open to you.",
    ],
  },
];
