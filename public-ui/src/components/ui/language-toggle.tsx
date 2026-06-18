"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Compact EN ⇄ KN toggle. `tone` adapts the colours to a dark/transparent
 * header ("light" text) or a normal light surface ("dark" text).
 */
export function LanguageToggle({
  tone = "dark",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { t, toggle, lang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("lang.aria")}
      title={t("lang.aria")}
      className={cn(
        "group inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-200",
        tone === "light"
          ? "border-champagne/30 text-pearl/80 hover:border-champagne/60 hover:text-pearl"
          : "border-antique-gold/30 text-deep-brown/75 hover:border-antique-gold/60 hover:text-antique-gold",
        className,
      )}
    >
      <Languages
        className={cn(
          "h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12",
          tone === "light" ? "text-champagne/70" : "text-antique-gold/70",
        )}
        strokeWidth={1.8}
      />
      <span className={lang === "en" ? "font-heading" : ""}>{t("lang.label")}</span>
    </button>
  );
}
