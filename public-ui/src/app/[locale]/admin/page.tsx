"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAudienceBookings,
  getContacts,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  adminSendOtp,
  adminVerifyOtp,
  type AudienceBooking,
  type ContactMessage,
  type AdminUser,
} from "@/lib/api";
import {
  Users,
  Mail,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  X,
  Phone,
  AlertCircle,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  ClipboardList,
  Clock,
  ShieldCheck,
  UserPlus,
  Trash2,
  Pencil,
  Lock,
  FileDown,
  Menu,
} from "lucide-react";

/* ── constants ──────────────────────────────────────────────────────── */
const ADMIN_MOBILE   = process.env.NEXT_PUBLIC_ADMIN_MOBILE   || "9999999999";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "123456";
const PAGE_SIZE = 15;

const COSMIC =
  "radial-gradient(ellipse at center,rgba(132,88,68,0.22) 0%,transparent 40%)," +
  "radial-gradient(ellipse at left center,rgba(110,18,32,0.20) 0%,transparent 55%)," +
  "radial-gradient(ellipse at right center,rgba(110,18,32,0.18) 0%,transparent 55%)," +
  "linear-gradient(135deg,#4b0d13 0%,#5b1118 25%,#65161c 50%,#571116 75%,#430a10 100%)";

type Tab = "bookings" | "contacts" | "admins";

/* ── CustomSelect ──────────────────────────────────────────────────── */
function CustomSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 8, height: 40, minWidth: 145, padding: "0 12px 0 14px",
          border: "1.5px solid #b9934a", borderRadius: 10,
          background: "linear-gradient(135deg,#fffaf4,#fef3e2)",
          cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#7a4a1e",
          boxShadow: "0 1px 4px rgba(185,147,69,0.12)",
          outline: "none", whiteSpace: "nowrap",
        }}
      >
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected.label}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#b9934a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 900,
          minWidth: "100%", background: "#fff",
          border: "1.5px solid #e8d9c0", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(75,13,19,0.13), 0 2px 8px rgba(185,147,69,0.1)",
          overflow: "hidden",
        }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 16px", border: "none", cursor: "pointer", fontSize: 13,
                fontWeight: opt.value === value ? 700 : 500,
                color: opt.value === value ? "#7a4a1e" : "#3b1a0e",
                background: opt.value === value ? "#fef3e2" : "#fff",
                transition: "background 0.12s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fef3e2"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = opt.value === value ? "#fef3e2" : "#fff"; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── helpers ────────────────────────────────────────────────────────── */
function fmt(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/* ══════════════════════════════════════════════════════════════════
   PDF — direct file download via jsPDF (no dialog, no preview)
══════════════════════════════════════════════════════════════════ */
function downloadPdfDirect(
  type: "bookings" | "contacts",
  data: AudienceBooking[] | ContactMessage[],
) {
  const doc   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW    = 210;
  const M     = 12;
  const now   = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
  const today = new Date().toLocaleDateString("en-IN", { dateStyle: "long" });
  const title = type === "contacts" ? "Contact Messages Report" : "Audience Bookings Report";
  const sub   = type === "contacts" ? "CONTACT MESSAGES REPORT" : "AUDIENCE BOOKINGS REPORT";
  const dateStr = new Date().toISOString().slice(0, 10);

  /* ── Header band ── */
  doc.setFillColor(75, 13, 19);
  doc.rect(0, 0, PW, 28, "F");
  doc.setDrawColor(185, 147, 74);
  doc.setLineWidth(0.8);
  doc.line(0, 28, PW, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(245, 230, 200);
  doc.text("Gurumurthy Guruji — Admin Console", M, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 158, 128);
  doc.text(sub, M, 18.5);

  doc.setFontSize(7);
  doc.setTextColor(160, 140, 110);
  doc.text("Generated: " + now, PW - M, 10, { align: "right" });
  doc.text("Records: " + data.length, PW - M, 17, { align: "right" });

  /* ── Summary strip ── */
  doc.setFillColor(253, 248, 242);
  doc.rect(0, 29, PW, 8, "F");
  doc.setDrawColor(230, 218, 200);
  doc.setLineWidth(0.25);
  doc.line(0, 37, PW, 37);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(122, 74, 42);
  doc.text(title + " — " + data.length + " record" + (data.length !== 1 ? "s" : ""), M, 34);

  type RGB = [number, number, number];

  const baseStyles = {
    overflow: "linebreak" as const,
    valign: "top" as const,
    lineColor: [232, 220, 200] as RGB,
    lineWidth: 0.2,
    textColor: [59, 26, 14] as RGB,
  };
  const headSt = {
    fillColor: [75, 13, 19] as RGB,
    textColor: [245, 230, 200] as RGB,
    fontStyle: "bold" as const,
    cellPadding: 3,
  };
  const altRow  = { fillColor: [253, 248, 242] as RGB };
  const margins = { left: M, right: M, bottom: 14 };

  /* ── Table ── */
  if (type === "contacts") {
    autoTable(doc, {
      startY: 40,
      head: [["#", "Name", "Email", "Subject", "Message", "Date"]],
      body: (data as ContactMessage[]).map((c, i) => [
        i + 1, c.name || "—", c.email || "—",
        c.subject || "—", c.message || "—", fmt(c.createdAt),
      ]),
      styles: { ...baseStyles, fontSize: 8.5, cellPadding: 2.8 },
      headStyles: { ...headSt, fontSize: 8 },
      alternateRowStyles: altRow,
      columnStyles: {
        0: { cellWidth: 8,  halign: "center", fontStyle: "bold", textColor: [185, 147, 74] as RGB },
        1: { cellWidth: 26, fontStyle: "bold" },
        2: { cellWidth: 38, fontSize: 7.5 },
        3: { cellWidth: 34 },
        4: { cellWidth: 62, fontSize: 8, textColor: [91, 45, 30] as RGB },
        5: { cellWidth: 18, halign: "center", fontSize: 7.5, textColor: [122, 74, 42] as RGB },
      },
      margin: margins,
    });
  } else {
    autoTable(doc, {
      startY: 40,
      head: [["#", "Name", "Mobile", "Profession", "Location", "Ashram", "How Known", "Message", "Date"]],
      body: (data as AudienceBooking[]).map((b, i) => [
        i + 1, b.fullName || "—", b.mobile || "—",
        b.profession || "—", b.location || "—",
        b.nearestAshram || "—", b.howKnown || "—",
        b.message || "—", fmt(b.createdAt),
      ]),
      styles: { ...baseStyles, fontSize: 7.5, cellPadding: 2.2 },
      headStyles: { ...headSt, fontSize: 7 },
      alternateRowStyles: altRow,
      columnStyles: {
        0: { cellWidth: 7,  halign: "center", fontStyle: "bold", textColor: [185, 147, 74] as RGB },
        1: { cellWidth: 22, fontStyle: "bold" },
        2: { cellWidth: 18 },
        3: { cellWidth: 19 },
        4: { cellWidth: 19 },
        5: { cellWidth: 22 },
        6: { cellWidth: 19 },
        7: { cellWidth: 42, fontSize: 7, textColor: [91, 45, 30] as RGB },
        8: { cellWidth: 18, halign: "center", fontSize: 7, textColor: [122, 74, 42] as RGB },
      },
      margin: margins,
    });
  }

  /* ── Footer on every page ── */
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    const H = doc.internal.pageSize.height;
    doc.setDrawColor(185, 147, 74);
    doc.setLineWidth(0.5);
    doc.line(M, H - 10, PW - M, H - 10);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(155, 122, 94);
    doc.text("Gurumurthy Guruji Admin Console — Confidential", M, H - 6);
    doc.text(today, PW - M, H - 6, { align: "right" });
  }

  /* ── Direct download — no dialog ── */
  doc.save(type === "contacts"
    ? "contact-messages-" + dateStr + ".pdf"
    : "audience-bookings-" + dateStr + ".pdf");
}



/* ════════════════════════════════════════════════════════════════════
   LOGIN SCREEN  (2-step OTP — verified against DB)
════════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: (name: string, mobile: string) => void }) {
  const [step,    setStep]    = useState<"phone" | "otp">("phone");
  const [mobile,  setMobile]  = useState("");
  const [otp,     setOtp]     = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");

  const FIXED_OTP = "123456";

  const field: React.CSSProperties = {
    display: "block", width: "100%", height: 48,
    border: "1.5px solid rgba(185,147,69,0.35)",
    borderRadius: 10, fontSize: 15, color: "#3b1a0e",
    background: "#fdf8f2", outline: "none",
    boxSizing: "border-box", paddingLeft: 44, paddingRight: 14, fontWeight: 500,
  };

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (mobile.length !== 10) { setErr("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    try {
      const res = await adminSendOtp(mobile);
      setAdminName(res.otp); // we reuse the response to get the name later via verify
      setStep("otp");
    } catch (ex: any) {
      setErr(ex?.message || "Mobile not registered as admin");
    } finally { setLoading(false); }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!otp) { setErr("Enter the OTP"); return; }
    if (otp !== FIXED_OTP) { setErr("Incorrect OTP. Please try again"); return; }
    setLoading(true);
    try {
      const user = await adminVerifyOtp(mobile, otp);
      sessionStorage.setItem("admin_key",    otp);
      sessionStorage.setItem("admin_name",   user.name);
      sessionStorage.setItem("admin_mobile", mobile);
      sessionStorage.setItem("admin_role",   user.role);
      onLogin(user.name, mobile);
    } catch (ex: any) {
      setErr(ex?.message || "Incorrect OTP. Please try again");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: 16, background: COSMIC, position: "relative" }}>
      {/* OM watermark */}
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", userSelect: "none", opacity: 0.04 }}>
        <span style={{ fontFamily: "serif", fontSize: 500, lineHeight: 1, color: "#f5e6c8" }}>ॐ</span>
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 400, overflow: "hidden", borderRadius: 22, border: "1px solid rgba(185,147,69,0.3)", background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.38)" }}>

        {/* Header */}
        <div style={{ padding: "28px 28px 24px", textAlign: "center", background: COSMIC }}>
          <div style={{ margin: "0 auto 12px", width: 52, height: 52, borderRadius: "50%", background: "rgba(245,230,200,0.12)", border: "1.5px solid rgba(245,230,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "serif", fontSize: 26, color: "#f5e6c8" }}>ॐ</span>
          </div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(245,230,200,0.45)", marginBottom: 4 }}>Admin Console</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#f5e6c8" }}>Gurumurthy Guruji</p>
        </div>

        {/* ── STEP 1: Phone ── */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} style={{ padding: "26px 26px 30px" }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#3b1a0e", marginBottom: 4 }}>Sign in to your account</p>
            <p style={{ fontSize: 13, color: "#9b7a5e", marginBottom: 22 }}>Enter your registered admin phone number</p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a4a2a", marginBottom: 7 }}>Phone Number</label>
              <div style={{ position: "relative" }}>
                <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#b9934a" }} />
                <input type="tel" inputMode="numeric" maxLength={10} value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, "")); setErr(""); }}
                  placeholder="Enter 10-digit mobile" autoFocus
                  style={{ ...field, border: `1.5px solid ${err ? "#dc2626" : "rgba(185,147,69,0.35)"}` }} />
              </div>
            </div>

            {err && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "9px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12.5, fontWeight: 600 }}><AlertCircle size={14} /> {err}</div>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", height: 48, borderRadius: 10, border: "none", background: loading ? "rgba(185,147,69,0.5)" : "linear-gradient(135deg,#c9822b,#b9934a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(185,147,69,0.3)" }}>
              {loading ? "Verifying…" : <><span>Send OTP</span><ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} style={{ padding: "26px 26px 30px" }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#3b1a0e", marginBottom: 4 }}>Verify OTP</p>
            <p style={{ fontSize: 13, color: "#9b7a5e", marginBottom: 4 }}>
              OTP sent to <strong style={{ color: "#3b1a0e" }}>+91 {mobile}</strong>
            </p>
            <button type="button" onClick={() => { setStep("phone"); setOtp(""); setErr(""); }}
              style={{ fontSize: 12, fontWeight: 600, color: "#b9934a", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20, textDecoration: "underline" }}>
              ← Change number
            </button>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a4a2a", marginBottom: 7 }}>Enter OTP</label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#b9934a" }} />
                <input type="tel" inputMode="numeric" maxLength={10} value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setErr(""); }}
                  placeholder="Enter OTP" autoFocus
                  style={{ ...field, letterSpacing: "0.2em", border: `1.5px solid ${err ? "#dc2626" : "rgba(185,147,69,0.35)"}` }} />
              </div>
            </div>

            {err && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "9px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12.5, fontWeight: 600 }}><AlertCircle size={14} /> {err}</div>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", height: 48, borderRadius: 10, border: "none", background: loading ? "rgba(185,147,69,0.5)" : "linear-gradient(135deg,#c9822b,#b9934a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(185,147,69,0.3)" }}>
              {loading ? "Verifying…" : <><CheckCircle2 size={16} /> Verify & Sign In</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DETAIL PANEL  (right-side slide-in)
════════════════════════════════════════════════════════════════════ */
function DetailPanel({
  item,
  tab,
  onClose,
}: {
  item: AudienceBooking | ContactMessage;
  tab: Tab;
  onClose: () => void;
}) {
  const isBooking = tab === "bookings";
  const name    = isBooking ? (item as AudienceBooking).fullName  : (item as ContactMessage).name;
  const initial = (name || "?")[0].toUpperCase();
  const sub     = isBooking ? (item as AudienceBooking).mobile    : (item as ContactMessage).email;

  const detailRows: [string, string][] = isBooking
    ? [
        ["Full Name",      (item as AudienceBooking).fullName],
        ["Mobile",         (item as AudienceBooking).mobile],
        ["Profession",     (item as AudienceBooking).profession],
        ["Location",       (item as AudienceBooking).location],
        ["Nearest Ashram", (item as AudienceBooking).nearestAshram],
        ["How Known",      (item as AudienceBooking).howKnown],
        ["Message",        (item as AudienceBooking).message || "—"],
      ]
    : [
        ["Name",    (item as ContactMessage).name],
        ["Email",   (item as ContactMessage).email],
        ["Subject", (item as ContactMessage).subject],
        ["Message", (item as ContactMessage).message],
      ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(2px)" }}
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
          width: 420, maxWidth: "100vw",
          background: "#f6f4f1",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}
      >
        {/* ── Panel Header ── */}
        <div style={{ background: COSMIC, padding: "20px 20px 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,230,200,0.45)" }}>
              {isBooking ? "Audience Booking" : "Contact Message"}
            </span>
            <button onClick={onClose}
              style={{ background: "rgba(245,230,200,0.12)", border: "1px solid rgba(245,230,200,0.22)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#f5e6c8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Avatar */}
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9822b,#b9934a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20, fontWeight: 800, color: "#fff", boxShadow: "0 2px 12px rgba(185,147,69,0.4)" }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#f5e6c8", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
              <p style={{ fontSize: 12, color: "rgba(245,230,200,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</p>
            </div>
            {/* Status badge */}
            <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: 20, padding: "3px 10px" }}>
              Received
            </span>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Intake / Contact Details Card */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ede6d6", overflow: "hidden", boxShadow: "0 1px 8px rgba(75,13,19,0.05)" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0e8d8", display: "flex", alignItems: "center", gap: 8 }}>
              <ClipboardList size={14} color="#b9934a" />
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9b7a5e" }}>
                {isBooking ? "Intake Details" : "Message Details"}
              </span>
            </div>
            <div style={{ padding: "6px 0" }}>
              {detailRows.map(([label, val]) => (
                <div key={label} style={{ display: "flex", padding: "9px 16px", borderBottom: "1px solid #f9f4ee" }}>
                  <span style={{ width: 120, minWidth: 120, fontSize: 12, fontWeight: 600, color: "#9b7a5e" }}>{label}</span>
                  <span style={{ flex: 1, fontSize: 13, color: "#3b1a0e", wordBreak: "break-word", lineHeight: 1.5 }}>{val || "—"}</span>
                </div>
              ))}
              <div style={{ display: "flex", padding: "9px 16px" }}>
                <span style={{ width: 120, minWidth: 120, fontSize: 12, fontWeight: 600, color: "#9b7a5e" }}>Submitted</span>
                <span style={{ flex: 1, fontSize: 13, color: "#3b1a0e" }}>{fmt(item.createdAt)} &nbsp;<span style={{ color: "#9b7a5e" }}>{fmtTime(item.createdAt)}</span></span>
              </div>
            </div>
          </div>

          {/* Status card — single "received" confirmation */}
          <div style={{ background: "#f0fdf4", borderRadius: 14, border: "1px solid #bbf7d0", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#dcfce7", border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle2 size={20} color="#16a34a" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d", marginBottom: 2 }}>
                {isBooking ? "Booking Received" : "Message Received"}
              </p>
              <p style={{ fontSize: 11.5, color: "#166534" }}>
                {fmt(item.createdAt)} at {fmtTime(item.createdAt)}
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ADMIN USER PANEL  (add / edit — right slide-in)
════════════════════════════════════════════════════════════════════ */
const AVATAR_COLORS = ["#c9822b","#7c3aed","#0891b2","#059669","#dc2626","#d97706"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function AdminPanel({
  admin,
  onClose,
  onSave,
}: {
  admin: AdminUser | null;
  onClose: () => void;
  onSave: (u: AdminUser) => void;
}) {
  const isEdit = !!admin;
  const [name,   setName]   = useState(admin?.name   || "");
  const [mobile, setMobile] = useState(admin?.mobile || "");
  const [role,   setRole]   = useState<"admin"|"superadmin">(admin?.role || "admin");
  const [status, setStatus] = useState(admin?.status || "active");
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Name is required"); return; }
    if (!isEdit && !/^\d{10}$/.test(mobile)) { setErr("Enter valid 10-digit mobile"); return; }
    setSaving(true);
    try {
      let saved: AdminUser;
      if (isEdit && admin) {
        saved = await updateAdminUser(admin.id, { name: name.trim(), role, status });
      } else {
        saved = await createAdminUser({ name: name.trim(), mobile, role });
      }
      onSave(saved);
    } catch (e: any) {
      setErr(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const inp: React.CSSProperties = {
    display: "block", width: "100%", height: 46,
    border: "1.5px solid #e2d5c0", borderRadius: 10,
    fontSize: 14, color: "#3b1a0e", background: "#fff",
    outline: "none", paddingLeft: 14, paddingRight: 14,
    boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const inpWithIcon: React.CSSProperties = { ...inp, paddingLeft: 40 };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: "#5b3a1e", marginBottom: 7,
  };

  return (
    <>
      <motion.div key="ab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }} />
      <motion.div key="ap" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 301, width: 460, maxWidth: "100vw", background: "#f5f5f5", boxShadow: "-8px 0 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

        {/* ── Header strip ── */}
        <div style={{ background: COSMIC, padding: "22px 22px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(245,230,200,0.45)" }}>
              {isEdit ? "Edit Admin User" : "Add New Admin"}
            </p>
            <button onClick={onClose} style={{ background: "rgba(245,230,200,0.1)", border: "1px solid rgba(245,230,200,0.2)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#f5e6c8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: name ? avatarColor(name) : "rgba(245,230,200,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
              {name ? name[0].toUpperCase() : <UserPlus size={22} color="rgba(245,230,200,0.5)" />}
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#f5e6c8", lineHeight: 1.3 }}>{name || "New Admin"}</p>
              <p style={{ fontSize: 12, color: "rgba(245,230,200,0.5)", marginTop: 2 }}>{isEdit ? `Editing · ${admin?.mobile}` : "Fill in the details below"}</p>
            </div>
          </div>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={submit} style={{ flex: 1, overflowY: "auto", padding: "20px 20px 32px" }}>

          {/* White card */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e0d5", padding: "22px 20px", boxShadow: "0 2px 12px rgba(75,13,19,0.06)", display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name <span style={{ color: "#dc2626" }}>*</span></label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ravi Kumar" style={inp} />
            </div>

            {/* Mobile — readonly on edit */}
            <div>
              <label style={labelStyle}>
                Mobile Number <span style={{ color: "#dc2626" }}>*</span>
                {isEdit && <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 500, color: "#9b7a5e", background: "#fdf8f2", border: "1px solid #e2d5c0", borderRadius: 4, padding: "1px 6px" }}>cannot be changed</span>}
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: isEdit ? "#c4b5a0" : "#b9934a" }} />
                <input
                  type="tel" inputMode="numeric" maxLength={10}
                  value={mobile}
                  onChange={e => !isEdit && setMobile(e.target.value.replace(/\D/g, ""))}
                  readOnly={isEdit}
                  placeholder="10-digit mobile number"
                  style={{ ...inpWithIcon, background: isEdit ? "#f5f0ea" : "#fff", color: isEdit ? "#9b7a5e" : "#3b1a0e", cursor: isEdit ? "not-allowed" : "text", border: `1.5px solid ${isEdit ? "#e2d5c0" : "#e2d5c0"}` }}
                />
              </div>
            </div>

            {/* Role — dropdown */}
            <div>
              <label style={labelStyle}>Role <span style={{ color: "#dc2626" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <ShieldCheck size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b9934a", pointerEvents: "none" }} />
                <select value={role} onChange={e => setRole(e.target.value as "admin" | "superadmin")}
                  style={{ ...inpWithIcon, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: 36, background: "#fff" }}>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b9934a" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            {/* Status (edit only) */}
            {isEdit && (
              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ position: "relative" }}>
                  <select value={status} onChange={e => setStatus(e.target.value as "active" | "inactive")}
                    style={{ ...inp, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: 36, color: status === "active" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b9934a" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            )}

          </div>

          {/* Error */}
          {err && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "11px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, fontWeight: 600 }}>
              <AlertCircle size={15} /> {err}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={saving}
            style={{ width: "100%", height: 50, marginTop: 20, borderRadius: 12, border: "none", background: saving ? "rgba(185,147,69,0.5)" : "linear-gradient(135deg,#c9822b,#b9934a)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 4px 18px rgba(185,147,69,0.35)", transition: "all 0.2s" }}>
            {saving ? "Saving…" : isEdit ? <><Pencil size={16} /> Update Admin</> : <><UserPlus size={16} /> Add Admin</>}
          </button>
        </form>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed,    setAuthed]    = useState(false);
  const [loggedName, setLoggedName] = useState("");
  const [loggedMobile, setLoggedMobile] = useState("");
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<AudienceBooking[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [admins,   setAdmins]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<AudienceBooking | ContactMessage | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [adminPanel, setAdminPanel] = useState<{ open: boolean; user: AdminUser | null }>({ open: false, user: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterBooking, setFilterBooking] = useState("all"); // ashram filter
  const [filterContact, setFilterContact] = useState("all"); // date-period filter

  /* ── check existing session ── */
  useEffect(() => {
    if (sessionStorage.getItem("admin_key")) {
      setAuthed(true);
      setLoggedName(sessionStorage.getItem("admin_name") || "Super Admin");
      setLoggedMobile(sessionStorage.getItem("admin_mobile") || "");
    }
  }, []);

  /* ── once admins load, sync the correct mobile for current user ── */
  useEffect(() => {
    if (!admins.length) return;
    const storedName = sessionStorage.getItem("admin_name");
    const storedMobile = sessionStorage.getItem("admin_mobile");
    if (storedMobile) return; // already correct
    const match = admins.find(a => a.name === storedName);
    if (match) {
      setLoggedMobile(match.mobile);
      sessionStorage.setItem("admin_mobile", match.mobile);
    }
  }, [admins]);

  /* ── fetch data ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [b, c, a] = await Promise.all([getAudienceBookings(), getContacts(), getAdminUsers()]);
      setBookings(b);
      setContacts(c);
      setAdmins(a);
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  async function refresh() {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  function logout() {
    sessionStorage.removeItem("admin_key");
    sessionStorage.removeItem("admin_name");
    sessionStorage.removeItem("admin_mobile");
    setAuthed(false);
    setLoggedName("");
    setLoggedMobile("");
  }

  /* ── unique ashram values for bookings filter dropdown (must be before any early return) ── */
  const ashramOptions = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.nearestAshram).filter(Boolean))).sort(),
    [bookings],
  );

  if (!authed) return (
    <LoginScreen onLogin={(name, mobile) => {
      setLoggedName(name);
      setLoggedMobile(mobile);
      setAuthed(true);
    }} />
  );

  /* ── filtered + paginated data ── */
  const raw = tab === "bookings" ? bookings : contacts;
  const q   = search.toLowerCase();
  const filtered = raw.filter((r) => {
    /* text search */
    let match = true;
    if (q) {
      if (tab === "bookings") {
        const b = r as AudienceBooking;
        match =
          !!b.fullName?.toLowerCase().includes(q) ||
          !!b.mobile?.includes(q) ||
          !!b.location?.toLowerCase().includes(q) ||
          !!b.nearestAshram?.toLowerCase().includes(q);
      } else {
        const c = r as ContactMessage;
        match =
          !!c.name?.toLowerCase().includes(q) ||
          !!c.email?.toLowerCase().includes(q) ||
          !!c.subject?.toLowerCase().includes(q);
      }
    }
    if (!match) return false;

    /* dropdown filter */
    if (tab === "bookings" && filterBooking !== "all") {
      return (r as AudienceBooking).nearestAshram === filterBooking;
    }
    if (tab === "contacts" && filterContact !== "all") {
      const d   = new Date(r.createdAt ?? "");
      const now = new Date();
      if (filterContact === "today")
        return d.toDateString() === now.toDateString();
      if (filterContact === "week") {
        const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= cutoff;
      }
      if (filterContact === "month")
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── column definitions ── */
  const bookingCols = ["Name", "Mobile", "Profession", "Location", "Ashram", "Date"];
  const contactCols = ["Name", "Email", "Subject", "Date"];

  /* close sidebar when tab changes on mobile; reset filters */
  const tabChange = (t: Tab) => {
    setTab(t); setPage(1); setSearch("");
    setFilterBooking("all"); setFilterContact("all");
    setSidebarOpen(false);
  };

  return (
    <div className="adm-root">

      {/* ── MOBILE SIDEBAR BACKDROP ─────────────────────────────────── */}
      {sidebarOpen && (
        <div className="adm-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
      <aside className={`adm-sidebar${sidebarOpen ? " adm-sidebar--open" : ""}`}>

        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(185,147,69,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(245,230,200,0.12)", border: "1.5px solid rgba(245,230,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "serif", fontSize: 18, color: "#f5e6c8" }}>ॐ</span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                <span style={{ color: "#f5e6c8" }}>Gurumurthy </span><span style={{ color: "#c9822b" }}>Guruji</span>
              </p>
              <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,230,200,0.4)", marginTop: 1 }}>Admin Console</p>
            </div>
          </div>
          <div style={{ marginTop: 14, borderRadius: 6, padding: "5px 10px", background: "rgba(201,130,43,0.2)", border: "1px solid rgba(201,130,43,0.35)", display: "inline-block" }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9822b" }}>Super Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "20px 12px", overflowY: "auto" }}>
          <p style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,230,200,0.35)", padding: "0 8px", marginBottom: 8 }}>
            Submissions
          </p>
          {([
            { key: "bookings", label: "Audience Bookings", icon: Users },
            { key: "contacts", label: "Contact Messages",  icon: Mail  },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => tabChange(key)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, background: tab === key ? "rgba(245,230,200,0.13)" : "transparent", borderLeft: tab === key ? "2.5px solid #c9822b" : "2.5px solid transparent", transition: "all 0.15s" }}>
              <Icon size={16} color={tab === key ? "#f5e6c8" : "rgba(245,230,200,0.45)"} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", color: tab === key ? "#f5e6c8" : "rgba(245,230,200,0.55)" }}>{label}</span>
            </button>
          ))}
          <p style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,230,200,0.35)", padding: "0 8px", marginTop: 20, marginBottom: 8 }}>
            Configuration
          </p>
          <button onClick={() => tabChange("admins")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, background: tab === "admins" ? "rgba(245,230,200,0.13)" : "transparent", borderLeft: tab === "admins" ? "2.5px solid #c9822b" : "2.5px solid transparent", transition: "all 0.15s" }}>
            <ShieldCheck size={16} color={tab === "admins" ? "#f5e6c8" : "rgba(245,230,200,0.45)"} />
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", color: tab === "admins" ? "#f5e6c8" : "rgba(245,230,200,0.55)" }}>Admin Users</span>
          </button>
        </nav>

        {/* Logged-in user + Sign Out */}
        <div style={{ padding: "14px 14px 16px", borderTop: "1px solid rgba(185,147,69,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9822b,#b9934a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {(loggedName || "S")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#f5e6c8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loggedName || "Super Admin"}</p>
              <p style={{ fontSize: 10.5, color: "rgba(245,230,200,0.45)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loggedMobile}</p>
            </div>
          </div>
          <button onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "7px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "rgba(245,230,200,0.45)", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <main className="adm-main">

        {/* ── Admins tab: white top bar ───────────────────────────────── */}
        {tab === "admins" && (
          <header className="adm-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="adm-hamburger" onClick={() => setSidebarOpen(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#3b1a0e", display: "flex", alignItems: "center" }}>
                <Menu size={22} />
              </button>
              <div>
                <p className="adm-header-sub">Configuration</p>
                <h1 className="adm-header-title">Admin Users</h1>
              </div>
            </div>
            <div className="adm-header-actions">
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", flexShrink: 0 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
                <span className="adm-live-text" style={{ fontSize: 11, fontWeight: 700, color: "#15803d" }}>Live</span>
              </div>
              <button onClick={() => setAdminPanel({ open: true, user: null })} className="adm-btn-gold">
                <UserPlus size={14} />
                <span className="adm-btn-label">New Admin</span>
              </button>
              <button onClick={refresh} className="adm-btn-outline">
                <RefreshCw size={13} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                <span className="adm-btn-label">Refresh</span>
              </button>
            </div>
          </header>
        )}

        {/* ── Bookings / Contacts: dark hero card ─────────────────────── */}
        {tab !== "admins" && (
          <div className="adm-hero-card">
            <div className="adm-hero-row">

              {/* Left: hamburger (mobile) + icon + title */}
              <div className="adm-hero-left">
                <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}>
                  <Menu size={20} />
                </button>
                <div className="adm-hero-icon-wrap">
                  {tab === "bookings" ? <Users size={22} color="#f5e6c8" /> : <Mail size={22} color="#f5e6c8" />}
                </div>
                <div className="adm-hero-text">
                  <p className="adm-hero-eyebrow">Submissions</p>
                  <h1 className="adm-hero-h1">
                    {tab === "bookings" ? "Audience Bookings" : "Contact Messages"}
                  </h1>
                  <p className="adm-hero-desc">
                    {tab === "bookings" ? "Manage audience booking submissions" : "Manage incoming contact messages"}
                  </p>
                </div>
              </div>

              {/* Right: count + actions */}
              <div className="adm-hero-right">
                <div className="adm-hero-count">
                  <span className="adm-hero-count-num">{filtered.length}</span>
                  <span className="adm-hero-count-lbl">
                    {tab === "bookings" ? "Bookings" : "Messages"}
                  </span>
                </div>
                <div className="adm-hero-sep" />
                {/* Actions group — kept together so they never split across lines */}
                <div className="adm-hero-actions">
                  <div className="adm-hero-live">
                    <span className="adm-live-dot" />
                    <span>Live</span>
                  </div>
                  <button className="adm-hero-btn-out" onClick={refresh}>
                    <RefreshCw size={13} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                    <span className="adm-hero-btn-txt">Refresh</span>
                  </button>
                  <button
                    className="adm-hero-btn-gold"
                    onClick={() => downloadPdfDirect(tab, tab === "bookings" ? bookings : contacts)}
                  >
                    <FileDown size={14} />
                    <span className="adm-hero-btn-txt">Download PDF</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Search + filter bar */}
        {tab !== "admins" && (
          <div className="adm-searchbar">
            {/* Search input */}
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b9934a", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder={tab === "bookings" ? "Search name, mobile, ashram…" : "Search name, email, subject…"}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="adm-search-input"
              />
            </div>

            {/* Filter dropdown */}
            {tab === "bookings" ? (
              <CustomSelect
                value={filterBooking}
                onChange={(v) => { setFilterBooking(v); setPage(1); }}
                options={[
                  { value: "all", label: "All Ashrams" },
                  ...ashramOptions.map((a) => ({ value: a, label: a })),
                ]}
              />
            ) : (
              <CustomSelect
                value={filterContact}
                onChange={(v) => { setFilterContact(v); setPage(1); }}
                options={[
                  { value: "all",   label: "All Time"   },
                  { value: "today", label: "Today"       },
                  { value: "week",  label: "This Week"   },
                  { value: "month", label: "This Month"  },
                ]}
              />
            )}
          </div>
        )}

        {/* ── Admin Users Table ── */}
        {tab === "admins" && (
          <div className="adm-content">
            <p style={{ fontSize: 13, color: "#9b7a5e", marginBottom: 18 }}>
              Manage who can log in to the admin console.
            </p>
            <div className="adm-table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fdf8f2", borderBottom: "1.5px solid #ede6d6" }}>
                    {["Admin", "Role", "Sections", "Last Login", "Status", ""].map(h => (
                      <th key={h} style={{ ...th }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#a08060", fontSize: 14 }}>No admin users found</td></tr>
                  ) : admins.map((a, i) => {
                    const color = avatarColor(a.name);
                    const isSuperAdmin = a.role === "superadmin";
                    return (
                      <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#fdf8f2", borderBottom: "1px solid #f0e8d8", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fef3e2")}
                        onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fdf8f2")}>
                        <td style={{ ...td }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                              {a.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#3b1a0e" }}>{a.name}</p>
                              <p style={{ fontSize: 11, color: "#9b7a5e", fontFamily: "monospace" }}>{a.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...td }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", borderRadius: 20, padding: "3px 10px", background: isSuperAdmin ? "#fef3e2" : "#ede9fe", color: isSuperAdmin ? "#c9822b" : "#7c3aed", border: `1px solid ${isSuperAdmin ? "rgba(201,130,43,0.35)" : "rgba(124,58,237,0.3)"}` }}>
                            <ShieldCheck size={11} /> {isSuperAdmin ? "SUPERADMIN" : "ADMIN"}
                          </span>
                        </td>
                        <td style={{ ...td, color: "#9b7a5e", fontSize: 12 }}>
                          {a.sectionsCount === 0 ? <em>All sections</em> : `${a.sectionsCount} section${a.sectionsCount !== 1 ? "s" : ""}`}
                        </td>
                        <td style={{ ...td, color: "#9b7a5e", fontSize: 12, whiteSpace: "nowrap" }}>
                          {a.lastLogin ? `${fmt(a.lastLogin)}, ${fmtTime(a.lastLogin)}` : <em style={{ color: "#c4b5a0" }}>Never</em>}
                        </td>
                        <td style={{ ...td }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", background: a.status === "active" ? "#f0fdf4" : "#fef2f2", color: a.status === "active" ? "#16a34a" : "#dc2626", border: `1px solid ${a.status === "active" ? "#bbf7d0" : "#fecaca"}` }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.status === "active" ? "#16a34a" : "#dc2626" }} />
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ ...td }}>
                          <button onClick={() => setAdminPanel({ open: true, user: a })}
                            style={{ background: "#fdf8f2", border: "1px solid rgba(185,147,69,0.3)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: "#b9934a", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                            <Pencil size={12} /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Bookings / Contacts Table ── */}
        {tab !== "admins" && (
          <div className="adm-content">
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#9b7a5e", fontSize: 14, gap: 10 }}>
                <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
              </div>
            ) : error ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 10 }}>
                <AlertCircle size={32} color="#dc2626" />
                <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 600 }}>{error}</p>
                <button onClick={fetchData} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #dc2626", background: "#fff", color: "#dc2626", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Retry</button>
              </div>
            ) : (
              <div className="adm-table-wrap">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#2c1810" }}>
                      <th style={{ ...th, color: "rgba(245,230,200,0.6)", width: 44 }}>#</th>
                      {(tab === "bookings" ? bookingCols : contactCols).map((col) => (
                        <th key={col} style={{ ...th, color: "rgba(245,230,200,0.6)" }}>{col}</th>
                      ))}
                      <th style={{ ...th, color: "rgba(245,230,200,0.6)", width: 60 }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slice.length === 0 ? (
                      <tr>
                        <td colSpan={tab === "bookings" ? 8 : 6} style={{ padding: "48px 20px", textAlign: "center", color: "#a08060", fontSize: 14 }}>
                          No records found
                        </td>
                      </tr>
                    ) : (
                      slice.map((row, i) => {
                        const idx = (safePage - 1) * PAGE_SIZE + i + 1;
                        const isEven = i % 2 === 0;
                        return (
                          <tr key={row.id}
                            style={{ background: isEven ? "#fff" : "#fdf8f2", borderBottom: "1px solid #f0e8d8", cursor: "pointer", transition: "background 0.1s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef3e2")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = isEven ? "#fff" : "#fdf8f2")}>
                            <td style={{ ...td, color: "#b9934a", fontWeight: 700, fontSize: 12 }}>{idx}</td>
                            {tab === "bookings" ? (
                              <>
                                <td style={{ ...td, fontWeight: 600, color: "#3b1a0e" }}>{(row as AudienceBooking).fullName}</td>
                                <td style={{ ...td, color: "#5b2d1e", fontFamily: "monospace" }}>{(row as AudienceBooking).mobile}</td>
                                <td style={{ ...td }}>{(row as AudienceBooking).profession}</td>
                                <td style={{ ...td }}>{(row as AudienceBooking).location}</td>
                                <td style={{ ...td }}>
                                  <span style={{ background: "#fef3e2", border: "1px solid rgba(185,147,69,0.3)", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 600, color: "#b9934a", whiteSpace: "nowrap" }}>
                                    {(row as AudienceBooking).nearestAshram?.split(",")[0]}
                                  </span>
                                </td>
                                <td style={{ ...td, color: "#9b7a5e", fontSize: 12, whiteSpace: "nowrap" }}>{fmt(row.createdAt)}</td>
                              </>
                            ) : (
                              <>
                                <td style={{ ...td, fontWeight: 600, color: "#3b1a0e" }}>{(row as ContactMessage).name}</td>
                                <td style={{ ...td, color: "#5b2d1e" }}>{(row as ContactMessage).email}</td>
                                <td style={{ ...td }}>
                                  <span style={{ display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {(row as ContactMessage).subject}
                                  </span>
                                </td>
                                <td style={{ ...td, color: "#9b7a5e", fontSize: 12, whiteSpace: "nowrap" }}>{fmt(row.createdAt)}</td>
                              </>
                            )}
                            <td style={{ ...td }}>
                              <button onClick={() => setDetail(row)}
                                style={{ background: "#fdf8f2", border: "1px solid rgba(185,147,69,0.3)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: "#b9934a", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                                <Eye size={13} /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {tab !== "admins" && !loading && !error && filtered.length > PAGE_SIZE && (
          <footer className="adm-pagination">
            <p style={{ fontSize: 12, color: "#9b7a5e" }}>
              Page {safePage} of {totalPages} · {filtered.length} total
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ ...pagBtn, opacity: safePage <= 1 ? 0.4 : 1 }}>
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = Math.max(1, Math.min(totalPages - 4, safePage - 2)) + i;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    style={{ ...pagBtn, background: pg === safePage ? "#b9934a" : "#fdf8f2", color: pg === safePage ? "#fff" : "#5b2d1e", fontWeight: pg === safePage ? 700 : 600 }}>
                    {pg}
                  </button>
                );
              })}
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{ ...pagBtn, opacity: safePage >= totalPages ? 0.4 : 1 }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </footer>
        )}
      </main>

      {/* Detail Panel */}
      <AnimatePresence>
        {detail && <DetailPanel item={detail} tab={tab} onClose={() => setDetail(null)} />}
      </AnimatePresence>

      {/* Admin User Panel */}
      <AnimatePresence>
        {adminPanel.open && (
          <AdminPanel
            admin={adminPanel.user}
            onClose={() => setAdminPanel({ open: false, user: null })}
            onSave={(saved) => {
              setAdmins(prev => {
                const idx = prev.findIndex(a => a.id === saved.id);
                return idx >= 0 ? prev.map(a => a.id === saved.id ? saved : a) : [...prev, saved];
              });
              setAdminPanel({ open: false, user: null });
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* ── Base reset ─────────────────────────────── */
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f5f0ea; }
        ::-webkit-scrollbar-thumb { background: rgba(185,147,69,0.4); border-radius: 3px; }

        /* ── Layout shell ───────────────────────────── */
        .adm-root {
          display: flex;
          height: 100vh;
          font-family: 'Inter','Segoe UI',sans-serif;
          background: #f5f5f5;
          overflow: hidden;
          position: relative;
        }

        /* ── Sidebar ────────────────────────────────── */
        .adm-sidebar {
          width: 210px;
          min-width: 210px;
          display: flex;
          flex-direction: column;
          background: ${COSMIC};
          border-right: 1px solid rgba(185,147,69,0.2);
          flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
          z-index: 400;
        }

        /* ── Main ───────────────────────────────────── */
        .adm-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* ── Hamburger (hidden on desktop) ──────────── */
        .adm-hamburger { display: none !important; }

        /* ── Mobile backdrop ────────────────────────── */
        .adm-backdrop { display: none; }

        /* ── Top bar ────────────────────────────────── */
        .adm-header {
          padding: 0 28px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border-bottom: 1px solid #e8e0d5;
          flex-shrink: 0;
          gap: 12px;
        }
        .adm-header-sub {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #b9934a;
        }
        .adm-header-title {
          font-size: 18px;
          font-weight: 800;
          color: #3b1a0e;
          line-height: 1.2;
          white-space: nowrap;
        }
        .adm-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .adm-live-text { display: inline; }

        /* ── Shared button styles ───────────────────── */
        .adm-btn-gold {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg,#c9822b,#b9934a);
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 2px 10px rgba(185,147,69,0.3);
          white-space: nowrap;
        }
        .adm-btn-outline {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid #e2d5c0;
          background: #fdf8f2;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: #5b2d1e;
          white-space: nowrap;
        }

        /* ── Hero card (bookings / contacts) ───────── */
        .adm-hero-card {
          background: ${COSMIC};
          border-bottom: 1px solid rgba(185,147,69,0.18);
          padding: 22px 28px 20px;
          flex-shrink: 0;
        }
        .adm-hero-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        /* Left side */
        .adm-hero-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1;
        }
        .adm-hero-ham {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #f5e6c8;
          padding: 4px;
          flex-shrink: 0;
          align-items: center;
        }
        .adm-hero-icon-wrap {
          width: 50px; height: 50px;
          border-radius: 50%;
          background: rgba(245,230,200,0.1);
          border: 1.5px solid rgba(245,230,200,0.22);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .adm-hero-text { min-width: 0; }
        .adm-hero-eyebrow {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(245,230,200,0.45); margin-bottom: 3px;
        }
        .adm-hero-h1 {
          font-size: 20px; font-weight: 900;
          color: #f5e6c8; line-height: 1.2; margin: 0;
        }
        .adm-hero-desc {
          font-size: 11.5px;
          color: rgba(245,230,200,0.42);
          margin-top: 3px;
        }
        /* Right side */
        .adm-hero-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .adm-hero-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .adm-hero-count { text-align: center; min-width: 36px; }
        .adm-hero-count-num {
          display: block; font-size: 28px; font-weight: 900;
          color: #c9822b; line-height: 1;
        }
        .adm-hero-count-lbl {
          display: block; font-size: 8px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(245,230,200,0.36); margin-top: 2px;
        }
        .adm-hero-sep {
          width: 1px; height: 36px;
          background: rgba(245,230,200,0.12); flex-shrink: 0;
        }
        .adm-hero-live {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 20px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.28);
          font-size: 11px; font-weight: 700; color: #4ade80;
          white-space: nowrap; flex-shrink: 0;
        }
        .adm-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e; flex-shrink: 0;
          display: inline-block;
        }
        .adm-hero-btn-out {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          border: 1.5px solid rgba(245,230,200,0.2);
          background: rgba(245,230,200,0.08);
          cursor: pointer; font-size: 12px; font-weight: 700;
          color: rgba(245,230,200,0.82); white-space: nowrap;
          flex-shrink: 0;
        }
        .adm-hero-btn-gold {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px; border: none;
          background: linear-gradient(135deg,#c9822b,#b9934a);
          cursor: pointer; font-size: 12px; font-weight: 700;
          color: #fff; white-space: nowrap;
          box-shadow: 0 2px 12px rgba(185,147,69,0.35);
          flex-shrink: 0;
        }
        .adm-hero-btn-txt { display: inline; }

        /* ── Search bar ─────────────────────────────── */
        .adm-searchbar {
          padding: 14px 28px;
          background: #f5f0ea;
          border-bottom: 1px solid #e8dfd0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .adm-search-input {
          width: 100%;
          height: 40px;
          border: 1.5px solid rgba(185,147,69,0.45);
          border-radius: 10px;
          padding-left: 36px;
          padding-right: 14px;
          font-size: 13px;
          color: #3b1a0e;
          background: #fff;
          outline: none;
          box-sizing: border-box;
          box-shadow: 0 1px 4px rgba(185,147,69,0.08);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .adm-search-input:focus {
          border-color: #b9934a;
          box-shadow: 0 0 0 3px rgba(185,147,69,0.14);
        }
        .adm-search-input::placeholder { color: #c4a882; }

        /* ── Table wrapper ──────────────────────────── */
        .adm-content {
          flex: 1;
          overflow: auto;
          padding: 20px 28px;
        }
        .adm-table-wrap {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #ede6d6;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          box-shadow: 0 2px 16px rgba(75,13,19,0.06);
        }

        /* ── Pagination ─────────────────────────────── */
        .adm-pagination {
          padding: 12px 28px;
          background: #fff;
          border-top: 1px solid #ede6d6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* ══════════════════════════════════════════════
           TABLET  (≤ 1024px)
        ══════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .adm-sidebar { width: 180px; min-width: 180px; }
          .adm-header  { padding: 0 18px; }
          .adm-hero-card { padding: 18px 20px; }
          .adm-hero-h1 { font-size: 18px; }
          .adm-searchbar { padding: 12px 18px; }
          .adm-content { padding: 16px 18px; }
          .adm-pagination { padding: 10px 18px; }
        }

        /* ══════════════════════════════════════════════
           MOBILE  (≤ 768px)
        ══════════════════════════════════════════════ */
        @media (max-width: 768px) {
          /* Sidebar slides off to the left; toggled by state */
          .adm-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            width: 240px;
            transform: translateX(-100%);
            z-index: 500;
          }
          .adm-sidebar--open { transform: translateX(0); }

          /* Semi-transparent backdrop behind open sidebar */
          .adm-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 490;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(2px);
          }

          /* Show hamburger icon */
          .adm-hamburger { display: flex !important; }

          /* Main takes full width */
          .adm-main { width: 100%; }

          /* Compact top bar */
          .adm-header {
            padding: 0 14px;
            height: 52px;
            gap: 8px;
          }
          .adm-header-title { font-size: 15px; }
          .adm-header-sub   { display: none; }

          /* Hero card — mobile stack */
          .adm-hero-card  { padding: 14px 16px 16px; }
          .adm-hero-ham   { display: flex !important; }
          .adm-hero-row   { flex-direction: column; align-items: flex-start; gap: 12px; }
          .adm-hero-icon-wrap { width: 40px; height: 40px; }
          .adm-hero-h1    { font-size: 16px; }
          .adm-hero-desc  { display: none; }
          /* Bottom action row: count left, buttons right */
          .adm-hero-right {
            width: 100%;
            justify-content: space-between;
            align-items: center;
            gap: 0;
          }
          .adm-hero-sep   { display: none; }
          .adm-hero-count-num  { font-size: 22px; }
          .adm-hero-actions    { gap: 7px; }
          .adm-hero-btn-out    { padding: 7px 11px; font-size: 11px; }
          .adm-hero-btn-gold   { padding: 7px 11px; font-size: 11px; }
          .adm-hero-live       { padding: 5px 9px; font-size: 10.5px; }

          /* Hide button labels — show icons only */
          .adm-btn-label  { display: none; }
          .adm-live-text  { display: none; }
          .adm-btn-gold   { padding: 7px 10px; }
          .adm-btn-outline{ padding: 7px 10px; }

          /* Search bar */
          .adm-searchbar { padding: 10px 14px; flex-wrap: wrap; gap: 10px; }

          /* Content area */
          .adm-content { padding: 12px 14px; }

          /* Pagination */
          .adm-pagination {
            padding: 8px 14px;
            font-size: 11px;
          }
        }

        /* ══════════════════════════════════════════════
           SMALL MOBILE  (≤ 480px)
        ══════════════════════════════════════════════ */
        @media (max-width: 480px) {
          .adm-header-title { font-size: 13px; }
          .adm-content { padding: 10px; }
          .adm-searchbar { padding: 8px 10px; }
          .adm-pagination { padding: 8px 10px; }
        }
      `}</style>
    </div>
  );
}

/* ── inline style constants ─────────────────────────────────────── */
const th: React.CSSProperties = {
  padding: "11px 14px",
  fontSize: 10.5,
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#9b7a5e",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "11px 14px",
  fontSize: 13,
  color: "#5b2d1e",
  verticalAlign: "middle",
};

const pagBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 7,
  border: "1px solid #e2d5c0",
  background: "#fdf8f2",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 600,
  color: "#5b2d1e",
};
