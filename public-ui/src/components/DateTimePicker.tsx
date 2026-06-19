"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Calendar, CalendarPlus, ChevronLeft, ChevronRight, Clock } from "lucide-react";

/* ── Branded calendar — scrollable hour/minute column ──────────── */
function TimeCol({ refEl, label, items, sel, onPick }: {
  refEl: React.RefObject<HTMLDivElement | null>;
  label: string; items: number; sel: number | null; onPick: (n: number) => void;
}) {
  const p2 = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: 3 }}>{label}</div>
      <div ref={refEl} className="dtp-scroll" style={{ height: 92, overflowY: "auto", border: "1px solid #f0f0f0", borderRadius: 7, padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: items }, (_, i) => i).map(n => {
          const on = sel === n;
          return (
            <button key={n} type="button" data-sel={on} onClick={() => onPick(n)}
              onMouseEnter={e => { if (!on) e.currentTarget.style.background = "#f0fdfa"; }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}
              style={{ flexShrink: 0, height: 22, borderRadius: 5, border: "none", background: on ? "#0d9488" : "transparent", color: on ? "#fff" : "#374151", fontSize: 11, fontWeight: on ? 700 : 500, cursor: "pointer", transition: "background 0.1s" }}>
              {p2(n)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Reusable branded date / date-time picker (teal, matches site) ──
   Replaces the native datetime-local popup (which can't be themed on
   Windows). value format: "YYYY-MM-DD" (date) or "YYYY-MM-DDTHH:mm". */
export function DateTimePicker({ value, onChange, mode = "datetime", placeholder, maxDate }: {
  value: string;
  onChange: (v: string) => void;
  mode?: "date" | "datetime";
  placeholder?: string;
  maxDate?: string;
}) {
  const TEAL = "#0d9488";
  const WD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MON = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const p2 = (n: number) => String(n).padStart(2, "0");

  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);
  const hourColRef = React.useRef<HTMLDivElement>(null);
  const minColRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ left: 0, top: 0, width: 0, flip: false });

  const reposition = React.useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const POP_H = mode === "datetime" ? 370 : 290;
    const width = Math.min(Math.max(r.width, 244), window.innerWidth - 16);
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
    if (!open || mode !== "datetime") return;
    const id = requestAnimationFrame(() => {
      [hourColRef, minColRef].forEach(ref => {
        const col = ref.current;
        const selEl = col?.querySelector("[data-sel='true']") as HTMLElement | null;
        if (col && selEl) col.scrollTop = selEl.offsetTop - col.clientHeight / 2 + selEl.clientHeight / 2;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [open, mode, value]);

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

  const emit = (y: number, mo: number, d: number, hh: number, mm: number) => {
    const dp = `${y}-${p2(mo + 1)}-${p2(d)}`;
    onChange(mode === "date" ? dp : `${dp}T${p2(hh)}:${p2(mm)}`);
  };

  const firstDow = new Date(view.year, view.month, 1).getDay();
  const dim = new Date(view.year, view.month + 1, 0).getDate();
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const maxKey = maxDate ? new Date(maxDate + "T23:59:59") : null;

  const isSel = (d: number) => !!parsed && parsed.y === view.year && parsed.m === view.month && parsed.d === d;
  const isToday = (d: number) => `${view.year}-${view.month}-${d}` === todayKey;
  const isDisabled = (d: number) => maxKey ? new Date(view.year, view.month, d) > maxKey : false;

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 });
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 });

  const label = () => {
    if (!parsed) return placeholder || (mode === "date" ? "Select date" : "Select date & time");
    const dt = new Date(parsed.y, parsed.m, parsed.d, parsed.hh, parsed.mm);
    const dpart = dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if (mode === "date") return dpart;
    return `${dpart} · ${dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
  };

  const navBtn: React.CSSProperties = { background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 };
  const footBtn = (color: string): React.CSSProperties => ({ background: "transparent", border: "none", fontSize: 11, fontWeight: 700, color, cursor: "pointer", padding: "4px 7px", borderRadius: 6 });

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button type="button" onClick={() => { if (!open) reposition(); setOpen(o => !o); }}
        style={{ width: "100%", height: 40, padding: "0 13px", borderRadius: 9, border: `1.5px solid ${open ? TEAL : "#e5e7eb"}`, background: open ? "#f0fdfa" : "#fff", fontSize: 13, color: parsed ? "#1f2937" : "#9ca3af", fontWeight: parsed ? 600 : 400, outline: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label()}</span>
        {mode === "date" ? <Calendar size={15} color={TEAL} style={{ flexShrink: 0 }} /> : <CalendarPlus size={15} color={TEAL} style={{ flexShrink: 0 }} />}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div ref={popRef} style={{ position: "fixed", left: coords.left, top: coords.top, width: coords.width, transform: coords.flip ? "translateY(-100%)" : "none", zIndex: 9999, background: "#fff", borderRadius: 14, border: "1.5px solid rgba(13,148,136,0.25)", boxShadow: "0 12px 40px rgba(13,148,136,0.20)", overflow: "hidden" }}>
          {/* Teal header */}
          <div style={{ background: "linear-gradient(135deg,#0d9488,#14b8a6)", padding: "7px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button type="button" onClick={prevMonth} style={navBtn}><ChevronLeft size={15} color="#fff" /></button>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{MON[view.month]} {view.year}</span>
            <button type="button" onClick={nextMonth} style={navBtn}><ChevronRight size={15} color="#fff" /></button>
          </div>

          <div style={{ padding: "8px 10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 2 }}>
              {WD.map(w => <div key={w} style={{ textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#9ca3af", padding: "2px 0" }}>{w}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {Array.from({ length: firstDow }).map((_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: dim }, (_, i) => i + 1).map(d => {
                const sel = isSel(d), td = isToday(d), dis = isDisabled(d);
                return (
                  <button key={d} type="button" disabled={dis}
                    onClick={() => { emit(view.year, view.month, d, parsed?.hh ?? 9, parsed?.mm ?? 0); if (mode === "date") setOpen(false); }}
                    onMouseEnter={e => { if (!sel && !dis) e.currentTarget.style.background = "#f0fdfa"; }}
                    onMouseLeave={e => { if (!sel && !dis) e.currentTarget.style.background = "transparent"; }}
                    style={{ height: 27, borderRadius: 7, border: td && !sel ? `1.5px solid ${TEAL}` : "1.5px solid transparent", background: sel ? TEAL : "transparent", color: dis ? "#d1d5db" : sel ? "#fff" : "#374151", fontSize: 11.5, fontWeight: sel || td ? 700 : 500, cursor: dis ? "not-allowed" : "pointer", transition: "background 0.12s" }}>
                    {d}
                  </button>
                );
              })}
            </div>

            {mode === "datetime" && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <Clock size={12} color={TEAL} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280" }}>Time</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: TEAL }}>{parsed ? `${p2(parsed.hh)}:${p2(parsed.mm)}` : "--:--"}</span>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <TimeCol refEl={hourColRef} label="Hour" items={24} sel={parsed?.hh ?? null}
                    onPick={h => emit(view.year, view.month, parsed?.d ?? now.getDate(), h, parsed?.mm ?? 0)} />
                  <TimeCol refEl={minColRef} label="Min" items={60} sel={parsed?.mm ?? null}
                    onPick={mi => emit(view.year, view.month, parsed?.d ?? now.getDate(), parsed?.hh ?? 9, mi)} />
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
                }} style={footBtn(TEAL)}>{mode === "date" ? "Today" : "Now"}</button>
                <button type="button" onClick={() => setOpen(false)} style={{ background: TEAL, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 13px", borderRadius: 7 }}>Done</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── Standalone time picker — matches DateTimePicker branding ──────
   value: "HH:mm" | ""   onChange: (v: string) => void
   error: show red border when field is required but empty           */
export function TimePicker({ value, onChange, placeholder, error }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  const TEAL = "#0d9488";
  const p2 = (n: number) => String(n).padStart(2, "0");

  const [open, setOpen] = React.useState(false);
  const wrapRef  = React.useRef<HTMLDivElement>(null);
  const popRef   = React.useRef<HTMLDivElement>(null);
  const hourRef  = React.useRef<HTMLDivElement>(null);
  const minRef   = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ left: 0, top: 0, width: 0, flip: false });

  const parsed = React.useMemo(() => {
    if (!value) return null;
    const [h, m] = value.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return { hh: h, mm: m };
  }, [value]);

  const reposition = React.useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const POP_H = 175;
    const width = Math.min(Math.max(r.width, 180), window.innerWidth - 16);
    const spaceBelow = window.innerHeight - r.bottom;
    const flip = spaceBelow < POP_H && r.top > spaceBelow;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    setCoords({ left, top: flip ? r.top - 6 : r.bottom + 6, width, flip });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => { window.removeEventListener("scroll", reposition, true); window.removeEventListener("resize", reposition); };
  }, [open, reposition]);

  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      [hourRef, minRef].forEach(ref => {
        const col = ref.current;
        const sel = col?.querySelector("[data-sel='true']") as HTMLElement | null;
        if (col && sel) col.scrollTop = sel.offsetTop - col.clientHeight / 2 + sel.clientHeight / 2;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [open, value]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const emit = (hh: number, mm: number) => onChange(`${p2(hh)}:${p2(mm)}`);

  const borderColor = open ? TEAL : error ? "#ef4444" : "#e5e7eb";

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button type="button" onClick={() => { if (!open) reposition(); setOpen(o => !o); }}
        style={{ width: "100%", height: 40, padding: "0 13px", borderRadius: 9, border: `1.5px solid ${borderColor}`, background: open ? "#f0fdfa" : "#fff", fontSize: 13, color: parsed ? "#1f2937" : "#9ca3af", fontWeight: parsed ? 600 : 400, outline: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s" }}>
        <span>{parsed ? `${p2(parsed.hh)}:${p2(parsed.mm)}` : (placeholder || "Select time")}</span>
        <Clock size={15} color={TEAL} style={{ flexShrink: 0 }} />
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div ref={popRef} style={{ position: "fixed", left: coords.left, top: coords.top, width: coords.width, transform: coords.flip ? "translateY(-100%)" : "none", zIndex: 9999, background: "#fff", borderRadius: 14, border: "1.5px solid rgba(13,148,136,0.25)", boxShadow: "0 12px 40px rgba(13,148,136,0.20)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#0d9488,#14b8a6)", padding: "7px 12px", display: "flex", alignItems: "center", gap: 7 }}>
            <Clock size={13} color="#fff" />
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Select Time</span>
            <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "#fff" }}>{parsed ? `${p2(parsed.hh)}:${p2(parsed.mm)}` : "--:--"}</span>
          </div>
          <div style={{ padding: "10px 10px 8px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <TimeCol refEl={hourRef} label="Hour" items={24} sel={parsed?.hh ?? null}
                onPick={h => emit(h, parsed?.mm ?? 0)} />
              <TimeCol refEl={minRef}  label="Min"  items={60} sel={parsed?.mm ?? null}
                onPick={m => emit(parsed?.hh ?? 0, m)} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7, paddingTop: 7, borderTop: "1px solid #f0f0f0" }}>
              <button type="button" onClick={() => onChange("")}
                style={{ background: "transparent", border: "none", fontSize: 11, fontWeight: 700, color: "#9ca3af", cursor: "pointer", padding: "4px 7px", borderRadius: 6 }}>Clear</button>
              <button type="button" onClick={() => setOpen(false)}
                style={{ background: TEAL, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 13px", borderRadius: 7 }}>Done</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
