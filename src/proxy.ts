import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next 16 renamed `middleware` → `proxy`. This redirects locale-less paths to a
// locale-prefixed URL (honouring the visitor's saved choice, else English),
// so every rendered route lives under /en/… or /kn/… for clean bilingual SEO.

const LOCALES = ["en", "kn"] as const;
const DEFAULT_LOCALE = "en";
const COOKIE = "ggj-lang";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(COOKIE)?.value;
  const locale =
    cookieLocale === "en" || cookieLocale === "kn" ? cookieLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, the metadata routes, and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)",
  ],
};
