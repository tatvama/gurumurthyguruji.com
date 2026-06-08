"use client";

// ─────────────────────────────────────────────────────────────────────────
// Language context — now ROUTE-DRIVEN for SEO. The locale comes from the URL
// segment (/en/… or /kn/…) via the [locale] layout, so the server renders the
// correct language and search engines can crawl/index both. The toggle
// navigates between the two locale URLs (and remembers the choice in a cookie
// so the root redirect can honour it).
// ─────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ui, type UiKey } from "./dictionary";
import {
  type Lang,
  type Bilingual,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
} from "./locales";

// Re-export so existing imports from "@/lib/i18n" keep working.
export type { Lang, Bilingual };
export { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "./locales";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Look up a UI string by key (falls back to English). */
  t: (key: UiKey) => string;
  /** Pick the current language from a `{ en, kn }` content pair. */
  tr: <T>(pair: Bilingual<T>) => T;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  // Locale is owned by the route — no internal state needed.
  const lang = initialLang;
  const router = useRouter();
  const pathname = usePathname() || `/${DEFAULT_LOCALE}`;

  const pathForLocale = useCallback(
    (target: Lang) => {
      const parts = pathname.split("/");
      if (parts[1] === "en" || parts[1] === "kn") {
        parts[1] = target;
      } else {
        parts.splice(1, 0, target);
      }
      const next = parts.join("/");
      return next || `/${target}`;
    },
    [pathname],
  );

  const setLang = useCallback(
    (l: Lang) => {
      if (l === lang) return;
      try {
        document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
      } catch {
        /* ignore */
      }
      router.push(pathForLocale(l));
    },
    [lang, router, pathForLocale],
  );

  const toggle = useCallback(() => setLang(lang === "en" ? "kn" : "en"), [lang, setLang]);

  const t = useCallback((key: UiKey): string => ui[lang][key] ?? ui.en[key] ?? key, [lang]);

  const tr = useCallback(
    <T,>(pair: Bilingual<T>): T => {
      if (!pair) return pair;
      const value = pair[lang];
      return value === undefined || value === null || value === "" ? pair.en : value;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a <LanguageProvider>");
  }
  return ctx;
}
