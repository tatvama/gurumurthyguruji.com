"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import type { AudienceBooking, ContactMessage } from "@/lib/api";

/* ── types ── */
interface PdfPayload {
  type: "bookings" | "contacts";
  data: (AudienceBooking | ContactMessage)[];
  generatedAt: string;
}

/* ── helpers ── */
function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtGenerated(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
}
function v(s: string | undefined | null) {
  return s && s.trim() ? s.trim() : "—";
}

/* ══════════════════════════════════════════════════════════════════
   All CSS — single source covers screen (responsive) + @media print
══════════════════════════════════════════════════════════════════ */
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Toolbar */
  .pdf-toolbar {
    background: #1a1a1a;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 100;
    flex-wrap: wrap;
  }
  .pdf-toolbar-btn {
    padding: 8px 18px;
    background: #4b0d13;
    color: #f5e6c8;
    border: 2px solid #b9934a;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 0.04em;
    font-family: inherit;
  }
  .pdf-toolbar-btn:hover { background: #6b1a22; }
  .pdf-toolbar-back {
    color: #bbb;
    text-decoration: none;
    font-size: 13px;
  }
  .pdf-toolbar-count {
    color: #888;
    font-size: 12px;
    margin-left: auto;
  }

  /* Page wrapper */
  .pdf-wrap {
    padding: 20px 0 40px;
  }

  /* A4-width page box */
  .pdf-page {
    width: min(210mm, 100%);
    min-height: 297mm;
    background: #fff;
    margin: 0 auto;
    box-shadow: 0 4px 40px rgba(0,0,0,0.4);
    position: relative;
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    color: #3b1a0e;
  }

  /* OM watermark */
  .pdf-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: min(240pt, 55vw);
    color: #e8dcc8;
    opacity: 0.06;
    pointer-events: none;
    user-select: none;
    z-index: 0;
    line-height: 1;
  }

  .pdf-inner { position: relative; z-index: 1; }

  /* Header */
  .pdf-header {
    background: #4b0d13;
    padding: 14px 20px 12px;
    border-bottom: 3px solid #b9934a;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .pdf-header h1 {
    font-size: clamp(13px, 4vw, 16pt);
    font-weight: 800;
    color: #f5e6c8;
    line-height: 1.2;
  }
  .pdf-header-sub {
    font-size: clamp(8px, 2vw, 8.5pt);
    color: rgba(245,230,200,0.65);
    margin-top: 3px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pdf-header-meta {
    text-align: right;
    font-size: clamp(8px, 2vw, 7.5pt);
    color: rgba(245,230,200,0.5);
    line-height: 1.7;
    flex-shrink: 0;
  }

  /* Summary */
  .pdf-summary {
    padding: 7px 20px;
    background: #fdf8f2;
    border-bottom: 1px solid #ede6d6;
    font-size: clamp(9px, 2vw, 8.5pt);
    color: #7a4a2a;
    font-weight: 600;
  }

  /* Footer (screen: static; print: fixed) */
  .pdf-footer {
    border-top: 2px solid #b9934a;
    padding: 6px 20px;
    display: flex;
    justify-content: space-between;
    font-size: clamp(8px, 2vw, 7pt);
    color: #9b7a5e;
    background: #fff;
    margin-top: 8px;
  }

  /* ── CONTACTS ────────────────────────────────────── */

  /* Mobile cards (screen ≤ 767px) */
  .c-cards { display: none; padding: 12px 12px 40px; }
  .c-table-wrap { display: block; padding: 14px 20px 40px; }

  @media screen and (max-width: 767px) {
    .c-cards { display: block; }
    .c-table-wrap { display: none; }
  }

  /* Card shared styles */
  .c-card {
    border: 1px solid #e8dcc8;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .c-card-hdr {
    background: #4b0d13;
    padding: 6px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .c-card-num { color: #b9934a; font-weight: 700; font-size: 12px; }
  .c-card-date { color: rgba(245,230,200,0.65); font-size: 11px; }
  .c-card-body { padding: 10px 12px; }
  .field-lbl {
    font-size: 10px;
    color: #9b7a5e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 1px;
  }
  .field-val { color: #3b1a0e; margin-bottom: 6px; font-size: 13px; }
  .field-val-name { font-weight: 700; font-size: 14px; }
  .field-val-email { font-size: 12px; word-break: break-all; }
  .field-val-subj { font-weight: 600; }
  .field-val-msg { font-size: 12px; color: #5b2d1e; line-height: 1.5; }

  /* Contact table */
  .c-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  .c-table col.c0 { width: 4%; }
  .c-table col.c1 { width: 14%; }
  .c-table col.c2 { width: 22%; }
  .c-table col.c3 { width: 20%; }
  .c-table col.c4 { width: 32%; }
  .c-table col.c5 { width: 8%; }
  .c-table thead { display: table-header-group; }
  .c-table thead tr {
    background: #4b0d13;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .c-table th {
    padding: 7px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #f5e6c8;
    text-align: left;
    border: 1px solid #6b1a22;
    vertical-align: middle;
    word-break: break-word;
  }
  .c-table td {
    padding: 6px 8px;
    font-size: 9pt;
    color: #3b1a0e;
    border: 1px solid #e8dcc8;
    vertical-align: top;
    word-break: break-word;
    line-height: 1.45;
  }
  .c-table tbody tr { page-break-inside: avoid; }
  .c-table tbody tr:nth-child(even) { background: #fdf8f2; }
  .c-table tbody tr:nth-child(odd)  { background: #fff; }
  .td-num   { text-align: center; font-weight: 700; color: #b9934a; font-size: 9pt; }
  .td-bold  { font-weight: 700; }
  .td-email { font-size: 8pt; word-break: break-all; }
  .td-date  { text-align: center; white-space: nowrap; color: #7a4a2a; font-size: 7.5pt; }
  .td-msg   { font-size: 8.5pt; color: #5b2d1e; }

  /* ── BOOKINGS ────────────────────────────────────── */
  .b-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 310px), 1fr));
    gap: 12px;
    padding: 12px 16px 40px;
  }
  .b-card {
    border: 1px solid #e8dcc8;
    border-radius: 8px;
    overflow: hidden;
  }
  .b-card-hdr {
    background: #4b0d13;
    padding: 6px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .b-card-num { color: #b9934a; font-weight: 800; font-size: 13px; }
  .b-card-date { color: rgba(245,230,200,0.65); font-size: 11px; }
  .b-card-body { padding: 10px 12px; }
  .b-card-name { font-weight: 700; font-size: 15px; color: #3b1a0e; }
  .b-card-mobile { font-size: 12px; color: #7a4a2a; font-family: monospace; margin-bottom: 6px; }
  .b-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
    margin-bottom: 6px;
  }
  .b-field-lbl {
    font-size: 9px;
    color: #9b7a5e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .b-field-val { font-size: 11px; color: #3b1a0e; font-weight: 500; }
  .b-msg-lbl {
    font-size: 9px;
    color: #9b7a5e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
  }
  .b-msg-val { font-size: 11.5px; color: #5b2d1e; line-height: 1.45; }

  /* ── PRINT ───────────────────────────────────────── */
  @page {
    size: A4 portrait;
    margin: 10mm 12mm 18mm;
  }

  @media print {
    /* ── Nuclear B&W reset: strip every background, force black text ── */
    *, *::before, *::after {
      background: #fff !important;
      background-color: #fff !important;
      background-image: none !important;
      color: #111 !important;
      box-shadow: none !important;
      text-shadow: none !important;
      -webkit-print-color-adjust: economy !important;
      print-color-adjust: economy !important;
    }

    .pdf-toolbar { display: none !important; }
    .pdf-wrap    { padding: 0 !important; }
    .pdf-page    { box-shadow: none !important; width: 100% !important; min-height: unset !important; }

    /* Watermark — keep faint */
    .pdf-watermark { color: #bbb !important; opacity: 0.18 !important; }

    /* Header — white bg, black text, thick bottom rule */
    .pdf-header {
      border-top: 3px solid #111 !important;
      border-bottom: 2px solid #111 !important;
      padding: 10px 20px 9px !important;
    }
    .pdf-header h1   { font-size: 14pt !important; color: #111 !important; }
    .pdf-header-sub  { font-size: 8pt  !important; color: #444 !important; }
    .pdf-header-meta { font-size: 7pt  !important; color: #555 !important; }

    /* Summary bar */
    .pdf-summary {
      border-bottom: 1px solid #aaa !important;
      color: #333 !important;
      font-size: 8pt !important;
      padding: 5px 0 !important;
    }

    /* ── Contact table ── */
    .c-cards      { display: none !important; }
    .c-table-wrap { display: block !important; padding: 6mm 0 22mm !important; }

    .c-table th {
      border: 1px solid #555 !important;
      border-bottom: 2px solid #111 !important;
      font-size: 7.5pt !important;
      padding: 5px 7px !important;
      color: #111 !important;
      font-weight: 800 !important;
    }
    .c-table td {
      border: 1px solid #ccc !important;
      font-size: 8pt !important;
      padding: 5px 7px !important;
      color: #111 !important;
    }
    .c-table tbody tr:nth-child(even) { background: #f4f4f4 !important; }
    .td-num  { color: #333 !important; font-weight: 700 !important; }
    .td-date { color: #333 !important; }
    .td-msg  { color: #222 !important; }

    /* ── Booking cards ── */
    .b-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 4mm !important;
      padding: 4mm 0 22mm !important;
    }
    .b-card {
      border: 1px solid #888 !important;
      border-radius: 2mm !important;
      break-inside: avoid;
    }
    .b-card-hdr {
      border-bottom: 1.5px solid #555 !important;
      padding: 2.5mm 3.5mm !important;
    }
    .b-card-num    { color: #444 !important; font-weight: 800 !important; }
    .b-card-date   { color: #666 !important; }
    .b-card-body   { padding: 2.5mm 3.5mm !important; }
    .b-card-name   { color: #111 !important; font-size: 10pt !important; }
    .b-card-mobile { color: #333 !important; font-size: 8pt  !important; margin-bottom: 3px !important; font-family: monospace !important; }
    .b-fields      { gap: 1px 6px !important; margin-bottom: 3px !important; }
    .b-field-lbl   { color: #555 !important; font-size: 6.5pt !important; }
    .b-field-val   { color: #111 !important; font-size: 7.5pt !important; }
    .b-msg-lbl     { color: #555 !important; font-size: 6.5pt !important; }
    .b-msg-val     { color: #222 !important; font-size: 8pt  !important; }

    /* Footer */
    .pdf-footer {
      border-top: 1px solid #555 !important;
      color: #444 !important;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 10mm;
      padding: 0 12mm;
      align-items: center;
    }
  }
`;

/* ── Shared header ── */
function PdfHeader({
  title,
  generatedAt,
  count,
}: {
  title: string;
  generatedAt: string;
  count: number;
}) {
  return (
    <div className="pdf-header">
      <div>
        <h1>Gurumurthy Guruji — Admin Console</h1>
        <div className="pdf-header-sub">{title}</div>
      </div>
      <div className="pdf-header-meta">
        Generated: {fmtGenerated(generatedAt)}
        <br />
        Total Records: {count}
      </div>
    </div>
  );
}

/* ── Contacts PDF ── */
function ContactsPdf({ data }: { data: ContactMessage[] }) {
  return (
    <>
      {/* Mobile cards */}
      <div className="c-cards">
        {data.map((c, i) => (
          <div
            key={c.id ?? i}
            className="c-card"
            style={{ background: i % 2 === 0 ? "#fff" : "#fdf8f2" }}
          >
            <div className="c-card-hdr">
              <span className="c-card-num">#{i + 1}</span>
              <span className="c-card-date">{fmt(c.createdAt)}</span>
            </div>
            <div className="c-card-body">
              <div className="field-lbl">Name</div>
              <div className={`field-val field-val-name`}>{v(c.name)}</div>
              <div className="field-lbl">Email</div>
              <div className={`field-val field-val-email`}>{v(c.email)}</div>
              <div className="field-lbl">Subject</div>
              <div className={`field-val field-val-subj`}>{v(c.subject)}</div>
              <div className="field-lbl">Message</div>
              <div className={`field-val field-val-msg`} style={{ marginBottom: 0 }}>
                {v(c.message)}
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p style={{ textAlign: "center", color: "#9b7a5e", padding: 20 }}>
            No records found
          </p>
        )}
      </div>

      {/* Desktop + print table */}
      <div className="c-table-wrap">
        <table className="c-table">
          <colgroup>
            <col className="c0" />
            <col className="c1" />
            <col className="c2" />
            <col className="c3" />
            <col className="c4" />
            <col className="c5" />
          </colgroup>
          <thead>
            <tr>
              {["#", "Name", "Email", "Subject", "Message", "Date"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: 20, color: "#9b7a5e" }}
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((c, i) => (
                <tr key={c.id ?? i}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-bold">{v(c.name)}</td>
                  <td className="td-email">{v(c.email)}</td>
                  <td>{v(c.subject)}</td>
                  <td className="td-msg">{v(c.message)}</td>
                  <td className="td-date">{fmt(c.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Bookings PDF ── */
function BookingsPdf({ data }: { data: AudienceBooking[] }) {
  const fields: Array<[string, keyof AudienceBooking]> = [
    ["Profession", "profession"],
    ["Location", "location"],
    ["Nearest Ashram", "nearestAshram"],
    ["How Known", "howKnown"],
  ];

  return (
    <div className="b-grid">
      {data.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#9b7a5e",
            padding: 20,
            gridColumn: "1/-1",
          }}
        >
          No records found
        </p>
      ) : (
        data.map((b, i) => (
          <div
            key={b.id ?? i}
            className="b-card"
            style={{ background: i % 2 === 0 ? "#fff" : "#fdf8f2" }}
          >
            <div className="b-card-hdr">
              <span className="b-card-num">#{i + 1}</span>
              <span className="b-card-date">{fmt(b.createdAt)}</span>
            </div>
            <div className="b-card-body">
              <div className="b-card-name">{v(b.fullName)}</div>
              <div className="b-card-mobile">{v(b.mobile)}</div>
              <div className="b-fields">
                {fields.map(([lbl, key]) => (
                  <div key={lbl}>
                    <div className="b-field-lbl">{lbl}</div>
                    <div className="b-field-val">{v(b[key] as string)}</div>
                  </div>
                ))}
              </div>
              {b.message && (
                <>
                  <div className="b-msg-lbl">Message</div>
                  <div className="b-msg-val">{b.message}</div>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ── Inner component (needs Suspense wrapper for useSearchParams) ── */
function PdfRenderer() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const typeParam = searchParams.get("type") as "bookings" | "contacts" | null;

  const [payload, setPayload] = useState<PdfPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pdfPayload");
      if (!raw) {
        setError("No data found. Please go back to admin and try again.");
        return;
      }
      const parsed = JSON.parse(raw) as PdfPayload;
      setPayload(parsed);
      localStorage.removeItem("pdfPayload");
    } catch {
      setError("Failed to load PDF data.");
    }
  }, []);

  /* ── error state ── */
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
          gap: 12,
        }}
      >
        <p style={{ color: "#7a4a2a", fontSize: 16 }}>{error}</p>
        <a
          href={`/${locale}/admin`}
          style={{ color: "#4b0d13", textDecoration: "underline", fontSize: 14 }}
        >
          ← Back to Admin
        </a>
      </div>
    );
  }

  /* ── loading state ── */
  if (!payload) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
          color: "#9b7a5e",
        }}
      >
        Loading…
      </div>
    );
  }

  const isBooking = (typeParam ?? payload.type) === "bookings";
  const title = isBooking ? "Appointment Bookings Report" : "Contact Messages Report";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Sticky toolbar (screen only, hidden on print) */}
      <div className="pdf-toolbar">
        <button className="pdf-toolbar-btn" onClick={() => window.print()}>
          ⬇ Save / Print as PDF
        </button>
        <a className="pdf-toolbar-back" href={`/${locale}/admin`}>
          ← Back to Admin
        </a>
        <span className="pdf-toolbar-count">
          {payload.data.length} record{payload.data.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* PDF page */}
      <div className="pdf-wrap">
        <div className="pdf-page">
          {/* Background watermark */}
          <div className="pdf-watermark" aria-hidden="true">
            ॐ
          </div>

          <div className="pdf-inner">
            <PdfHeader
              title={title}
              generatedAt={payload.generatedAt}
              count={payload.data.length}
            />

            <div className="pdf-summary">
              {title} — {payload.data.length} record
              {payload.data.length !== 1 ? "s" : ""}
            </div>

            {isBooking ? (
              <BookingsPdf data={payload.data as AudienceBooking[]} />
            ) : (
              <ContactsPdf data={payload.data as ContactMessage[]} />
            )}

            <div className="pdf-footer">
              <span>Gurumurthy Guruji Admin Console — Confidential</span>
              <span>
                {new Date(payload.generatedAt).toLocaleDateString("en-IN", {
                  dateStyle: "long",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Page export ── */
export default function PdfPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
            color: "#9b7a5e",
          }}
        >
          Loading…
        </div>
      }
    >
      <PdfRenderer />
    </Suspense>
  );
}
