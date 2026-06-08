import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata("/contact", isLocale(locale) ? locale : "en");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}