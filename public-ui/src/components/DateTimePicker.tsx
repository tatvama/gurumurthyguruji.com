"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Calendar, CalendarPlus, ChevronDown, ChevronLeft, ChevronRight, Clock } from "lucide-react";

/* ── Reusable branded date / date-time picker.
   Supports teal (admin, default) and maroon (public UI) via accentColor/accentLight.
   `naked` strips the trigger button's own border so it can live inside a parent field box. */
export function DateTimePicker({ value, onChange, mode = "datetime", placeholder, minDate, maxDate, accentColor, accentLight, naked }: {
  value: string;
  onChange: (v: string) => void;
  mode?: "date" | "datetime";
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  accentColor?: string;
  accentLight?: string;
  naked?: boolean;
}) {
  const ACCENT = accentColor ?? "#0d9488";
  const LIGHT  = accentLight ?? "#f0fdfa";
  const WD  = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MON = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const p2  = (n: number) => String(n).padStart(2, "0");

  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const popRef  = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ left: 0, top: 0, width: 0, flip: false });
  const [showMonthDrop, setShowMonthDrop] = React.useState(false);
  const [showYearDrop,  setShowYearDrop]  = React.useState(false);
  const monthDropRef = React.useRef<HTMLDivElement>(null);
  const yearDropRef  = React.useRef<HTMLDivElement>(null);
  const monthListRef = React.useRef<HTMLDivElement>(null);
  const yearListRef  = React.useRef<HTMLDivElement>(null);

  const reposition = React.useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const POP_H = mode === "datetime" ? 330 : 270;
    const width = Math.min(Math.max(r.width, 260), window.innerWidth - 16);
    const spaceBelow = window.innerHeight - r.bottom;
    const flip = spaceBelow < POP_H && r.top > spaceBelow;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    setCoords({ left, top: flip ? r.top - 6 : r.bottom + 6, width, flip });
  }, [mode]);

  React.useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  const parsed = React.useMemo(() => {
    if (!value) return null;
    const [dp, tp] = value.split("T");
    const [y, m, d] = (dp || "").split("-").map(Number);
    let hh = 9, mm = 0;
    if (tp) { const [h, mi] = tp.split(":").map(Number); hh = isNaN(h) ? 9 : h; mm = isNaN(mi) ? 0 : mi; }
    if (!y || !m || !d) return null;
    return { y, m: m - 1, d, hh, mm };
  }, [value]);

  const now = new Date();
  const [view, setView] = React.useState({ year: parsed?.y ?? now.getFullYear(), month: parsed?.m ?? now.getMonth() });

  React.useEffect(() => { if (open && parsed) setView({ year: parsed.y, month: parsed.m }); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [open]);

  React.useEffect(() => {
    if (!showMonthDrop && !showYearDrop) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (monthDropRef.current && !monthDropRef.current.contains(t)) setShowMonthDrop(false);
      if (yearDropRef.current  && !yearDropRef.current.contains(t))  setShowYearDrop(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showMonthDrop, showYearDrop]);

  React.useEffect(() => {
    if (showMonthDrop && monthListRef.current)
      monthListRef.current.scrollTop = Math.max(0, (view.month - 1) * 34);
  }, [showMonthDrop]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (showYearDrop && yearListRef.current) {
      const idx = yearList.indexOf(view.year);
      yearListRef.current.scrollTop = Math.max(0, (idx - 1) * 34);
    }
  }, [showYearDrop]); // eslint-disable-line react-hooks/exhaustive-deps

  const emit = (y: number, mo: number, d: number, hh: number, mm: number) => {
    const dp = `${y}-${p2(mo + 1)}-${p2(d)}`;
    onChange(mode === "date" ? dp : `${dp}T${p2(hh)}:${p2(mm)}`);
  };

  const firstDow = new Date(view.year, view.month, 1).getDay();
  const dim      = new Date(view.year, view.month + 1, 0).getDate();
  const p2n = (n: number) => String(n).padStart(2, "0");
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const dayStr   = (d: number) => `${view.year}-${p2n(view.month + 1)}-${p2n(d)}`;

  const isSel      = (d: number) => !!parsed && parsed.y === view.year && parsed.m === view.month && parsed.d === d;
  const isToday    = (d: number) => `${view.year}-${view.month}-${d}` === todayKey;
  const isDisabled = (d: number) => {
    const ds = dayStr(d);
    if (minDate && ds < minDate) return true;
    if (maxDate && ds > maxDate) return true;
    return false;
  };

  /* Year-month bounds (YYYY-MM) for disabling month/year dropdown options */
  const minYM = minDate ? minDate.slice(0, 7) : null;   // e.g. "2026-06"
  const maxYM = maxDate ? maxDate.slice(0, 7) : null;
  const monthDisabled = (mo: number) => {
    const ym = `${view.year}-${p2n(mo + 1)}`;
    if (minYM && ym < minYM) return true;
    if (maxYM && ym > maxYM) return true;
    return false;
  };
  const yearDisabled = (y: number) => {
    if (minDate && y < Number(minDate.slice(0, 4))) return true;
    if (maxDate && y > Number(maxDate.slice(0, 4))) return true;
    return false;
  };

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 });
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 });

  const prevDisabled = minDate
    ? (view.year < Number(minDate.slice(0, 4)) ||
       (view.year === Number(minDate.slice(0, 4)) && view.month <= Number(minDate.slice(5, 7)) - 1))
    : false;
  const nextDisabled = maxDate
    ? (view.year > Number(maxDate.slice(0, 4)) ||
       (view.year === Number(maxDate.slice(0, 4)) && view.month >= Number(maxDate.slice(5, 7)) - 1))
    : false;

  const label = () => {
    if (!parsed) return placeholder || (mode === "date" ? "Select date" : "Select date & time");
    const dt = new Date(parsed.y, parsed.m, parsed.d, parsed.hh, parsed.mm);
    const dpart = dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if (mode === "date") return dpart;
    return `${dpart} · ${p2(parsed.hh)}:${p2(parsed.mm)}`;
  };

  const yearList = React.useMemo(() => Array.from({ length: 81 }, (_, i) => now.getFullYear() - 50 + i), []);

  /* Calendar header gradient — slightly lighter shade for stop 2 */
  const headerGradient = ACCENT === "#0d9488"
    ? "linear-gradient(135deg,#0d9488,#14b8a6)"
    : `linear-gradient(135deg,${ACCENT},${ACCENT}cc)`;

  /* Shared styles for custom dropdowns */
  const navBtn: React.CSSProperties = { background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 };
  const footBtn = (color: string): React.CSSProperties => ({ background: "transparent", border: "none", fontSize: 11, fontWeight: 700, color, cursor: "pointer", padding: "4px 7px", borderRadius: 6 });
  const dropTrigger: React.CSSProperties = { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, outline: "none" };
  const dropPanel: React.CSSProperties = { position: "absolute", top: "calc(100% + 5px)", left: 0, zIndex: 10002, background: "#fff", borderRadius: 8, border: `1.5px solid ${ACCENT}33`, boxShadow: `0 8px 28px ${ACCENT}30`, maxHeight: "min(204px, 40vh)", overflowY: "auto", minWidth: 110 };
  const dropItem = (sel: boolean): React.CSSProperties => ({ padding: "8px 14px", fontSize: 12, fontWeight: sel ? 700 : 400, color: sel ? "#fff" : "#374151", background: sel ? ACCENT : "transparent", cursor: "pointer", whiteSpace: "nowrap" });

  /* Trigger button styles — naked = no own border (parent provides it) */
  const triggerStyle: React.CSSProperties = naked ? {
    width: "100%", padding: 0, border: "none", background: "transparent",
    fontSize: 13.5, color: parsed ? "#2A1C13" : "rgba(42,28,19,0.38)",
    fontWeight: parsed ? 600 : 400, outline: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    fontFamily: "var(--font-nunito), Nunito, 'Segoe UI', sans-serif",
  } : {
    width: "100%", height: 40, padding: "0 13px", borderRadius: 9,
    border: `1.5px solid ${open ? ACCENT : "#e5e7eb"}`,
    background: open ? LIGHT : "#fff",
    fontSize: 13, color: parsed ? "#1f2937" : "#9ca3af",
    fontWeight: parsed ? 600 : 400, outline: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    boxSizing: "border-box" as const, transition: "border-color 0.15s, background 0.15s",
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <button type="button" onClick={() => { if (!open) reposition(); setOpen(o => !o); }} style={triggerStyle}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label()}</span>
        {mode === "date"
          ? <Calendar size={naked ? 18 : 15} color={ACCENT} style={{ flexShrink: 0 }} />
          : <CalendarPlus size={naked ? 18 : 15} color={ACCENT} style={{ flexShrink: 0 }} />}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div ref={popRef} style={{ position: "fixed", left: coords.left, top: coords.top, width: coords.width, transform: coords.flip ? "translateY(-100%)" : "none", zIndex: 9999, background: "#fff", borderRadius: 14, border: `1.5px solid ${ACCENT}40`, boxShadow: `0 12px 40px ${ACCENT}33` }}>

          {/* ── Coloured header ── */}
          <div style={{ background: headerGradient, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, borderRadius: "12px 12px 0 0", overflow: "visible" }}>
            <button type="button" onClick={prevDisabled ? undefined : prevMonth} disabled={prevDisabled} style={{ ...navBtn, opacity: prevDisabled ? 0.35 : 1, cursor: prevDisabled ? "not-allowed" : "pointer" }}><ChevronLeft size={15} color="#fff" /></button>

            <div style={{ display: "flex", gap: 5, alignItems: "center", flex: 1, justifyContent: "center" }}>

              {/* Month picker */}
              <div ref={monthDropRef} style={{ position: "relative" }}>
                <button type="button" style={dropTrigger}
                  onClick={() => { setShowMonthDrop(d => !d); setShowYearDrop(false); }}>
                  {MON[view.month]}
                  <ChevronDown size={9} color="#fff" />
                </button>
                {showMonthDrop && (
                  <div ref={monthListRef} style={dropPanel}>
                    {MON.map((m, i) => {
                      const dis = monthDisabled(i);
                      return (
                        <div key={i} style={{ ...dropItem(i === view.month), ...(dis ? { color: "#d1d5db", cursor: "not-allowed" } : {}) }}
                          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); if (dis) return; setView(v => ({ ...v, month: i })); setShowMonthDrop(false); }}
                          onMouseEnter={e => { if (!dis && i !== view.month) (e.currentTarget as HTMLElement).style.background = LIGHT; }}
                          onMouseLeave={e => { if (!dis && i !== view.month) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >{m}</div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Year picker */}
              <div ref={yearDropRef} style={{ position: "relative" }}>
                <button type="button" style={dropTrigger}
                  onClick={() => { setShowYearDrop(d => !d); setShowMonthDrop(false); }}>
                  {view.year}
                  <ChevronDown size={9} color="#fff" />
                </button>
                {showYearDrop && (
                  <div ref={yearListRef} style={{ ...dropPanel, minWidth: 76 }}>
                    {yearList.map(y => {
                      const dis = yearDisabled(y);
                      return (
                        <div key={y} style={{ ...dropItem(y === view.year), ...(dis ? { color: "#d1d5db", cursor: "not-allowed" } : {}) }}
                          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); if (dis) return; setView(v => ({ ...v, year: y })); setShowYearDrop(false); }}
                          onMouseEnter={e => { if (!dis && y !== view.year) (e.currentTarget as HTMLElement).style.background = LIGHT; }}
                          onMouseLeave={e => { if (!dis && y !== view.year) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >{y}</div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            <button type="button" onClick={nextDisabled ? undefined : nextMonth} disabled={nextDisabled} style={{ ...navBtn, opacity: nextDisabled ? 0.35 : 1, cursor: nextDisabled ? "not-allowed" : "pointer" }}><ChevronRight size={15} color="#fff" /></button>
          </div>

          <div style={{ padding: "8px 10px" }}>
            {/* Weekday labels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 2 }}>
              {WD.map(w => <div key={w} style={{ textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#9ca3af", padding: "2px 0" }}>{w}</div>)}
            </div>
            {/* Day grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {Array.from({ length: firstDow }).map((_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: dim }, (_, i) => i + 1).map(d => {
                const sel = isSel(d), td = isToday(d), dis = isDisabled(d);
                return (
                  <button key={d} type="button" disabled={dis}
                    onClick={() => { emit(view.year, view.month, d, parsed?.hh ?? 9, parsed?.mm ?? 0); if (mode === "date") setOpen(false); }}
                    onMouseEnter={e => { if (!sel && !dis) e.currentTarget.style.background = LIGHT; }}
                    onMouseLeave={e => { if (!sel && !dis) e.currentTarget.style.background = "transparent"; }}
                    style={{ height: 28, borderRadius: 7, border: td && !sel ? `1.5px solid ${ACCENT}` : "1.5px solid transparent", background: sel ? ACCENT : "transparent", color: dis ? "#d1d5db" : sel ? "#fff" : "#374151", fontSize: 11.5, fontWeight: sel || td ? 700 : 500, cursor: dis ? "not-allowed" : "pointer", transition: "background 0.12s" }}>
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Time input — only in datetime mode */}
            {mode === "datetime" && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Clock size={12} color={ACCENT} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280" }}>Time</span>
                </div>
                <div style={{ display: "inline-flex" }}>
                  <TimePicker
                    value={parsed ? `${p2(parsed.hh)}:${p2(parsed.mm)}` : ""}
                    onChange={v => {
                      const [h, m] = v.split(":").map(Number);
                      if (!isNaN(h) && !isNaN(m))
                        emit(view.year, view.month, parsed?.d ?? now.getDate(), h, m);
                    }}
                    accentColor={ACCENT}
                    accentLight={LIGHT}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 7, borderTop: "1px solid #f0f0f0" }}>
              <button type="button" onClick={() => onChange("")} style={footBtn("#9ca3af")}>Clear</button>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <button type="button" onClick={() => {
                  const n = new Date();
                  setView({ year: n.getFullYear(), month: n.getMonth() });
                  emit(n.getFullYear(), n.getMonth(), n.getDate(), mode === "date" ? 0 : n.getHours(), mode === "date" ? 0 : n.getMinutes());
                  if (mode === "date") setOpen(false);
                }} style={footBtn(ACCENT)}>{mode === "date" ? "Today" : "Now"}</button>
                <button type="button" onClick={() => setOpen(false)}
                  style={{ background: ACCENT, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 13px", borderRadius: 7 }}>Done</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── Standalone time picker — inline HH : MM  AM/PM ── */
export function TimePicker({ value, onChange, accentColor, accentLight, naked }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  accentColor?: string;
  accentLight?: string;
  naked?: boolean;
}) {
  const ACCENT = accentColor ?? "#0d9488";
  const LIGHT  = accentLight ?? "#f0fdfa";

  const hourRef = React.useRef<HTMLInputElement>(null);
  const minRef  = React.useRef<HTMLInputElement>(null);
  const lastVal = React.useRef(value);
  /* digit buffers — accumulate typed digits independently of cursor position */
  const hourBuf = React.useRef("");
  const minBuf  = React.useRef("");

  const parse12 = (v: string): { h: string; m: string; a: "AM" | "PM" } => {
    if (!v) return { h: "", m: "", a: "AM" };
    const [hh, mm] = v.split(":").map(Number);
    return {
      h: String(hh === 0 ? 12 : hh > 12 ? hh - 12 : hh).padStart(2, "0"),
      m: String(mm).padStart(2, "0"),
      a: hh < 12 ? "AM" : "PM",
    };
  };

  const init = parse12(value);
  const [hour, setHour] = React.useState(init.h);
  const [min,  setMin]  = React.useState(init.m);
  const [ampm, setAmpm] = React.useState<"AM" | "PM">(init.a);
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (value !== lastVal.current) {
      lastVal.current = value;
      const p = parse12(value);
      setHour(p.h); setMin(p.m); setAmpm(p.a);
      hourBuf.current = ""; minBuf.current = "";
    }
  }, [value]);

  const emit = (h: string, m: string, a: "AM" | "PM") => {
    const hN = parseInt(h, 10), mN = parseInt(m, 10);
    if (!h || isNaN(hN) || hN < 1 || hN > 12 || isNaN(mN) || mN < 0 || mN > 59) return;
    const h24 = hN === 12 ? (a === "AM" ? 0 : 12) : (a === "PM" ? hN + 12 : hN);
    const v = `${String(h24).padStart(2, "0")}:${String(mN).padStart(2, "0")}`;
    lastVal.current = v;
    onChange(v);
  };

  const goMin  = () => setTimeout(() => { minRef.current?.focus();  minRef.current?.select();  minBuf.current  = ""; }, 10);
  const goHour = () => setTimeout(() => { hourRef.current?.focus(); hourRef.current?.select(); hourBuf.current = ""; }, 10);

  const onHourKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goMin(); return; }
    if (e.key === "Tab") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = ((parseInt(hour, 10) || 0) % 12) + 1;
      const s = String(n).padStart(2, "0");
      setHour(s); emit(s, min, ampm); return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const cur = parseInt(hour, 10) || 1;
      const n = cur <= 1 ? 12 : cur - 1;
      const s = String(n).padStart(2, "0");
      setHour(s); emit(s, min, ampm); return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      setHour(""); hourBuf.current = ""; return;
    }
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const buf = (hourBuf.current + e.key).slice(-2);
      const n = parseInt(buf, 10);
      if (n >= 1 && n <= 12) {
        const s = String(n).padStart(2, "0");
        setHour(s); emit(s, min, ampm);
        if (buf.length >= 2 || n >= 2) { hourBuf.current = ""; goMin(); }
        else hourBuf.current = buf;
      }
    }
  };

  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) { setHour(""); hourBuf.current = ""; return; }
    const newChar = raw.slice(-1);
    const buf = (hourBuf.current + newChar).slice(-2);
    const n = parseInt(buf, 10);
    if (n >= 1 && n <= 12) {
      const s = String(n).padStart(2, "0");
      setHour(s); emit(s, min, ampm);
      if (buf.length >= 2 || n >= 2) { hourBuf.current = ""; goMin(); }
      else hourBuf.current = buf;
    }
  };

  const onMinKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goHour(); return; }
    if (e.key === "Tab") return;
    if (e.key === "Backspace") {
      e.preventDefault();
      if (!min || min === "00") { goHour(); return; }
      setMin(""); minBuf.current = ""; return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = ((parseInt(min, 10) || 0) + 1) % 60;
      const s = String(n).padStart(2, "0");
      setMin(s); emit(hour, s, ampm); return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const cur = parseInt(min, 10) || 0;
      const n = cur <= 0 ? 59 : cur - 1;
      const s = String(n).padStart(2, "0");
      setMin(s); emit(hour, s, ampm); return;
    }
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const buf = (minBuf.current + e.key).slice(-2);
      const n = parseInt(buf, 10);
      if (n >= 0 && n <= 59) {
        const s = String(n).padStart(2, "0");
        setMin(s); emit(hour, s, ampm);
        minBuf.current = buf.length >= 2 ? "" : buf;
      }
    }
  };

  const onMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) { setMin(""); minBuf.current = ""; return; }
    const newChar = raw.slice(-1);
    const buf = (minBuf.current + newChar).slice(-2);
    const n = parseInt(buf, 10);
    if (n >= 0 && n <= 59) {
      const s = String(n).padStart(2, "0");
      setMin(s); emit(hour, s, ampm);
      minBuf.current = buf.length >= 2 ? "" : buf;
    }
  };

  const toggleAmpm = (a: "AM" | "PM") => { setAmpm(a); emit(hour, min, a); };

  const inputStyle: React.CSSProperties = {
    width: naked ? 28 : 22, border: "none", outline: "none", textAlign: "center",
    fontSize: naked ? 13.5 : 13, fontWeight: 600,
    color: naked ? "#2A1C13" : "#1f2937",
    background: "transparent", padding: 0,
    fontFamily: naked ? "var(--font-nunito), Nunito, 'Segoe UI', sans-serif" : "inherit",
  };

  /* Outer container — naked = borderless (parent LabeledBox provides the frame) */
  const containerStyle: React.CSSProperties = naked ? {
    display: "flex", alignItems: "center", gap: 2,
    background: "transparent",
  } : {
    display: "flex", alignItems: "center",
    height: 40, padding: "0 10px 0 13px",
    borderRadius: 9,
    border: `1.5px solid ${focused ? ACCENT : "#e5e7eb"}`,
    background: focused ? LIGHT : "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.15s, background 0.15s",
    gap: 2,
  };

  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setFocused(false);
          hourBuf.current = ""; minBuf.current = "";
        }
      }}
      style={containerStyle}
    >
      <input ref={hourRef} type="text" inputMode="numeric" value={hour} placeholder="--"
        onChange={onHourChange} onKeyDown={onHourKey}
        onFocus={e => { e.target.select(); hourBuf.current = ""; }}
        maxLength={2} style={inputStyle} />
      <span style={{ fontSize: naked ? 13.5 : 13, fontWeight: 700, color: naked ? "rgba(42,28,19,0.45)" : "#9ca3af", lineHeight: 1, padding: "0 1px" }}>:</span>
      <input ref={minRef} type="text" inputMode="numeric" value={min} placeholder="--"
        onChange={onMinChange} onKeyDown={onMinKey}
        onFocus={e => { e.target.select(); minBuf.current = ""; }}
        maxLength={2} style={inputStyle} />

      <div style={{ width: 1, height: 18, background: naked ? "rgba(42,28,19,0.18)" : "#e5e7eb", margin: "0 8px", flexShrink: 0 }} />

      {(["AM", "PM"] as const).map((a, i) => (
        <button key={a} type="button" onClick={() => toggleAmpm(a)}
          style={{
            height: naked ? 28 : 26,
            padding: naked ? "0 9px" : "0 8px",
            fontSize: 11, fontWeight: 700,
            border: `1.5px solid ${ampm === a ? ACCENT : naked ? "rgba(200,170,130,0.45)" : "#e5e7eb"}`,
            borderRadius: 5,
            background: ampm === a ? LIGHT : "transparent",
            color: ampm === a ? ACCENT : naked ? "rgba(42,28,19,0.40)" : "#9ca3af",
            cursor: "pointer", marginLeft: i === 0 ? 0 : 3,
            transition: "all 0.12s",
          }}>
          {a}
        </button>
      ))}
    </div>
  );
}
