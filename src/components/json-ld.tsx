import { siteConfig, ashrams, faqs } from "@/lib/data";

/**
 * Rich structured data (JSON-LD) for SEO — rendered once per page in the
 * [locale] layout. Builds a @graph of Organization, Person, WebSite, the
 * Trust's ashram locations (PlaceOfWorship), the core Services, and an
 * FAQPage. Replace telephone/email/social once the real details are known
 * (currently siteConfig placeholders).
 */
export function JsonLd({ locale = "en" }: { locale?: string }) {
  const base = siteConfig.url;
  const inLanguage = locale === "kn" ? "kn-IN" : "en-IN";
  const social = [
    siteConfig.social.youtube,
    siteConfig.social.instagram,
    siteConfig.social.facebook,
  ].filter((u) => u && u !== "#");

  const ashramNodes = ashrams
    .filter((a) => a.status === "Active")
    .map((a) => ({
      "@type": ["PlaceOfWorship", "LocalBusiness"],
      "@id": `${base}/#ashram-${a.id}`,
      name: a.name,
      parentOrganization: { "@id": `${base}/#trust` },
      address: {
        "@type": "PostalAddress",
        addressLocality: a.location,
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      priceRange: "Free",
      areaServed: "IN",
    }));

  const services = [
    {
      name: "Trikāla Jñāna Darshan",
      description:
        "Guruji's divine sight into a seeker's past, present and future — guidance toward peace and dharma, free of charge.",
    },
    {
      name: "Sanjeevini Kriya Initiation",
      description:
        "Initiation into the sacred Kriya of breath, silence and Guru's grace in the lineage of Mahavatar Babaji.",
    },
    {
      name: "Spiritual Guidance",
      description:
        "Compassionate counsel for life's challenges — career, family, health and inner purpose — given freely.",
    },
  ].map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@id": `${base}/#guruji` },
    areaServed: ["IN", "Worldwide"],
    isAccessibleForFree: true,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: siteConfig.name,
        inLanguage: ["en-IN", "kn-IN"],
        publisher: { "@id": `${base}/#trust` },
      },
      {
        "@type": ["Organization", "NGO"],
        "@id": `${base}/#trust`,
        name: siteConfig.trust,
        url: base,
        logo: `${base}/images/guruji-portrait.png`,
        description:
          "A spiritual and charitable trust serving seekers through Sanjeevini Kriya, free spiritual guidance, and daily Annadana (feeding over 1,000 people) across Karnataka.",
        founder: { "@id": `${base}/#guruji` },
        sameAs: social,
      },
      {
        "@type": "Person",
        "@id": `${base}/#guruji`,
        name: siteConfig.name,
        honorificPrefix: "Pujya Sri",
        jobTitle: siteConfig.role,
        description:
          "Spiritual Master and Kriya Yoga guide, blessed by Shri Thrayambak Babaji and Shirdi Sai Baba, in the Kriya lineage of Mahavatar Babaji. Renowned for Trikāla Jñāna — the divine perception of past, present and future — and for teaching Sanjeevini Kriya.",
        url: base,
        image: `${base}/images/guruji-portrait.png`,
        knowsAbout: [
          "Kriya Yoga",
          "Sanjeevini Kriya",
          "Trikāla Jñāna",
          "Spiritual Guidance",
          "Meditation",
          "Sai Baba devotion",
        ],
        worksFor: { "@id": `${base}/#trust` },
      },
      ...ashramNodes,
      ...services,
      {
        "@type": "FAQPage",
        "@id": `${base}/#faq`,
        inLanguage,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
