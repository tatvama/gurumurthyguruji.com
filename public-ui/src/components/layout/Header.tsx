"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/components/ui/locale-link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { LanguageToggle } from "@/components/ui/language-toggle";
import {
  Menu, X, MessageCircle, ChevronDown,
  Wind, BookOpen, Users, MapPin, HeartHandshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Nav types ─────────────────────────────────────────────────────────
type NavChild = {
  key: UiKey;
  descKey: UiKey;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.FC<any>;
};
type NavItemDef = { key: UiKey; href?: string; children?: NavChild[] };

// ── Navigation structure (labels resolved via the dictionary) ──────────
const navItems: NavItemDef[] = [
  { key: "nav.about", href: "/about" },
  { key: "nav.trikala", href: "/trikala-jnana" },
  {
    key: "nav.path",
    children: [
      { key: "nav.sanjeevini", descKey: "nav.sanjeevini.desc", href: "/sanjeevini-kriya", Icon: Wind },
      { key: "nav.guruvani",   descKey: "nav.guruvani.desc",   href: "/guruvani",          Icon: BookOpen },
      { key: "nav.parampara",  descKey: "nav.parampara.desc",  href: "/guru-parampara",    Icon: Users },
    ],
  },
  {
    key: "nav.spaces",
    children: [
      { key: "nav.ashrams", descKey: "nav.ashrams.desc", href: "/ashrams", Icon: MapPin },
      { key: "nav.seva",    descKey: "nav.seva.desc",    href: "/seva",    Icon: HeartHandshake },
    ],
  },
  { key: "nav.contact", href: "/contact" },
];
// ─────────────────────────────────────────────────────────────────────

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname   = usePathname();
  // Strip the /en or /kn locale prefix so active-state checks match unprefixed hrefs.
  const pathNoLocale = pathname.replace(/^\/(en|kn)(?=\/|$)/, "") || "/";
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Transparent only when at the very top of the home page (dark hero beneath)
  const isTransparent = pathNoLocale === "/" && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveDropdown(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openDropdown  = (name: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActiveDropdown(name); };
  const scheduleClose = ()             => { closeTimer.current = setTimeout(() => setActiveDropdown(null), 130); };

  const isGroupActive = (item: NavItemDef) =>
    item.href ? pathNoLocale === item.href : !!item.children?.some((c) => pathNoLocale === c.href);

  const linkCn = (active: boolean) =>
    isTransparent
      ? active ? "text-champagne" : "text-pearl/72 hover:text-pearl"
      : active ? "text-antique-gold" : "text-deep-brown/80 hover:text-antique-gold";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-300 md:px-8",
        isTransparent
          ? "py-5"
          : isScrolled
            ? "border-b border-antique-gold/20 bg-pearl/96 py-3 shadow-[0_2px_28px_rgba(42,28,19,0.07)] backdrop-blur-xl"
            : "border-b border-antique-gold/15 bg-pearl/95 py-4 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">

        {/* ── Logo ──────────────────────────────────────────────────── */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full font-heading text-lg leading-none transition-all duration-300",
            isTransparent
              ? "border border-champagne/28 bg-champagne/10 text-champagne"
              : "bg-gold-gradient text-deep-brown shadow-sm",
          )}>
            ॐ
          </span>
          <span className={cn(
            "font-heading text-base font-bold tracking-wide transition-colors duration-300 sm:text-lg",
            isTransparent ? "text-pearl/88" : "text-deep-brown",
          )}>
            <span className="hidden sm:inline">Pujya Sri </span>Gurumurthy{" "}
            <span className={isTransparent ? "text-champagne" : "text-antique-gold"}>Guruji</span>
          </span>
        </Link>

        {/* ── Desktop navigation ───────────────────────────────────── */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = isGroupActive(item);
            const isOpen = activeDropdown === item.key;

            /* Direct link */
            if (item.href) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "nav-link-hover relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    linkCn(active),
                  )}
                >
                  {t(item.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={cn(
                        "absolute -bottom-0.5 left-3 right-3 h-[1.5px] rounded-full",
                        isTransparent ? "bg-champagne/70" : "bg-antique-gold",
                      )}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                </Link>
              );
            }

            /* Dropdown trigger + panel */
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => openDropdown(item.key)}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setActiveDropdown(isOpen ? null : item.key)}
                  aria-expanded={isOpen}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    linkCn(active),
                  )}
                >
                  {t(item.key)}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-full w-72 pt-2"
                      onMouseEnter={() => openDropdown(item.key)}
                      onMouseLeave={scheduleClose}
                    >
                      <div className="panel-frosted overflow-hidden shadow-[0_24px_60px_rgba(42,28,19,0.22)]">
                        <div className="h-[1.5px] bg-gradient-to-r from-transparent via-antique-gold/70 to-transparent" />

                        <div className="p-2">
                          {item.children?.map((child) => {
                            const childActive = pathNoLocale === child.href;
                            return (
                              <Link
                                key={child.key}
                                href={child.href}
                                onClick={() => setActiveDropdown(null)}
                                className={cn(
                                  "group flex items-start gap-3.5 rounded-xl border-l-[2px] border-transparent px-3.5 py-3 transition-all duration-200",
                                  "hover:border-antique-gold/50 hover:bg-antique-gold/5",
                                  childActive && "border-antique-gold/45 bg-antique-gold/5",
                                )}
                              >
                                <span className={cn(
                                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-200",
                                  childActive
                                    ? "bg-antique-gold text-pearl ring-antique-gold/30"
                                    : "bg-antique-gold/8 text-antique-gold ring-antique-gold/16 group-hover:bg-antique-gold group-hover:text-pearl group-hover:ring-0",
                                )}>
                                  <child.Icon className="h-[15px] w-[15px]" strokeWidth={1.6} />
                                </span>

                                <div className="min-w-0">
                                  <p className={cn(
                                    "font-heading text-[15px] font-semibold leading-tight transition-colors",
                                    childActive ? "text-antique-gold" : "text-deep-brown group-hover:text-antique-gold",
                                  )}>
                                    {t(child.key)}
                                  </p>
                                  <p className="mt-0.5 text-[12px] leading-relaxed text-deep-brown/50">
                                    {t(child.descKey)}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="border-t border-champagne/15 px-5 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-antique-gold/42">
                            {t("nav.trust")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* ── Toggle + CTA + mobile button ──────────────────────────── */}
        <div className="flex items-center gap-3">
          <LanguageToggle tone={isTransparent ? "light" : "dark"} className="hidden sm:inline-flex" />

          <Link
            href="/meet-guruji"
            className={cn(
              "hidden items-center gap-2.5 whitespace-nowrap lg:inline-flex",
              isTransparent ? "btn-outline-pill-dark" : "btn-gold-pill",
            )}
          >
            {t("cta.bookShort")}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-antique-gold opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-antique-gold" />
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={cn(
              "rounded-lg p-2 transition-colors lg:hidden",
              isTransparent ? "text-pearl/78 hover:text-pearl" : "text-deep-brown hover:text-antique-gold",
            )}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ── Mobile menu — slides in from the right ───────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-pearl px-6 pb-10 pt-6"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient font-heading text-base text-deep-brown">
                  ॐ
                </span>
                <span className="font-heading text-lg font-bold text-deep-brown">
                  Gurumurthy <span className="text-antique-gold">Guruji</span>
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <LanguageToggle tone="dark" />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-deep-brown hover:text-antique-gold"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <hr className="divider-gold my-6" />

            <nav className="flex flex-col overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.key} className="border-b border-champagne/18">
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-4 font-heading text-2xl font-medium transition-colors",
                        pathNoLocale === item.href ? "text-antique-gold" : "text-deep-brown",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key)}
                        className="flex w-full items-center justify-between py-4"
                      >
                        <span className={cn(
                          "font-heading text-2xl font-medium",
                          item.children?.some((c) => pathNoLocale === c.href) ? "text-antique-gold" : "text-deep-brown",
                        )}>
                          {t(item.key)}
                        </span>
                        <ChevronDown className={cn(
                          "h-5 w-5 text-antique-gold/55 transition-transform duration-200",
                          mobileExpanded === item.key && "rotate-180",
                        )} />
                      </button>

                      <AnimatePresence>
                        {mobileExpanded === item.key && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mb-3 space-y-1 pl-2">
                              {item.children?.map((child) => (
                                <Link
                                  key={child.key}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                                    pathNoLocale === child.href
                                      ? "bg-antique-gold/8 text-antique-gold"
                                      : "text-deep-brown/75 hover:text-antique-gold",
                                  )}
                                >
                                  <child.Icon className="h-5 w-5 shrink-0 text-antique-gold/55" strokeWidth={1.5} />
                                  <div>
                                    <p className="font-heading text-lg font-semibold">{t(child.key)}</p>
                                    <p className="text-xs text-deep-brown/45">{t(child.descKey)}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-8 space-y-3">
              <Link
                href="/meet-guruji"
                onClick={() => setMobileOpen(false)}
                className="btn-gold-pill flex w-full justify-center"
              >
                {t("cta.book")}
              </Link>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-pill flex w-full justify-center"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                {t("cta.whatsapp")}
              </a>
            </div>

            <div className="mt-auto pt-8 text-center">
              <p className="font-heading text-sm italic text-deep-brown/35">
                {t("footer.quote")}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-antique-gold/38">
                {t("nav.trust")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
