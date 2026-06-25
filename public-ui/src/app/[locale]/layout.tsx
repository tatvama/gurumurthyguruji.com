import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  Inter,
  Cormorant_Garamond,
  Caveat,
  Noto_Sans_Kannada,
  Noto_Serif,
  Cinzel,
  Cinzel_Decorative,
  Aboreto,
  DM_Serif_Display,
  Nunito,
  Montserrat,
  Lora,
  Adamina,
  Baskervville,
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

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const aboreto = Aboreto({
  variable: "--font-aboreto",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  preload: false,
});

// Kundli hero fonts — preload: false so they only load on the kundli page
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  preload: false,
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: false,
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: false,
});

const adamina = Adamina({
  variable: "--font-adamina",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});

const baskervville = Baskervville({
  variable: "--font-baskervville",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});

// Trikala reading form hint font
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

// Kannada faces — not preloaded; load when the Kannada locale is served.
const notoKannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
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
    "Spiritual Master Pujya Sri Gurumurthy Guruji — renowned for Trikāla Jñāna (divine sight of past, present & future) and Sanjeevini Kriya. Blessed by Shri Thrayambak Babaji & Shirdi Sai Baba. Receive a free spiritual appointment in Karnataka.",
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
      className={`${inter.variable} ${cormorant.variable} ${caveat.variable} ${notoKannada.variable} ${notoSerif.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${aboreto.variable} ${dmSerifDisplay.variable} ${nunito.variable} ${montserrat.variable} ${lora.variable} ${adamina.variable} ${baskervville.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col overflow-x-hidden bg-pearl font-sans text-deep-brown selection:bg-champagne/30">
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
