import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

const routes = [
  "",
  "/about",
  "/trikala-jnana",
  "/sanjeevini-kriya",
  "/guru-parampara",
  "/ashrams",
  "/seva",
  "/guruvani",
  "/meet-guruji",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => {
    const en = `${siteConfig.url}/en${route}`;
    const kn = `${siteConfig.url}/kn${route}`;
    return {
      url: en,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: { languages: { en, kn } },
    };
  });
}
