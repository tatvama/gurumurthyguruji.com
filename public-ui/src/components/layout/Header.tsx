"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/components/ui/locale-link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import type { UiKey } from "@/lib/dictionary";
import { LanguageToggle } from "@/components/ui/language-toggle";
import {
  Menu, X, ChevronDown,
  Wind, BookOpen, Users, MapPin, HeartHandshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Nav data ───────────────────────────────────────────────────────────────────
type NavChild = {
  key: UiKey;
  descKey: UiKey;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.FC<any>;
};
type NavItemDef = { key: UiKey; href?: string; children?: NavChild[] };

const navItems: NavItemDef[] = [
  { key: "nav.about",   href: "/about" },
  { key: "nav.trikala", href: "/trikala-jnana" },
  {
    key: "nav.path",
    children: [
      { key: "nav.sanjeevini", descKey: "nav.sanjeevini.desc", href: "/sanjeevini-kriya", Icon: Wind },
      { key: "nav.guruvani",   descKey: "nav.guruvani.desc",   href: "/guruvani",         Icon: BookOpen },
      { key: "nav.parampara",  descKey: "nav.parampara.desc",  href: "/guru-parampara",   Icon: Users },
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

// ── Component ─────────────────────────────────────────────────────────────────
export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const pathNoLocale = pathname.replace(/^\/(en|kn)(?=\/|$)/, "") || "/";

  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // Portal requires client-side mount check (document is not available on server)
  const [isMounted,      setIsMounted]      = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mark as client-mounted
  useEffect(() => { setIsMounted(true); }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close drawer on route change — 50 ms debounce prevents AnimatePresence
  // from conflicting with the navigation render cycle
  useEffect(() => {
    const id = setTimeout(() => {
      setMobileOpen(false);
      setMobileExpanded(null);
      setActiveDropdown(null);
    }, 50);
    return () => clearTimeout(id);
  }, [pathname]);

  // Escape key closes desktop dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveDropdown(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Desktop dropdown hover helpers
  const openDropdown  = (key: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActiveDropdown(key); };
  const scheduleClose = ()            => { closeTimer.current = setTimeout(() => setActiveDropdown(null), 130); };

  const isGroupActive = (item: NavItemDef) =>
    item.href
      ? pathNoLocale === item.href
      : !!item.children?.some((c) => pathNoLocale === c.href);

  // Navbar is always dark — text is always light
  const linkCn = (active: boolean) =>
    active ? "text-champagne" : "text-pearl/65 hover:text-pearl";

  const closeDrawer = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  // ── Mobile drawer JSX ─────────────────────────────────────────────────────
  // Rendered via createPortal into document.body so it lives in the ROOT
  // stacking context — completely independent from the header's z-40 context.
  // This prevents the backdrop from ever obscuring the header bar itself.
  const drawerPortal = (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop — sits at z:9998 in root context */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.60)", backdropFilter: "blur(4px)" }}
            onClick={closeDrawer}
          />

          {/* Panel — sits at z:9999, slides from the right */}
          <motion.div
            key="mobile-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              width: "80vw",
              maxWidth: "300px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              background:
                "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
                "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
                "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
                "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)",
            }}
          >
            {/* OM watermark */}
            <div
              aria-hidden
              style={{
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                userSelect: "none",
              }}
            >
              <span className="font-heading text-[260px] leading-none text-antique-gold/[0.07]">ॐ</span>
            </div>

            {/* Drawer header row */}
            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-antique-gold/15 px-5 py-4">
              <Link href="/" onClick={closeDrawer} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-antique-gold/35 bg-antique-gold/15 font-heading text-base text-antique-gold">
                  ॐ
                </span>
                <div>
                  <p className="font-heading text-sm font-bold leading-tight text-white">
                    Gurumurthy <span className="text-antique-gold">Guruji</span>
                  </p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {t("nav.trust")}
                  </p>
                </div>
              </Link>
              <button
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-antique-gold/25 text-antique-gold/60 transition-colors hover:border-antique-gold hover:text-antique-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="relative z-10 min-h-0 flex-1 overflow-y-auto py-3">
              {navItems.map((item, idx) => {
                const active     = isGroupActive(item);
                const isExpanded = mobileExpanded === item.key;
                const num        = String(idx + 1).padStart(2, "0");

                if (item.href) {
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={closeDrawer}
                      className={cn(
                        "flex items-center justify-between px-5 py-3.5 transition-colors",
                        active ? "text-antique-gold" : "text-white/65 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-5 text-[10px] font-bold text-antique-gold/50">{num}</span>
                        <span className="font-heading text-[15px] font-medium">{t(item.key)}</span>
                      </div>
                      <span className={cn("text-sm", active ? "text-antique-gold" : "text-white/25")}>
                        →
                      </span>
                    </Link>
                  );
                }

                return (
                  <div key={item.key}>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.key)}
                      className={cn(
                        "flex w-full items-center justify-between px-5 py-3.5 transition-colors",
                        item.children?.some((c) => pathNoLocale === c.href)
                          ? "text-antique-gold"
                          : "text-white/65 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-5 text-[10px] font-bold text-antique-gold/50">{num}</span>
                        <span className="font-heading text-[15px] font-medium">{t(item.key)}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-white/30 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key={item.key + "-sub"}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="mb-1 ml-9 overflow-hidden border-l-2 border-antique-gold/20"
                        >
                          {item.children?.map((child) => (
                            <Link
                              key={child.key}
                              href={child.href}
                              onClick={closeDrawer}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 transition-colors",
                                pathNoLocale === child.href
                                  ? "text-antique-gold"
                                  : "text-white/45 hover:text-white",
                              )}
                            >
                              <child.Icon
                                className="h-4 w-4 shrink-0 text-antique-gold/50"
                                strokeWidth={1.5}
                              />
                              <span className="font-heading text-sm">{t(child.key)}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Bottom: language + book CTA */}
            <div className="relative z-10 shrink-0 space-y-3 border-t border-antique-gold/15 px-5 pb-8 pt-5">
              <div className="flex justify-center">
                <LanguageToggle tone="light" />
              </div>
              <Link
                href="/meet-guruji"
                onClick={closeDrawer}
                className="btn-gold-pill flex w-full justify-center"
              >
                {t("cta.book")}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Fixed top bar — z-40 in root stacking context, always cosmic-dark */}
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-40 px-4 transition-all duration-300 sm:px-6 md:px-8",
          isScrolled
            ? "border-b border-antique-gold/20 py-2.5 shadow-[0_4px_32px_rgba(75,13,19,0.55)] backdrop-blur-xl"
            : "border-b border-antique-gold/10 py-3.5 backdrop-blur-md",
        )}
        style={{
          background:
            "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
            "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
            "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
            "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex min-w-0 shrink items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 font-heading text-sm leading-none text-champagne transition-all duration-300 sm:h-9 sm:w-9 sm:text-base">
              ॐ
            </span>
            <span className="truncate font-heading text-[13px] font-bold tracking-wide text-pearl/90 transition-colors duration-300 sm:text-[15px] lg:text-base">
              <span className="hidden sm:inline">Pujya Sri </span>Gurumurthy{" "}
              <span className="text-champagne">Guruji</span>
            </span>
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = isGroupActive(item);
              const isOpen = activeDropdown === item.key;

              if (item.href) {
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                      linkCn(active),
                    )}
                  >
                    {t(item.key)}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-3 right-3 h-[1.5px] rounded-full bg-champagne/70"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                  </Link>
                );
              }

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
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key={item.key + "-dropdown"}
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
                                      childActive
                                        ? "text-antique-gold"
                                        : "text-deep-brown group-hover:text-antique-gold",
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

          {/* Right side */}
          <div className="flex shrink-0 items-center">
            {/* Desktop: language toggle + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle tone="light" />
              <Link
                href="/meet-guruji"
                className="btn-outline-pill-dark inline-flex items-center gap-2 whitespace-nowrap"
              >
                {t("cta.bookShort")}
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-champagne" />
                </span>
              </Link>
            </div>

            {/* Mobile/tablet hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-pearl/80 transition-colors hover:bg-white/10 hover:text-pearl lg:hidden"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — portal to document.body (root stacking context) */}
      {isMounted && createPortal(drawerPortal, document.body)}
    </>
  );
}
