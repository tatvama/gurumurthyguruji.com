"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "@/lib/i18n";

type NextLinkProps = ComponentProps<typeof NextLink>;

/**
 * Drop-in replacement for next/link that prefixes internal hrefs with the
 * active locale (e.g. /about → /en/about). External links, hash links, and
 * already-localized hrefs pass through unchanged. Swapping the import is all
 * a component needs — JSX usage stays identical.
 */
export function Link({ href, ...props }: NextLinkProps) {
  const { lang } = useLanguage();
  let finalHref = href;

  if (typeof href === "string" && href.startsWith("/")) {
    const alreadyLocalized = /^\/(en|kn)(\/|$)/.test(href);
    if (!alreadyLocalized) {
      finalHref = href === "/" ? `/${lang}` : `/${lang}${href}`;
    }
  }

  return <NextLink href={finalHref} {...props} />;
}
