"use client";

/* ════════════════════════════════════════════════════════════════════
   WritingPadPro — multipage A4 digital writing pad for Guruji
   ---------------------------------------------------------------------
   • A4-proportioned pages, add / delete / navigate multiple pages
   • Pointer Events with pressure → stylus-accurate on iPad & Android pen
   • Palm rejection: once a pen is detected, finger-touch is ignored
   • Tools: pen · highlighter · eraser, colour + thickness pickers, undo
   • Persists as JSON { v:2, pages:[dataURL…] } to the case-pad endpoint
     (reuses getCasePad / saveCasePad / clearCasePad with any padKey).
   • Backward-compatible: a raw single dataURL loads as page 1.
═══════════════════════════════════════════════════════════════════════ */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pen, Highlighter, Eraser, Undo2, Plus, Trash2, Download,
  ChevronLeft, ChevronRight, Check, Loader2,
} from "lucide-react";
import { getCasePad, saveCasePad } from "@/lib/api";

/* Internal pixel resolution of a page (A4 portrait ratio ≈ 1 : 1.414).
   Displayed scaled-to-fit, but strokes are stored at this crisp size. */
const CW = 1000;
const CH = 1414;
const MAX_PAGES = 24;

type Tool = "pen" | "highlighter" | "eraser";

const COLORS = ["#111827", "#1d4ed8", "#dc2626", "#15803d", "#d97706", "#7c3aed"];
const SIZES: { key: string; label: string; w: number }[] = [
  { key: "s", label: "Fine",   w: 2 },
  { key: "m", label: "Medium", w: 3.5 },
  { key: "l", label: "Bold",   w: 6 },
];
const ERASER_SIZES: { key: string; label: string; w: number }[] = [
  { key: "xs", label: "S",  w: 4 },
  { key: "s",  label: "M",  w: 8 },
  { key: "m",  label: "L",  w: 14 },
  { key: "xl", label: "XL", w: 24 },
];

const BLANK = ""; // empty string ⇒ a fresh white page

function newWhite(): string {
  return BLANK;
}

export default function WritingPadPro({
  padKey,
  title = "Guruji Writing Pad",
}: {
  padKey: string;
  title?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pagesRef  = useRef<string[]>([BLANK]);     // dataURL per page
  const curRef    = useRef(0);                       // active page index
  const undoRef   = useRef<string[]>([]);            // undo snapshots (current page)
  const drawingRef = useRef(false);
  const lastRef    = useRef<{ x: number; y: number } | null>(null);
  const lastMidRef = useRef<{ x: number; y: number } | null>(null);
  const hasPenRef = useRef(false);                   // palm rejection flag
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);   // highlighter stroke buffer
  const strokePtsRef = useRef<{ x: number; y: number }[]>([]); // live stroke points

  const [pageCount, setPageCount] = useState(1);
  const [cur, setCur]   = useState(0);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [sizeW, setSizeW] = useState(SIZES[1].w);
  const [eraserSizeW, setEraserSizeW] = useState(ERASER_SIZES[1].w);
  const [save, setSave] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── canvas helpers ───────────────────────────────────────────── */
  const ctx = () => canvasRef.current?.getContext("2d") || null;

  const paintWhite = useCallback(() => {
    const c = ctx(); if (!c) return;
    c.globalCompositeOperation = "source-over";
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, CW, CH);
  }, []);

  /* Render a stored dataURL (or blank) onto the canvas */
  const renderPage = useCallback((data: string) => {
    const c = ctx(); if (!c) return;
    paintWhite();
    if (data && data.startsWith("data:")) {
      const img = new Image();
      img.onload = () => { c.drawImage(img, 0, 0, CW, CH); };
      img.src = data;
    }
  }, [paintWhite]);

  /* Snapshot current canvas into pagesRef[cur] */
  const commit = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    pagesRef.current[curRef.current] = cv.toDataURL("image/png");
  }, []);

  /* Debounced persistence of ALL pages */
  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSave("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        commit();
        await saveCasePad(padKey, JSON.stringify({ v: 2, pages: pagesRef.current }));
        setSave("saved");
        setTimeout(() => setSave("idle"), 1500);
      } catch { setSave("idle"); }
    }, 900);
  }, [commit, padKey]);

  /* ── load existing pad once ───────────────────────────────────── */
  useEffect(() => {
    let ignore = false;
    (async () => {
      let pages: string[] = [BLANK];
      try {
        const raw = await getCasePad(padKey);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.pages) && parsed.pages.length) pages = parsed.pages;
          } catch {
            if (raw.startsWith("data:")) pages = [raw];   // legacy single-image pad
          }
        }
      } catch { /* offline → start blank */ }
      if (ignore) return;
      pagesRef.current = pages;
      curRef.current = 0;
      setPageCount(pages.length);
      setCur(0);
      setLoaded(true);
    })();
    return () => { ignore = true; };
  }, [padKey]);

  /* Draw the active page whenever it changes / after load */
  useEffect(() => {
    if (!loaded) return;
    undoRef.current = [];
    renderPage(pagesRef.current[cur] ?? BLANK);
  }, [cur, loaded, renderPage]);

  /* flush save on unmount */
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  /* ── pointer → canvas coordinate mapping ──────────────────────── */
  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const cv = canvasRef.current!;
    const r = cv.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (CW / r.width),
      y: (e.clientY - r.top)  * (CH / r.height),
    };
  }

  function strokeWidth(e: React.PointerEvent<HTMLCanvasElement>) {
    const base = tool === "highlighter" ? sizeW * 4 : tool === "eraser" ? eraserSizeW : sizeW;
    // Real pens report 0–1 pressure; mouse/most touch report 0 or 0.5.
    if (e.pointerType === "pen" && e.pressure > 0) return base * (0.35 + 1.7 * e.pressure);
    return base;
  }

  function applyStyle(c: CanvasRenderingContext2D, w: number) {
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = w;
    c.setLineDash([]);   // always solid — never dashed
    if (tool === "eraser") {
      c.globalCompositeOperation = "destination-out";
      c.strokeStyle = "rgba(0,0,0,1)";
    } else if (tool === "highlighter") {
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 0.30;
      c.strokeStyle = "#fde047";
    } else {
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 1;
      c.strokeStyle = color;
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerType === "pen") hasPenRef.current = true;
    if (e.pointerType === "touch" && hasPenRef.current) return;
    e.preventDefault();
    const cv = canvasRef.current; if (!cv) return;
    cv.setPointerCapture(e.pointerId);
    undoRef.current.push(cv.toDataURL("image/png"));
    if (undoRef.current.length > 20) undoRef.current.shift();
    drawingRef.current = true;
    const p = pos(e);
    lastRef.current = p;
    lastMidRef.current = p;

    if (tool === "highlighter") {
      strokePtsRef.current = [p];
      const oc = overlayRef.current?.getContext("2d");
      if (oc) oc.clearRect(0, 0, CW, CH);
      return;
    }

    const c = ctx(); if (!c) return;
    applyStyle(c, strokeWidth(e));
    c.beginPath();
    c.arc(p.x, p.y, Math.max(c.lineWidth / 2, 0.5), 0, Math.PI * 2);
    c.fillStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
    if (tool === "eraser") c.globalCompositeOperation = "destination-out";
    c.fill();
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    if (e.pointerType === "touch" && hasPenRef.current) return;
    e.preventDefault();
    const p = pos(e);
    const last = lastRef.current || p;
    const mx = (last.x + p.x) / 2;
    const my = (last.y + p.y) / 2;

    if (tool === "highlighter") {
      strokePtsRef.current.push(p);
      const oc = overlayRef.current?.getContext("2d");
      if (oc) {
        oc.clearRect(0, 0, CW, CH);
        oc.lineCap = "round";
        oc.lineJoin = "round";
        oc.strokeStyle = "#fde047";
        oc.lineWidth = sizeW * 4;
        oc.globalAlpha = 1;
        const pts = strokePtsRef.current;
        oc.beginPath();
        oc.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const pmx = (pts[i - 1].x + pts[i].x) / 2;
          const pmy = (pts[i - 1].y + pts[i].y) / 2;
          oc.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, pmx, pmy);
        }
        oc.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        oc.stroke();
      }
      lastRef.current = p;
      lastMidRef.current = { x: mx, y: my };
      return;
    }

    const c = ctx(); if (!c) return;
    const prevMid = lastMidRef.current || last;
    applyStyle(c, strokeWidth(e));
    c.beginPath();
    c.moveTo(prevMid.x, prevMid.y);
    c.quadraticCurveTo(last.x, last.y, mx, my);
    c.stroke();
    lastRef.current = p;
    lastMidRef.current = { x: mx, y: my };
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastRef.current = null;
    lastMidRef.current = null;

    if (tool === "highlighter") {
      const c = ctx();
      const ov = overlayRef.current;
      const oc = ov?.getContext("2d");
      if (c && ov && oc) {
        c.save();
        c.globalAlpha = 0.30;
        c.globalCompositeOperation = "source-over";
        c.drawImage(ov, 0, 0);
        c.restore();
        oc.clearRect(0, 0, CW, CH);
      }
      strokePtsRef.current = [];
    }

    const c = ctx(); if (c) c.globalAlpha = 1;
    scheduleSave();
  }

  /* ── toolbar actions ──────────────────────────────────────────── */
  function undo() {
    const cv = canvasRef.current; const c = ctx();
    if (!cv || !c || !undoRef.current.length) return;
    const prev = undoRef.current.pop()!;
    paintWhite();
    if (prev.startsWith("data:")) {
      const img = new Image();
      img.onload = () => { c.drawImage(img, 0, 0, CW, CH); scheduleSave(); };
      img.src = prev;
    } else scheduleSave();
  }

  function clearPage() {
    const cv = canvasRef.current; if (cv) undoRef.current.push(cv.toDataURL("image/png"));
    paintWhite();
    scheduleSave();
  }

  function gotoPage(idx: number) {
    if (idx < 0 || idx >= pagesRef.current.length || idx === curRef.current) return;
    commit();                       // save current strokes
    curRef.current = idx;
    setCur(idx);
  }

  function addPage() {
    if (pagesRef.current.length >= MAX_PAGES) return;
    commit();
    pagesRef.current.push(newWhite());
    const idx = pagesRef.current.length - 1;
    curRef.current = idx;
    setPageCount(pagesRef.current.length);
    setCur(idx);
    scheduleSave();
  }

  function deletePage() {
    if (pagesRef.current.length <= 1) { clearPage(); return; }
    pagesRef.current.splice(curRef.current, 1);
    const idx = Math.max(0, curRef.current - 1);
    curRef.current = idx;
    setPageCount(pagesRef.current.length);
    setCur(idx);
    scheduleSave();
  }

  function downloadPage() {
    const cv = canvasRef.current; if (!cv) return;
    const a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = `${padKey}-page-${cur + 1}.png`;
    a.click();
  }

  /* ── custom cursors ──────────────────────────────────────────── */
  function getCursor(): string {
    if (tool === "eraser") {
      const sizeMap: Record<number, { d: number; hot: number }> = {
        4:  { d: 14, hot: 7 },
        8:  { d: 20, hot: 10 },
        14: { d: 28, hot: 14 },
        24: { d: 40, hot: 20 },
      };
      const { d, hot } = sizeMap[eraserSizeW] ?? { d: 20, hot: 10 };
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${d}' height='${d}'><circle cx='${hot}' cy='${hot}' r='${hot - 1}' fill='none' stroke='black' stroke-width='1.5'/><circle cx='${hot}' cy='${hot}' r='1' fill='black'/></svg>`;
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hot} ${hot}, crosshair`;
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><line x1='12' y1='1' x2='12' y2='23' stroke='black' stroke-width='1.5'/><line x1='1' y1='12' x2='23' y2='12' stroke='black' stroke-width='1.5'/><circle cx='12' cy='12' r='2.5' fill='white' stroke='black' stroke-width='1.2'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 12 12, crosshair`;
  }

  /* ── styles ───────────────────────────────────────────────────── */
  const toolBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
    width: 32, height: 32, borderRadius: 8, cursor: "pointer",
    border: active ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb",
    background: active ? "#0d9488" : "#fff",
    color: active ? "#fff" : "#374151",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Toolbar */}
      {isMobile ? (
        /* ── Mobile: 3 fixed rows ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12 }}>
          {/* Row 1: title + save indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0f766e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: save === "saved" ? "#15803d" : "#6b7280", flexShrink: 0, marginLeft: 8 }}>
              {save === "saving" ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                : save === "saved" ? <><Check size={12} /> Saved</> : null}
            </span>
          </div>
          {/* Row 2: pen / highlighter / eraser + all colors */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button title="Pen"         onClick={() => setTool("pen")}         style={toolBtn(tool === "pen")}><Pen size={14} /></button>
            <button title="Highlighter" onClick={() => setTool("highlighter")} style={toolBtn(tool === "highlighter")}><Highlighter size={14} /></button>
            <button title="Eraser"      onClick={() => setTool("eraser")}      style={toolBtn(tool === "eraser")}><Eraser size={14} /></button>
            <span style={{ width: 1, height: 22, background: "#e5e7eb" }} />
            {COLORS.map(cl => (
              <button key={cl} title={cl} onClick={() => { setColor(cl); if (tool === "eraser") setTool("pen"); }}
                style={{ width: 22, height: 22, borderRadius: "50%", background: cl, cursor: "pointer", flexShrink: 0,
                  border: color === cl && tool !== "eraser" ? "2.5px solid #0d9488" : "2px solid #fff",
                  boxShadow: "0 0 0 1px #e5e7eb" }} />
            ))}
          </div>
          {/* Row 3: size buttons + undo / clear / download */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {tool !== "eraser" && SIZES.map(s => (
              <button key={s.key} onClick={() => setSizeW(s.w)} title={s.label}
                style={{ padding: "0 9px", height: 27, borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  border: sizeW === s.w ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb",
                  background: sizeW === s.w ? "rgba(13,148,136,0.08)" : "#fff",
                  color: sizeW === s.w ? "#0d9488" : "#6b7280" }}>{s.label}</button>
            ))}
            {tool === "eraser" && <>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af" }}>Size:</span>
              {ERASER_SIZES.map(s => (
                <button key={s.key} onClick={() => setEraserSizeW(s.w)} title={`Eraser ${s.label}`}
                  style={{ width: 28, height: 27, borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700,
                    border: eraserSizeW === s.w ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                    background: eraserSizeW === s.w ? "rgba(239,68,68,0.08)" : "#fff",
                    color: eraserSizeW === s.w ? "#ef4444" : "#6b7280",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>{s.label}</button>
              ))}
            </>}
            <span style={{ width: 1, height: 20, background: "#e5e7eb", margin: "0 2px" }} />
            <button onClick={undo}         title="Undo"             style={toolBtn(false)}><Undo2 size={13} /></button>
            <button onClick={clearPage}    title="Clear this page"  style={{ ...toolBtn(false), color: "#dc2626", borderColor: "#fecaca" }}><Trash2 size={13} /></button>
            <button onClick={downloadPage} title="Download page PNG" style={toolBtn(false)}><Download size={13} /></button>
          </div>
        </div>
      ) : (
        /* ── Desktop: original single-row layout ── */
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, padding: "10px 12px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0f766e", marginRight: 4 }}>{title}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button title="Pen"         onClick={() => setTool("pen")}         style={toolBtn(tool === "pen")}><Pen size={16} /></button>
            <button title="Highlighter" onClick={() => setTool("highlighter")} style={toolBtn(tool === "highlighter")}><Highlighter size={16} /></button>
            <button title="Eraser"      onClick={() => setTool("eraser")}      style={toolBtn(tool === "eraser")}><Eraser size={16} /></button>
          </div>
          <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />
          <div style={{ display: "flex", gap: 5 }}>
            {COLORS.map(cl => (
              <button key={cl} title={cl} onClick={() => { setColor(cl); if (tool === "eraser") setTool("pen"); }}
                style={{ width: 24, height: 24, borderRadius: "50%", background: cl, cursor: "pointer",
                  border: color === cl && tool !== "eraser" ? "3px solid #0d9488" : "2px solid #fff",
                  boxShadow: "0 0 0 1px #e5e7eb" }} />
            ))}
          </div>
          <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />
          {tool !== "eraser" && (
            <div style={{ display: "flex", gap: 5 }}>
              {SIZES.map(s => (
                <button key={s.key} onClick={() => setSizeW(s.w)} title={s.label}
                  style={{ padding: "0 10px", height: 30, borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                    border: sizeW === s.w ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb",
                    background: sizeW === s.w ? "rgba(13,148,136,0.08)" : "#fff",
                    color: sizeW === s.w ? "#0d9488" : "#6b7280" }}>{s.label}</button>
              ))}
            </div>
          )}
          {tool === "eraser" && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginRight: 2 }}>Size:</span>
              {ERASER_SIZES.map(s => (
                <button key={s.key} onClick={() => setEraserSizeW(s.w)} title={`Eraser ${s.label}`}
                  style={{ width: 32, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                    border: eraserSizeW === s.w ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                    background: eraserSizeW === s.w ? "rgba(239,68,68,0.08)" : "#fff",
                    color: eraserSizeW === s.w ? "#ef4444" : "#6b7280",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>{s.label}</button>
              ))}
            </div>
          )}
          <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />
          <button onClick={undo}         title="Undo"            style={toolBtn(false)}><Undo2 size={16} /></button>
          <button onClick={clearPage}    title="Clear this page" style={{ ...toolBtn(false), color: "#dc2626", borderColor: "#fecaca" }}><Trash2 size={16} /></button>
          <button onClick={downloadPage} title="Download page PNG" style={toolBtn(false)}><Download size={16} /></button>
          <div style={{ flex: 1 }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: save === "saved" ? "#15803d" : "#6b7280" }}>
            {save === "saving" ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
              : save === "saved" ? <><Check size={13} /> Saved</> : null}
          </span>
          <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />
          <button onClick={addPage} disabled={pageCount >= MAX_PAGES}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: pageCount >= MAX_PAGES ? "default" : "pointer", opacity: pageCount >= MAX_PAGES ? 0.5 : 1 }}>
            <Plus size={14} /> Add Page
          </button>
          <button onClick={deletePage} title="Delete this page" disabled={pageCount <= 1}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${pageCount <= 1 ? "#e5e7eb" : "#fecaca"}`, background: "#fff", color: pageCount <= 1 ? "#d1d5db" : "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: pageCount <= 1 ? "default" : "pointer", opacity: pageCount <= 1 ? 0.5 : 1 }}>
            <Trash2 size={13} /> Delete Page
          </button>
        </div>
      )}

      {/* The A4 page */}
      <div style={{ display: "flex", justifyContent: "center", background: "#eef2f7", borderRadius: 12, padding: 16, overflow: "auto" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 760 }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{
              display: "block", width: "100%", height: "auto",
              background: "#fff", borderRadius: 6,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              touchAction: "none", cursor: getCursor(),
              border: "1px solid #d1d5db",
            }}
          />
          {/* Overlay canvas — shows live highlighter stroke at 0.30 opacity without bead artifacts */}
          <canvas
            ref={overlayRef}
            width={CW}
            height={CH}
            style={{
              position: "absolute", top: 0, left: 0,
              display: "block", width: "100%", height: "auto",
              opacity: 0.30, pointerEvents: "none", borderRadius: 6,
            }}
          />
        </div>
      </div>

      {/* Page navigator — below the canvas */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {/* Row 1: Prev / Page counter / Next */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <button onClick={() => gotoPage(cur - 1)} disabled={cur === 0}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: cur === 0 ? "#cbd5e1" : "#374151", fontSize: 13, fontWeight: 600, cursor: cur === 0 ? "default" : "pointer" }}>
            <ChevronLeft size={15} /> Prev
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", minWidth: 80, textAlign: "center" }}>Page {cur + 1} / {pageCount}</span>
          <button onClick={() => gotoPage(cur + 1)} disabled={cur >= pageCount - 1}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: cur >= pageCount - 1 ? "#cbd5e1" : "#374151", fontSize: 13, fontWeight: 600, cursor: cur >= pageCount - 1 ? "default" : "pointer" }}>
            Next <ChevronRight size={15} />
          </button>
        </div>
        {/* Row 2: Add Page / Delete — mobile only */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <button onClick={addPage} disabled={pageCount >= MAX_PAGES}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 18px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", fontSize: 13, fontWeight: 700, cursor: pageCount >= MAX_PAGES ? "default" : "pointer", opacity: pageCount >= MAX_PAGES ? 0.5 : 1 }}>
              <Plus size={15} /> Add Page
            </button>
            <button onClick={deletePage} title="Delete this page" disabled={pageCount <= 1}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 18px", borderRadius: 8, border: `1.5px solid ${pageCount <= 1 ? "#e5e7eb" : "#fecaca"}`, background: "#fff", color: pageCount <= 1 ? "#d1d5db" : "#dc2626", fontSize: 13, fontWeight: 600, cursor: pageCount <= 1 ? "default" : "pointer", opacity: pageCount <= 1 ? 0.5 : 1 }}>
              <Trash2 size={14} /> Delete Page
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
        Write with a stylus for pressure-sensitive strokes. Once a pen is used, palm touches are ignored automatically. Pages autosave.
      </p>
    </div>
  );
}
