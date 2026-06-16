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
  const lastRef   = useRef<{ x: number; y: number } | null>(null);
  const hasPenRef = useRef(false);                   // palm rejection flag
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pageCount, setPageCount] = useState(1);
  const [cur, setCur]   = useState(0);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [sizeW, setSizeW] = useState(SIZES[1].w);
  const [save, setSave] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);

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
    const base = tool === "highlighter" ? sizeW * 4 : tool === "eraser" ? sizeW * 6 : sizeW;
    // Real pens report 0–1 pressure; mouse/most touch report 0 or 0.5.
    if (e.pointerType === "pen" && e.pressure > 0) return base * (0.35 + 1.7 * e.pressure);
    return base;
  }

  function applyStyle(c: CanvasRenderingContext2D, w: number) {
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = w;
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
    // Palm rejection: ignore finger touches once a pen has been used here
    if (e.pointerType === "touch" && hasPenRef.current) return;
    e.preventDefault();
    const c = ctx(); const cv = canvasRef.current; if (!c || !cv) return;
    cv.setPointerCapture(e.pointerId);
    // push undo snapshot (cap 20)
    undoRef.current.push(cv.toDataURL("image/png"));
    if (undoRef.current.length > 20) undoRef.current.shift();
    drawingRef.current = true;
    const p = pos(e);
    lastRef.current = p;
    applyStyle(c, strokeWidth(e));
    // dot for a tap
    c.beginPath();
    c.arc(p.x, p.y, Math.max(c.lineWidth / 2, 0.5), 0, Math.PI * 2);
    c.fillStyle = tool === "eraser" ? "rgba(0,0,0,1)" : (tool === "highlighter" ? "#fde047" : color);
    if (tool === "eraser") c.globalCompositeOperation = "destination-out";
    c.fill();
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    if (e.pointerType === "touch" && hasPenRef.current) return;
    e.preventDefault();
    const c = ctx(); if (!c) return;
    const p = pos(e);
    const last = lastRef.current || p;
    applyStyle(c, strokeWidth(e));
    // quadratic smoothing through the midpoint
    const mx = (last.x + p.x) / 2;
    const my = (last.y + p.y) / 2;
    c.beginPath();
    c.moveTo(last.x, last.y);
    c.quadraticCurveTo(last.x, last.y, mx, my);
    c.stroke();
    lastRef.current = p;
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastRef.current = null;
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

  /* ── styles ───────────────────────────────────────────────────── */
  const toolBtn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
    width: 38, height: 38, borderRadius: 9, cursor: "pointer",
    border: active ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb",
    background: active ? "#0d9488" : "#fff",
    color: active ? "#fff" : "#374151",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, padding: "10px 12px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#0f766e", marginRight: 4 }}>{title}</span>

        {/* tools */}
        <div style={{ display: "flex", gap: 6 }}>
          <button title="Pen"         onClick={() => setTool("pen")}         style={toolBtn(tool === "pen")}><Pen size={16} /></button>
          <button title="Highlighter" onClick={() => setTool("highlighter")} style={toolBtn(tool === "highlighter")}><Highlighter size={16} /></button>
          <button title="Eraser"      onClick={() => setTool("eraser")}      style={toolBtn(tool === "eraser")}><Eraser size={16} /></button>
        </div>

        <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />

        {/* colors */}
        <div style={{ display: "flex", gap: 5 }}>
          {COLORS.map(cl => (
            <button key={cl} title={cl} onClick={() => { setColor(cl); if (tool === "eraser") setTool("pen"); }}
              style={{ width: 24, height: 24, borderRadius: "50%", background: cl, cursor: "pointer",
                border: color === cl && tool !== "eraser" ? "3px solid #0d9488" : "2px solid #fff",
                boxShadow: "0 0 0 1px #e5e7eb" }} />
          ))}
        </div>

        <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />

        {/* sizes */}
        <div style={{ display: "flex", gap: 5 }}>
          {SIZES.map(s => (
            <button key={s.key} onClick={() => setSizeW(s.w)} title={s.label}
              style={{ padding: "0 10px", height: 30, borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                border: sizeW === s.w ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb",
                background: sizeW === s.w ? "rgba(13,148,136,0.08)" : "#fff",
                color: sizeW === s.w ? "#0d9488" : "#6b7280" }}>{s.label}</button>
          ))}
        </div>

        <span style={{ width: 1, height: 26, background: "#e5e7eb" }} />

        <button onClick={undo}        title="Undo"            style={toolBtn(false)}><Undo2 size={16} /></button>
        <button onClick={clearPage}   title="Clear this page" style={{ ...toolBtn(false), color: "#dc2626", borderColor: "#fecaca" }}><Trash2 size={16} /></button>
        <button onClick={downloadPage} title="Download page PNG" style={toolBtn(false)}><Download size={16} /></button>

        <div style={{ flex: 1 }} />

        {/* save state */}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: save === "saved" ? "#15803d" : "#6b7280" }}>
          {save === "saving" ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
            : save === "saved" ? <><Check size={13} /> Saved</> : null}
        </span>
      </div>

      {/* Page navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <button onClick={() => gotoPage(cur - 1)} disabled={cur === 0}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: cur === 0 ? "#cbd5e1" : "#374151", fontSize: 12.5, fontWeight: 600, cursor: cur === 0 ? "default" : "pointer" }}>
          <ChevronLeft size={15} /> Prev
        </button>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Page {cur + 1} / {pageCount}</span>
        <button onClick={() => gotoPage(cur + 1)} disabled={cur >= pageCount - 1}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: cur >= pageCount - 1 ? "#cbd5e1" : "#374151", fontSize: 12.5, fontWeight: 600, cursor: cur >= pageCount - 1 ? "default" : "pointer" }}>
          Next <ChevronRight size={15} />
        </button>
        <span style={{ width: 1, height: 22, background: "#e5e7eb" }} />
        <button onClick={addPage} disabled={pageCount >= MAX_PAGES}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: pageCount >= MAX_PAGES ? "default" : "pointer", opacity: pageCount >= MAX_PAGES ? 0.5 : 1 }}>
          <Plus size={15} /> Add Page
        </button>
        <button onClick={deletePage} title="Delete this page"
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {/* The A4 page */}
      <div style={{ display: "flex", justifyContent: "center", background: "#eef2f7", borderRadius: 12, padding: 16, overflow: "auto" }}>
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
            width: "100%", maxWidth: 760, height: "auto",
            background: "#fff", borderRadius: 6,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            touchAction: "none", cursor: "crosshair",
            border: "1px solid #d1d5db",
          }}
        />
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
        Write with a stylus for pressure-sensitive strokes. Once a pen is used, palm touches are ignored automatically. Pages autosave.
      </p>
    </div>
  );
}
