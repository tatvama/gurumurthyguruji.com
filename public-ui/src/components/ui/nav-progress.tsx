"use client";

/**
 * Gold navigation progress bar.
 * - Starts immediately on any internal anchor click.
 * - Completes and fades when usePathname() changes (navigation done).
 * - Zero dependencies beyond next/navigation.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavProgress() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathRef = useRef(pathname);
  const runningRef = useRef(false);

  function start() {
    if (runningRef.current) return;
    runningRef.current = true;
    setVisible(true);
    setPct(8);
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setPct((p) => (p < 82 ? p + Math.random() * 9 : p));
    }, 340);
    // Safety valve — auto-complete if no route change within 10 s
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(finish, 10_000);
  }

  function finish() {
    if (tickRef.current) clearInterval(tickRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    tickRef.current = null;
    timeoutRef.current = null;
    setPct(100);
    setTimeout(() => {
      setVisible(false);
      setPct(0);
      runningRef.current = false;
    }, 360);
  }

  // Detect navigation completion via pathname change
  useEffect(() => {
    if (pathRef.current !== pathname) {
      pathRef.current = pathname;
      if (runningRef.current) finish();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Detect navigation start via any anchor click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      // Skip external, mailto, tel, hash-only
      if (!href || /^(https?:|mailto:|tel:|#|javascript:)/.test(href)) return;
      // Skip same-page
      const targetPath = href.split("?")[0].split("#")[0];
      if (targetPath === window.location.pathname) return;
      start();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] h-[2.5px]"
      style={{
        width: `${pct}%`,
        opacity: visible ? 1 : 0,
        background:
          "linear-gradient(90deg, #B99345 0%, #E8CC80 50%, #D8B76A 100%)",
        boxShadow:
          "0 0 10px 1px rgba(185,147,69,0.60), 0 0 3px rgba(255,210,80,0.45)",
        transition: `width ${pct === 100 ? "0.22s" : "0.36s"} ease, opacity 0.3s ease`,
      }}
    />
  );
}
