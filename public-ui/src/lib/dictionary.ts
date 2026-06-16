// ─────────────────────────────────────────────────────────────────────────
// Bilingual UI dictionary — English (base) + Kannada (ಕನ್ನಡ).
// English is the default. The Kannada strings are reviewed/verified separately;
// `t()` in lib/i18n falls back to English for any missing Kannada key.
//
// Keep keys grouped by surface. Proper nouns (names, places) are not translated.
// ─────────────────────────────────────────────────────────────────────────

export const ui = {
  en: {
    // ── Navigation ──────────────────────────────────────────────
    "nav.about": "About",
    "nav.trikala": "Trikāla Jñāna",
    "nav.path": "The Path",
    "nav.spaces": "Sacred Spaces",
    "nav.contact": "Contact",
    "nav.sanjeevini": "Sanjeevini Kriya",
    "nav.sanjeevini.desc": "Sacred breath, silence & Guru's grace",
    "nav.guruvani": "Guruvani",
    "nav.guruvani.desc": "Teachings, quotes & spiritual wisdom",
    "nav.parampara": "Guru Parampara",
    "nav.parampara.desc": "The unbroken lineage of Kriya masters",
    "nav.ashrams": "Ashrams & Mandirs",
    "nav.ashrams.desc": "Centers of devotion across Karnataka",
    "nav.seva": "Seva & Annadana",
    "nav.seva.desc": "Compassionate service & daily feeding",
    "nav.trust": "Sadhguru Sai Samsthana Trust",

    // ── Calls to action ─────────────────────────────────────────
    "cta.book": "Book a Free Appointment",
    "cta.bookShort": "Book Free Appointment",
    "cta.getTrikala": "GET Trikala Reading",
    "cta.seekGuidance": "Seek Guruji's Guidance — Free",
    "cta.discoverTrikala": "Discover Trikāla Jñāna",
    "cta.learnTrikala": "Learn About Trikāla Jñāna",
    "cta.readJourney": "Read Guruji's Journey",
    "cta.whatsapp": "Chat on WhatsApp",
    "cta.viewAll": "View All",

    // ── Hero ────────────────────────────────────────────────────
    "hero.badge": "Free Sacred Appointment · Open to All Seekers",
    "hero.h1.line1": "Experience the Divine Grace of",
    "hero.h1.name": "Pujya Sri Gurumurthy Guruji",
    "hero.tagline": "Spiritual Master · Kriya Yoga Guide · Trikāla Jñāna",
    "hero.body":
      "Blessed by Shri Thrayambak Babaji and Shirdi Sai Baba. Through the divine sight of Trikāla Jñāna and the sacred path of Sanjeevini Kriya, seekers are guided toward inner peace, clarity, and awakening.",
    "hero.quote":
      "“The journey within is the path to true enlightenment; every soul guided is a step closer to divine harmony.”",
    "hero.trust.guided": "5,000+ Seekers Guided",
    "hero.trust.blessed": "Blessed by Babaji & Sai Baba",
    "hero.trust.free": "Always Free of Charge",
    "hero.chip": "Sanjeevini Kriya",

    // ── Antaryami (the signature "unspoken pain" section) ───────
    "antaryami.eyebrow": "Antaryami · The Unspoken Known",
    "antaryami.title": "He Knows Your Pain Before You Speak It",
    "antaryami.body":
      "Countless seekers come to Guruji carrying a sorrow too heavy for words. Before they speak a single sentence, Guruji quietly writes their unspoken question on a slip of paper — the very thought they came holding in their heart — and places it before them.",
    "antaryami.body2":
      "This is not prediction or astrology. It is antaryami — the Guru's grace seeing directly into the soul. In that moment of being truly seen, the healing begins.",
    "antaryami.pullquote":
      "“Before a word is spoken, the heart is already known.”",
    "antaryami.stat":
      "Thousands of seekers — families, elders, and people from every walk of life across India — have found this stillness of being understood.",

    // ── About preview ───────────────────────────────────────────
    "about.eyebrow": "The Living Master",
    "about.title.a": "A Path of Compassion &",
    "about.title.b": "Inner Peace",
    "about.body":
      "Pujya Sri Gurumurthy Guruji's path is one of grace, silence, and inner awakening. Blessed by Shri Thrayambak Babaji and guided by the divine presence of Shirdi Sai Baba, Guruji gently leads seekers toward peace, clarity, and divine connection.",
    "about.quote": "“The path of Kriya is the path of direct soul experience.”",
    "about.quoteBy": "— Guruji",

    // ── About PAGE (full story) ─────────────────────────────────
    "aboutpage.h1.a": "The Journey of",
    "aboutpage.h1.b": "Awakening",
    "aboutpage.lead": "A life dedicated to devotion, Sanjeevini Kriya, the divine sight of Trikāla Jñāna, and selfless service to humanity.",
    "aboutpage.intro": "Pujya Sri Gurumurthy Guruji's life is a testament to surrender, practice, and unconditional compassion. From his earliest spiritual stirrings to his mission today, his presence remains a guiding light for thousands seeking peace in a restless world.",
    "aboutpage.s1.title": "Divine Birth & Early Calling",
    "aboutpage.s1.p1": "From a tender age, Pujya Sri Gurumurthy Guruji showed a profound spiritual inclination. While others chased worldly achievement, Guruji was drawn naturally to silence and to the deeper questions of existence.",
    "aboutpage.s1.p2": "This innate calling blossomed as he grew, leading him to the ancient scriptures, the lives of great saints, and the power of meditation. It was clear that a higher purpose was quietly orchestrating his journey.",
    "aboutpage.quote": "“The search for God is not a journey to a distant land, but a quiet return to the eternal home within the heart.”",
    "aboutpage.s2.title": "The Grace of Sai Baba",
    "aboutpage.s2.p1": "A turning point came with the deepening of his devotion to Shirdi Sai Baba. The boundless compassion and unifying message of Sai Baba became a cornerstone of Guruji's life and teaching.",
    "aboutpage.s2.p2": "Under Sai Baba's loving guidance, Guruji began establishing mandirs and ashrams — sanctuaries where people of every background could find solace, healing, and spiritual nourishment.",
    "aboutpage.s3.title": "Babaji's Grace & Sanjeevini Kriya",
    "aboutpage.s3.p1": "The journey deepened through the grace of his guru, Shri Thrayambak Babaji, and the timeless Kriya lineage of Mahavatar Babaji. Guruji received the sacred technique of Sanjeevini Kriya — harnessing the life-force (prana) to purify the mind and awaken the soul.",
    "aboutpage.s3.p2": "Today Guruji is a living conduit for this ancient tradition, initiating sincere seekers into Sanjeevini Kriya and guiding them through the subtle realms of consciousness under the protective light of the Guru Parampara.",
    "aboutpage.s4.title": "The Divine Sight of Trikāla Jñāna",
    "aboutpage.s4.p1": "As his realisation deepened, Guruji became known for a rare and sacred gift — Trikāla Jñāna, the divine perception of a soul's past, present, and future. With a single compassionate glance, the karmic patterns and hidden blockages within a seeker are gently revealed.",
    "aboutpage.s4.p2": "This is not astrology or prediction, but a direct seeing born of Kriya sadhana and the Guru's grace — offered freely to every sincere soul, only to guide them toward peace, clarity, and their highest good.",
    "aboutpage.s5.title": "The Unspoken Known",
    "aboutpage.s5.p1": "Among those who come to Guruji, many carry a grief too heavy for words. Again and again, before a single sentence is spoken, Guruji has quietly written their unspoken question on a slip of paper and placed it before them — naming the very sorrow they came holding in their heart.",
    "aboutpage.s5.p2": "This is antaryami — the inner knowing born of realisation and grace, the same divine sight the Sai tradition has ever revered. To be seen so completely, without a word, is itself the beginning of healing.",
    "aboutpage.s5.trust": "Families, elders, and leaders and public figures from across India have sat in his presence — each received with the same boundless compassion, none ever turned away.",
    "aboutpage.mission.a": "Guruji's Mission",
    "aboutpage.mission.b": "Today",
    "aboutpage.mission.body": "Pujya Sri Gurumurthy Guruji tirelessly travels and teaches, making himself accessible to thousands. His mission is simple yet profound: to awaken the inner divinity in every soul through Kriya and devotion, and to serve the world through Annadana — feeding the hungry — and selfless seva.",

    // ── Trikāla teaser ──────────────────────────────────────────
    "trikala.eyebrow": "The Divine Sight",
    "trikala.subtitle": "The Divine Sight of Past, Present & Future",
    "trikala.intro":
      "Guruji is blessed with the rare gift of Trikāla Jñāna — the divine perception of a soul's past, present, and future. With a single compassionate glance, Guruji perceives the karmic patterns and the path that leads a seeker gently toward their highest good.",
    "trikala.clarifier":
      "This is not astrology, palmistry, or prediction. Trikāla Jñāna arises from inner realisation and the Guru's grace — a direct seeing of the soul, offered only to guide you toward peace and dharma, never to instil fear.",
    "trikala.past": "Past",
    "trikala.present": "Present",
    "trikala.future": "Future",
    "trikala.past.line":
      "The karmic roots and bonds carried across lifetimes — gently understood, never judged.",
    "trikala.present.line":
      "The true cause behind your present struggles, revealed with clarity and compassion.",
    "trikala.future.line":
      "The path that leads to your highest good, and the sadhana that prepares you for it.",

    // ── Scriptural roots (Trikāla page) ─────────────────────────
    "scripture.eyebrow": "Rooted in Scripture",
    "scripture.title": "The Sight the Scriptures Describe",
    "scripture.intro":
      "Trikāla Jñāna is not invention, nor astrology. The knowledge of past, present and future is named in the Bhagavad Gītā and the Yoga Sūtras themselves — as the Lord's own omniscience, and as the highest fruit of yogic realisation.",
    "scripture.bg.ref": "Bhagavad Gītā 7.26",
    "scripture.bg.meaning":
      "“I know the past, the present and the future, O Arjuna, and all living beings.”",
    "scripture.bg.gloss": "Sri Krishna as trikāl-darśhī — the knower of the three times.",
    "scripture.ys.ref": "Yoga Sūtra III.16",
    "scripture.ys.meaning":
      "“Through saṃyama upon the three transformations arises knowledge of past and future.”",
    "scripture.ys.gloss":
      "Patañjali's Yoga Sūtra — divine sight as the fruit of realisation, never prediction.",
    "scripture.close":
      "What the scriptures name, a realised master lives. Guruji's Trikāla Jñāna is this very sight — awakened not by study, but by grace.",

    // ── Trikāla PAGE (full) ─────────────────────────────────────
    "trikalapage.hero.eyebrow": "The Divine Sight of Guruji",
    "trikalapage.hero.cta2": "Explore Sanjeevini Kriya",
    "trikalapage.times.eyebrow": "Trikāla · The Three Times",
    "trikalapage.times.title": "One Glance, Three Horizons of Time",
    "trikalapage.times.subtitle": "With Guruji's divine sight, the whole arc of a soul's journey becomes clear — gently, and with compassion.",
    "trikalapage.sight.eyebrow": "A Realised Vision",
    "trikalapage.sight.title": "Seen Through Grace, Not Calculation",
    "trikalapage.sight.p1": "Trikāla Jñāna is not learned from books or charts. It awakens through decades of Kriya sadhana, the blessings of Shri Thrayambak Babaji, and the grace of Shirdi Sai Baba.",
    "trikalapage.sight.p2": "When you sit before Guruji, there is nothing you must explain. In a single compassionate glance, the subtle energies and karmic imprints of your life are perceived — and only what serves your awakening is gently revealed.",
    "trikalapage.clarifier.title": "This Is Not Astrology",
    "trikalapage.receive.eyebrow": "The Blessing",
    "trikalapage.receive.title": "What a Seeker Receives",
    "trikalapage.receive.subtitle": "Every appointment is offered with love — and always free of charge.",
    "trikalapage.receive.b1": "Clarity on the karmic patterns shaping your life",
    "trikalapage.receive.b2": "The true, hidden cause behind your present struggles",
    "trikalapage.receive.b3": "A personal sadhana to walk toward your highest good",
    "trikalapage.receive.b4": "Deep peace, reassurance, and the Guru's living grace",
    "trikalapage.cta.title": "Let Guruji See Your Path",
    "trikalapage.cta.body": "Come with sincerity and an open heart. Receive the divine sight of Trikāla Jñāna and walk forward with clarity, courage, and grace.",

    // ── Impact stats ────────────────────────────────────────────
    "stats.eyebrow": "A Lifetime of Grace",
    "stats.title": "Serving Seekers Across India",
    "stats.guided": "Devotees Guided",
    "stats.reached": "People Reached",
    "stats.fed": "Fed Daily",
    "stats.ashrams": "Ashrams & Mandirs",

    // ── Testimonials ────────────────────────────────────────────
    "testimonials.eyebrow": "Devotee Experiences",
    "testimonials.title": "Stories of Grace",
    "testimonials.trustline":
      "Sought by families, elders, leaders, and public figures across India — every soul received with the same boundless grace.",

    // ── Final CTA ───────────────────────────────────────────────
    "final.badge": "Always Free of Charge",
    "final.title": "Receive Guruji's Grace",
    "final.body":
      "Sit in the presence of Pujya Sri Gurumurthy Guruji and receive guidance for life's challenges through Trikāla Jñāna, divine wisdom, and compassion — given freely to every sincere seeker.",

    // ── Meet Guruji (free-appointment form) ────────────────────────
    "meet.badge": "Always Free of Charge",
    "meet.title.a": "Book Your Free",
    "meet.title.b": "Sacred Appointment",
    "meet.subtitle":
      "Request a personal appointment with Pujya Sri Gurumurthy Guruji — for Trikāla Jñāna darshan, Sanjeevini Kriya initiation, blessings, or spiritual counsel. There is never any charge.",
    "meet.success.title": "Request Received",
    "meet.success.body":
      "Your request has been received with devotion. Our team will contact you soon regarding your appointment with Guruji.",
    "meet.success.again": "Submit Another Request",
    "meet.f.name": "Full Name *",
    "meet.f.name.ph": "E.g. Ramesh Kumar",
    "meet.f.mobile": "Mobile / WhatsApp *",
    "meet.f.mobile.ph": "+91 98765 43210",
    "meet.f.profession": "Profession / Work *",
    "meet.f.profession.ph": "E.g. Software Engineer",
    "meet.f.place": "Current Place *",
    "meet.f.place.ph": "Area, City, Taluk, District",
    "meet.f.howknown": "How did you come to know about Guruji? *",
    "meet.f.howknown.ph": "E.g. Friend, YouTube, Social Media",
    "meet.f.ashram": "Which ashram is nearest to you? *",
    "meet.f.ashram.ph": "Select nearest ashram...",
    "meet.f.message": "Message to convey to Guruji (Optional)",
    "meet.f.message.ph": "Share your spiritual seeking or current challenges...",
    "meet.submit": "Request My Free Appointment",
    "meet.submitting": "Submitting...",
    "meet.note": "For urgent matters, you can also reach out via WhatsApp.",

    // ── Footer ──────────────────────────────────────────────────
    "footer.tagline":
      "A spiritual sanctuary for seekers — guided by grace, Kriya, and the divine sight of Trikāla Jñāna.",
    "footer.explore": "Explore",
    "footer.connect": "Connect",
    "footer.contact": "Contact",
    "footer.free": "All appointments with Guruji are free of charge.",
    "footer.rights": "All rights reserved.",
    "footer.quote": "“May all beings be guided towards peace and divine grace.”",
    "footer.disclaimer":
      "Spiritual guidance offered by Guruji complements, and does not replace, professional medical, legal, or financial advice. All appointments are offered free of charge.",

    // ── Misc ────────────────────────────────────────────────────
    "lang.label": "ಕನ್ನಡ",
    "lang.aria": "Switch to Kannada",
    // [contact]
    "contact.hero.title": "Contact",
    "contact.hero.titleAccent": "Us",
    "contact.hero.subtitle": "Reach out to the Sai Samsthana Trust for general inquiries, seva opportunities, or to connect with an ashram near you.",
    "contact.details.heading": "Get in Touch",
    "contact.details.phoneLabel": "Phone / WhatsApp",
    "contact.details.emailLabel": "Email",
    "contact.details.ashramLabel": "Main Ashram",
    "contact.details.ashramName": "Sadhguru Shirdi Sai Baba Mandir",
    "contact.details.ashramLocation": "Srirangapatna, Mandya Dist, Karnataka",
    "contact.map.title": "Location Map",
    "contact.map.subtitle": "Srirangapatna Mandir, Karnataka (Coming Soon)",
    "contact.form.heading": "Send a Message",
    "contact.form.nameLabel": "Full Name",
    "contact.form.namePlaceholder": "Your name",
    "contact.form.emailLabel": "Email Address",
    "contact.form.emailPlaceholder": "your@email.com",
    "contact.form.subjectLabel": "Subject",
    "contact.form.subjectPlaceholder": "How can we help?",
    "contact.form.messageLabel": "Message",
    "contact.form.messagePlaceholder": "Write your message here...",
    "contact.form.submit": "Send Message",
    "contact.form.guidanceNote": "If you are looking for spiritual guidance, please use the",
    "contact.form.guidanceLink": "Meet Guruji",
    "contact.form.guidanceNoteEnd": "form instead.",
    // [guruvani]
    "guruvani.hero.titleLead": "Guruvani: ",
    "guruvani.hero.titleAccent": "The Master's Voice",
    "guruvani.hero.subtitle": "Timeless wisdom and sacred quotes to illuminate your spiritual path.",
    "guruvani.filters.all": "All",
    // [parampara]
    "parampara.hero.titleLead": "The Sacred",
    "parampara.hero.titleHighlight": "Lineage",
    "parampara.hero.subtitle": "Tracing the divine transmission of Sanjeevini Kriya from the cosmic source to the present living guide.",
    "parampara.tree.heading": "The Sacred Tree of Lineage",
    "parampara.tree.subtitle": "Click on the lineage chart below to expand and view the complete Guru Parampara in detail.",
    "parampara.tree.expandButton": "Click to Expand Chart",
    "parampara.cosmic.heading": "Adi Guru Ishwara / Shiva",
    "parampara.cosmic.subtitle": "The Primordial Source of Kriya Wisdom",
    "parampara.lightbox.close": "Close",
    // [ashramspage]
    "ashramspage.hero.titlePrefix": "Ashrams & ",
    "ashramspage.hero.titleAccent": "Mandirs",
    "ashramspage.hero.subtitle": "Sacred sanctuaries of peace, devotion, and selfless service across Karnataka.",
    "ashramspage.map.title": "Sadhguru Sai Samsthana Ashrams",
    "ashramspage.map.caption": "Map view of all centers in Karnataka (Coming Soon)",
    // [sevapage]
    "sevapage.hero.titleLead": "Compassion in",
    "sevapage.hero.titleAccent": "Action",
    "sevapage.hero.subtitle": "\"Service to humanity is service to God.\" Experience the joy of selfless giving through Sai Samsthana Trust.",
    "sevapage.initiatives.heading": "Our Initiatives",
    "sevapage.initiatives.annadana.title": "Maha Annadana",
    "sevapage.initiatives.annadana.body": "Food is considered the highest form of charity (Maha Daan). Through the Sai Samsthana Trust, we ensure that over 1,000 hungry individuals are fed daily with nutritious, sanctified meals. No one who visits our ashrams leaves hungry.",
    "sevapage.initiatives.education.title": "Spiritual Education",
    "sevapage.initiatives.education.body": "We conduct free spiritual classes, satsangs, and Sanjeevini Kriya workshops to uplift the minds of the masses, offering them tools to navigate life's challenges with peace and equanimity.",
    "sevapage.cta.heading": "Support the Trust",
    "sevapage.cta.body": "Your contributions help us sustain and expand our Annadana and charitable activities. Join us in this noble cause.",
    "sevapage.cta.button": "Donate Now",
    "sevapage.cta.note": "Donation details and secure gateway placeholder.",
    // [sanjeevini]
    "sanjeevini.hero.titleMain": "Sanjeevini",
    "sanjeevini.hero.titleAccent": "Kriya",
    "sanjeevini.hero.subtitle": "An ancient, sacred science of breath and consciousness passed down through the immortal Siddha lineage.",
    "sanjeevini.essence.heading": "The Essence of the Practice",
    "sanjeevini.essence.para1": "Sanjeevini Kriya is not merely a breathing exercise; it is a profound spiritual technology. By directing the life force (Prana) through the subtle channels of the spine, the practitioner gradually unwinds karmic knots and awakens the dormant spiritual energy.",
    "sanjeevini.essence.para2": "Through the living transmission from Pujya Sri Gurumurthy Guruji, the seed of this Kriya is planted in the seeker's heart, requiring only the water of daily practice and the sunlight of devotion to blossom.",
    "sanjeevini.pillars.heading": "The Three Pillars",
    "sanjeevini.pillars.breath": "Breath (Pranayama)",
    "sanjeevini.pillars.silence": "Silence (Dhyana)",
    "sanjeevini.pillars.grace": "Grace (Kripa)",
    "sanjeevini.benefits.heading": "Fruits of the Practice",
    "sanjeevini.cta.heading": "Begin Your Journey",
    "sanjeevini.cta.text": "Sanjeevini Kriya is taught personally by Pujya Sri Gurumurthy Guruji or authorized acharyas. Request an appointment to seek initiation.",
    "sanjeevini.cta.button": "Request Initiation",
  },

  // ───────────────────────────────────────────────────────────────
  // KANNADA (ಕನ್ನಡ). Verified separately; English is used as fallback.
  // ───────────────────────────────────────────────────────────────
  kn: {
    // ── Navigation ──────────────────────────────────────────────
    "nav.about": "ಪರಿಚಯ",
    "nav.trikala": "ತ್ರಿಕಾಲ ಜ್ಞಾನ",
    "nav.path": "ಆಧ್ಯಾತ್ಮಿಕ ಪಥ",
    "nav.spaces": "ಪವಿತ್ರ ಸ್ಥಳಗಳು",
    "nav.contact": "ಸಂಪರ್ಕ",
    "nav.sanjeevini": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ",
    "nav.sanjeevini.desc": "ಪವಿತ್ರ ಶ್ವಾಸ, ಮೌನ ಮತ್ತು ಗುರು ಕೃಪೆ",
    "nav.guruvani": "ಗುರುವಾಣಿ",
    "nav.guruvani.desc": "ಬೋಧನೆಗಳು, ನುಡಿಮುತ್ತುಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನ",
    "nav.parampara": "ಗುರು ಪರಂಪರೆ",
    "nav.parampara.desc": "ಕ್ರಿಯಾ ಗುರುಗಳ ಅಖಂಡ ಪರಂಪರೆ",
    "nav.ashrams": "ಆಶ್ರಮಗಳು ಮತ್ತು ಮಂದಿರಗಳು",
    "nav.ashrams.desc": "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಭಕ್ತಿಯ ಕೇಂದ್ರಗಳು",
    "nav.seva": "ಸೇವೆ ಮತ್ತು ಅನ್ನದಾನ",
    "nav.seva.desc": "ಕರುಣಾಮಯ ಸೇವೆ ಮತ್ತು ನಿತ್ಯ ಅನ್ನದಾನ",
    "nav.trust": "ಸದ್ಗುರು ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್",

    // ── Calls to action ─────────────────────────────────────────
    "cta.book": "ಉಚಿತ ದರ್ಶನ ಕಾಯ್ದಿರಿಸಿ",
    "cta.bookShort": "ಉಚಿತ ದರ್ಶನ",
    "cta.getTrikala": "ತ್ರಿಕಾಲ ರೀಡಿಂಗ್ ಪಡೆಯಿರಿ",
    "cta.seekGuidance": "ಗುರೂಜಿಯ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ — ಉಚಿತ",
    "cta.discoverTrikala": "ತ್ರಿಕಾಲ ಜ್ಞಾನವನ್ನು ಅರಿಯಿರಿ",
    "cta.learnTrikala": "ತ್ರಿಕಾಲ ಜ್ಞಾನದ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ",
    "cta.readJourney": "ಗುರೂಜಿಯ ಪಯಣವನ್ನು ಓದಿ",
    "cta.whatsapp": "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ",
    "cta.viewAll": "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",

    // ── Hero ────────────────────────────────────────────────────
    "hero.badge": "ಉಚಿತ ದಿವ್ಯ ದರ್ಶನ · ಎಲ್ಲ ಭಕ್ತರಿಗೂ ಮುಕ್ತ",
    "hero.h1.line1": "ದಿವ್ಯ ಕೃಪೆಯನ್ನು ಅನುಭವಿಸಿ —",
    "hero.h1.name": "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ",
    "hero.tagline": "ಆಧ್ಯಾತ್ಮಿಕ ಗುರು · ಕ್ರಿಯಾ ಯೋಗ ಮಾರ್ಗದರ್ಶಿ · ತ್ರಿಕಾಲ ಜ್ಞಾನ",
    "hero.body":
      "ಶ್ರೀ ತ್ರ್ಯಂಬಕ ಬಾಬಾಜಿ ಮತ್ತು ಶಿರಡಿ ಸಾಯಿಬಾಬಾ ಅವರ ಆಶೀರ್ವಾದ ಪಡೆದವರು. ತ್ರಿಕಾಲ ಜ್ಞಾನದ ದಿವ್ಯ ದೃಷ್ಟಿ ಮತ್ತು ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಪವಿತ್ರ ಪಥದ ಮೂಲಕ, ಸಾಧಕರು ಆಂತರಿಕ ಶಾಂತಿ, ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಜಾಗೃತಿಯೆಡೆಗೆ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯುತ್ತಾರೆ.",
    "hero.quote":
      "“ಅಂತರಂಗದ ಪಯಣವೇ ನಿಜವಾದ ಜ್ಞಾನೋದಯದ ಮಾರ್ಗ; ಮಾರ್ಗದರ್ಶನ ಪಡೆದ ಪ್ರತಿ ಆತ್ಮವೂ ದಿವ್ಯ ಸಾಮರಸ್ಯಕ್ಕೆ ಒಂದು ಹೆಜ್ಜೆ ಹತ್ತಿರ.”",
    "hero.trust.guided": "5,000+ ಸಾಧಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ",
    "hero.trust.blessed": "ಬಾಬಾಜಿ ಮತ್ತು ಸಾಯಿಬಾಬಾ ಅವರ ಆಶೀರ್ವಾದ",
    "hero.trust.free": "ಯಾವಾಗಲೂ ಉಚಿತ",
    "hero.chip": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ",

    // ── Antaryami ───────────────────────────────────────────────
    "antaryami.eyebrow": "ಅಂತರ್ಯಾಮಿ · ಹೇಳದೆ ಅರಿತವರು",
    "antaryami.title": "ನೀವು ಹೇಳುವ ಮೊದಲೇ ನಿಮ್ಮ ನೋವನ್ನು ಗುರೂಜಿ ಅರಿಯುತ್ತಾರೆ",
    "antaryami.body":
      "ಮಾತಿಗೆ ಮೀರಿದ ದುಃಖವನ್ನು ಹೊತ್ತು ಅಸಂಖ್ಯ ಸಾಧಕರು ಗುರೂಜಿಯ ಬಳಿಗೆ ಬರುತ್ತಾರೆ. ಅವರು ಒಂದು ಮಾತನ್ನೂ ಆಡುವ ಮೊದಲೇ, ಅವರು ಮನದಲ್ಲಿ ಹೊತ್ತು ತಂದ ಆ ಪ್ರಶ್ನೆಯನ್ನೇ ಗುರೂಜಿ ಮೌನವಾಗಿ ಕಾಗದದ ಮೇಲೆ ಬರೆದು ಅವರ ಮುಂದಿಡುತ್ತಾರೆ.",
    "antaryami.body2":
      "ಇದು ಭವಿಷ್ಯ ಹೇಳುವುದಲ್ಲ, ಜ್ಯೋತಿಷ್ಯವೂ ಅಲ್ಲ. ಇದು ಅಂತರ್ಯಾಮಿ — ಆತ್ಮವನ್ನೇ ನೇರವಾಗಿ ಕಾಣುವ ಗುರು ಕೃಪೆ. ತಾವು ನಿಜವಾಗಿ ಅರಿಯಲ್ಪಟ್ಟ ಆ ಕ್ಷಣದಲ್ಲೇ ಗುಣಪಡಿಸುವಿಕೆ ಆರಂಭವಾಗುತ್ತದೆ.",
    "antaryami.pullquote":
      "“ಮಾತು ಹೊರಡುವ ಮೊದಲೇ ಹೃದಯವು ಅರಿಯಲ್ಪಡುತ್ತದೆ.”",
    "antaryami.stat":
      "ಭಾರತದಾದ್ಯಂತ ಸಾವಿರಾರು ಸಾಧಕರು — ಕುಟುಂಬಗಳು, ಹಿರಿಯರು, ಎಲ್ಲ ವರ್ಗದ ಜನರು — ಅರಿಯಲ್ಪಟ್ಟ ಈ ನೆಮ್ಮದಿಯನ್ನು ಕಂಡಿದ್ದಾರೆ.",

    // ── About preview ───────────────────────────────────────────
    "about.eyebrow": "ಜೀವಂತ ಗುರು",
    "about.title.a": "ಕರುಣೆ ಮತ್ತು",
    "about.title.b": "ಆಂತರಿಕ ಶಾಂತಿಯ ಪಥ",
    "about.body":
      "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ಪಥವು ಕೃಪೆ, ಮೌನ ಮತ್ತು ಆಂತರಿಕ ಜಾಗೃತಿಯದ್ದು. ಶ್ರೀ ತ್ರ್ಯಂಬಕ ಬಾಬಾಜಿ ಅವರ ಆಶೀರ್ವಾದ ಮತ್ತು ಶಿರಡಿ ಸಾಯಿಬಾಬಾ ಅವರ ದಿವ್ಯ ಸಾನ್ನಿಧ್ಯದ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ, ಗುರೂಜಿ ಸಾಧಕರನ್ನು ಶಾಂತಿ, ಸ್ಪಷ್ಟತೆ ಮತ್ತು ದಿವ್ಯ ಸಂಬಂಧದೆಡೆಗೆ ಮೃದುವಾಗಿ ಕೊಂಡೊಯ್ಯುತ್ತಾರೆ.",
    "about.quote": "“ಕ್ರಿಯಾದ ಪಥವೇ ನೇರವಾದ ಆತ್ಮಾನುಭವದ ಪಥ.”",
    "about.quoteBy": "— ಗುರೂಜಿ",

    // ── About PAGE (full story) ─────────────────────────────────
    "aboutpage.h1.a": "ಜಾಗೃತಿಯ",
    "aboutpage.h1.b": "ಪಯಣ",
    "aboutpage.lead": "ಭಕ್ತಿ, ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ, ತ್ರಿಕಾಲ ಜ್ಞಾನದ ದಿವ್ಯ ದೃಷ್ಟಿ ಮತ್ತು ಮಾನವತೆಗೆ ನಿಸ್ವಾರ್ಥ ಸೇವೆಗೆ ಮುಡಿಪಾದ ಜೀವನ.",
    "aboutpage.intro": "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ಜೀವನವು ಶರಣಾಗತಿ, ಸಾಧನೆ ಮತ್ತು ನಿಸ್ಸೀಮ ಕರುಣೆಯ ಸಾಕ್ಷಿ. ಬಾಲ್ಯದ ಆಧ್ಯಾತ್ಮಿಕ ಒಲವಿನಿಂದ ಇಂದಿನ ಧ್ಯೇಯದವರೆಗೆ, ಅವರ ಸಾನ್ನಿಧ್ಯವು ಚಂಚಲ ಜಗತ್ತಿನಲ್ಲಿ ಶಾಂತಿ ಬಯಸುವ ಸಾವಿರಾರು ಜನರಿಗೆ ಮಾರ್ಗದರ್ಶಕ ಬೆಳಕಾಗಿದೆ.",
    "aboutpage.s1.title": "ದಿವ್ಯ ಜನನ ಮತ್ತು ಬಾಲ್ಯದ ಕರೆ",
    "aboutpage.s1.p1": "ಎಳೆಯ ವಯಸ್ಸಿನಿಂದಲೇ ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ಆಳವಾದ ಆಧ್ಯಾತ್ಮಿಕ ಒಲವನ್ನು ತೋರಿದರು. ಇತರರು ಲೌಕಿಕ ಸಾಧನೆಗಳ ಹಿಂದೆ ಓಡುತ್ತಿದ್ದಾಗ, ಗುರೂಜಿ ಸಹಜವಾಗಿ ಮೌನ ಮತ್ತು ಅಸ್ತಿತ್ವದ ಆಳವಾದ ಪ್ರಶ್ನೆಗಳೆಡೆಗೆ ಸೆಳೆಯಲ್ಪಟ್ಟರು.",
    "aboutpage.s1.p2": "ಬೆಳೆದಂತೆ ಈ ಸಹಜ ಕರೆ ಅರಳಿತು — ಪ್ರಾಚೀನ ಶಾಸ್ತ್ರಗಳು, ಮಹಾನ್ ಸಂತರ ಜೀವನ ಮತ್ತು ಧ್ಯಾನದ ಶಕ್ತಿಯೆಡೆಗೆ ಅವರನ್ನು ಕೊಂಡೊಯ್ಯಿತು. ಉನ್ನತ ದಿವ್ಯ ಉದ್ದೇಶವೊಂದು ಮೌನವಾಗಿ ಅವರ ಪಯಣವನ್ನು ರೂಪಿಸುತ್ತಿತ್ತು ಎಂಬುದು ಸ್ಪಷ್ಟವಾಗಿತ್ತು.",
    "aboutpage.quote": "“ದೇವರ ಅನ್ವೇಷಣೆ ದೂರದ ನಾಡಿಗೆ ಮಾಡುವ ಪಯಣವಲ್ಲ, ಹೃದಯದೊಳಗಿನ ಶಾಶ್ವತ ಮನೆಗೆ ಮಾಡುವ ಶಾಂತ ಮರಳುವಿಕೆ.”",
    "aboutpage.s2.title": "ಸಾಯಿಬಾಬಾ ಅವರ ಕೃಪೆ",
    "aboutpage.s2.p1": "ಶಿರಡಿ ಸಾಯಿಬಾಬಾ ಅವರೆಡೆಗಿನ ಭಕ್ತಿ ಆಳವಾದಾಗ ಒಂದು ಮಹತ್ವದ ತಿರುವು ಬಂದಿತು. ಸಾಯಿಬಾಬಾ ಅವರ ನಿಸ್ಸೀಮ ಕರುಣೆ ಮತ್ತು ಏಕತೆಯ ಸಂದೇಶವು ಗುರೂಜಿಯ ಜೀವನ ಮತ್ತು ಬೋಧನೆಯ ಬುನಾದಿಯಾಯಿತು.",
    "aboutpage.s2.p2": "ಸಾಯಿಬಾಬಾ ಅವರ ಪ್ರೀತಿಯ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ, ಗುರೂಜಿ ಮಂದಿರಗಳು ಮತ್ತು ಆಶ್ರಮಗಳನ್ನು ಸ್ಥಾಪಿಸಲಾರಂಭಿಸಿದರು — ಎಲ್ಲ ವರ್ಗದ ಜನರೂ ಸಾಂತ್ವನ, ಗುಣಪಡಿಸುವಿಕೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಪೋಷಣೆಯನ್ನು ಕಾಣುವ ಆಶ್ರಯ ಸ್ಥಳಗಳು.",
    "aboutpage.s3.title": "ಬಾಬಾಜಿ ಅವರ ಕೃಪೆ ಮತ್ತು ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ",
    "aboutpage.s3.p1": "ಅವರ ಗುರು ಶ್ರೀ ತ್ರ್ಯಂಬಕ ಬಾಬಾಜಿ ಅವರ ಕೃಪೆ ಮತ್ತು ಮಹಾವತಾರ ಬಾಬಾಜಿ ಅವರ ಶಾಶ್ವತ ಕ್ರಿಯಾ ಪರಂಪರೆಯ ಮೂಲಕ ಪಯಣ ಆಳವಾಯಿತು. ಗುರೂಜಿ ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ಪವಿತ್ರ ತಂತ್ರವನ್ನು ಪಡೆದರು — ಮನಸ್ಸನ್ನು ಶುದ್ಧಗೊಳಿಸಲು ಮತ್ತು ಆತ್ಮವನ್ನು ಜಾಗೃತಗೊಳಿಸಲು ಪ್ರಾಣಶಕ್ತಿಯನ್ನು ಬಳಸುವ ವಿಧಾನ.",
    "aboutpage.s3.p2": "ಇಂದು ಗುರೂಜಿ ಈ ಪ್ರಾಚೀನ ಪರಂಪರೆಯ ಜೀವಂತ ಮಾಧ್ಯಮ — ಪ್ರಾಮಾಣಿಕ ಸಾಧಕರಿಗೆ ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ದೀಕ್ಷೆ ನೀಡುತ್ತಾ, ಗುರು ಪರಂಪರೆಯ ರಕ್ಷಣಾತ್ಮಕ ಬೆಳಕಿನಲ್ಲಿ ಪ್ರಜ್ಞೆಯ ಸೂಕ್ಷ್ಮ ಲೋಕಗಳ ಮೂಲಕ ಅವರನ್ನು ಮಾರ್ಗದರ್ಶಿಸುತ್ತಾರೆ.",
    "aboutpage.s4.title": "ತ್ರಿಕಾಲ ಜ್ಞಾನದ ದಿವ್ಯ ದೃಷ್ಟಿ",
    "aboutpage.s4.p1": "ಸಾಕ್ಷಾತ್ಕಾರ ಆಳವಾದಂತೆ, ಗುರೂಜಿ ಅಪರೂಪದ ಮತ್ತು ಪವಿತ್ರ ವರಕ್ಕಾಗಿ ಪ್ರಸಿದ್ಧರಾದರು — ತ್ರಿಕಾಲ ಜ್ಞಾನ, ಆತ್ಮದ ಭೂತ, ವರ್ತಮಾನ ಮತ್ತು ಭವಿಷ್ಯದ ದಿವ್ಯ ದೃಷ್ಟಿ. ಒಂದೇ ಕರುಣಾಪೂರ್ಣ ನೋಟದಿಂದ, ಸಾಧಕನೊಳಗಿನ ಕರ್ಮದ ಮಾದರಿಗಳು ಮತ್ತು ಗುಪ್ತ ತಡೆಗಳು ಮೃದುವಾಗಿ ಬಯಲಾಗುತ್ತವೆ.",
    "aboutpage.s4.p2": "ಇದು ಜ್ಯೋತಿಷ್ಯ ಅಥವಾ ಭವಿಷ್ಯ ಹೇಳುವುದಲ್ಲ, ಕ್ರಿಯಾ ಸಾಧನೆ ಮತ್ತು ಗುರು ಕೃಪೆಯಿಂದ ಹುಟ್ಟಿದ ನೇರ ದರ್ಶನ — ಪ್ರತಿ ಪ್ರಾಮಾಣಿಕ ಆತ್ಮಕ್ಕೂ ಉಚಿತವಾಗಿ ನೀಡಲ್ಪಡುತ್ತದೆ, ಶಾಂತಿ, ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಅವರ ಪರಮ ಹಿತದೆಡೆಗೆ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.",
    "aboutpage.s5.title": "ಹೇಳದೆ ಅರಿತ ಮಾತು",
    "aboutpage.s5.p1": "ಗುರೂಜಿಯ ಬಳಿಗೆ ಬರುವವರಲ್ಲಿ ಹಲವರು ಮಾತಿಗೆ ಮೀರಿದ ದುಃಖವನ್ನು ಹೊತ್ತು ಬರುತ್ತಾರೆ. ಮತ್ತೆ ಮತ್ತೆ, ಒಂದು ಮಾತನ್ನೂ ಆಡುವ ಮೊದಲೇ, ಅವರು ಮನದಲ್ಲಿ ಹೊತ್ತು ತಂದ ಆ ನೋವನ್ನೇ ಹೆಸರಿಸಿ, ಅವರ ಹೇಳದ ಪ್ರಶ್ನೆಯನ್ನು ಗುರೂಜಿ ಮೌನವಾಗಿ ಕಾಗದದ ಮೇಲೆ ಬರೆದು ಅವರ ಮುಂದಿಟ್ಟಿದ್ದಾರೆ.",
    "aboutpage.s5.p2": "ಇದು ಅಂತರ್ಯಾಮಿ — ಸಾಕ್ಷಾತ್ಕಾರ ಮತ್ತು ಕೃಪೆಯಿಂದ ಹುಟ್ಟಿದ ಆಂತರಿಕ ಅರಿವು, ಸಾಯಿ ಪರಂಪರೆ ಸದಾ ಗೌರವಿಸಿದ ಅದೇ ದಿವ್ಯ ದೃಷ್ಟಿ. ಮಾತಿಲ್ಲದೆ ಹೀಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಅರಿಯಲ್ಪಡುವುದೇ ಗುಣಪಡಿಸುವಿಕೆಯ ಆರಂಭ.",
    "aboutpage.s5.trust": "ಭಾರತದಾದ್ಯಂತ ಕುಟುಂಬಗಳು, ಹಿರಿಯರು, ನಾಯಕರು ಮತ್ತು ಗಣ್ಯ ವ್ಯಕ್ತಿಗಳು ಅವರ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಕುಳಿತಿದ್ದಾರೆ — ಪ್ರತಿಯೊಬ್ಬರೂ ಅದೇ ನಿಸ್ಸೀಮ ಕರುಣೆಯಿಂದ ಸ್ವೀಕರಿಸಲ್ಪಟ್ಟಿದ್ದಾರೆ, ಯಾರನ್ನೂ ಎಂದೂ ಮರಳಿಸಲಾಗಿಲ್ಲ.",
    "aboutpage.mission.a": "ಗುರೂಜಿಯ ಧ್ಯೇಯ",
    "aboutpage.mission.b": "ಇಂದು",
    "aboutpage.mission.body": "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿ ದಣಿವರಿಯದೆ ಪ್ರಯಾಣಿಸಿ ಬೋಧಿಸುತ್ತಾ, ಸಾವಿರಾರು ಜನರಿಗೆ ಲಭ್ಯರಾಗಿದ್ದಾರೆ. ಅವರ ಧ್ಯೇಯ ಸರಳ ಆದರೆ ಗಹನ: ಕ್ರಿಯಾ ಮತ್ತು ಭಕ್ತಿಯ ಮೂಲಕ ಪ್ರತಿ ಆತ್ಮದೊಳಗಿನ ದಿವ್ಯತೆಯನ್ನು ಜಾಗೃತಗೊಳಿಸುವುದು, ಮತ್ತು ಅನ್ನದಾನ — ಹಸಿದವರಿಗೆ ಊಟ ನೀಡುವುದು — ಹಾಗೂ ನಿಸ್ವಾರ್ಥ ಸೇವೆಯ ಮೂಲಕ ಜಗತ್ತಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುವುದು.",

    // ── Trikāla teaser ──────────────────────────────────────────
    "trikala.eyebrow": "ದಿವ್ಯ ದೃಷ್ಟಿ",
    "trikala.subtitle": "ಭೂತ, ವರ್ತಮಾನ ಮತ್ತು ಭವಿಷ್ಯದ ದಿವ್ಯ ದೃಷ್ಟಿ",
    "trikala.intro":
      "ಗುರೂಜಿಗೆ ತ್ರಿಕಾಲ ಜ್ಞಾನದ ಅಪರೂಪದ ವರ ಲಭಿಸಿದೆ — ಆತ್ಮದ ಭೂತ, ವರ್ತಮಾನ ಮತ್ತು ಭವಿಷ್ಯವನ್ನು ಕಾಣುವ ದಿವ್ಯ ದೃಷ್ಟಿ. ಒಂದೇ ಕರುಣಾಪೂರ್ಣ ನೋಟದಿಂದ, ಸಾಧಕನನ್ನು ಅವನ ಪರಮ ಹಿತದೆಡೆಗೆ ಕೊಂಡೊಯ್ಯುವ ಕರ್ಮದ ಮಾದರಿಗಳನ್ನು ಮತ್ತು ಮಾರ್ಗವನ್ನು ಗುರೂಜಿ ಗ್ರಹಿಸುತ್ತಾರೆ.",
    "trikala.clarifier":
      "ಇದು ಜ್ಯೋತಿಷ್ಯ, ಹಸ್ತಸಾಮುದ್ರಿಕ ಅಥವಾ ಭವಿಷ್ಯ ಹೇಳುವುದಲ್ಲ. ತ್ರಿಕಾಲ ಜ್ಞಾನವು ಆಂತರಿಕ ಸಾಕ್ಷಾತ್ಕಾರ ಮತ್ತು ಗುರು ಕೃಪೆಯಿಂದ ಉದಯಿಸುತ್ತದೆ — ಆತ್ಮದ ನೇರ ದರ್ಶನ, ಭಯ ಹುಟ್ಟಿಸಲು ಅಲ್ಲ, ಶಾಂತಿ ಮತ್ತು ಧರ್ಮದೆಡೆಗೆ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.",
    "trikala.past": "ಭೂತ",
    "trikala.present": "ವರ್ತಮಾನ",
    "trikala.future": "ಭವಿಷ್ಯ",
    "trikala.past.line":
      "ಜನ್ಮಜನ್ಮಾಂತರಗಳಿಂದ ಹೊತ್ತ ಕರ್ಮದ ಬೇರುಗಳು ಮತ್ತು ಬಂಧಗಳು — ತೀರ್ಪಿಲ್ಲದೆ, ಮೃದುವಾಗಿ ಅರಿಯಲ್ಪಡುತ್ತವೆ.",
    "trikala.present.line":
      "ನಿಮ್ಮ ಇಂದಿನ ಸಂಕಷ್ಟಗಳ ನಿಜವಾದ ಕಾರಣವು ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಕರುಣೆಯಿಂದ ಬಯಲಾಗುತ್ತದೆ.",
    "trikala.future.line":
      "ನಿಮ್ಮ ಪರಮ ಹಿತದೆಡೆಗೆ ಕೊಂಡೊಯ್ಯುವ ಮಾರ್ಗ ಮತ್ತು ಅದಕ್ಕೆ ಸಿದ್ಧಗೊಳಿಸುವ ಸಾಧನೆ.",

    // ── Scriptural roots (Trikāla page) ─────────────────────────
    "scripture.eyebrow": "ಶಾಸ್ತ್ರಾಧಾರಿತ",
    "scripture.title": "ಶಾಸ್ತ್ರಗಳು ವರ್ಣಿಸುವ ದೃಷ್ಟಿ",
    "scripture.intro":
      "ತ್ರಿಕಾಲ ಜ್ಞಾನವು ಕಲ್ಪನೆಯೂ ಅಲ್ಲ, ಜ್ಯೋತಿಷ್ಯವೂ ಅಲ್ಲ. ಭೂತ, ವರ್ತಮಾನ ಮತ್ತು ಭವಿಷ್ಯದ ಜ್ಞಾನವನ್ನು ಭಗವದ್ಗೀತೆ ಮತ್ತು ಯೋಗಸೂತ್ರಗಳೇ ಹೆಸರಿಸುತ್ತವೆ — ಭಗವಂತನ ಸರ್ವಜ್ಞತೆಯಾಗಿ ಮತ್ತು ಯೋಗಸಾಕ್ಷಾತ್ಕಾರದ ಪರಮ ಫಲವಾಗಿ.",
    "scripture.bg.ref": "ಭಗವದ್ಗೀತೆ 7.26",
    "scripture.bg.meaning":
      "“ಅರ್ಜುನಾ, ಭೂತ, ವರ್ತಮಾನ ಮತ್ತು ಭವಿಷ್ಯ — ಎಲ್ಲ ಜೀವಿಗಳನ್ನೂ ನಾನು ಬಲ್ಲೆ.”",
    "scripture.bg.gloss": "ಶ್ರೀಕೃಷ್ಣನು ತ್ರಿಕಾಲದರ್ಶಿ — ಮೂರು ಕಾಲಗಳನ್ನೂ ಬಲ್ಲವನು.",
    "scripture.ys.ref": "ಯೋಗಸೂತ್ರ III.16",
    "scripture.ys.meaning":
      "“ಮೂರು ಪರಿಣಾಮಗಳ ಮೇಲಿನ ಸಂಯಮದಿಂದ ಭೂತ ಮತ್ತು ಭವಿಷ್ಯದ ಜ್ಞಾನ ಉದಯಿಸುತ್ತದೆ.”",
    "scripture.ys.gloss":
      "ಪತಂಜಲಿಯ ಯೋಗಸೂತ್ರ — ದಿವ್ಯ ದೃಷ್ಟಿಯು ಭವಿಷ್ಯ ಹೇಳುವುದಲ್ಲ, ಸಾಕ್ಷಾತ್ಕಾರದ ಫಲ.",
    "scripture.close":
      "ಶಾಸ್ತ್ರಗಳು ಹೆಸರಿಸುವುದನ್ನು ಸಾಕ್ಷಾತ್ಕಾರ ಪಡೆದ ಗುರು ಜೀವಿಸುತ್ತಾರೆ. ಗುರೂಜಿಯ ತ್ರಿಕಾಲ ಜ್ಞಾನವೇ ಕೃಪೆಯಿಂದ ಜಾಗೃತವಾದ ಈ ದೃಷ್ಟಿ — ಅಧ್ಯಯನದಿಂದಲ್ಲ.",

    // ── Trikāla PAGE (full) ─────────────────────────────────────
    "trikalapage.hero.eyebrow": "ಗುರೂಜಿಯ ದಿವ್ಯ ದೃಷ್ಟಿ",
    "trikalapage.hero.cta2": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾವನ್ನು ಅನ್ವೇಷಿಸಿ",
    "trikalapage.times.eyebrow": "ತ್ರಿಕಾಲ · ಮೂರು ಕಾಲಗಳು",
    "trikalapage.times.title": "ಒಂದೇ ನೋಟ, ಕಾಲದ ಮೂರು ದಿಗಂತಗಳು",
    "trikalapage.times.subtitle": "ಗುರೂಜಿಯ ದಿವ್ಯ ದೃಷ್ಟಿಯಿಂದ, ಆತ್ಮದ ಪಯಣದ ಸಂಪೂರ್ಣ ವಿಸ್ತಾರವು ಸ್ಪಷ್ಟವಾಗುತ್ತದೆ — ಮೃದುವಾಗಿ, ಕರುಣೆಯಿಂದ.",
    "trikalapage.sight.eyebrow": "ಸಾಕ್ಷಾತ್ಕಾರದ ದೃಷ್ಟಿ",
    "trikalapage.sight.title": "ಲೆಕ್ಕಾಚಾರದಿಂದಲ್ಲ, ಕೃಪೆಯಿಂದ ಕಾಣಲ್ಪಟ್ಟದ್ದು",
    "trikalapage.sight.p1": "ತ್ರಿಕಾಲ ಜ್ಞಾನವನ್ನು ಪುಸ್ತಕಗಳಿಂದ ಅಥವಾ ಕೋಷ್ಟಕಗಳಿಂದ ಕಲಿಯಲಾಗದು. ದಶಕಗಳ ಕ್ರಿಯಾ ಸಾಧನೆ, ಶ್ರೀ ತ್ರ್ಯಂಬಕ ಬಾಬಾಜಿ ಅವರ ಆಶೀರ್ವಾದ ಮತ್ತು ಶಿರಡಿ ಸಾಯಿಬಾಬಾ ಅವರ ಕೃಪೆಯಿಂದ ಅದು ಜಾಗೃತವಾಗುತ್ತದೆ.",
    "trikalapage.sight.p2": "ಗುರೂಜಿಯ ಮುಂದೆ ಕುಳಿತಾಗ, ನೀವು ವಿವರಿಸಬೇಕಾದದ್ದು ಏನೂ ಇಲ್ಲ. ಒಂದೇ ಕರುಣಾಪೂರ್ಣ ನೋಟದಿಂದ, ನಿಮ್ಮ ಜೀವನದ ಸೂಕ್ಷ್ಮ ಶಕ್ತಿಗಳು ಮತ್ತು ಕರ್ಮದ ಮುದ್ರೆಗಳು ಗ್ರಹಿಸಲ್ಪಡುತ್ತವೆ — ನಿಮ್ಮ ಜಾಗೃತಿಗೆ ನೆರವಾಗುವುದು ಮಾತ್ರ ಮೃದುವಾಗಿ ಬಯಲಾಗುತ್ತದೆ.",
    "trikalapage.clarifier.title": "ಇದು ಜ್ಯೋತಿಷ್ಯವಲ್ಲ",
    "trikalapage.receive.eyebrow": "ಆಶೀರ್ವಾದ",
    "trikalapage.receive.title": "ಸಾಧಕನು ಪಡೆಯುವುದೇನು",
    "trikalapage.receive.subtitle": "ಪ್ರತಿ ದರ್ಶನವನ್ನೂ ಪ್ರೀತಿಯಿಂದ ನೀಡಲಾಗುತ್ತದೆ — ಮತ್ತು ಯಾವಾಗಲೂ ಉಚಿತ.",
    "trikalapage.receive.b1": "ನಿಮ್ಮ ಜೀವನವನ್ನು ರೂಪಿಸುವ ಕರ್ಮದ ಮಾದರಿಗಳ ಬಗ್ಗೆ ಸ್ಪಷ್ಟತೆ",
    "trikalapage.receive.b2": "ನಿಮ್ಮ ಇಂದಿನ ಸಂಕಷ್ಟಗಳ ಹಿಂದಿನ ನಿಜವಾದ, ಗುಪ್ತ ಕಾರಣ",
    "trikalapage.receive.b3": "ನಿಮ್ಮ ಪರಮ ಹಿತದೆಡೆಗೆ ನಡೆಯಲು ವೈಯಕ್ತಿಕ ಸಾಧನೆ",
    "trikalapage.receive.b4": "ಆಳವಾದ ಶಾಂತಿ, ಭರವಸೆ ಮತ್ತು ಗುರುವಿನ ಜೀವಂತ ಕೃಪೆ",
    "trikalapage.cta.title": "ಗುರೂಜಿ ನಿಮ್ಮ ಮಾರ್ಗವನ್ನು ಕಾಣಲಿ",
    "trikalapage.cta.body": "ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ತೆರೆದ ಹೃದಯದೊಂದಿಗೆ ಬನ್ನಿ. ತ್ರಿಕಾಲ ಜ್ಞಾನದ ದಿವ್ಯ ದೃಷ್ಟಿಯನ್ನು ಪಡೆದು ಸ್ಪಷ್ಟತೆ, ಧೈರ್ಯ ಮತ್ತು ಕೃಪೆಯೊಂದಿಗೆ ಮುಂದೆ ಸಾಗಿ.",

    // ── Impact stats ────────────────────────────────────────────
    "stats.eyebrow": "ಕೃಪೆಯ ಜೀವಮಾನ",
    "stats.title": "ಭಾರತದಾದ್ಯಂತ ಸಾಧಕರ ಸೇವೆ",
    "stats.guided": "ಮಾರ್ಗದರ್ಶನ ಪಡೆದ ಭಕ್ತರು",
    "stats.reached": "ತಲುಪಿದ ಜನರು",
    "stats.fed": "ನಿತ್ಯ ಅನ್ನದಾನ",
    "stats.ashrams": "ಆಶ್ರಮಗಳು ಮತ್ತು ಮಂದಿರಗಳು",

    // ── Testimonials ────────────────────────────────────────────
    "testimonials.eyebrow": "ಭಕ್ತರ ಅನುಭವಗಳು",
    "testimonials.title": "ಕೃಪೆಯ ಕಥೆಗಳು",
    "testimonials.trustline":
      "ಭಾರತದಾದ್ಯಂತ ಕುಟುಂಬಗಳು, ಹಿರಿಯರು, ನಾಯಕರು ಮತ್ತು ಗಣ್ಯ ವ್ಯಕ್ತಿಗಳು ಗುರೂಜಿಯ ಮಾರ್ಗದರ್ಶನ ಬಯಸಿ ಬಂದಿದ್ದಾರೆ — ಪ್ರತಿ ಆತ್ಮವೂ ಅದೇ ಅಪಾರ ಕೃಪೆಯಿಂದ ಸ್ವೀಕರಿಸಲ್ಪಟ್ಟಿದೆ.",

    // ── Final CTA ───────────────────────────────────────────────
    "final.badge": "ಯಾವಾಗಲೂ ಉಚಿತ",
    "final.title": "ಗುರೂಜಿಯ ಕೃಪೆಯನ್ನು ಪಡೆಯಿರಿ",
    "final.body":
      "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಕುಳಿತು, ತ್ರಿಕಾಲ ಜ್ಞಾನ, ದಿವ್ಯ ಜ್ಞಾನ ಮತ್ತು ಕರುಣೆಯ ಮೂಲಕ ಜೀವನದ ಸವಾಲುಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ — ಪ್ರತಿ ಪ್ರಾಮಾಣಿಕ ಸಾಧಕನಿಗೂ ಉಚಿತವಾಗಿ ನೀಡಲಾಗುತ್ತದೆ.",

    // ── Meet Guruji (free-appointment form) ────────────────────────
    "meet.badge": "ಯಾವಾಗಲೂ ಉಚಿತ",
    "meet.title.a": "ನಿಮ್ಮ ಉಚಿತ",
    "meet.title.b": "ದಿವ್ಯ ದರ್ಶನ ಕಾಯ್ದಿರಿಸಿ",
    "meet.subtitle":
      "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರೊಂದಿಗೆ ವೈಯಕ್ತಿಕ ದರ್ಶನವನ್ನು ಕೋರಿ — ತ್ರಿಕಾಲ ಜ್ಞಾನ ದರ್ಶನ, ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ದೀಕ್ಷೆ, ಆಶೀರ್ವಾದ ಅಥವಾ ಆಧ್ಯಾತ್ಮಿಕ ಸಲಹೆಗಾಗಿ. ಯಾವ ಶುಲ್ಕವೂ ಇಲ್ಲ.",
    "meet.success.title": "ಕೋರಿಕೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    "meet.success.body":
      "ನಿಮ್ಮ ಕೋರಿಕೆಯನ್ನು ಭಕ್ತಿಯಿಂದ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಗುರೂಜಿಯೊಂದಿಗಿನ ನಿಮ್ಮ ದರ್ಶನದ ಕುರಿತು ನಮ್ಮ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    "meet.success.again": "ಮತ್ತೊಂದು ಕೋರಿಕೆ ಸಲ್ಲಿಸಿ",
    "meet.f.name": "ಪೂರ್ಣ ಹೆಸರು *",
    "meet.f.name.ph": "ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್",
    "meet.f.mobile": "ಮೊಬೈಲ್ / ವಾಟ್ಸಾಪ್ *",
    "meet.f.mobile.ph": "+91 98765 43210",
    "meet.f.profession": "ವೃತ್ತಿ / ಕೆಲಸ *",
    "meet.f.profession.ph": "ಉದಾ. ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್",
    "meet.f.place": "ಪ್ರಸ್ತುತ ಸ್ಥಳ *",
    "meet.f.place.ph": "ಪ್ರದೇಶ, ನಗರ, ತಾಲೂಕು, ಜಿಲ್ಲೆ",
    "meet.f.howknown": "ಗುರೂಜಿಯ ಬಗ್ಗೆ ನಿಮಗೆ ಹೇಗೆ ತಿಳಿಯಿತು? *",
    "meet.f.howknown.ph": "ಉದಾ. ಸ್ನೇಹಿತರು, ಯೂಟ್ಯೂಬ್, ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ",
    "meet.f.ashram": "ನಿಮಗೆ ಹತ್ತಿರದ ಆಶ್ರಮ ಯಾವುದು? *",
    "meet.f.ashram.ph": "ಹತ್ತಿರದ ಆಶ್ರಮವನ್ನು ಆಯ್ಕೆಮಾಡಿ...",
    "meet.f.message": "ಗುರೂಜಿಗೆ ತಿಳಿಸಬೇಕಾದ ಸಂದೇಶ (ಐಚ್ಛಿಕ)",
    "meet.f.message.ph": "ನಿಮ್ಮ ಆಧ್ಯಾತ್ಮಿಕ ಅನ್ವೇಷಣೆ ಅಥವಾ ಪ್ರಸ್ತುತ ಸವಾಲುಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...",
    "meet.submit": "ನನ್ನ ಉಚಿತ ದರ್ಶನವನ್ನು ಕೋರಿ",
    "meet.submitting": "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    "meet.note": "ತುರ್ತು ವಿಷಯಗಳಿಗಾಗಿ, ನೀವು ವಾಟ್ಸಾಪ್ ಮೂಲಕವೂ ಸಂಪರ್ಕಿಸಬಹುದು.",

    // ── Footer ──────────────────────────────────────────────────
    "footer.tagline":
      "ಸಾಧಕರಿಗಾಗಿ ಒಂದು ಆಧ್ಯಾತ್ಮಿಕ ಆಶ್ರಯ — ಕೃಪೆ, ಕ್ರಿಯಾ ಮತ್ತು ತ್ರಿಕಾಲ ಜ್ಞಾನದ ದಿವ್ಯ ದೃಷ್ಟಿಯಿಂದ ಮಾರ್ಗದರ್ಶಿತ.",
    "footer.explore": "ಅನ್ವೇಷಿಸಿ",
    "footer.connect": "ಸಂಪರ್ಕಿಸಿ",
    "footer.contact": "ಸಂಪರ್ಕ",
    "footer.free": "ಗುರೂಜಿಯೊಂದಿಗಿನ ಎಲ್ಲ ದರ್ಶನಗಳೂ ಉಚಿತ.",
    "footer.rights": "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    "footer.quote": "“ಸಕಲ ಜೀವಿಗಳೂ ಶಾಂತಿ ಮತ್ತು ದಿವ್ಯ ಕೃಪೆಯೆಡೆಗೆ ಮಾರ್ಗದರ್ಶಿತರಾಗಲಿ.”",
    "footer.disclaimer":
      "ಗುರೂಜಿ ನೀಡುವ ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನವು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ, ಕಾನೂನು ಅಥವಾ ಆರ್ಥಿಕ ಸಲಹೆಗೆ ಪೂರಕವಾಗಿದೆ, ಬದಲಿಯಲ್ಲ. ಎಲ್ಲ ದರ್ಶನಗಳನ್ನೂ ಉಚಿತವಾಗಿ ನೀಡಲಾಗುತ್ತದೆ.",

    // ── Misc ────────────────────────────────────────────────────
    "lang.label": "English",
    "lang.aria": "Switch to English",
    // [contact]
    "contact.hero.title": "ಸಂಪರ್ಕಿಸಿ",
    "contact.hero.titleAccent": "ನಮ್ಮನ್ನು",
    "contact.hero.subtitle": "ಸಾಮಾನ್ಯ ವಿಚಾರಣೆಗಳಿಗೆ, ಸೇವಾ ಅವಕಾಶಗಳಿಗೆ, ಅಥವಾ ನಿಮ್ಮ ಸಮೀಪದ ಆಶ್ರಮದೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಲು ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    "contact.details.heading": "ಸಂಪರ್ಕದಲ್ಲಿರಿ",
    "contact.details.phoneLabel": "ದೂರವಾಣಿ / ವಾಟ್ಸಾಪ್",
    "contact.details.emailLabel": "ಇಮೇಲ್",
    "contact.details.ashramLabel": "ಮುಖ್ಯ ಆಶ್ರಮ",
    "contact.details.ashramName": "ಸದ್ಗುರು ಶಿರಡಿ ಸಾಯಿ ಬಾಬಾ ಮಂದಿರ",
    "contact.details.ashramLocation": "ಶ್ರೀರಂಗಪಟ್ಟಣ, ಮಂಡ್ಯ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ",
    "contact.map.title": "ಸ್ಥಳ ನಕ್ಷೆ",
    "contact.map.subtitle": "ಶ್ರೀರಂಗಪಟ್ಟಣ ಮಂದಿರ, ಕರ್ನಾಟಕ (ಶೀಘ್ರದಲ್ಲೇ)",
    "contact.form.heading": "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    "contact.form.nameLabel": "ಪೂರ್ಣ ಹೆಸರು",
    "contact.form.namePlaceholder": "ನಿಮ್ಮ ಹೆಸರು",
    "contact.form.emailLabel": "ಇಮೇಲ್ ವಿಳಾಸ",
    "contact.form.emailPlaceholder": "your@email.com",
    "contact.form.subjectLabel": "ವಿಷಯ",
    "contact.form.subjectPlaceholder": "ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    "contact.form.messageLabel": "ಸಂದೇಶ",
    "contact.form.messagePlaceholder": "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    "contact.form.submit": "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    "contact.form.guidanceNote": "ನೀವು ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನವನ್ನು ಬಯಸುತ್ತಿದ್ದರೆ, ದಯವಿಟ್ಟು",
    "contact.form.guidanceLink": "ಗುರೂಜಿಯವರ ದರ್ಶನ",
    "contact.form.guidanceNoteEnd": "ಫಾರ್ಮ್ ಅನ್ನು ಬಳಸಿ.",
    // [guruvani]
    "guruvani.hero.titleLead": "ಗುರುವಾಣಿ: ",
    "guruvani.hero.titleAccent": "ಗುರುಗಳ ದಿವ್ಯ ವಾಣಿ",
    "guruvani.hero.subtitle": "ನಿಮ್ಮ ಆಧ್ಯಾತ್ಮಿಕ ಪಥವನ್ನು ಬೆಳಗಿಸುವ ಕಾಲಾತೀತ ಜ್ಞಾನ ಮತ್ತು ಪವಿತ್ರ ನುಡಿಮುತ್ತುಗಳು.",
    "guruvani.filters.all": "ಎಲ್ಲಾ",
    // [parampara]
    "parampara.hero.titleLead": "ಪವಿತ್ರ",
    "parampara.hero.titleHighlight": "ಗುರುಪರಂಪರೆ",
    "parampara.hero.subtitle": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾದ ದಿವ್ಯ ಪ್ರಸರಣವನ್ನು ಬ್ರಹ್ಮಾಂಡ ಮೂಲದಿಂದ ಇಂದಿನ ಸಜೀವ ಮಾರ್ಗದರ್ಶಕ ಗುರುಗಳವರೆಗೆ ಅನುಸರಿಸುತ್ತಾ.",
    "parampara.tree.heading": "ಗುರುಪರಂಪರೆಯ ಪವಿತ್ರ ವೃಕ್ಷ",
    "parampara.tree.subtitle": "ಸಂಪೂರ್ಣ ಗುರುಪರಂಪರೆಯನ್ನು ವಿವರವಾಗಿ ನೋಡಲು ಕೆಳಗಿನ ಪರಂಪರಾ ಚಿತ್ರವನ್ನು ಒತ್ತಿ ವಿಸ್ತರಿಸಿರಿ.",
    "parampara.tree.expandButton": "ಚಿತ್ರವನ್ನು ವಿಸ್ತರಿಸಲು ಒತ್ತಿರಿ",
    "parampara.cosmic.heading": "ಆದಿ ಗುರು ಈಶ್ವರ / ಶಿವ",
    "parampara.cosmic.subtitle": "ಕ್ರಿಯಾ ಜ್ಞಾನದ ಆದಿಮೂಲ",
    "parampara.lightbox.close": "ಮುಚ್ಚಿ",
    // [ashramspage]
    "ashramspage.hero.titlePrefix": "ಆಶ್ರಮಗಳು ಮತ್ತು ",
    "ashramspage.hero.titleAccent": "ಮಂದಿರಗಳು",
    "ashramspage.hero.subtitle": "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಶಾಂತಿ, ಭಕ್ತಿ ಹಾಗೂ ನಿಸ್ವಾರ್ಥ ಸೇವೆಯ ಪವಿತ್ರ ಧಾಮಗಳು.",
    "ashramspage.map.title": "ಸದ್ಗುರು ಸಾಯಿ ಸಂಸ್ಥಾನ ಆಶ್ರಮಗಳು",
    "ashramspage.map.caption": "ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಕೇಂದ್ರಗಳ ನಕ್ಷೆ ನೋಟ (ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ)",
    // [sevapage]
    "sevapage.hero.titleLead": "ಕಾರ್ಯದಲ್ಲಿ",
    "sevapage.hero.titleAccent": "ಕರುಣೆ",
    "sevapage.hero.subtitle": "\"ಮಾನವ ಸೇವೆಯೇ ಮಾಧವ ಸೇವೆ.\" ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್‌ ಮೂಲಕ ನಿಸ್ವಾರ್ಥ ದಾನದ ಆನಂದವನ್ನು ಅನುಭವಿಸಿರಿ.",
    "sevapage.initiatives.heading": "ನಮ್ಮ ಸೇವಾ ಕಾರ್ಯಗಳು",
    "sevapage.initiatives.annadana.title": "ಮಹಾ ಅನ್ನದಾನ",
    "sevapage.initiatives.annadana.body": "ಅನ್ನದಾನವೇ ದಾನಗಳಲ್ಲಿ ಶ್ರೇಷ್ಠವಾದ ಮಹಾದಾನವೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ. ಸಾಯಿ ಸಂಸ್ಥಾನ ಟ್ರಸ್ಟ್‌ ಮೂಲಕ, ಪ್ರತಿದಿನ 1,000ಕ್ಕೂ ಹೆಚ್ಚು ಹಸಿದ ಜೀವಗಳಿಗೆ ಪೌಷ್ಟಿಕ ಹಾಗೂ ಪವಿತ್ರ ಪ್ರಸಾದ ಭೋಜನವನ್ನು ನೀಡುತ್ತೇವೆ. ನಮ್ಮ ಆಶ್ರಮಗಳಿಗೆ ಭೇಟಿ ನೀಡುವ ಯಾರೂ ಹಸಿವಿನಿಂದ ಹಿಂದಿರುಗುವುದಿಲ್ಲ.",
    "sevapage.initiatives.education.title": "ಆಧ್ಯಾತ್ಮಿಕ ಶಿಕ್ಷಣ",
    "sevapage.initiatives.education.body": "ಜನಸಾಮಾನ್ಯರ ಮನಸ್ಸನ್ನು ಉನ್ನತಿಗೊಳಿಸಲು ನಾವು ಉಚಿತ ಆಧ್ಯಾತ್ಮಿಕ ತರಗತಿಗಳು, ಸತ್ಸಂಗಗಳು ಮತ್ತು ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ಕಾರ್ಯಾಗಾರಗಳನ್ನು ನಡೆಸುತ್ತೇವೆ; ಜೀವನದ ಸವಾಲುಗಳನ್ನು ಶಾಂತಿ ಹಾಗೂ ಸಮಚಿತ್ತದಿಂದ ಎದುರಿಸಲು ಸಾಧನಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.",
    "sevapage.cta.heading": "ಟ್ರಸ್ಟ್‌ಗೆ ನೆರವಾಗಿರಿ",
    "sevapage.cta.body": "ನಿಮ್ಮ ಕಾಣಿಕೆಗಳು ನಮ್ಮ ಅನ್ನದಾನ ಹಾಗೂ ಧರ್ಮಕಾರ್ಯಗಳನ್ನು ಮುಂದುವರಿಸಿ ವಿಸ್ತರಿಸಲು ಸಹಕಾರಿಯಾಗುತ್ತವೆ. ಈ ಪುಣ್ಯಕಾರ್ಯದಲ್ಲಿ ನಮ್ಮೊಂದಿಗೆ ಕೈಜೋಡಿಸಿರಿ.",
    "sevapage.cta.button": "ಈಗ ದೇಣಿಗೆ ನೀಡಿ",
    "sevapage.cta.note": "ದೇಣಿಗೆ ವಿವರಗಳು ಹಾಗೂ ಸುರಕ್ಷಿತ ಪಾವತಿ ವ್ಯವಸ್ಥೆ ಶೀಘ್ರದಲ್ಲೇ.",
    // [sanjeevini]
    "sanjeevini.hero.titleMain": "ಸಂಜೀವಿನಿ",
    "sanjeevini.hero.titleAccent": "ಕ್ರಿಯಾ",
    "sanjeevini.hero.subtitle": "ಅಮರ ಸಿದ್ಧ ಪರಂಪರೆಯ ಮೂಲಕ ಹರಿದು ಬಂದ, ಶ್ವಾಸ ಮತ್ತು ಪ್ರಜ್ಞೆಯ ಪ್ರಾಚೀನ ಪವಿತ್ರ ವಿಜ್ಞಾನ.",
    "sanjeevini.essence.heading": "ಸಾಧನೆಯ ಸಾರ",
    "sanjeevini.essence.para1": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾ ಕೇವಲ ಶ್ವಾಸದ ಅಭ್ಯಾಸವಲ್ಲ; ಇದು ಒಂದು ಗಾಢವಾದ ಆಧ್ಯಾತ್ಮಿಕ ವಿದ್ಯೆ. ಬೆನ್ನೆಲುಬಿನ ಸೂಕ್ಷ್ಮ ನಾಡಿಗಳ ಮೂಲಕ ಪ್ರಾಣಶಕ್ತಿಯನ್ನು (ಪ್ರಾಣ) ನಿರ್ದೇಶಿಸುವ ಮೂಲಕ, ಸಾಧಕನು ಕ್ರಮೇಣ ಕರ್ಮಗ್ರಂಥಿಗಳನ್ನು ಬಿಡಿಸುತ್ತಾ, ಸುಪ್ತವಾಗಿರುವ ಆಧ್ಯಾತ್ಮಿಕ ಶಕ್ತಿಯನ್ನು ಜಾಗೃತಗೊಳಿಸುತ್ತಾನೆ.",
    "sanjeevini.essence.para2": "ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರ ಜೀವಂತ ದೀಕ್ಷಾ ಸಂಚಾರದ ಮೂಲಕ, ಈ ಕ್ರಿಯಾದ ಬೀಜವು ಸಾಧಕನ ಹೃದಯದಲ್ಲಿ ಬಿತ್ತಲ್ಪಡುತ್ತದೆ; ಅದು ಅರಳಲು ಬೇಕಿರುವುದು ಕೇವಲ ನಿತ್ಯ ಸಾಧನೆಯ ನೀರು ಮತ್ತು ಭಕ್ತಿಯ ಸೂರ್ಯಪ್ರಕಾಶ ಮಾತ್ರ.",
    "sanjeevini.pillars.heading": "ಮೂರು ಆಧಾರ ಸ್ತಂಭಗಳು",
    "sanjeevini.pillars.breath": "ಶ್ವಾಸ (ಪ್ರಾಣಾಯಾಮ)",
    "sanjeevini.pillars.silence": "ಮೌನ (ಧ್ಯಾನ)",
    "sanjeevini.pillars.grace": "ಕೃಪೆ (ಕೃಪಾ)",
    "sanjeevini.benefits.heading": "ಸಾಧನೆಯ ಫಲಗಳು",
    "sanjeevini.cta.heading": "ನಿಮ್ಮ ಯಾತ್ರೆಯನ್ನು ಆರಂಭಿಸಿ",
    "sanjeevini.cta.text": "ಸಂಜೀವಿನಿ ಕ್ರಿಯಾವನ್ನು ಪೂಜ್ಯ ಶ್ರೀ ಗುರುಮೂರ್ತಿ ಗುರೂಜಿಯವರು ಅಥವಾ ಅಧಿಕೃತ ಆಚಾರ್ಯರು ಸ್ವತಃ ಬೋಧಿಸುತ್ತಾರೆ. ದೀಕ್ಷೆಯನ್ನು ಬಯಸಿ ಭೇಟಿಗೆ ಮನವಿ ಸಲ್ಲಿಸಿ.",
    "sanjeevini.cta.button": "ದೀಕ್ಷೆಗೆ ಮನವಿ ಸಲ್ಲಿಸಿ",
  },
} as const;

export type UiKey = keyof typeof ui.en;
