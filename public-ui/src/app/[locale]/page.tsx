import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AntaryamiSection } from "@/components/sections/AntaryamiSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { TrikalaTeaser } from "@/components/sections/TrikalaTeaser";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { HomeTestimonials } from "@/components/sections/HomeTestimonials";
import { FreeAudienceCTA } from "@/components/sections/FreeAudienceCTA";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata("/", isLocale(locale) ? locale : "en");
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* 1 · Who — grandeur + free audience */}
        <HeroSection />

        {/* 2 · The signature hook — he knows your pain before you speak it */}
        <AntaryamiSection variant="home" />

        {/* 3 · A brief word on Guruji */}
        <AboutPreview />

        {/* 4 · The divine sight, explained (with the "not astrology" clarifier) */}
        <TrikalaTeaser />

        {/* 5 · Social proof — impact + devotee stories */}
        <ImpactStats />
        <HomeTestimonials />

        {/* 6 · Free-audience invitation */}
        <FreeAudienceCTA />
      </main>
      <Footer />
    </>
  );
}
