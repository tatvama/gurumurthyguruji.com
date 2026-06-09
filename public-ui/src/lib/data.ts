// Primary navigation — kept to an elegant set for the header.
export const navigation = [
  { name: "Home", href: "/" },
  { name: "About Guruji", href: "/about" },
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
  // ↓↓↓ PLACEHOLDERS — replace with real values ↓↓↓
  phoneDisplay: "+91 XXXXX XXXXX",
  phoneHref: "tel:+91XXXXXXXXXX",
  whatsappDisplay: "+91 XXXXX XXXXX",
  whatsappHref: "https://wa.me/91XXXXXXXXXX",
  email: "contact@gurumurthyguruji.com",
  addressMain: "Sadhguru Shirdi Sai Baba Mandir, Srirangapatna, Mandya Dist, Karnataka, India",
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
    q: "Is the audience with Guruji really free of charge?",
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
    a: "At the ashrams and Shirdi Sai Baba mandirs established across Karnataka. Request an audience and our team will guide you to the nearest centre.",
  },
  {
    q: "Can I receive guidance if I live far away or abroad?",
    a: "Yes. Many seekers connect from across India and the world. Mention your location when you request an audience and we will do our best to assist.",
  },
  {
    q: "How can I support the mission?",
    a: "Through seva and by joining the daily Annadana that feeds over 1,000 people. Every act of selfless service is a prayer.",
  },
];
