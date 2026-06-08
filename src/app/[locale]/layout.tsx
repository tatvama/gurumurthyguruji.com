import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  Inter,
  Cormorant_Garamond,
  Noto_Sans_Kannada,
  Noto_Serif_Kannada,
} from "next/font/google";
import "../globals.css";
import { siteConfig } from "@/lib/data";
import { JsonLd } from "@/components/json-ld";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { NavProgress } from "@/components/ui/nav-progress";
import { LanguageProvider } from "@/lib/i18n";
import { LOCALES, isLocale } from "@/lib/locales";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Kannada faces — not preloaded; load when the Kannada locale is served.
const notoKannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const notoKannadaSerif = Noto_Serif_Kannada({
  variable: "--font-kannada-serif",
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Pujya Sri Gurumurthy Guruji | Spiritual Master & Kriya Yoga Guide",
    template: "%s | Pujya Sri Gurumurthy Guruji",
  },
  description:
    "Spiritual Master Pujya Sri Gurumurthy Guruji — renowned for Trikāla Jñāna (divine sight of past, present & future) and Sanjeevini Kriya. Blessed by Shri Thrayambak Babaji & Shirdi Sai Baba. Receive a free spiritual audience in Karnataka.",
  keywords: [
    "Pujya Sri Gurumurthy Guruji",
    "Gurumurthy Guruji",
    "Trikāla Jñāna",
    "Trikala Jnana",
    "Sanjeevini Kriya",
    "Kriya Yoga guide India",
    "spiritual master Karnataka",
    "spiritual guru India",
    "Sai Baba ashram Karnataka",
    "free spiritual guidance",
    "Sadhguru Sai Samsthana Trust",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "kn_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Pujya Sri Gurumurthy Guruji | Spiritual Master & Kriya Yoga Guide",
    description:
      "Trikāla Jñāna, Sanjeevini Kriya & free spiritual guidance from Pujya Sri Gurumurthy Guruji — blessed by Shri Thrayambak Babaji & Shirdi Sai Baba.",
    images: [{ url: "/images/guruji-portrait.png", alt: "Pujya Sri Gurumurthy Guruji" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pujya Sri Gurumurthy Guruji | Spiritual Master & Kriya Yoga Guide",
    description:
      "Trikāla Jñāna, Sanjeevini Kriya & free spiritual guidance from Pujya Sri Gurumurthy Guruji.",
    images: ["/images/guruji-portrait.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FEFCF7",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${cormorant.variable} ${notoKannada.variable} ${notoKannadaSerif.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-pearl font-sans text-deep-brown selection:bg-champagne/30">
        <NavProgress />
        <LanguageProvider initialLang={locale}>
          {children}
          <WhatsAppFloat />
        </LanguageProvider>
        <JsonLd locale={locale} />
      </body>
    </html>
  );
}
