"use client";

import { Link } from "@/components/ui/locale-link";
import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

// Brand glyphs (lucide v1 dropped brand icons) — inline simple-icons paths.
const socials = [
  {
    label: "YouTube",
    href: siteConfig.social.youtube,
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-brown px-4 pb-8 pt-16 md:px-8" style={{ color: "rgba(255,220,170,0.75)" }}>
      <div className="mx-auto mb-12 flex max-w-7xl flex-col items-center justify-between gap-10 pb-12 sm:flex-row sm:items-center">

        {/* Brand & mission */}
        <div className="flex flex-col items-center gap-5 sm:items-start">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-xl text-deep-brown"
              style={{
                background: "linear-gradient(135deg, #B99345 0%, #D4A853 45%, #D8B76A 100%)",
                boxShadow: "0 0 0 2px rgba(185,147,69,0.35), 0 4px 14px rgba(185,147,69,0.25)",
              }}
            >
              ॐ
            </span>
            <h2 style={{ color: "#ffffff", fontFamily: "var(--font-cinzel), serif", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.08em" }}>
              Gurumurthy <span style={{ color: "#D8B76A" }}>Guruji</span>
            </h2>
          </Link>
          <p className="max-w-sm text-center text-sm leading-relaxed sm:text-left" style={{ color: "rgba(255,220,170,0.75)" }}>
            {t("footer.tagline")}
          </p>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-[0_0_18px_rgba(249,115,22,0.50)]"
              style={{
                border: "1.5px solid rgba(249,115,22,0.65)",
                color: "#F97316",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px]" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mb-8 max-w-7xl border-t border-white/10" />

      <div className="mx-auto max-w-7xl space-y-4">
        <p className="text-center text-[11px] leading-relaxed" style={{ color: "rgba(255,220,170,0.45)" }}>
          {t("footer.disclaimer")}
        </p>
        <div className="flex flex-col items-center justify-between gap-3 text-xs md:flex-row" style={{ color: "rgba(255,220,170,0.60)" }}>
          <p>© {year} {siteConfig.trust}. {t("footer.rights")}</p>
          <p className="font-heading text-sm italic text-champagne/80">{t("footer.quote")}</p>
        </div>
      </div>
    </footer>
  );
}
