// Plain (non-client) locale constants/types. These must NOT live in the
// "use client" i18n module, because server code (the [locale] layout's
// generateStaticParams) imports the runtime VALUES — importing them from a
// client module yields client-reference proxies, not the real array.

export type Lang = "en" | "kn";
export type Bilingual<T = string> = { en: T; kn: T };

export const LOCALES: Lang[] = ["en", "kn"];
export const DEFAULT_LOCALE: Lang = "en";
export const LOCALE_COOKIE = "ggj-lang";

export function isLocale(value: string): value is Lang {
  return value === "en" || value === "kn";
}
