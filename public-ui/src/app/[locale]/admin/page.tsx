"use client";

export const dynamic = "force-dynamic";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  getTrikalaReadings,
  updateTrikalaStatus,
  updateTrikalaFields,
  saveGurujiVakya,
  getCaseNotes, addCaseNote, deleteCaseNote,
  getCaseFollowups, addCaseFollowup, deleteCaseFollowup,
  getCasePad, saveCasePad, clearCasePad,
  getTodayStats,
  getAnalytics,
  getDevotees, getDevoteeHistory, createDevotee, updateDevotee, checkDuplicateDevotee,
  getRemedyLibrary, createRemedy, updateRemedy, deleteRemedy,
  getCaseRemedies, assignRemedy, updateRemedyAssignment, deleteRemedyAssignment,
  getAppointments, createAppointment, updateAppointment, deleteAppointment,
  getAiReport, generateAiReport,
  getChatMessages, sendChatMessage, clearChatHistory,
  generateWhatsAppMessage, logWhatsAppSent,
  convertBookingToAppointment,
  getAuditLogs,
  TRIKALA_STATUSES, REMEDY_CATEGORIES, REMEDY_STATUSES, APPOINTMENT_TYPES, APPOINTMENT_STATUSES,
  WHATSAPP_TEMPLATES, ADMIN_ROLES,
  type AudienceBooking,
  type ContactMessage,
  type AdminUser,
  type TrikalaReading,
  type CaseNote,
  type CaseFollowup,
  type TodayStats,
  type Analytics,
  type Devotee,
  type DevoteeHistory,
  type Remedy,
  type CaseRemedy,
  type Appointment,
  type AiReport,
  type ChatMessage,
  type AuditLog,
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
  BookOpen,
  Star,
  BookUser,
} from "lucide-react";

/* ── constants ──────────────────────────────────────────────────────── */
const ADMIN_MOBILE   = process.env.NEXT_PUBLIC_ADMIN_MOBILE   || "9999999999";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "123456";
const PAGE_SIZE = 15;

const COSMIC = "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)";

type Tab = "today" | "bookings" | "contacts" | "admins" | "trikala" | "devotees" | "appointments" | "remedies" | "reports" | "settings";

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
          border: "1.5px solid #0d9488", borderRadius: 10,
          background: "linear-gradient(135deg,#f9fafb,#f0fdfa)",
          cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151",
          boxShadow: "0 1px 4px rgba(13,148,136,0.08)",
          outline: "none", whiteSpace: "nowrap",
        }}
      >
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected.label}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 900,
          minWidth: "100%", background: "#fff",
          border: "1.5px solid #e5e7eb", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(13,148,136,0.06)",
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
                color: opt.value === value ? "#374151" : "#374151",
                background: opt.value === value ? "#f0fdfa" : "#fff",
                transition: "background 0.12s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f0fdfa"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = opt.value === value ? "#f0fdfa" : "#fff"; }}
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

/* remedy category → icon (PRD §3 Stage 4) */
function remedyIcon(cat?: string): string {
  switch (cat) {
    case "Pooja": return "🪔";
    case "Mantra": return "📿";
    case "Vrata": return "🌙";
    case "Temple Visit": return "🏛️";
    case "Daana": return "🍲";
    case "Seva": return "🤲";
    case "Personal Discipline": return "🧘";
    case "Follow-up Consultation": return "🔄";
    default: return "🕯️";
  }
}

/* relationship badge colours (PRD §7) */
function relBadge(rel?: string): { bg: string; fg: string } {
  switch ((rel || "new").toLowerCase()) {
    case "vip":       return { bg: "rgba(13,148,136,0.12)", fg: "#0d9488" };
    case "donor":     return { bg: "rgba(22,163,74,0.12)",  fg: "#15803d" };
    case "volunteer": return { bg: "rgba(37,99,235,0.12)",  fg: "#1d4ed8" };
    case "regular":   return { bg: "rgba(124,58,162,0.12)", fg: "#6b21a8" };
    case "family":    return { bg: "rgba(190,24,93,0.12)",  fg: "#9d174d" };
    default:          return { bg: "#f3f4f6", fg: "#374151" };
  }
}

/* ══════════════════════════════════════════════════════════════════
   DEVOTEE 360 — profile slide-over with full chronological timeline
══════════════════════════════════════════════════════════════════ */
function DevoteeProfilePanel({
  history, loading, onClose, onOpenCase,
}: {
  history: DevoteeHistory | null;
  loading: boolean;
  onClose: () => void;
  onOpenCase: (caseRef: string) => void;
}) {
  const origD = history?.devotee;
  const [editMode, setEditMode] = useState(false);
  const [localD, setLocalD]     = useState<Devotee | null>(null);
  const [saving, setSaving]     = useState(false);
  const [saveErr, setSaveErr]   = useState("");
  const [waOpen, setWaOpen]     = useState(false);
  const [waMsg,  setWaMsg]      = useState("");
  const [waUrl,  setWaUrl]      = useState("");
  const [waTemplate, setWaTemplate] = useState("");

  useEffect(() => { setLocalD(origD ?? null); setEditMode(false); }, [origD]);

  const d = (editMode && localD) ? localD : origD;
  const rel = relBadge(d?.relationship);

  async function saveEdit() {
    if (!localD) return;
    setSaving(true); setSaveErr("");
    try {
      const updated = await updateDevotee(localD.id, {
        name: localD.name, phone: localD.phone, email: localD.email,
        city: localD.city, state: localD.state, language: localD.language,
        relationship: localD.relationship, sevaInterest: localD.sevaInterest,
        associatedTemple: localD.associatedTemple, notes: localD.notes,
        familyLinks: localD.familyLinks, tags: localD.tags,
      });
      setLocalD(updated);
      setEditMode(false);
    } catch (e: any) {
      setSaveErr(e?.message || "Save failed");
    } finally { setSaving(false); }
  }

  async function openWaTemplate(tpl: string) {
    if (!d) return;
    const phone = (d.whatsapp || d.phone || "").replace(/\D/g, "").slice(-10);
    if (!phone) return;
    try {
      const res = await generateWhatsAppMessage(tpl as any, { devoteeName: d.name, phone });
      setWaMsg(res.message); setWaUrl(res.waUrl ?? ""); setWaTemplate(tpl); setWaOpen(true);
    } catch { /* ignore */ }
  }

  const Section = ({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) => (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0d9488", marginBottom: 10 }}>
        {title}{count != null ? ` · ${count}` : ""}
      </p>
      {children}
    </div>
  );
  const Fld = ({ label, val, field }: { label: string; val?: string; field: keyof Devotee }) => (
    editMode ? (
      <div style={{ padding: "9px 0", borderBottom: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 3 }}>
        <label style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</label>
        <input value={(localD as any)?.[field] ?? ""} onChange={e => setLocalD((prev: any) => ({ ...prev, [field]: e.target.value }))}
          style={{ padding: "6px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", background: "#ffffff", fontSize: 12.5, color: "#1f2937", outline: "none", width: "100%", boxSizing: "border-box" }} />
      </div>
    ) : (
      val ? (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: 12, color: "#6b7280", flexShrink: 0 }}>{label}</span>
          <span style={{ fontSize: 12.5, color: "#1f2937", fontWeight: 500, textAlign: "right" }}>{val}</span>
        </div>
      ) : null
    )
  );

  if (!history || !d) return null;

  return (
    <AnimatePresence>
      {history && d && (
        <>
          <motion.div key="dev-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(2px)" }} />
          <motion.div key="dev-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201, width: 460, maxWidth: "100vw",
              background: "#f8fafc", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column",
              fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            {/* Header */}
            <div style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb", padding: "20px 22px", color: "#1f2937", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 13, alignItems: "center", minWidth: 0 }}>
                  {d.photo ? (
                    <img src={d.photo} alt={d.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(0,0,0,0.12)" }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>
                      {(d.name || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    {editMode ? (
                      <input value={localD?.name ?? ""} onChange={e => setLocalD((p: any) => ({ ...p, name: e.target.value }))}
                        style={{ fontSize: 18, fontWeight: 800, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 7, padding: "3px 8px", color: "#1f2937", outline: "none", width: "100%" }} />
                    ) : (
                      <h2 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{d.name}</h2>
                    )}
                    <p style={{ fontSize: 11.5, color: "#6b7280", fontFamily: "monospace", marginTop: 2 }}>{d.devoteeRef || "—"}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {editMode ? (
                    <>
                      <button onClick={saveEdit} disabled={saving}
                        style={{ background: saving ? "rgba(255,255,255,0.1)" : "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: 8, padding: "5px 12px", cursor: saving ? "default" : "pointer", color: "#1f2937", fontSize: 12, fontWeight: 700 }}>
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button onClick={() => { setEditMode(false); setLocalD(origD ?? null); setSaveErr(""); }}
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#1f2937", fontSize: 12 }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { setEditMode(true); setLocalD(d); }}
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: "#1f2937", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                      <Pencil size={12} /> Edit
                    </button>
                  )}
                  <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1f2937" }}><X size={16} /></button>
                </div>
              </div>
              {saveErr && <p style={{ fontSize: 11, color: "#fca5a5", marginTop: 6 }}>{saveErr}</p>}
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <span style={{ background: rel.bg, color: rel.fg, padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{d.relationship || "new"}</span>
                {d.language && <span style={{ background: "rgba(255,255,255,0.1)", padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{d.language}</span>}
                {d.sensitive && <span style={{ background: "rgba(220,38,38,0.2)", color: "#fecaca", padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Sensitive</span>}
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
              {/* Quick contact */}
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {d.phone && <a href={`tel:${d.phone}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: "#fff", border: "1px solid #e5e7eb", color: "#0d9488", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}><Phone size={14} /> Call</a>}
                {(d.whatsapp || d.phone) && <a href={`https://wa.me/91${(d.whatsapp || d.phone || "").replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: "#25D366", border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>WhatsApp</a>}
                {d.email && <a href={`mailto:${d.email}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: "#fff", border: "1px solid #e5e7eb", color: "#0d9488", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}><Mail size={14} /> Email</a>}
              </div>

              {/* WhatsApp reminder templates */}
              {(d.whatsapp || d.phone) && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      { tpl: "appointment_reminder", label: "Appt Reminder" },
                      { tpl: "followup_reminder",    label: "Follow-up" },
                      { tpl: "case_ready",           label: "Reading Ready" },
                      { tpl: "remedy_assigned",      label: "Remedy" },
                      { tpl: "welcome",              label: "Welcome" },
                    ].map(({ tpl, label }) => (
                      <button key={tpl} onClick={() => openWaTemplate(tpl)}
                        style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid #25D366", background: "rgba(37,211,102,0.07)", color: "#166534", fontSize: 11.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 13 }}>📱</span> {label}
                      </button>
                    ))}
                  </div>
                  {waOpen && (
                    <div style={{ marginTop: 10, padding: "12px 14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                      <p style={{ fontSize: 10.5, fontWeight: 700, color: "#166534", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>WhatsApp Message · {waTemplate.replace(/_/g, " ")}</p>
                      <p style={{ fontSize: 12.5, color: "#14532d", lineHeight: 1.55, marginBottom: 10, whiteSpace: "pre-wrap" }}>{waMsg}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={waUrl} target="_blank" rel="noreferrer"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: "#25D366", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
                          Open in WhatsApp
                        </a>
                        <button onClick={() => setWaOpen(false)} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid #bbf7d0", background: "#fff", color: "#6b7280", fontSize: 12, cursor: "pointer" }}>×</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Details grid */}
              <Section title="Profile">
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: editMode ? "4px 16px 8px" : "4px 16px" }}>
                  <Fld label="Phone" val={d.phone} field="phone" />
                  <Fld label="WhatsApp" val={d.whatsapp} field="whatsapp" />
                  <Fld label="Email" val={d.email} field="email" />
                  <Fld label="City" val={d.city} field="city" />
                  <Fld label="State" val={d.state} field="state" />
                  <Fld label="Language" val={d.language} field="language" />
                  <Fld label="Relationship" val={d.relationship} field="relationship" />
                  <Fld label="Seva Interest" val={d.sevaInterest} field="sevaInterest" />
                  <Fld label="Temple" val={d.associatedTemple} field="associatedTemple" />
                  <Fld label="Tags" val={d.tags} field="tags" />
                  <Fld label="Family Links" val={d.familyLinks} field="familyLinks" />
                  {!editMode && d.firstContactAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderBottom: "1px solid #e5e7eb" }}>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>First contact</span>
                      <span style={{ fontSize: 12.5, color: "#1f2937", fontWeight: 500 }}>{fmt(d.firstContactAt)}</span>
                    </div>
                  )}
                </div>
                {editMode ? (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, display: "block" }}>Notes</label>
                    <textarea value={localD?.notes ?? ""} onChange={e => setLocalD((p: any) => ({ ...p, notes: e.target.value }))} rows={3}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#ffffff", fontSize: 12.5, color: "#1f2937", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                ) : d.notes ? (
                  <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 10, lineHeight: 1.6, fontStyle: "italic" }}>{d.notes}</p>
                ) : null}
              </Section>

              {loading ? (
                <div style={{ textAlign: "center", color: "#0d9488", padding: 20, fontSize: 13 }}><RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /></div>
              ) : (
                <>
                  {/* Trikala cases */}
                  <Section title="Trikala Cases" count={history.cases.length}>
                    {history.cases.length === 0 ? <p style={{ fontSize: 12.5, color: "#0d9488" }}>No cases yet.</p> :
                      history.cases.map((c: any) => (
                        <button key={c.id} onClick={() => onOpenCase(c.case_reference)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", marginBottom: 7, cursor: "pointer", textAlign: "left" }}>
                          <div><p style={{ fontSize: 12.5, fontWeight: 700, color: "#0d9488", fontFamily: "monospace" }}>{c.case_reference}</p><p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2, textTransform: "capitalize" }}>{c.problem_category || c.service_type} · {fmt(c.created_at)}</p></div>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151", background: "#f3f4f6", padding: "3px 9px", borderRadius: 20 }}>{c.status}</span>
                        </button>
                      ))}
                  </Section>

                  {/* Appointments */}
                  <Section title="Appointments" count={history.appointments.length}>
                    {history.appointments.length === 0 ? <p style={{ fontSize: 12.5, color: "#0d9488" }}>No appointments.</p> :
                      history.appointments.map((a: any) => (
                        <div key={a.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", marginBottom: 7 }}>
                          <div><p style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937" }}>{a.appointment_type}</p><p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{a.start_time ? fmt(a.start_time) : "Slot TBD"}</p></div>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151", background: "#f3f4f6", padding: "3px 9px", borderRadius: 20, height: "fit-content" }}>{a.status}</span>
                        </div>
                      ))}
                  </Section>

                  {/* Remedies */}
                  <Section title="Divine Remedies" count={history.remedies.length}>
                    {history.remedies.length === 0 ? <p style={{ fontSize: 12.5, color: "#0d9488" }}>No remedies assigned.</p> :
                      history.remedies.map((r: any) => (
                        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", marginBottom: 7 }}>
                          <div><p style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937" }}>🕯️ {r.remedy_name}</p><p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{r.category}</p></div>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151", background: "#f3f4f6", padding: "3px 9px", borderRadius: 20, height: "fit-content" }}>{r.status}</span>
                        </div>
                      ))}
                  </Section>

                  {/* Timeline */}
                  <Section title="Timeline" count={history.timeline.length}>
                    {history.timeline.length === 0 ? <p style={{ fontSize: 12.5, color: "#0d9488" }}>No timeline events.</p> : (
                      <div style={{ position: "relative", paddingLeft: 22 }}>
                        <div style={{ position: "absolute", left: 7, top: 4, bottom: 4, width: 2, background: "rgba(13,148,136,0.2)" }} />
                        {history.timeline.map((ev) => (
                          <div key={ev.id} style={{ position: "relative", marginBottom: 16 }}>
                            <div style={{ position: "absolute", left: -22, top: 1, width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "2px solid #0d9488", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>{ev.icon || "•"}</div>
                            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937" }}>{ev.title}</p>
                            {ev.description && <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2, lineHeight: 1.5 }}>{ev.description}</p>}
                            <p style={{ fontSize: 10.5, color: "#0d9488", marginTop: 3 }}>{fmt(ev.createdAt)} · {fmtTime(ev.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Section>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ADD DEVOTEE — create form with duplicate detection (PRD §12-C)
══════════════════════════════════════════════════════════════════ */
function AddDevoteePanel({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [f, setF] = useState({ name: "", phone: "", whatsapp: "", email: "", city: "", state: "", relationship: "new", language: "Kannada", notes: "" });
  const [dupes, setDupes] = useState<Devotee[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  async function submit(force = false) {
    if (!f.name.trim()) { setErr("Name is required"); return; }
    setSaving(true); setErr("");
    try {
      if (!force) {
        const found = await checkDuplicateDevotee({ phone: f.phone, whatsapp: f.whatsapp, email: f.email, name: f.name, city: f.city });
        if (found.length) { setDupes(found); setSaving(false); return; }
      }
      await createDevotee({ ...f, force: true });
      onCreated();
    } catch (e: any) { setErr(e?.message || "Failed to create devotee"); }
    finally { setSaving(false); }
  }

  const field = (label: string, key: string, type = "text") => (
    <div style={{ marginBottom: 13 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
      <input type={type} value={(f as any)[key]} onChange={e => set(key, e.target.value)}
        style={{ width: "100%", height: 40, padding: "0 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none", boxSizing: "border-box" }} />
    </div>
  );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(2px)" }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 211, width: 420, maxWidth: "100vw", background: "#f8fafc", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb", padding: "18px 22px", color: "#1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(17,24,39,0.5)" }}>Devotee 360</p><h2 style={{ fontSize: 17, fontWeight: 800 }}>Add Devotee</h2></div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1f2937" }}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {dupes.length > 0 && (
            <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>⚠️ Possible duplicate found</p>
              {dupes.map(dp => <p key={dp.id} style={{ fontSize: 12, color: "#78350f" }}>This person may already exist as <strong>{dp.devoteeRef}</strong> — {dp.name}{dp.phone ? ` (${dp.phone})` : ""}</p>)}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => submit(true)} disabled={saving} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#92400e", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Create anyway</button>
                <button onClick={() => setDupes([])} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #d6a960", background: "transparent", color: "#92400e", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          {field("Full Name *", "name")}
          {field("Phone", "phone", "tel")}
          {field("WhatsApp", "whatsapp", "tel")}
          {field("Email", "email", "email")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{field("City", "city")}{field("State", "state")}</div>
          <div style={{ marginBottom: 13 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Relationship</label>
            <select value={f.relationship} onChange={e => set("relationship", e.target.value)} style={{ width: "100%", height: 40, padding: "0 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none" }}>
              {["new", "regular", "donor", "volunteer", "vip", "family"].map(r => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          {field("Preferred Language", "language")}
          <div style={{ marginBottom: 13 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Notes</label>
            <textarea value={f.notes} onChange={e => set("notes", e.target.value)} rows={3} style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          {err && <p style={{ fontSize: 12.5, color: "#dc2626", marginBottom: 10 }}>{err}</p>}
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => submit(false)} disabled={saving || dupes.length > 0} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving || dupes.length > 0 ? 0.6 : 1 }}>{saving ? "Saving…" : "Create Devotee"}</button>
        </div>
      </motion.div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   APPOINTMENT — create / edit slide-over (PRD §6)
══════════════════════════════════════════════════════════════════ */
function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function AppointmentPanel({ appt, onClose, onSaved }: { appt: Appointment | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    devoteeName: appt?.devoteeName || "", mobile: appt?.mobile || "",
    appointmentType: appt?.appointmentType || "General Audience", mode: appt?.mode || "in-person",
    startTime: toLocalInput(appt?.startTime), durationMinutes: String(appt?.durationMinutes || 30),
    status: appt?.status || "Requested", priority: appt?.priority || "Normal",
    location: appt?.location || "", meetingLink: appt?.meetingLink || "",
    purpose: appt?.purpose || "", outcomeNote: appt?.outcomeNote || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  async function save() {
    if (!f.devoteeName.trim()) { setErr("Devotee name is required"); return; }
    setSaving(true); setErr("");
    const payload: any = {
      devotee_name: f.devoteeName, mobile: f.mobile, appointment_type: f.appointmentType,
      mode: f.mode, start_time: f.startTime ? new Date(f.startTime).toISOString() : null,
      duration_minutes: parseInt(f.durationMinutes) || null, status: f.status, priority: f.priority,
      location: f.location, meeting_link: f.meetingLink, purpose: f.purpose, outcome_note: f.outcomeNote,
    };
    try {
      if (appt) await updateAppointment(appt.id, payload);
      else      await createAppointment(payload);
      onSaved();
    } catch (e: any) { setErr(e?.message || "Failed to save"); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!appt) return;
    setSaving(true);
    try { await deleteAppointment(appt.id); onSaved(); }
    catch (e: any) { setErr(e?.message || "Failed to delete"); setSaving(false); }
  }

  const lbl = { fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 } as const;
  const inp = { width: "100%", height: 40, padding: "0 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none", boxSizing: "border-box" } as const;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(2px)" }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 211, width: 440, maxWidth: "100vw", background: "#f8fafc", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb", padding: "18px 22px", color: "#1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(17,24,39,0.5)" }}>Appointment{appt?.appointmentRef ? ` · ${appt.appointmentRef}` : ""}</p><h2 style={{ fontSize: 17, fontWeight: 800 }}>{appt ? "Edit Appointment" : "New Appointment"}</h2></div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1f2937" }}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Devotee Name *</label><input value={f.devoteeName} onChange={e => set("devoteeName", e.target.value)} style={inp} /></div>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Mobile</label><input value={f.mobile} onChange={e => set("mobile", e.target.value)} style={inp} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Type</label><select value={f.appointmentType} onChange={e => set("appointmentType", e.target.value)} style={{ ...inp, padding: "0 10px" }}>{APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Mode</label><select value={f.mode} onChange={e => set("mode", e.target.value)} style={{ ...inp, padding: "0 10px" }}>{["in-person", "phone", "video"].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Date &amp; Time</label><input type="datetime-local" value={f.startTime} onChange={e => set("startTime", e.target.value)} style={inp} /></div>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Minutes</label><input type="number" value={f.durationMinutes} onChange={e => set("durationMinutes", e.target.value)} style={inp} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Status</label><select value={f.status} onChange={e => set("status", e.target.value)} style={{ ...inp, padding: "0 10px" }}>{APPOINTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Priority</label><select value={f.priority} onChange={e => set("priority", e.target.value)} style={{ ...inp, padding: "0 10px" }}>{["Normal", "High", "Urgent", "VIP"].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          </div>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Location</label><input value={f.location} onChange={e => set("location", e.target.value)} style={inp} /></div>
          {f.mode === "video" && <div style={{ marginBottom: 13 }}><label style={lbl}>Meeting Link</label><input value={f.meetingLink} onChange={e => set("meetingLink", e.target.value)} style={inp} /></div>}
          <div style={{ marginBottom: 13 }}><label style={lbl}>Purpose</label><textarea value={f.purpose} onChange={e => set("purpose", e.target.value)} rows={2} style={{ ...inp, height: "auto", padding: "10px 13px", resize: "vertical", fontFamily: "inherit" }} /></div>
          {appt && <div style={{ marginBottom: 13 }}><label style={lbl}>Outcome Note (after meeting)</label><textarea value={f.outcomeNote} onChange={e => set("outcomeNote", e.target.value)} rows={2} style={{ ...inp, height: "auto", padding: "10px 13px", resize: "vertical", fontFamily: "inherit" }} /></div>}
          {err && <p style={{ fontSize: 12.5, color: "#dc2626" }}>{err}</p>}
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10 }}>
          {appt && <button onClick={remove} disabled={saving} style={{ padding: "11px 14px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Trash2 size={14} /></button>}
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : appt ? "Save Changes" : "Create Appointment"}</button>
        </div>
      </motion.div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REMEDY — library create / edit slide-over (PRD §12-D)
══════════════════════════════════════════════════════════════════ */
function RemedyPanel({ remedy, onClose, onSaved }: { remedy: Remedy | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    name: remedy?.name || "", category: remedy?.category || "Pooja",
    defaultInstruction: remedy?.defaultInstruction || "", defaultDuration: remedy?.defaultDuration || "",
    language: remedy?.language || "Kannada", reminderSchedule: remedy?.reminderSchedule || "",
    followupRequired: remedy?.followupRequired || false, gurujiApprovalRequired: remedy?.gurujiApprovalRequired || false,
    adminCaution: remedy?.adminCaution || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  async function save() {
    if (!f.name.trim()) { setErr("Name is required"); return; }
    setSaving(true); setErr("");
    const payload: any = {
      name: f.name, category: f.category, default_instruction: f.defaultInstruction,
      default_duration: f.defaultDuration, language: f.language, reminder_schedule: f.reminderSchedule,
      followup_required: f.followupRequired, guruji_approval_required: f.gurujiApprovalRequired,
      admin_caution: f.adminCaution,
    };
    try {
      if (remedy) await updateRemedy(remedy.id, payload);
      else        await createRemedy(payload as any);
      onSaved();
    } catch (e: any) { setErr(e?.message || "Failed to save"); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!remedy) return;
    setSaving(true);
    try { await deleteRemedy(remedy.id); onSaved(); }
    catch (e: any) { setErr(e?.message || "Failed to delete"); setSaving(false); }
  }

  const lbl = { fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 } as const;
  const inp = { width: "100%", height: 40, padding: "0 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none", boxSizing: "border-box" } as const;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(2px)" }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 211, width: 420, maxWidth: "100vw", background: "#f8fafc", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb", padding: "18px 22px", color: "#1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(17,24,39,0.5)" }}>Remedy Library</p><h2 style={{ fontSize: 17, fontWeight: 800 }}>{remedy ? "Edit Remedy" : "Add Remedy"}</h2></div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1f2937" }}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Remedy Name *</label><input value={f.name} onChange={e => set("name", e.target.value)} style={inp} /></div>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Category</label><select value={f.category} onChange={e => set("category", e.target.value)} style={{ ...inp, padding: "0 10px" }}>{REMEDY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Default Instruction</label><textarea value={f.defaultInstruction} onChange={e => set("defaultInstruction", e.target.value)} rows={3} style={{ ...inp, height: "auto", padding: "10px 13px", resize: "vertical", fontFamily: "inherit" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Duration</label><input value={f.defaultDuration} onChange={e => set("defaultDuration", e.target.value)} placeholder="21 days" style={inp} /></div>
            <div style={{ marginBottom: 13 }}><label style={lbl}>Language</label><input value={f.language} onChange={e => set("language", e.target.value)} style={inp} /></div>
          </div>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Reminder Schedule</label><input value={f.reminderSchedule} onChange={e => set("reminderSchedule", e.target.value)} placeholder="Daily / Weekly" style={inp} /></div>
          <div style={{ marginBottom: 13 }}><label style={lbl}>Admin Caution</label><input value={f.adminCaution} onChange={e => set("adminCaution", e.target.value)} style={inp} /></div>
          <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11, cursor: "pointer" }}>
            <input type="checkbox" checked={f.followupRequired} onChange={e => set("followupRequired", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#0d9488" }} />
            <span style={{ fontSize: 12.5, color: "#1f2937" }}>Follow-up required after remedy period</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11, cursor: "pointer" }}>
            <input type="checkbox" checked={f.gurujiApprovalRequired} onChange={e => set("gurujiApprovalRequired", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#0d9488" }} />
            <span style={{ fontSize: 12.5, color: "#1f2937" }}>Guruji approval required before assigning</span>
          </label>
          {err && <p style={{ fontSize: 12.5, color: "#dc2626" }}>{err}</p>}
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10 }}>
          {remedy && <button onClick={remove} disabled={saving} style={{ padding: "11px 14px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Trash2 size={14} /></button>}
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : remedy ? "Save Changes" : "Add Remedy"}</button>
        </div>
      </motion.div>
    </>
  );
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
  const title = type === "contacts" ? "Contact Messages Report" : "Appointment Bookings Report";
  const sub   = type === "contacts" ? "CONTACT MESSAGES REPORT" : "APPOINTMENT BOOKINGS REPORT";
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
  const [serverOtp, setServerOtp] = useState("");

  const field: React.CSSProperties = {
    display: "block", width: "100%", height: 48,
    border: "1.5px solid rgba(13,148,136,0.3)",
    borderRadius: 10, fontSize: 15, color: "#374151",
    background: "#f9fafb", outline: "none",
    boxSizing: "border-box", paddingLeft: 44, paddingRight: 14, fontWeight: 500,
  };

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (mobile.length !== 10) { setErr("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    try {
      const res = await adminSendOtp(mobile);
      setServerOtp(res.otp);
      setStep("otp");
    } catch (ex: any) {
      setErr(ex?.message || "Mobile not registered as admin");
    } finally { setLoading(false); }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!otp) { setErr("Enter the OTP"); return; }
    if (otp !== serverOtp) { setErr("Incorrect OTP. Please try again"); return; }
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
        <span style={{ fontFamily: "serif", fontSize: 500, lineHeight: 1, color: "#1f2937" }}>ॐ</span>
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 400, overflow: "hidden", borderRadius: 22, border: "1px solid rgba(13,148,136,0.2)", background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.38)" }}>

        {/* Header */}
        <div style={{ padding: "28px 28px 24px", textAlign: "center", background: "linear-gradient(135deg,#0d9488,#0f766e)", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ margin: "0 auto 12px", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "serif", fontSize: 26, color: "#ffffff" }}>ॐ</span>
          </div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Admin Console</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>Gurumurthy Guruji</p>
        </div>

        {/* ── STEP 1: Phone ── */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} style={{ padding: "26px 26px 30px" }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Sign in to your account</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 22 }}>Enter your registered admin phone number</p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#374151", marginBottom: 7 }}>Phone Number</label>
              <div style={{ position: "relative" }}>
                <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#0d9488" }} />
                <input type="tel" inputMode="numeric" maxLength={10} value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, "")); setErr(""); }}
                  placeholder="Enter 10-digit mobile" autoFocus
                  style={{ ...field, border: `1.5px solid ${err ? "#dc2626" : "rgba(13,148,136,0.3)"}` }} />
              </div>
            </div>

            {err && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "9px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12.5, fontWeight: 600 }}><AlertCircle size={14} /> {err}</div>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", height: 48, borderRadius: 10, border: "none", background: loading ? "rgba(13,148,136,0.4)" : "linear-gradient(135deg,#0d9488,#0d9488)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(13,148,136,0.2)" }}>
              {loading ? "Verifying…" : <><span>Send OTP</span><ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} style={{ padding: "26px 26px 30px" }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Verify OTP</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
              OTP sent to <strong style={{ color: "#374151" }}>+91 {mobile}</strong>
            </p>
            <button type="button" onClick={() => { setStep("phone"); setOtp(""); setErr(""); }}
              style={{ fontSize: 12, fontWeight: 600, color: "#0d9488", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20, textDecoration: "underline" }}>
              ← Change number
            </button>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#374151", marginBottom: 7 }}>Enter OTP</label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#0d9488" }} />
                <input type="tel" inputMode="numeric" maxLength={10} value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setErr(""); }}
                  placeholder="Enter OTP" autoFocus
                  style={{ ...field, letterSpacing: "0.2em", border: `1.5px solid ${err ? "#dc2626" : "rgba(13,148,136,0.3)"}` }} />
              </div>
            </div>

            {err && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "9px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12.5, fontWeight: 600 }}><AlertCircle size={14} /> {err}</div>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", height: 48, borderRadius: 10, border: "none", background: loading ? "rgba(13,148,136,0.4)" : "linear-gradient(135deg,#0d9488,#0d9488)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(13,148,136,0.2)" }}>
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
  const [converting, setConverting] = useState(false);
  const [convertMsg, setConvertMsg] = useState<{ type: "ok" | "warn" | "err"; text: string } | null>(null);

  async function convertToAppt() {
    if (!isBooking) return;
    setConverting(true); setConvertMsg(null);
    try {
      await convertBookingToAppointment((item as AudienceBooking).id);
      setConvertMsg({ type: "ok", text: "Appointment created! Open Appointments tab to view." });
    } catch (e: any) {
      if (e?.status === 409) {
        setConvertMsg({ type: "warn", text: "An appointment already exists for this booking." });
      } else {
        setConvertMsg({ type: "err", text: e?.message || "Conversion failed." });
      }
    } finally { setConverting(false); }
  }
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
          background: "#f8fafc",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}
      >
        {/* ── Panel Header ── */}
        <div style={{ background: COSMIC, padding: "20px 20px 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9ca3af" }}>
              {isBooking ? "Appointment Booking" : "Contact Message"}
            </span>
            <button onClick={onClose}
              style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Avatar */}
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20, fontWeight: 800, color: "#fff", boxShadow: "0 2px 12px rgba(13,148,136,0.25)" }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1f2937", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
              <p style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</p>
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
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
              <ClipboardList size={14} color="#0d9488" />
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b7280" }}>
                {isBooking ? "Intake Details" : "Message Details"}
              </span>
            </div>
            <div style={{ padding: "6px 0" }}>
              {detailRows.map(([label, val]) => (
                <div key={label} style={{ display: "flex", padding: "9px 16px", borderBottom: "1px solid #f9f4ee" }}>
                  <span style={{ width: 120, minWidth: 120, fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{label}</span>
                  <span style={{ flex: 1, fontSize: 13, color: "#374151", wordBreak: "break-word", lineHeight: 1.5 }}>{val || "—"}</span>
                </div>
              ))}
              <div style={{ display: "flex", padding: "9px 16px" }}>
                <span style={{ width: 120, minWidth: 120, fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Submitted</span>
                <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{fmt(item.createdAt)} &nbsp;<span style={{ color: "#6b7280" }}>{fmtTime(item.createdAt)}</span></span>
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

          {/* Convert to Appointment — PRD §8 */}
          {isBooking && (
            <div style={{ marginTop: 4 }}>
              <button onClick={convertToAppt} disabled={converting}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "none", background: converting ? "#d1fae5" : "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#1f2937", fontSize: 13.5, fontWeight: 700, cursor: converting ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>📅</span>
                {converting ? "Creating appointment…" : "Convert to Appointment"}
              </button>
              {convertMsg && (
                <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 500, background: convertMsg.type === "ok" ? "#f0fdf4" : convertMsg.type === "warn" ? "#fefce8" : "#fef2f2", color: convertMsg.type === "ok" ? "#15803d" : convertMsg.type === "warn" ? "#92400e" : "#b91c1c", border: `1px solid ${convertMsg.type === "ok" ? "#bbf7d0" : convertMsg.type === "warn" ? "#fde68a" : "#fecaca"}` }}>
                  {convertMsg.text}
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ADMIN USER PANEL  (add / edit — right slide-in)
════════════════════════════════════════════════════════════════════ */
const AVATAR_COLORS = ["#0d9488","#7c3aed","#0891b2","#059669","#dc2626","#d97706"];
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
  const [role,   setRole]   = useState<string>(admin?.role || "admin");
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
    border: "1.5px solid #e5e7eb", borderRadius: 10,
    fontSize: 14, color: "#374151", background: "#fff",
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
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#9ca3af" }}>
              {isEdit ? "Edit Admin User" : "Add New Admin"}
            </p>
            <button onClick={onClose} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: name ? avatarColor(name) : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              {name ? name[0].toUpperCase() : <UserPlus size={22} color="#9ca3af" />}
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{name || "New Admin"}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{isEdit ? `Editing · ${admin?.mobile}` : "Fill in the details below"}</p>
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
                {isEdit && <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 500, color: "#6b7280", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 4, padding: "1px 6px" }}>cannot be changed</span>}
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: isEdit ? "#c4b5a0" : "#0d9488" }} />
                <input
                  type="tel" inputMode="numeric" maxLength={10}
                  value={mobile}
                  onChange={e => !isEdit && setMobile(e.target.value.replace(/\D/g, ""))}
                  readOnly={isEdit}
                  placeholder="10-digit mobile number"
                  style={{ ...inpWithIcon, background: isEdit ? "#f3f4f6" : "#fff", color: isEdit ? "#6b7280" : "#374151", cursor: isEdit ? "not-allowed" : "text", border: `1.5px solid ${isEdit ? "#e5e7eb" : "#e5e7eb"}` }}
                />
              </div>
            </div>

            {/* Role — dropdown */}
            <div>
              <label style={labelStyle}>Role <span style={{ color: "#dc2626" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <ShieldCheck size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#0d9488", pointerEvents: "none" }} />
                <select value={role} onChange={e => setRole(e.target.value)}
                  style={{ ...inpWithIcon, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: 36, background: "#fff" }}>
                  {ADMIN_ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
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
                  <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
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
            style={{ width: "100%", height: 50, marginTop: 20, borderRadius: 12, border: "none", background: saving ? "rgba(13,148,136,0.4)" : "linear-gradient(135deg,#0d9488,#0d9488)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 4px 18px rgba(13,148,136,0.3)", transition: "all 0.2s" }}>
            {saving ? "Saving…" : isEdit ? <><Pencil size={16} /> Update Admin</> : <><UserPlus size={16} /> Add Admin</>}
          </button>
        </form>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PRIVATE NOTES
════════════════════════════════════════════════════════════════════ */
function PrivateNotes({ caseId }: { caseId: string }) {
  const [draft,   setDraft]   = useState("");
  const [notes,   setNotes]   = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    setLoading(true);
    getCaseNotes(caseId)
      .then(setNotes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [caseId]);

  async function save() {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      const note = await addCaseNote(caseId, draft.trim());
      setNotes(prev => [note, ...prev]);
      setDraft("");
    } catch { /* ignore */ } finally { setSaving(false); }
  }

  async function deleteNote(id: number) {
    await deleteCaseNote(caseId, id).catch(() => {});
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ color: "#0d9488" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#0d9488" stroke="#0d9488" strokeWidth="0"><path d="M19 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>
        </span>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>Private Notes</p>
      </div>

      {/* Input area */}
      <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 12, background: "#fff" }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Write your private note here…"
          onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") save(); }}
          style={{ width: "100%", minHeight: 80, padding: "12px 14px", border: "none", outline: "none", resize: "vertical", fontSize: 13.5, color: "#1f2937", fontFamily: "inherit", lineHeight: 1.65, boxSizing: "border-box", background: "#fff" }}
        />
      </div>

      {/* Save button */}
      <button onClick={save} disabled={saving || !draft.trim()}
        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 9, border: "none", background: saving || !draft.trim() ? "#d1fae5" : "#0d9488", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving || !draft.trim() ? "default" : "pointer", marginBottom: 20, boxShadow: saving || !draft.trim() ? "none" : "0 2px 8px rgba(13,148,136,0.2)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
        </svg>
        {saving ? "Saving…" : "Save Note"}
      </button>

      {/* Divider */}
      <div style={{ height: 1, background: "#e5e7eb", marginBottom: 20 }} />

      {/* Notes list / empty state */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 32, color: "#6b7280", fontSize: 13 }}>Loading notes…</div>
      ) : notes.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, gap: 12, color: "#6b7280", textAlign: "center" }}>
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
            <rect x="10" y="6" width="36" height="46" rx="4" fill="#e8e0d4"/>
            <rect x="10" y="6" width="36" height="46" rx="4" fill="url(#ng)" opacity="0.6"/>
            <rect x="18" y="18" width="20" height="2.5" rx="1.2" fill="#0d9488" opacity="0.6"/>
            <rect x="18" y="25" width="16" height="2.5" rx="1.2" fill="#0d9488" opacity="0.4"/>
            <rect x="18" y="32" width="12" height="2.5" rx="1.2" fill="#0d9488" opacity="0.3"/>
            <path d="M38 42l8 8" stroke="#FA580C" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="44" cy="48" r="6" fill="#FA580C" opacity="0.85"/>
            <path d="M42 48h4M44 46v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            <defs><linearGradient id="ng" x1="10" y1="6" x2="46" y2="52" gradientUnits="userSpaceOnUse"><stop stopColor="#d4a946"/><stop offset="1" stopColor="#0d9488" stopOpacity="0"/></linearGradient></defs>
          </svg>
          <p style={{ fontSize: 13.5, color: "#6b7280" }}>No notes yet. Add your first note above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map(n => (
            <div key={n.id} style={{ background: "#fffbf4", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", position: "relative" }}>
              <p style={{ fontSize: 13.5, color: "#1f2937", lineHeight: 1.65, whiteSpace: "pre-wrap", marginBottom: 6 }}>{n.text}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#6b7280" }}>
                  {new Date(n.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <button onClick={() => deleteNote(n.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b5a0", padding: "2px 4px", borderRadius: 5, display: "flex", alignItems: "center" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#c4b5a0")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FOLLOW-UPS & APPOINTMENTS
════════════════════════════════════════════════════════════════════ */
const FOLLOWUP_TYPES = [
  { value: "phone",    label: "📞 Phone Call"         },
  { value: "video",    label: "🎥 Video Call"          },
  { value: "email",    label: "📧 Email"               },
  { value: "whatsapp", label: "💬 WhatsApp"            },
  { value: "meeting",  label: "🤝 In-person Meeting"   },
];


function FollowUps({ caseId }: { caseId: string }) {
  const [type,     setType]     = useState("phone");
  const [dateTime, setDateTime] = useState("");
  const [notes,    setNotes]    = useState("");
  const [items,    setItems]    = useState<CaseFollowup[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    setLoading(true);
    getCaseFollowups(caseId)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [caseId]);

  async function schedule() {
    if (!dateTime) return;
    setSaving(true);
    try {
      const item = await addCaseFollowup(caseId, { type, dateTime, notes: notes.trim() });
      setItems(prev => [item, ...prev]);
      setDateTime(""); setNotes("");
    } catch { /* ignore */ } finally { setSaving(false); }
  }

  async function deleteItem(id: number) {
    await deleteCaseFollowup(caseId, id).catch(() => {});
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function fmtDT(iso: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const typeLabel = (v: string) => FOLLOWUP_TYPES.find(t => t.value === v)?.label ?? v;

  const canSchedule = !!dateTime && !saving;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 16 }}>📅</span>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>Follow-ups &amp; Appointments</p>
      </div>

      {/* Form card */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 18px 16px", background: "#fff", marginBottom: 16 }}>

        {/* Row 1 — Type + DateTime */}
        <div className="tdp-fu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#0d9488", textTransform: "uppercase", marginBottom: 6 }}>Type</p>
            <div style={{ position: "relative" }}>
              <select value={type} onChange={e => setType(e.target.value)}
                style={{ width: "100%", height: 40, padding: "0 32px 0 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", appearance: "none", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                {FOLLOWUP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#0d9488", textTransform: "uppercase", marginBottom: 6 }}>Date &amp; Time</p>
            <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Row 2 — Notes */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#0d9488", textTransform: "uppercase", marginBottom: 6 }}>Notes</p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Agenda, reminders, or notes for this follow-up…"
            style={{ width: "100%", minHeight: 72, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
        </div>

        {/* Schedule button */}
        <button onClick={schedule} disabled={!canSchedule}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 9, border: "none", background: canSchedule ? "#0d9488" : "#d1fae5", color: "#fff", fontSize: 13, fontWeight: 700, cursor: canSchedule ? "pointer" : "default", boxShadow: canSchedule ? "0 2px 8px rgba(13,148,136,0.2)" : "none" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {saving ? "Scheduling…" : "Schedule"}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#e5e7eb", marginBottom: 20 }} />

      {/* List / empty state */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 32, color: "#6b7280", fontSize: 13 }}>Loading follow-ups…</div>
      ) : items.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, gap: 12, textAlign: "center" }}>
          {/* Calendar illustration */}
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
            <rect x="6" y="12" width="52" height="46" rx="6" fill="#EEF4FF"/>
            <rect x="6" y="12" width="52" height="46" rx="6" fill="url(#cg)" opacity="0.5"/>
            <rect x="6" y="12" width="52" height="18" rx="6" fill="#6B9FED" opacity="0.85"/>
            <rect x="6" y="24" width="52" height="6" fill="#6B9FED" opacity="0.85"/>
            <circle cx="20" cy="9" r="4" fill="#9B5DE5"/>
            <circle cx="44" cy="9" r="4" fill="#9B5DE5"/>
            <rect x="14" y="36" width="8" height="8" rx="2" fill="#0d9488" opacity="0.7"/>
            <rect x="28" y="36" width="8" height="8" rx="2" fill="#6B9FED" opacity="0.6"/>
            <rect x="42" y="36" width="8" height="8" rx="2" fill="#9B5DE5" opacity="0.5"/>
            <rect x="14" y="48" width="8" height="4" rx="2" fill="#e5e7eb"/> 
            <rect x="28" y="48" width="8" height="4" rx="2" fill="#e5e7eb"/>
            <defs><linearGradient id="cg" x1="6" y1="12" x2="58" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#0d9488"/><stop offset="1" stopColor="#6B9FED" stopOpacity="0.3"/></linearGradient></defs>
          </svg>
          <p style={{ fontSize: 13.5, color: "#6b7280" }}>No follow-ups scheduled yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: "#fffbf4", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>{typeLabel(item.type)}</span>
                    <span style={{ fontSize: 11, color: "#0d9488", fontWeight: 600, background: "#f0fdfa", borderRadius: 20, padding: "2px 9px", border: "1px solid #a7f3d0" }}>
                      {fmtDT(item.dateTime)}
                    </span>
                  </div>
                  {item.notes && <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55 }}>{item.notes}</p>}
                  <p style={{ fontSize: 10.5, color: "#c4b5a0", marginTop: 5 }}>
                    Scheduled {new Date(item.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={() => deleteItem(item.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b5a0", padding: "2px 4px", borderRadius: 5, flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#c4b5a0")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   WRITING PAD — canvas drawing component
════════════════════════════════════════════════════════════════════ */
const PAD_COLORS = ["#000000","#0d9488","#e53e3e","#3182ce","#38a169","#805ad5","#d53f8c","#ffffff"];
const PAD_SIZES  = [
  { value: 1,  label: "1px — Fine"   },
  { value: 2,  label: "2px — Normal" },
  { value: 4,  label: "4px — Medium" },
  { value: 8,  label: "8px — Thick"  },
  { value: 16, label: "16px — Bold"  },
];

function WritingPad({ caseId }: { caseId: string }) {
  const canvasRef  = React.useRef<HTMLCanvasElement>(null);
  const wrapRef    = React.useRef<HTMLDivElement>(null);
  const drawing    = React.useRef(false);
  const lastPos    = React.useRef<{ x: number; y: number } | null>(null);
  const saveTimer  = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [tool,    setTool]    = useState<"pen"|"eraser">("pen");
  const [color,   setColor]   = useState("#000000");
  const [size,    setSize]    = useState(2);

  /* init canvas: restore saved image from DB or white fill */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    canvas.width  = wrap.clientWidth  || 800;
    canvas.height = 380;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    getCasePad(caseId).then(saved => {
      if (saved) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = saved;
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getXY(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width  / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top)  * scaleY,
    };
  }

  function onDown(e: React.MouseEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const pos = getXY(e);
    lastPos.current = pos;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === "eraser" ? size * 5 : size) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.fill();
  }
  function onMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing.current || !lastPos.current) return;
    const pos = getXY(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth   = tool === "eraser" ? size * 5 : size;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();
    lastPos.current = pos;
  }
  function onUp() {
    drawing.current = false; lastPos.current = null;
    /* debounced save to DB after stroke ends */
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const data = canvasRef.current?.toDataURL("image/png");
      if (data) saveCasePad(caseId, data).catch(() => {});
    }, 800);
  }

  function clearCanvas() {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    clearCasePad(caseId).catch(() => {});
  }
  function downloadPNG() {
    const link = document.createElement("a");
    link.download = "writing-pad.png";
    link.href = canvasRef.current!.toDataURL("image/png");
    link.click();
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ color: "#0d9488" }}><TIco.Pad /></span>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>Writing Pad</p>
      </div>

      {/* Card */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" }}>
          {/* Pen */}
          <button onClick={() => setTool("pen")}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", borderRadius: 7, border: `1.5px solid ${tool === "pen" ? "#0d9488" : "#e5e7eb"}`, background: tool === "pen" ? "#f0fdfc" : "#fff", color: tool === "pen" ? "#0d9488" : "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
            Pen
          </button>
          {/* Eraser */}
          <button onClick={() => setTool("eraser")}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", borderRadius: 7, border: `1.5px solid ${tool === "eraser" ? "#0d9488" : "#e5e7eb"}`, background: tool === "eraser" ? "#0d9488" : "#fff", color: tool === "eraser" ? "#fff" : "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16l13-13 7 7-3 3"/><path d="M6.5 17.5l5-5"/></svg>
            Eraser
          </button>

          {/* Color swatches */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {PAD_COLORS.map(c => (
              <button key={c} onClick={() => { setColor(c); setTool("pen"); }}
                style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: c === color && tool === "pen" ? "3px solid #0d9488" : "2px solid #d4c4b0", cursor: "pointer", flexShrink: 0, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #d4c4b0" : "none" }} />
            ))}
          </div>

          {/* Stroke size */}
          <select value={size} onChange={e => setSize(Number(e.target.value))}
            style={{ height: 32, padding: "0 28px 0 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 12.5, color: "#1f2937", background: "#fff", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            {PAD_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Canvas */}
        <div ref={wrapRef} style={{ lineHeight: 0 }}>
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", cursor: tool === "eraser" ? "cell" : "crosshair", touchAction: "none" }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, border: "none", background: "#0d9488", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(13,148,136,0.2)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13 19.79 19.79 0 0 1 1.29 4.37 2 2 0 0 1 3.22 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Save Drawing
        </button>
        <button onClick={clearCanvas}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Clear
        </button>
        <button onClick={downloadPNG}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PNG
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TRIKALA DETAIL — full-screen two-column view (matching image 2)
════════════════════════════════════════════════════════════════════ */
const TRIKALA_STATUS_CFG: Record<string, { bg: string; color: string; dot: string }> = {
  "Submitted":              { bg: "#EEF4FF", color: "#3B82F6", dot: "#3B82F6" },
  "Incomplete":             { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626" },
  "Ready for AI Analysis":  { bg: "#EFF6FF", color: "#2563EB", dot: "#2563EB" },
  "AI Draft Generated":     { bg: "#F3E8FF", color: "#7C3AED", dot: "#7C3AED" },
  "AI Report":              { bg: "#F3E8FF", color: "#7C3AED", dot: "#7C3AED" },
  "Awaiting Guruji Review": { bg: "#FFF7E6", color: "#D97706", dot: "#D97706" },
  "Under Review":           { bg: "#FFF7E6", color: "#D97706", dot: "#D97706" },
  "Remedy Assigned":        { bg: "#FDF2E9", color: "#C2410C", dot: "#C2410C" },
  "Follow-up Scheduled":    { bg: "#ECFEFF", color: "#0891B2", dot: "#0891B2" },
  "Finalized":              { bg: "#ECFDF5", color: "#059669", dot: "#059669" },
  "Published / Shared":     { bg: "#DCFCE7", color: "#16A34A", dot: "#16A34A" },
  "Published":              { bg: "#DCFCE7", color: "#16A34A", dot: "#16A34A" },
  "Closed":                 { bg: "#F3F4F6", color: "#6B7280", dot: "#6B7280" },
  "Reopened":               { bg: "#FEF3C7", color: "#B45309", dot: "#B45309" },
};
const ALL_TRIKALA_STATUSES = TRIKALA_STATUSES;
type DetailTab = "Analysis" | "Guruji Vakya" | "Remedies" | "Notes" | "AI Chat" | "Pad" | "Follow-ups";
const DETAIL_TABS: DetailTab[] = ["Analysis", "Guruji Vakya", "Remedies", "Notes", "AI Chat", "Pad", "Follow-ups"];

/* small icon helpers */
const TIco = {
  Phone:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.22 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Service:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  Cal:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Clock:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Pin:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Gender:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7"/><path d="M21 3l-6 6M15 3h6v6"/></svg>,
  Brief:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Submitted:() => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  Question: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  Status:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
  Star:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#0d9488" stroke="#0d9488" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Notes:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  AI:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/></svg>,
  Pad:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Follow:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
  Pencil:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
  Back:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
};

/* ══════════════════════════════════════════════════════════════════
   AI PRE-ANALYSIS tab (PRD §3 Stage 2) — generate the Guruji Review Sheet
══════════════════════════════════════════════════════════════════ */
function AiAnalysisTab({ reading }: { reading: TrikalaReading }) {
  const [report, setReport] = useState<AiReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    getAiReport(reading.caseReference).then(r => { if (on) { setReport(r); setLoading(false); } }).catch(() => setLoading(false));
    return () => { on = false; };
  }, [reading.caseReference]);

  async function generate() {
    setBusy(true); setErr("");
    try { setReport(await generateAiReport(reading.caseReference)); }
    catch (e: any) { setErr(e?.message || "Failed to generate analysis"); }
    finally { setBusy(false); }
  }

  const Block = ({ title, body, mono }: { title: string; body?: string; mono?: boolean }) => (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0d9488", marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 13, color: "#3a3f48", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: mono ? "monospace" : "inherit" }}>{body || "—"}</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid #F2F3F5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ color: "#0d9488", display: "flex" }}><TIco.AI /></span>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: "#23262d" }}>AI Pre-Analysis</p>
          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0d9488", background: "rgba(13,148,136,0.10)", padding: "2px 8px", borderRadius: 20 }}>Draft · Not Final</span>
        </div>
        <button onClick={generate} disabled={busy} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#d4a946,#c39a3e)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", boxShadow: "0 2px 8px rgba(13,148,136,0.3)", opacity: busy ? 0.7 : 1 }}>
          {busy ? "Analysing…" : <><TIco.Pencil /> {report ? "Regenerate" : "Generate"}</>}
        </button>
      </div>
      <div style={{ padding: "20px 24px" }}>
        {err && <p style={{ fontSize: 12.5, color: "#dc2626", marginBottom: 12 }}>{err}</p>}
        {loading ? (
          <p style={{ textAlign: "center", color: "#878d98", padding: 30, fontSize: 13 }}>Loading…</p>
        ) : !report ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, color: "#878d98", textAlign: "center", gap: 14 }}>
            <span style={{ fontSize: 42 }}>🔍</span>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 360 }}>No AI pre-analysis yet. Generate a structured Guruji Review Sheet — it summarizes the case, detects missing data, and suggests questions. <strong>It never finalizes guidance.</strong></p>
          </div>
        ) : (
          <>
            <Block title="Summary" body={report.summary} />
            {report.urgentPoints && report.urgentPoints !== "No urgent flags detected." && (
              <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#dc2626", marginBottom: 5 }}>⚡ Urgent Points</p>
                <p style={{ fontSize: 13, color: "#991b1b", lineHeight: 1.6 }}>{report.urgentPoints}</p>
              </div>
            )}
            <Block title="Missing / To Confirm" body={report.missingFields} />
            <Block title="Suggested Questions" body={report.suggestedQuestions} />
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", cursor: "pointer" }}>View full draft review sheet</summary>
              <pre style={{ fontSize: 11.5, color: "#3a3f48", lineHeight: 1.6, whiteSpace: "pre-wrap", background: "#FBF8F2", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginTop: 10, fontFamily: "monospace" }}>{report.draftReport}</pre>
            </details>
            <p style={{ fontSize: 11, color: "#9aa0ab", marginTop: 14 }}>Generated {fmt(report.createdAt)} · {fmtTime(report.createdAt)}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GURUJI VAKYA tab (PRD §3 Stage 3) — the most important section
══════════════════════════════════════════════════════════════════ */
function GurujiVakyaTab({ reading, onSaved }: { reading: TrikalaReading; onSaved: (updated: TrikalaReading) => void }) {
  const [f, setF] = useState({
    guruji_observation: reading.gurujiObservation || "", karmic_indication: reading.karmicIndication || "",
    divine_remedy: reading.divineRemedy || "", remedy_duration: reading.remedyDuration || "",
    remedy_place: reading.remedyPlace || "", mantra_japa: reading.mantraJapa || "",
    seva_daana: reading.sevaDaana || "", followup_required: reading.followupRequired || false,
    closure_note: reading.closureNote || "",
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: any) => { setF(p => ({ ...p, [k]: v })); setDone(false); };

  async function save(advance: boolean) {
    setSaving(true); setErr("");
    try {
      const updated = await saveGurujiVakya(reading.id, { ...f, advanceStatus: advance });
      onSaved(updated);
      setDone(true);
    } catch (e: any) { setErr(e?.message || "Failed to save guidance"); }
    finally { setSaving(false); }
  }

  const lbl = { fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#0d9488", display: "block", marginBottom: 6 };
  const ta  = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#ffffff", fontSize: 13.5, color: "#1f2937", outline: "none", resize: "vertical" as const, fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" as const };
  const inp = { width: "100%", height: 40, padding: "0 13px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#ffffff", fontSize: 13.5, color: "#1f2937", outline: "none", boxSizing: "border-box" as const };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "16px 22px", borderBottom: "1px solid #F2F3F5", background: "#f8fafc" }}>
        <span style={{ fontSize: 18 }}>🪔</span>
        <div>
          <p style={{ fontSize: 14.5, fontWeight: 800, color: "#0d9488" }}>Guruji Vakya &mdash; Sacred Guidance</p>
          <p style={{ fontSize: 11.5, color: "#6b7280" }}>The final, authoritative guidance. Saving advances the case to &ldquo;Remedy Assigned&rdquo;.</p>
        </div>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ marginBottom: 16 }}><label style={lbl}>Guruji&apos;s Observation</label><textarea rows={3} value={f.guruji_observation} onChange={e => set("guruji_observation", e.target.value)} style={ta} placeholder="What Guruji understood about the devotee's situation…" /></div>
        <div style={{ marginBottom: 16 }}><label style={lbl}>Spiritual Reason / Karmic Indication</label><textarea rows={2} value={f.karmic_indication} onChange={e => set("karmic_indication", e.target.value)} style={ta} /></div>
        <div style={{ marginBottom: 16 }}><label style={lbl}>Divine Remedy Advised</label><textarea rows={2} value={f.divine_remedy} onChange={e => set("divine_remedy", e.target.value)} style={ta} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ marginBottom: 16 }}><label style={lbl}>Duration</label><input value={f.remedy_duration} onChange={e => set("remedy_duration", e.target.value)} style={inp} placeholder="3 / 9 / 21 / 48 days" /></div>
          <div style={{ marginBottom: 16 }}><label style={lbl}>Place</label><input value={f.remedy_place} onChange={e => set("remedy_place", e.target.value)} style={inp} placeholder="Home / temple / kshetra" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ marginBottom: 16 }}><label style={lbl}>Mantra / Japa</label><input value={f.mantra_japa} onChange={e => set("mantra_japa", e.target.value)} style={inp} /></div>
          <div style={{ marginBottom: 16 }}><label style={lbl}>Seva / Daana</label><input value={f.seva_daana} onChange={e => set("seva_daana", e.target.value)} style={inp} /></div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16, cursor: "pointer" }}>
          <input type="checkbox" checked={f.followup_required} onChange={e => set("followup_required", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#0d9488" }} />
          <span style={{ fontSize: 13, color: "#1f2937", fontWeight: 500 }}>Follow-up required</span>
        </label>
        <div style={{ marginBottom: 16 }}><label style={lbl}>Case Closure Note</label><textarea rows={2} value={f.closure_note} onChange={e => set("closure_note", e.target.value)} style={ta} /></div>
        {err && <p style={{ fontSize: 12.5, color: "#dc2626", marginBottom: 10 }}>{err}</p>}
        {done && <p style={{ fontSize: 12.5, color: "#16a34a", marginBottom: 10, fontWeight: 600 }}>✓ Guruji Vakya saved.</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => save(false)} disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving…" : "Save Draft"}</button>
          <button onClick={() => save(true)} disabled={saving} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: "#f3f4f6", color: "#1f2937", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(13,148,136,0.3)" }}>Save &amp; Mark Remedy Assigned</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CASE REMEDIES tab (PRD §3 Stage 4) — assign from library, track status
══════════════════════════════════════════════════════════════════ */
function CaseRemediesTab({ reading }: { reading: TrikalaReading }) {
  const [items, setItems] = useState<CaseRemedy[]>([]);
  const [lib, setLib] = useState<Remedy[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [sel, setSel] = useState("");
  const [custom, setCustom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [its, library] = await Promise.all([getCaseRemedies(reading.caseReference), getRemedyLibrary()]);
      setItems(its); setLib(library);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [reading.caseReference]);
  useEffect(() => { load(); }, [load]);

  async function assign() {
    const chosen = lib.find(r => String(r.id) === sel);
    if (!chosen && !custom.trim()) return;
    setBusy(true);
    try {
      await assignRemedy(reading.caseReference, {
        remedy_name: chosen ? chosen.name : custom.trim(),
        remedy_id: chosen?.id, category: chosen?.category,
        custom_instruction: custom.trim() || chosen?.defaultInstruction || "",
        start_date: startDate || null, end_date: endDate || null,
        devotee_id: reading.devoteeId,
      } as any);
      setSel(""); setCustom(""); setStartDate(""); setEndDate(""); setAdding(false);
      load();
    } catch { /* ignore */ } finally { setBusy(false); }
  }
  async function setStatus(id: number, status: string) {
    try { await updateRemedyAssignment(id, { status }); load(); } catch { /* ignore */ }
  }
  async function remove(id: number) {
    try { await deleteRemedyAssignment(id); load(); } catch { /* ignore */ }
  }

  const inp = { width: "100%", height: 38, padding: "0 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#1f2937", outline: "none", boxSizing: "border-box" as const };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid #F2F3F5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 16 }}>🕯️</span>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: "#23262d" }}>Divine Remedies</p>
        </div>
        <button onClick={() => setAdding(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
          {adding ? "Cancel" : "+ Assign Remedy"}
        </button>
      </div>
      <div style={{ padding: "18px 24px" }}>
        {adding && (
          <div style={{ background: "#FBF8F2", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px", marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", display: "block", marginBottom: 6 }}>From Library</label>
            <select value={sel} onChange={e => setSel(e.target.value)} style={{ ...inp, marginBottom: 10 }}>
              <option value="">— Select a remedy —</option>
              {lib.map(r => <option key={r.id} value={r.id}>{remedyIcon(r.category)} {r.name} ({r.category})</option>)}
            </select>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", display: "block", marginBottom: 6 }}>Custom Instruction</label>
            <textarea value={custom} onChange={e => setCustom(e.target.value)} rows={2} style={{ ...inp, height: "auto", padding: "10px 12px", resize: "vertical", fontFamily: "inherit", marginBottom: 10 }} placeholder="Personalised instruction for this devotee…" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", display: "block", marginBottom: 6 }}>Start</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inp} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", display: "block", marginBottom: 6 }}>End</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inp} /></div>
            </div>
            <button onClick={assign} disabled={busy || (!sel && !custom.trim())} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "#0d9488", color: "#1f2937", fontSize: 12.5, fontWeight: 700, cursor: "pointer", opacity: busy || (!sel && !custom.trim()) ? 0.5 : 1 }}>{busy ? "Assigning…" : "Assign"}</button>
          </div>
        )}
        {loading ? (
          <p style={{ textAlign: "center", color: "#878d98", padding: 24, fontSize: 13 }}>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center", color: "#0d9488", padding: 24, fontSize: 13 }}>No remedies assigned yet.</p>
        ) : items.map(it => (
          <div key={it.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{remedyIcon(it.category)} {it.remedyName}</p>
                {it.customInstruction && <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 4, lineHeight: 1.5 }}>{it.customInstruction}</p>}
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{it.category}{it.startDate ? ` · ${fmt(it.startDate)}` : ""}{it.endDate ? ` → ${fmt(it.endDate)}` : ""}</p>
              </div>
              <button onClick={() => remove(it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbb9a6", flexShrink: 0 }}><Trash2 size={14} /></button>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {REMEDY_STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(it.id, s)}
                  style={{ padding: "3px 10px", borderRadius: 20, border: it.status === s ? "1.5px solid #0d9488" : "1px solid #e5e7eb", background: it.status === s ? "#0d9488" : "#fff", color: it.status === s ? "#fff" : "#6b7280", fontSize: 10.5, fontWeight: 600, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   APPOINTMENT CALENDAR VIEW (PRD §6) — month grid with event dots
══════════════════════════════════════════════════════════════════ */
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ══════════════════════════════════════════════════════════════════
   SETTINGS TAB — audit log + system summary (PRD §11)
══════════════════════════════════════════════════════════════════ */
function SettingsTab({
  todayStats, trikalaCount, devoteeCount, appointmentCount, remedyCount, adminCount, onSidebarToggle,
}: {
  todayStats: TodayStats | null; trikalaCount: number; devoteeCount: number; appointmentCount: number;
  remedyCount: number; adminCount: number; onSidebarToggle: () => void;
}) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditLimit, setAuditLimit] = useState(50);

  useEffect(() => {
    setAuditLoading(true);
    getAuditLogs(auditLimit).then(logs => { setAuditLogs(logs); setAuditLoading(false); }).catch(() => setAuditLoading(false));
  }, [auditLimit]);

  const systemCounts = [
    { label: "Trikala Cases",  value: trikalaCount,     icon: "⭕", color: "#0d9488" },
    { label: "Devotees",       value: devoteeCount,     icon: "🙏", color: "#7c3aed" },
    { label: "Appointments",   value: appointmentCount, icon: "📅", color: "#0891b2" },
    { label: "Remedy Library", value: remedyCount,      icon: "🕯️", color: "#0d9488" },
    { label: "Admin Users",    value: adminCount,       icon: "🔑", color: "#059669" },
    { label: "New Intake (today)",value: todayStats?.newIntake ?? 0, icon: "📋", color: "#d97706" },
  ];

  const ROLES_TABLE = ADMIN_ROLES.map(r => ({ ...r }));

  function actionColor(action: string): string {
    if (action.startsWith("CREATE")) return "#16a34a";
    if (action.startsWith("UPDATE") || action.startsWith("PATCH")) return "#0891b2";
    if (action.startsWith("DELETE")) return "#dc2626";
    return "#0d9488";
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9fafb", minHeight: 0, overflowY: "auto" }}>
      <div className="adm-hero-card">
        <div className="adm-hero-row">
          <div className="adm-hero-left">
            <button className="adm-hero-ham" onClick={onSidebarToggle}><Menu size={20} /></button>
            <div className="adm-hero-icon-wrap"><span style={{ fontSize: 22 }}>⚙️</span></div>
            <div className="adm-hero-text">
              <p className="adm-hero-eyebrow">System Configuration</p>
              <h1 className="adm-hero-h1">Settings &amp; Audit</h1>
              <p className="adm-hero-desc">Role matrix, system counts, and full audit trail</p>
            </div>
          </div>
          <div className="adm-hero-right">
            <div className="adm-hero-actions">
              <button className="adm-hero-btn-out" onClick={() => { setAuditLoading(true); getAuditLogs(auditLimit).then(l => { setAuditLogs(l); setAuditLoading(false); }).catch(() => setAuditLoading(false)); }}>
                <RefreshCw size={13} style={auditLoading ? { animation: "spin 1s linear infinite" } : {}} />
                <span className="adm-hero-btn-txt">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* System Counts */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14 }}>System Overview</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {systemCounts.map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE8DD", padding: "18px 16px", display: "flex", alignItems: "center", gap: 13, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Matrix */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14 }}>RBAC Role Matrix</p>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE8DD", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", background: "#F8F2EA", padding: "10px 16px", borderBottom: "1px solid #EDE8DD" }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Role</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Permissions</span>
            </div>
            {ROLES_TABLE.map((r, i) => (
              <div key={r.value} style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "12px 16px", borderBottom: i < ROLES_TABLE.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#1f2937" }}>{r.label}</p>
                  <code style={{ fontSize: 10, color: "#6b7280" }}>{r.value}</code>
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0d9488" }}>Audit Log · Last {auditLimit} entries</p>
            <select value={auditLimit} onChange={e => setAuditLimit(Number(e.target.value))}
              style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, color: "#1f2937", cursor: "pointer" }}>
              {[25, 50, 100, 200].map(n => <option key={n} value={n}>Show {n}</option>)}
            </select>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE8DD", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {auditLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 100, gap: 10, color: "#6b7280" }}>
                <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading audit log…
              </div>
            ) : auditLogs.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#0d9488", fontSize: 13 }}>No audit entries yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8F2EA", borderBottom: "1px solid #EDE8DD" }}>
                      {["Timestamp","Action","Entity Type","Entity ID","By"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, i) => (
                      <tr key={log.id} style={{ borderBottom: i < auditLogs.length - 1 ? "1px solid #e5e7eb" : "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                        onMouseLeave={e => (e.currentTarget.style.background = "")}>
                        <td style={{ padding: "9px 14px", color: "#6b7280", whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 11 }}>
                          {log.createdAt ? new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "9px 14px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff", background: actionColor(log.action || "") }}>
                            {log.action || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "9px 14px", color: "#1f2937", fontFamily: "monospace", fontSize: 11 }}>{log.entityType || "—"}</td>
                        <td style={{ padding: "9px 14px", color: "#6b7280", fontFamily: "monospace", fontSize: 11 }}>{log.entityId || "—"}</td>
                        <td style={{ padding: "9px 14px", color: "#6b7280", fontSize: 11 }}>{log.userName || "system"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApptCalendar({ appointments, onSelect }: { appointments: Appointment[]; onSelect: (a: Appointment) => void }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [picked, setPicked] = useState<number | null>(null);

  function prev() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setPicked(null); }
  function next() { if (month === 11) { setYear(y => y + 1); setMonth(0);  } else setMonth(m => m + 1); setPicked(null); }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function apptsByDay(d: number): Appointment[] {
    return appointments.filter(a => {
      if (!a.startTime) return false;
      const dt = new Date(a.startTime);
      return dt.getFullYear() === year && dt.getMonth() === month && dt.getDate() === d;
    });
  }

  const dayAppts = picked ? apptsByDay(picked) : [];
  const todayD = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1;

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
        <button onClick={prev} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
          <ChevronLeft size={16} />
        </button>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#1f2937" }}>{MONTH_NAMES[month]} {year}</p>
        <button onClick={next} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 16px 4px" }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 16px 16px", gap: 4 }}>
        {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const appts = apptsByDay(d);
          const isToday = d === todayD;
          const isPicked = d === picked;
          return (
            <button key={d} onClick={() => setPicked(isPicked ? null : d)}
              style={{
                padding: "6px 4px", borderRadius: 9, border: isPicked ? "2px solid #0d9488" : isToday ? "2px solid #0d9488" : "2px solid transparent",
                background: isPicked ? "#0d9488" : isToday ? "#f3f4f6" : "transparent",
                color: isPicked ? "#fff" : isToday ? "#0d9488" : "#1f2937",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minHeight: 52, position: "relative",
              }}>
              <span style={{ fontSize: 13, fontWeight: isPicked || isToday ? 800 : 500 }}>{d}</span>
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                {appts.slice(0, 3).map((a, idx) => (
                  <span key={idx} style={{ width: 6, height: 6, borderRadius: "50%", background: isPicked ? "rgba(255,255,255,0.8)" : "#0d9488", flexShrink: 0 }} />
                ))}
                {appts.length > 3 && <span style={{ fontSize: 8, fontWeight: 700, color: isPicked ? "#fff" : "#6b7280" }}>+{appts.length - 3}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      {picked && (
        <div style={{ borderTop: "1px solid #e5e7eb", padding: "16px 24px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            {picked} {MONTH_NAMES[month]} · {dayAppts.length} appointment{dayAppts.length !== 1 ? "s" : ""}
          </p>
          {dayAppts.length === 0 ? (
            <p style={{ fontSize: 13, color: "#0d9488" }}>No appointments. Click "New Appointment" to schedule one.</p>
          ) : dayAppts.map(a => (
            <div key={a.id} onClick={() => onSelect(a)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 8, cursor: "pointer", background: "#f9fafb" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.background = "#f9fafb")}>
              <div style={{ width: 6, height: 40, borderRadius: 3, background: a.status === "Completed" ? "#16a34a" : a.priority === "Urgent" ? "#dc2626" : "#0d9488", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{a.devoteeName || "Devotee"}</p>
                <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{a.appointmentType} · {a.startTime ? fmtTime(a.startTime) : "Time TBD"}{a.mode ? ` · ${a.mode}` : ""}</p>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151", background: "#f3f4f6", padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AI CHAT tab (PRD §4-C) — per-case contextual assistant
══════════════════════════════════════════════════════════════════ */
function AiChatTab({ reading }: { reading: TrikalaReading }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef  = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let on = true;
    getChatMessages(reading.caseReference)
      .then(msgs => { if (on) { setMessages(msgs); setLoading(false); } })
      .catch(() => setLoading(false));
    return () => { on = false; };
  }, [reading.caseReference]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const txt = draft.trim();
    if (!txt || sending) return;
    setDraft("");
    setSending(true);
    try {
      const { userMessage, aiMessage } = await sendChatMessage(reading.caseReference, txt);
      setMessages(prev => [...prev, userMessage, aiMessage]);
    } catch { /* ignore */ } finally { setSending(false); inputRef.current?.focus(); }
  }

  async function clear() {
    if (!confirm("Clear all chat history for this case?")) return;
    setClearing(true);
    try { await clearChatHistory(reading.caseReference); setMessages([]); }
    catch { /* ignore */ } finally { setClearing(false); }
  }

  const QUICK = [
    "Namaskar! What can you tell me about this case?",
    "What information is missing?",
    "Suggest questions to ask the devotee",
    "Is this case urgent?",
    "Summarize the guidance given so far",
    "What is the current status flow?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderBottom: "1px solid #F2F3F5", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#23262d" }}>Seva AI Assistant</p>
            <p style={{ fontSize: 11, color: "#9aa0ab" }}>Context-aware · Case {reading.caseReference} · Not a substitute for Guruji&apos;s guidance</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} disabled={clearing} style={{ fontSize: 11.5, color: "#9aa0ab", background: "none", border: "1px solid #e5e7eb", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
            {clearing ? "Clearing…" : "Clear"}
          </button>
        )}
      </div>

      {/* Message list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#0d9488", fontSize: 13, padding: 30 }}>Loading chat…</p>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>🙏</p>
            <p style={{ fontSize: 13.5, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>Namaskar! I am your Seva AI Assistant.</p>
            <p style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 22, lineHeight: 1.6, maxWidth: 340, margin: "0 auto 22px" }}>
              I can help you understand this case, identify missing data, and prepare for Guruji's review. Ask me anything.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => { setDraft(q); inputRef.current?.focus(); }}
                  style={{ padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: "#FBF8F2", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(m => (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "11px 15px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "linear-gradient(135deg,#0d9488,#14b8a6)" : "#f9fafb",
                  color: m.role === "user" ? "#ffffff" : "#1f2937",
                  fontSize: 13.5, lineHeight: 1.65, whiteSpace: "pre-wrap",
                  boxShadow: m.role === "user" ? "0 2px 8px rgba(13,148,136,0.2)" : "0 1px 4px rgba(0,0,0,0.05)",
                  border: m.role === "assistant" ? "1px solid #e5e7eb" : "none",
                }}>
                  {/* Render bold markdown (**text**) */}
                  {m.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={i}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                </div>
                <span style={{ fontSize: 10.5, color: "#0d9488", marginTop: 4, paddingLeft: m.role === "user" ? 0 : 4 }}>
                  {m.role === "user" ? "You" : "Seva AI"} · {fmtTime(m.createdAt)}
                </span>
              </div>
            ))}
            {sending && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ padding: "10px 16px", borderRadius: "14px 14px 14px 4px", background: "#f9fafb", border: "1px solid #e5e7eb", fontSize: 13 }}>
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                    {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#0d9488", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Quick prompts (when messages exist) */}
      {messages.length > 0 && (
        <div style={{ padding: "8px 22px 0", borderTop: "1px solid #e5e7eb", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
          {["Missing info?", "Suggest questions", "Case summary", "Urgency?"].map(q => (
            <button key={q} onClick={() => { setDraft(q); inputRef.current?.focus(); }}
              style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "1px solid #e5e7eb", background: "#FBF8F2", color: "#374151", fontSize: 11.5, cursor: "pointer", whiteSpace: "nowrap" }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "12px 22px 16px", borderTop: "1px solid #F2F3F5", flexShrink: 0, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)} rows={2}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about missing data, case summary, questions to ask, urgency… (Enter to send)"
          style={{ flex: 1, padding: "10px 13px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#ffffff", fontSize: 13.5, color: "#1f2937", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
        <button onClick={send} disabled={!draft.trim() || sending}
          style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: draft.trim() && !sending ? "linear-gradient(135deg,#0d9488,#14b8a6)" : "#d1fae5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: draft.trim() && !sending ? "pointer" : "default", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CASE PDF GENERATION (PRD §9) — 7 case-specific PDF types
══════════════════════════════════════════════════════════════════ */
function buildCasePdfHeader(doc: any, title: string, subtitle: string, caseRef: string, watermark?: string) {
  const PW = 210; const M = 14;
  doc.setFillColor(75, 13, 19);
  doc.rect(0, 0, PW, 30, "F");
  doc.setDrawColor(185, 147, 74); doc.setLineWidth(0.7); doc.line(0, 30, PW, 30);
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(245, 230, 200);
  doc.text("Pujya Sri Gurumurthy Guruji", M, 10);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(185, 147, 74);
  doc.text(subtitle.toUpperCase(), M, 18);
  doc.setFontSize(7); doc.setTextColor(160, 140, 110);
  doc.text(`Case: ${caseRef}`, PW - M, 10, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, PW - M, 17, { align: "right" });
  doc.setFillColor(253, 248, 242); doc.rect(0, 30, PW, 9, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(75, 13, 19);
  doc.text(title, M, 36);
  if (watermark) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(52); doc.setTextColor(240, 225, 205);
    doc.setGState(new (doc as any).GState({ opacity: 0.12 }));
    doc.text(watermark, PW / 2, 160, { align: "center", angle: 35 });
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
  }
}
function casePdfFooter(doc: any, pages: number) {
  const PW = 210; const M = 14;
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    const H = doc.internal.pageSize.height;
    doc.setDrawColor(185, 147, 74); doc.setLineWidth(0.4); doc.line(M, H - 11, PW - M, H - 11);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(155, 122, 94);
    doc.text("Gurumurthy Guruji — Sacred · Confidential · Not for distribution", M, H - 6);
    doc.text(`Page ${p} of ${pages}`, PW - M, H - 6, { align: "right" });
  }
}
function row(doc: any, label: string, value: string, y: number): number {
  const M = 14; const PW = 210;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(155, 122, 94);
  doc.text(label.toUpperCase(), M, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(43, 28, 19);
  const lines = doc.splitTextToSize(value || "—", PW - M - 60);
  doc.text(lines, 65, y);
  return y + Math.max(8, lines.length * 5.5);
}

function generateTrikalaIntakePDF(reading: TrikalaReading) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  buildCasePdfHeader(doc, "Trikala Consultation — Intake Form", "TRIKALA INTAKE FORM", reading.caseReference, "INTAKE");
  let y = 48;
  y = row(doc, "Full Name", reading.fullName, y); y += 2;
  y = row(doc, "Mobile", reading.mobile, y); y += 2;
  y = row(doc, "Email", reading.email, y); y += 2;
  y = row(doc, "Gender", reading.gender, y); y += 2;
  y = row(doc, "Occupation", reading.occupation, y); y += 2;
  y = row(doc, "Date of Birth", reading.dob ? reading.dob.toString().slice(0,10) : "—", y); y += 2;
  y = row(doc, "Time of Birth", reading.tob || "Not provided", y); y += 2;
  y = row(doc, "Place of Birth", reading.pob, y); y += 2;
  y = row(doc, "Service Type", reading.serviceType === "ashta_rekha" ? "Ashta Rekha Palm Reading" : "General Horoscope", y); y += 2;
  y = row(doc, "Priority", reading.priority || "Normal", y); y += 2;
  y = row(doc, "Category", reading.problemCategory || "—", y); y += 6;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(75, 13, 19);
  doc.text("DEVOTEE'S QUESTION / GUIDANCE QUERY", 14, y); y += 6;
  doc.setFillColor(253, 248, 242); doc.roundedRect(14, y - 3, 182, 38, 3, 3, "F");
  doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(59, 26, 14);
  const qLines = doc.splitTextToSize(`"${reading.guidanceQuery}"`, 176);
  doc.text(qLines, 16, y + 2);
  casePdfFooter(doc, doc.getNumberOfPages());
  doc.save(`trikala-intake-${reading.caseReference}.pdf`);
}

function generateFinalConsultationPDF(reading: TrikalaReading) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  buildCasePdfHeader(doc, "Final Consultation Summary", "FINAL CONSULTATION — GURUJI BLESSINGS", reading.caseReference, "FINAL");
  let y = 48;
  y = row(doc, "Devotee", reading.fullName, y); y += 2;
  y = row(doc, "Service", reading.serviceType === "ashta_rekha" ? "Ashta Rekha" : "General Horoscope", y); y += 2;
  y = row(doc, "Reviewed", reading.gurujiReviewedAt ? new Date(reading.gurujiReviewedAt).toLocaleString("en-IN") : "—", y); y += 6;
  if (reading.gurujiObservation) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(75, 13, 19);
    doc.text("GURUJI'S OBSERVATION", 14, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(43, 28, 19);
    doc.text(doc.splitTextToSize(reading.gurujiObservation, 182), 14, y); y += 20;
  }
  if (reading.karmicIndication) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(75, 13, 19);
    doc.text("KARMIC INDICATION", 14, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(43, 28, 19);
    doc.text(doc.splitTextToSize(reading.karmicIndication, 182), 14, y); y += 16;
  }
  if (reading.divineRemedy) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(75, 13, 19);
    doc.text("DIVINE REMEDY ADVISED", 14, y); y += 6;
    doc.setFillColor(253, 248, 242); doc.roundedRect(14, y - 3, 182, 28, 3, 3, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(107, 18, 28);
    doc.text(doc.splitTextToSize(reading.divineRemedy, 178), 16, y + 2); y += 28;
    y = row(doc, "Duration", reading.remedyDuration || "As advised", y); y += 2;
    y = row(doc, "Place", reading.remedyPlace || "As advised", y); y += 2;
    y = row(doc, "Mantra / Japa", reading.mantraJapa || "—", y); y += 2;
    y = row(doc, "Seva / Daana", reading.sevaDaana || "—", y); y += 2;
  }
  if (reading.closureNote) { y += 4; y = row(doc, "Closure Note", reading.closureNote, y); }
  casePdfFooter(doc, doc.getNumberOfPages());
  doc.save(`final-consultation-${reading.caseReference}.pdf`);
}

function generateRemedyInstructionCardPDF(reading: TrikalaReading) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  buildCasePdfHeader(doc, "Divine Remedy Instruction Card", "REMEDY INSTRUCTIONS — FOR DEVOTEE", reading.caseReference);
  const M = 14; let y = 48;
  doc.setFillColor(107, 18, 28); doc.roundedRect(M, y, 182, 18, 4, 4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(245, 230, 200);
  doc.text(reading.fullName, M + 6, y + 11);
  y += 26;
  if (reading.divineRemedy) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(75, 13, 19);
    doc.text("PRESCRIBED REMEDY", M, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(43, 28, 19);
    doc.text(doc.splitTextToSize(reading.divineRemedy, 182), M, y); y += 16;
    const details = [
      ["Duration", reading.remedyDuration], ["Place", reading.remedyPlace],
      ["Mantra / Japa", reading.mantraJapa], ["Seva / Daana", reading.sevaDaana],
    ].filter(([, v]) => v) as [string, string][];
    details.forEach(([k, v]) => { y = row(doc, k, v, y); y += 2; });
  }
  if (reading.closureNote) { y += 4; y = row(doc, "Special Note", reading.closureNote, y); }
  y += 10;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(155, 122, 94);
  doc.text("🙏 Perform with faith, devotion, and purity of heart. Jay Guruji. 🕉️", M, y, { align: "left" });
  casePdfFooter(doc, doc.getNumberOfPages());
  doc.save(`remedy-card-${reading.caseReference}.pdf`);
}

function generateAiDraftPDF(reading: TrikalaReading, report: AiReport | null) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  buildCasePdfHeader(doc, "AI Pre-Analysis Draft Report", "AI DRAFT — NOT FINAL GUIDANCE", reading.caseReference, "DRAFT");
  const M = 14; let y = 48;
  doc.setFillColor(254, 243, 199); doc.roundedRect(M, y, 182, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(146, 64, 14);
  doc.text("⚠️  This is an AI-generated draft. It is for internal review only. Guruji's final guidance supersedes this document entirely.", M + 4, y + 6);
  y += 16;
  if (report) {
    y = row(doc, "Summary", report.summary, y); y += 4;
    y = row(doc, "Missing Fields", report.missingFields, y); y += 4;
    y = row(doc, "Suggested Questions", report.suggestedQuestions, y); y += 4;
    if (report.urgentPoints) { y = row(doc, "Urgent Points", report.urgentPoints, y); y += 4; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(75, 13, 19);
    doc.text("FULL DRAFT REPORT", M, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(43, 28, 19);
    const lines = doc.splitTextToSize(report.draftReport || "", 182);
    doc.text(lines, M, y);
  } else {
    doc.setFont("helvetica", "italic"); doc.setFontSize(11); doc.setTextColor(155, 122, 94);
    doc.text("No AI report generated for this case yet.", M, y);
  }
  casePdfFooter(doc, doc.getNumberOfPages());
  doc.save(`ai-draft-${reading.caseReference}.pdf`);
}

function generateGurujiReviewSheetPDF(reading: TrikalaReading, report: AiReport | null) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  buildCasePdfHeader(doc, "Guruji Review Sheet — Internal", "GURUJI REVIEW SHEET · CONFIDENTIAL", reading.caseReference, "FOR REVIEW");
  const M = 14; let y = 48;
  y = row(doc, "Devotee", reading.fullName, y); y += 2;
  y = row(doc, "DOB", reading.dob ? reading.dob.toString().slice(0,10) : "—", y); y += 2;
  y = row(doc, "TOB", reading.tob || "Not provided", y); y += 2;
  y = row(doc, "POB", reading.pob, y); y += 2;
  y = row(doc, "Service", reading.serviceType === "ashta_rekha" ? "Ashta Rekha" : "General Horoscope", y); y += 4;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(75, 13, 19);
  doc.text("DEVOTEE'S QUERY", M, y); y += 6;
  doc.setFillColor(253, 248, 242); doc.roundedRect(M, y - 3, 182, 22, 3, 3, "F");
  doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(59, 26, 14);
  doc.text(doc.splitTextToSize(`"${reading.guidanceQuery}"`, 178), M + 2, y + 2); y += 26;
  if (report) {
    y = row(doc, "AI Summary", report.summary, y); y += 4;
    y = row(doc, "Missing Info", report.missingFields, y); y += 4;
    y = row(doc, "Key Questions", report.suggestedQuestions, y); y += 4;
    if (report.urgentPoints) { y = row(doc, "Urgent Points", report.urgentPoints, y); y += 6; }
  }
  /* Blank Guruji entry fields */
  const sections = ["Guruji's Observation", "Karmic Indication", "Divine Remedy", "Mantra / Japa"];
  sections.forEach(s => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(107, 18, 28);
    doc.text(s.toUpperCase(), M, y); y += 5;
    doc.setDrawColor(185, 147, 74); doc.setLineWidth(0.3);
    for (let i = 0; i < 3; i++) { doc.line(M, y + i * 6, 196, y + i * 6); }
    y += 24;
  });
  casePdfFooter(doc, doc.getNumberOfPages());
  doc.save(`guruji-review-sheet-${reading.caseReference}.pdf`);
}

/* ── Tiny PDF state panel for the case detail (opens from status bar) ── */
function CasePdfMenu({ reading }: { reading: TrikalaReading }) {
  const [open, setOpen] = useState(false);
  const [aiReport, setAiReport] = useState<AiReport | null>(null);
  useEffect(() => {
    if (open && aiReport === null) {
      getAiReport(reading.caseReference).then(r => setAiReport(r ?? undefined as any)).catch(() => {});
    }
  }, [open, reading.caseReference]); // eslint-disable-line react-hooks/exhaustive-deps
  const options = [
    { label: "Intake Form",           icon: "📋", fn: () => generateTrikalaIntakePDF(reading) },
    { label: "AI Draft Report",       icon: "🔍", fn: () => generateAiDraftPDF(reading, aiReport) },
    { label: "Guruji Review Sheet",   icon: "📝", fn: () => generateGurujiReviewSheetPDF(reading, aiReport) },
    { label: "Final Consultation",    icon: "📄", fn: () => generateFinalConsultationPDF(reading) },
    { label: "Remedy Instruction Card",icon: "🕯️", fn: () => generateRemedyInstructionCardPDF(reading) },
  ];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 8, border: "1.5px solid rgba(13,148,136,0.3)", background: "rgba(240,253,252,0.9)", color: "#0d9488", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
        <FileDown size={13} /> PDF
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 200 }}>
          {options.map(o => (
            <button key={o.label} onClick={() => { o.fn(); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", border: "none", borderBottom: "1px solid #e5e7eb", background: "#fff", color: "#1f2937", fontSize: 12.5, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#FEF3E2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
              <span>{o.icon}</span> {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TrikalaDetailPanel({
  reading,
  onClose,
  onStatusChange,
}: {
  reading: TrikalaReading;
  onClose: () => void;
  onStatusChange: (updated: TrikalaReading) => void;
}) {
  const [status,    setStatus]    = useState(reading.status);
  const [saving,    setSaving]    = useState(false);
  const [saveErr,   setSaveErr]   = useState("");
  const [activeTab, setActiveTab] = useState<DetailTab>("Analysis");

  async function save() {
    if (status === reading.status) return;
    setSaving(true); setSaveErr("");
    try {
      const updated = await updateTrikalaStatus(reading.id, status);
      onStatusChange(updated);
    } catch (e: any) {
      setSaveErr(e?.message || "Failed to update status");
    } finally { setSaving(false); }
  }

  const stsCfg  = TRIKALA_STATUS_CFG[reading.status] ?? TRIKALA_STATUS_CFG["Submitted"];
  const svcLabel = reading.serviceType === "ashta_rekha" ? "Ashta Rekha" : "General Horoscope";

  const infoRows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <TIco.Phone />,     label: "MOBILE",        value: reading.mobile },
    { icon: <TIco.Mail />,      label: "EMAIL",         value: reading.email },
    { icon: <TIco.Service />,   label: "SERVICE",       value: svcLabel },
    { icon: <TIco.Cal />,       label: "DATE OF BIRTH", value: reading.dob ? reading.dob.toString().slice(0, 10) : "—" },
    { icon: <TIco.Clock />,     label: "TIME OF BIRTH", value: reading.tob || "—" },
    { icon: <TIco.Pin />,       label: "PLACE OF BIRTH",value: reading.pob },
    { icon: <TIco.Gender />,    label: "GENDER",        value: reading.gender },
    { icon: <TIco.Brief />,     label: "OCCUPATION",    value: reading.occupation },
    { icon: <TIco.Submitted />, label: "SUBMITTED",     value: reading.createdAt ? new Date(reading.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—" },
  ];

  const tabIcon: Record<DetailTab, React.ReactNode> = {
    "Analysis":     <TIco.Star />,
    "Guruji Vakya": <span style={{ fontSize: 14 }}>🪔</span>,
    "Remedies":     <span style={{ fontSize: 14 }}>🕯️</span>,
    "Notes":        <TIco.Notes />,
    "AI Chat":      <TIco.AI />,
    "Pad":          <TIco.Pad />,
    "Follow-ups":   <TIco.Follow />,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: "#F2F3F5",
        display: "flex", flexDirection: "column",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .tdp-top      { padding: 0 12px !important; gap: 8px !important; }
          .tdp-logo-txt { display: none !important; }
          .tdp-admin    { display: none !important; }
          .tdp-vdiv     { display: none !important; }
          .tdp-body     { flex-direction: column !important; overflow-y: auto !important; padding: 14px !important; gap: 14px !important; }
          .tdp-left     { width: 100% !important; overflow-y: visible !important; padding-right: 0 !important; }
          .tdp-right    { overflow: visible !important; }
          .tdp-tabs     { overflow-x: auto !important; scrollbar-width: none; }
          .tdp-tabs::-webkit-scrollbar { display: none; }
          .tdp-tabs button { flex: 0 0 auto !important; padding: 9px 14px !important; }
          .tdp-content  { overflow-y: visible !important; min-height: 320px; }
          .tdp-fu-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .tdp-top { height: 52px !important; }
          .tdp-body { padding: 10px !important; }
        }
      `}</style>
      {/* ── TOP BAR ─────────────────────────────────────── */}
      <div className="tdp-top" style={{
        background: "#fff", borderBottom: "1px solid #E8E8EA",
        padding: "0 20px", height: 48,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <button onClick={onClose}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6B5744", fontSize: 13, fontWeight: 600, padding: "5px 8px", borderRadius: 7 }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          <TIco.Back /> Back to list
        </button>
        <span style={{ color: "#d1fae5" }}>|</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>{reading.caseReference}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", background: stsCfg.bg, color: stsCfg.color }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: stsCfg.dot, display: "inline-block", flexShrink: 0 }} />
          {reading.status}
        </span>
        <div style={{ flex: 1 }} />
        <CasePdfMenu reading={reading} />
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginLeft: 8 }}>{reading.fullName}</span>
      </div>

      {/* ── BODY ────────────────────────────────────────── */}
      {/* flex row; left panel scrolls, right panel scrolls */}
      <div className="tdp-body" style={{
        flex: 1, display: "flex", gap: 24, padding: "24px 40px",
        overflow: "hidden", minHeight: 0,
      }}>

        {/* ── LEFT PANEL (300 px, scrollable) ──────────── */}
        <div className="tdp-left" style={{
          width: 300, flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 14,
          overflowY: "auto", paddingRight: 4,
        }}>

          {/* Profile card */}
          <div style={{ background: "linear-gradient(180deg,#f0fdfc 0%,#f9fafb 60%,#fff 100%)", borderRadius: 14, border: "1px solid #e5e7eb", padding: "26px 18px 20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdfa", border: "1.5px solid rgba(13,148,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cinzel), Georgia, serif", fontSize: 26, fontWeight: 700, color: "#0d9488", margin: "0 auto 12px" }}>
              {reading.fullName[0]?.toUpperCase()}
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#23262d", marginBottom: 3 }}>{reading.fullName}</p>
            <p style={{ fontSize: 11.5, color: "#9aa0ab", marginBottom: 12 }}>Case # {reading.caseReference}</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 14px", background: stsCfg.bg, color: stsCfg.color, border: "1px solid rgba(0,0,0,0.05)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: stsCfg.dot, display: "inline-block" }} />
              {reading.status}
            </span>
          </div>

          {/* Info rows */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEDEF", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flexShrink: 0 }}>
            {infoRows.map(({ icon, label, value }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "11px 16px", borderBottom: i < infoRows.length - 1 ? "1px solid #F2F3F5" : "none" }}>
                <span style={{ color: "#0d9488", flexShrink: 0, marginTop: 2, display: "flex" }}>{icon}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", color: "#9aa0ab", textTransform: "uppercase", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "#23262d", wordBreak: "break-word", lineHeight: 1.45 }}>{value || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Devotee's Question */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEDEF", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid #F2F3F5" }}>
              <span style={{ color: "#0d9488" }}><TIco.Question /></span>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#23262d" }}>Devotee&apos;s Question</p>
            </div>
            <p style={{ fontSize: 13.5, color: "#3a3f48", lineHeight: 1.65, fontStyle: "italic", padding: "14px 16px" }}>&ldquo;{reading.guidanceQuery}&rdquo;</p>
          </div>

          {/* Update Status */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEDEF", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <span style={{ color: "#0d9488" }}><TIco.Status /></span>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#3a3f48", letterSpacing: "0.06em", textTransform: "uppercase" }}>Update Status</p>
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <select value={status} onChange={e => setStatus(e.target.value as typeof status)}
                style={{ width: "100%", height: 40, padding: "0 32px 0 12px", borderRadius: 9, border: "1.5px solid #d4c4b0", background: "#f9fafb", fontSize: 13, color: "#1f2937", appearance: "none", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                {ALL_TRIKALA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {saveErr && <p style={{ fontSize: 11.5, color: "#ef4444", marginBottom: 8 }}>{saveErr}</p>}
            <button onClick={save} disabled={saving || status === reading.status}
              style={{ width: "100%", height: 40, borderRadius: 9, border: "none", background: (saving || status === reading.status) ? "#d1fae5" : "#0d9488", color: "#fff", fontWeight: 700, fontSize: 13, cursor: (saving || status === reading.status) ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: (saving || status === reading.status) ? "none" : "0 2px 8px rgba(13,148,136,0.2)" }}>
              {saving ? "Saving…" : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save Status</>}
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL (flex-1, scrollable) ─────────── */}
        <div className="tdp-right" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden", gap: 18 }}>

          {/* Tab bar — segmented control */}
          <div className="tdp-tabs" style={{ display: "flex", background: "#EAEBEE", borderRadius: 12, padding: 4, flexShrink: 0, gap: 4 }}>
            {DETAIL_TABS.map(t => {
              const active = activeTab === t;
              return (
                <button key={t} onClick={() => setActiveTab(t)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "10px 12px", borderRadius: 9, border: "none",
                    background: active ? "#fff" : "transparent",
                    boxShadow: active ? "0 1px 5px rgba(0,0,0,0.08)" : "none",
                    cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
                    color: active ? "#0d9488" : "#878d98", whiteSpace: "nowrap", transition: "all 0.15s",
                  }}>
                  <span style={{ color: active ? "#0d9488" : "#a0a6b0", display: "flex" }}>{tabIcon[t]}</span>
                  {t}
                </button>
              );
            })}
          </div>

          {/* Tab content — floating white card, scrollable */}
          <div className="tdp-content" style={{ flex: 1, background: "#fff", border: "1px solid #EDEDEF", borderRadius: 14, overflowY: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {activeTab === "Analysis" && <AiAnalysisTab reading={reading} />}
            {activeTab === "Guruji Vakya" && <GurujiVakyaTab reading={reading} onSaved={onStatusChange} />}
            {activeTab === "Remedies" && <CaseRemediesTab reading={reading} />}
            {activeTab === "Notes" && <div style={{ padding: "22px 24px" }}><PrivateNotes caseId={reading.caseReference} /></div>}
            {activeTab === "AI Chat" && <div style={{ height: "100%", display: "flex", flexDirection: "column" }}><AiChatTab reading={reading} /></div>}
            {activeTab === "Pad" && <div style={{ padding: "22px 24px" }}><WritingPad caseId={reading.caseReference} /></div>}
            {activeTab === "Follow-ups" && <div style={{ padding: "22px 24px" }}><FollowUps caseId={reading.caseReference} /></div>}
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "10px", fontSize: 11, color: "#b6bbc4", flexShrink: 0 }}>
        Guruji Astro · Admin Panel · {new Date().getFullYear()}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed,    setAuthed]    = useState(false);
  const [loggedName, setLoggedName] = useState("");
  const [loggedMobile, setLoggedMobile] = useState("");
  const router       = useRouter();
  const searchParams = useSearchParams();
  const VALID_TABS: Tab[] = ["today", "bookings", "contacts", "admins", "trikala", "devotees", "appointments", "remedies", "reports", "settings"];
  const initTab = (searchParams.get("tab") as Tab | null);
  const [tab, setTab] = useState<Tab>(VALID_TABS.includes(initTab as Tab) ? (initTab as Tab) : "today");
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
  const [trikalaReadings, setTrikalaReadings] = useState<TrikalaReading[]>([]);
  const [trikalaLoading, setTrikalaLoading] = useState(false);
  const [trikalaError, setTrikalaError]     = useState("");
  const [trikalaSearch, setTrikalaSearch]   = useState("");
  const [trikalaDetail, setTrikalaDetail]   = useState<TrikalaReading | null>(null);
  const [trikalaFilter, setTrikalaFilter]   = useState("all");
  const [devoteeFilter, setDevoteeFilter]   = useState("all");

  /* ── PRD modules state ── */
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [analytics, setAnalytics]   = useState<Analytics | null>(null);
  const [devotees, setDevotees]           = useState<Devotee[]>([]);
  const [devoteesLoading, setDevoteesLoading] = useState(false);
  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [devoteeRel, setDevoteeRel]       = useState("all");
  const [devoteeHistory, setDevoteeHistory] = useState<DevoteeHistory | null>(null);
  const [devoteeHistoryLoading, setDevoteeHistoryLoading] = useState(false);
  const [appointments, setAppointments]   = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading]     = useState(false);
  const [apptFilter, setApptFilter]       = useState("all");
  const [apptView, setApptView]           = useState<"list" | "calendar">("list");
  const [apptPanel, setApptPanel]         = useState<{ open: boolean; appt: Appointment | null }>({ open: false, appt: null });
  const [remedyLib, setRemedyLib]         = useState<Remedy[]>([]);
  const [remedyLibLoading, setRemedyLibLoading] = useState(false);
  const [remedyCatFilter, setRemedyCatFilter]   = useState("all");
  const [remedyPanel, setRemedyPanel]     = useState<{ open: boolean; remedy: Remedy | null }>({ open: false, remedy: null });
  const [addDevoteeOpen, setAddDevoteeOpen] = useState(false);

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

  const fetchTrikala = useCallback(async () => {
    setTrikalaLoading(true);
    setTrikalaError("");
    try {
      const data = await getTrikalaReadings();
      setTrikalaReadings(data);
    } catch (e: any) {
      setTrikalaError(e?.message || "Failed to load readings");
    } finally {
      setTrikalaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && tab === "trikala") fetchTrikala();
  }, [authed, tab, fetchTrikala]);

  /* ── PRD module data loaders ── */
  const fetchTodayStats = useCallback(async () => {
    try { setTodayStats(await getTodayStats()); } catch { /* keep prior */ }
  }, []);
  const fetchDevotees = useCallback(async () => {
    setDevoteesLoading(true);
    try { setDevotees(await getDevotees({ search: devoteeSearch, relationship: devoteeRel })); }
    catch { /* ignore */ } finally { setDevoteesLoading(false); }
  }, [devoteeSearch, devoteeRel]);
  const fetchAppointments = useCallback(async () => {
    setApptLoading(true);
    try { setAppointments(await getAppointments({ status: apptFilter })); }
    catch { /* ignore */ } finally { setApptLoading(false); }
  }, [apptFilter]);
  const fetchRemedyLib = useCallback(async () => {
    setRemedyLibLoading(true);
    try { setRemedyLib(await getRemedyLibrary(remedyCatFilter)); }
    catch { /* ignore */ } finally { setRemedyLibLoading(false); }
  }, [remedyCatFilter]);

  // Today: load stats + ensure trikala/bookings present for the activity feed
  useEffect(() => {
    if (!authed) return;
    if (tab === "today")  { fetchTodayStats(); if (!trikalaReadings.length) fetchTrikala(); }
    if (tab === "reports") { getAnalytics().then(setAnalytics).catch(() => {}); }
  }, [authed, tab, fetchTodayStats, fetchTrikala, trikalaReadings.length]);

  useEffect(() => { if (authed && tab === "devotees")     fetchDevotees();     }, [authed, tab, fetchDevotees]);
  useEffect(() => { if (authed && tab === "appointments") fetchAppointments(); }, [authed, tab, fetchAppointments]);
  useEffect(() => { if (authed && tab === "remedies")     fetchRemedyLib();    }, [authed, tab, fetchRemedyLib]);

  /* ── open a devotee 360 profile ── */
  const openDevotee = useCallback(async (d: Devotee) => {
    setDevoteeHistoryLoading(true);
    setDevoteeHistory({ devotee: d, cases: [], appointments: [], remedies: [], timeline: [], bookings: [] });
    try { setDevoteeHistory(await getDevoteeHistory(d.id)); }
    catch { /* keep stub */ } finally { setDevoteeHistoryLoading(false); }
  }, []);

  /* ── open/close trikala detail — synced to ?case= URL param ── */
  const openTrikalaDetail = useCallback((r: TrikalaReading) => {
    setTrikalaDetail(r);
    const params = new URLSearchParams(searchParams.toString());
    params.set("case", r.caseReference);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const closeTrikalaDetail = useCallback(() => {
    setTrikalaDetail(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("case");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  /* ── restore detail panel from ?case= on refresh once readings load ── */
  useEffect(() => {
    const caseRef = searchParams.get("case");
    if (!caseRef || trikalaDetail || trikalaReadings.length === 0) return;
    const match = trikalaReadings.find(r => r.caseReference === caseRef);
    if (match) setTrikalaDetail(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trikalaReadings]);

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

  /* ── logged-in user's role derived from admins list ── */
  const loggedRole = useMemo(
    () => admins.find((a) => a.mobile === loggedMobile)?.role ?? "admin",
    [admins, loggedMobile],
  );
  const isSuperAdmin = loggedRole === "superadmin";

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

  /* close sidebar when tab changes on mobile; reset filters; sync URL */
  const tabChange = (t: Tab) => {
    setTab(t); setPage(1); setSearch("");
    setFilterBooking("all"); setFilterContact("all");
    setSidebarOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", t);
    params.delete("case");
    setTrikalaDetail(null);
    router.replace(`?${params.toString()}`, { scroll: false });
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
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(13,148,136,0.10)", border: "1.5px solid rgba(13,148,136,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "serif", fontSize: 18, color: "#0d9488" }}>ॐ</span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                <span style={{ color: "#111827" }}>Gurumurthy </span><span style={{ color: "#0d9488" }}>Guruji</span>
              </p>
              <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af", marginTop: 1 }}>Admin Console</p>
            </div>
          </div>
          <div style={{ marginTop: 14, borderRadius: 6, padding: "5px 10px", display: "inline-block", background: isSuperAdmin ? "rgba(13,148,136,0.10)" : "rgba(124,58,237,0.08)", border: `1px solid ${isSuperAdmin ? "rgba(13,148,136,0.3)" : "rgba(124,58,237,0.25)"}` }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: isSuperAdmin ? "#0d9488" : "#7c3aed" }}>
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>

          {/* Today — command center */}
          {([
            { key: "today" as const, label: "Today", icon: "🏛️", urgent: (bookings.length + contacts.length) > 0 },
          ]).map(({ key, label, icon, urgent }) => (
            <button key={key} onClick={() => tabChange(key)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 8, background: tab === key ? "rgba(13,148,136,0.08)" : "transparent", borderLeft: tab === key ? "2.5px solid #0d9488" : "2.5px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: tab === key ? 800 : 600, textAlign: "left", color: tab === key ? "#0d9488" : "#6b7280" }}>{label}</span>
              {urgent && tab !== key && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />}
            </button>
          ))}

          <div style={{ height: 1, background: "#f0f0f0", margin: "8px 0 12px" }} />

          {/* Core operations */}
          <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", padding: "0 8px", marginBottom: 8 }}>
            Operations
          </p>
          {([
            { key: "trikala"     as const, label: "Trikala Cases",    icon: "⭕" },
            { key: "appointments"as const, label: "Appointments",     icon: "📅" },
            { key: "bookings"    as const, label: "Audience Bookings", icon: "📋" },
            { key: "contacts"    as const, label: "Contact Messages",  icon: "📬" },
          ]).map(({ key, label, icon }) => (
            <button key={key} onClick={() => tabChange(key)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 3, background: tab === key ? "rgba(13,148,136,0.08)" : "transparent", borderLeft: tab === key ? "2.5px solid #0d9488" : "2.5px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: tab === key ? 700 : 500, textAlign: "left", whiteSpace: "nowrap", color: tab === key ? "#0d9488" : "#6b7280" }}>{label}</span>
            </button>
          ))}

          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0 12px" }} />

          {/* Spiritual records */}
          <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", padding: "0 8px", marginBottom: 8 }}>
            Spiritual Records
          </p>
          {([
            { key: "devotees" as const, label: "Devotee Profiles",  icon: "🙏" },
            { key: "remedies" as const, label: "Divine Remedies",   icon: "🕯️" },
            { key: "reports"  as const, label: "Reports & PDFs",    icon: "📄" },
          ]).map(({ key, label, icon }) => (
            <button key={key} onClick={() => tabChange(key)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 3, background: tab === key ? "rgba(13,148,136,0.08)" : "transparent", borderLeft: tab === key ? "2.5px solid #0d9488" : "2.5px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: tab === key ? 700 : 500, textAlign: "left", whiteSpace: "nowrap", color: tab === key ? "#0d9488" : "#6b7280" }}>{label}</span>
            </button>
          ))}

          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0 12px" }} />

          {/* Configuration */}
          <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", padding: "0 8px", marginBottom: 8 }}>
            Configuration
          </p>
          {([
            { key: "admins"   as const, label: "Admin Users",  icon: "👥" },
            { key: "settings" as const, label: "Settings",     icon: "⚙️" },
          ]).map(({ key, label, icon }) => (
            <button key={key} onClick={() => tabChange(key)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 3, background: tab === key ? "rgba(13,148,136,0.08)" : "transparent", borderLeft: tab === key ? "2.5px solid #0d9488" : "2.5px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: tab === key ? 700 : 500, textAlign: "left", whiteSpace: "nowrap", color: tab === key ? "#0d9488" : "#6b7280" }}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Logged-in user + Sign Out */}
        <div style={{ padding: "14px 14px 16px", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {(loggedName || "S")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loggedName || "Super Admin"}</p>
              <p style={{ fontSize: 10.5, color: "#9ca3af", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loggedMobile}</p>
            </div>
          </div>
          <button onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "7px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#6b7280", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <main className="adm-main">

        {/* ══════════════════════════════════════════════════════════════════
            TODAY — Command Center Dashboard (PRD §13)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "today" && (() => {
          const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
          const s = todayStats;
          // Live stats from API when available, else derive from loaded lists
          const v = {
            appts:      s?.todaysAppointments ?? 0,
            review:     s?.gurujiReviewPending ?? trikalaReadings.filter(r => ["Awaiting Guruji Review","Under Review","AI Draft Generated","AI Report"].includes(r.status)).length,
            followups:  s?.followupsDue ?? 0,
            intake:     s?.newIntake ?? trikalaReadings.filter(r => r.status === "Submitted").length,
            missing:    s?.missingInfo ?? trikalaReadings.filter(r => r.status === "Incomplete").length,
            publish:    s?.reportsToPublish ?? trikalaReadings.filter(r => r.status === "Finalized").length,
            urgent:     s?.urgentCases ?? trikalaReadings.filter(r => r.priority === "Urgent" || r.priority === "Emergency").length,
            noshow:     s?.noshowsYesterday ?? 0,
            devotees:   s?.totalDevotees ?? 0,
          };
          const cards = [
            { icon: "📅", color: "gold",   accent: "gold",   label: "Today's Appointments",  value: v.appts,     sub: "Scheduled meetings & calls",     urgent: false },
            { icon: "⭕", color: "orange", accent: "orange", label: "Guruji Review Pending",  value: v.review,    sub: "Cases awaiting final review",    urgent: v.review > 0 },
            { icon: "🔔", color: "blue",   accent: "blue",   label: "Follow-ups Due",         value: v.followups, sub: "Devotees requiring follow-up",   urgent: v.followups > 0 },
            { icon: "📋", color: "green",  accent: "green",  label: "New Intake Forms",       value: v.intake,    sub: "New Trikala submissions",        urgent: v.intake > 0 },
            { icon: "⚠️", color: "purple", accent: "purple", label: "Missing Information",    value: v.missing,   sub: "Cases stuck on incomplete data", urgent: v.missing > 0 },
            { icon: "📄", color: "gold",   accent: "gold",   label: "Reports to Publish",     value: v.publish,   sub: "Final PDFs pending share",       urgent: false },
            { icon: "⚡", color: "red",    accent: "red",    label: "Urgent Cases",           value: v.urgent,    sub: "High-priority awaiting action",  urgent: v.urgent > 0 },
            { icon: "🚫", color: "red",    accent: "red",    label: "No-shows Yesterday",     value: v.noshow,    sub: "Missed appointments to follow",  urgent: v.noshow > 0 },
          ];
          return (
            <div style={{ flex: 1, overflowY: "auto", background: "#f5f7fa", minHeight: 0 }}>
              {/* Hero */}
              <div className="adm-hero-card">
                <div className="adm-hero-row">
                  <div className="adm-hero-left">
                    <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}><Menu size={20} /></button>
                    <div className="adm-hero-icon-wrap">
                      <span style={{ fontFamily: "serif", fontSize: 22, color: "#1f2937" }}>ॐ</span>
                    </div>
                    <div className="adm-hero-text">
                      <p className="adm-hero-eyebrow">Guruji Seva Management System</p>
                      <h1 className="adm-hero-h1">Today&rsquo;s Command Center</h1>
                      <p className="adm-hero-desc">{today}</p>
                    </div>
                  </div>
                  <div className="adm-hero-right">
                    <div className="adm-hero-live">
                      <span className="adm-live-dot" />
                      <span className="adm-live-text">Live</span>
                    </div>
                    <button className="adm-hero-btn-out" onClick={refresh}>
                      <RefreshCw size={13} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                      <span className="adm-hero-btn-txt">Refresh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat grid */}
              <div style={{ padding: "24px 28px 32px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0d9488", marginBottom: 16 }}>Live Overview</p>
                <div className="today-grid">
                  {cards.map(card => (
                    <div key={card.label} className={`today-stat-card accent-${card.accent}${card.urgent ? " is-urgent" : ""}`}>
                      <div className={`today-stat-icon ${card.color}`}>
                        <span style={{ fontSize: 18 }}>{card.icon}</span>
                      </div>
                      <div className="today-stat-value">{card.value}</div>
                      <div className="today-stat-label">{card.label}</div>
                      <div className="today-stat-sub">{card.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14, marginTop: 8 }}>Quick Actions</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {[
                    { label: "Open Trikala Cases", desc: "Review consultation requests", tab: "trikala" as const, icon: "⭕" },
                    { label: "Audience Bookings",  desc: "View appointment requests",   tab: "bookings" as const, icon: "📋" },
                    { label: "Contact Messages",   desc: "Review submitted messages",   tab: "contacts" as const, icon: "📬" },
                    { label: "Devotee Profiles",   desc: "Search devotee records",      tab: "devotees" as const, icon: "🙏" },
                    { label: "Divine Remedies",    desc: "Manage remedy library",       tab: "remedies" as const, icon: "🕯️" },
                    { label: "Reports & PDFs",     desc: "Generate and export reports", tab: "reports"  as const, icon: "📄" },
                  ].map(q => (
                    <button key={q.label} onClick={() => tabChange(q.tab)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, border: "1px solid #EDE8DD", background: "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.18s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(13,148,136,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#EDE8DD"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{q.icon}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{q.label}</p>
                        <p style={{ fontSize: 11, color: "#6b7280" }}>{q.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Upcoming (placeholder) */}
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14, marginTop: 28 }}>Recent Activity</p>
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE8DD", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  {bookings.slice(0, 5).map((b, i) => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < 4 ? "1px solid #e5e7eb" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,#0d9488,#14b8a6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {(b.fullName || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.fullName}</p>
                        <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1 }}>📋 Audience booking · {b.nearestAshram || b.location || "—"}</p>
                      </div>
                      <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                      </span>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div style={{ padding: "48px 24px", textAlign: "center", color: "#0d9488", fontSize: 14 }}>
                      No recent activity. All is peaceful. 🙏
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════════════
            APPOINTMENTS tab — PRD §6 (placeholder, Phase 3)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "appointments" && (() => {
          const STATUS_PILLS = ["all", ...APPOINTMENT_STATUSES];
          const isToday = (iso?: string) => iso ? new Date(iso).toDateString() === new Date().toDateString() : false;
          const upcoming = appointments.filter(a => a.startTime && new Date(a.startTime) >= new Date());
          return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9fafb", minHeight: 0, overflowY: "auto" }}>
              <div className="adm-hero-card">
                <div className="adm-hero-row">
                  <div className="adm-hero-left">
                    <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}><Menu size={20} /></button>
                    <div className="adm-hero-icon-wrap"><span style={{ fontSize: 22 }}>📅</span></div>
                    <div className="adm-hero-text">
                      <p className="adm-hero-eyebrow">Command Center</p>
                      <h1 className="adm-hero-h1">Appointments</h1>
                      <p className="adm-hero-desc">All Guruji meetings, calls & consultations in one calendar</p>
                    </div>
                  </div>
                  <div className="adm-hero-right">
                    <div className="adm-hero-actions">
                      {/* Calendar / List toggle */}
                      <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3, gap: 2, border: "1px solid #e5e7eb" }}>
                        {(["list","calendar"] as const).map(v => (
                          <button key={v} onClick={() => setApptView(v)}
                            style={{ padding: "5px 12px", borderRadius: 7, border: "none", background: apptView === v ? "#ffffff" : "transparent", color: apptView === v ? "#0d9488" : "#6b7280", fontSize: 11.5, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", boxShadow: apptView === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                            {v === "list" ? "☰ List" : "📅 Calendar"}
                          </button>
                        ))}
                      </div>
                      <button className="adm-hero-btn-gold" onClick={() => setApptPanel({ open: true, appt: null })}>
                        <UserPlus size={14} /><span className="adm-hero-btn-txt">New Appointment</span>
                      </button>
                      <button className="adm-hero-btn-out" onClick={fetchAppointments}>
                        <RefreshCw size={13} style={apptLoading ? { animation: "spin 1s linear infinite" } : {}} />
                        <span className="adm-hero-btn-txt">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 28px 32px" }}>
                {/* mini stat row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Today", value: appointments.filter(a => isToday(a.startTime)).length, color: "gold" },
                    { label: "Pending Approval", value: appointments.filter(a => a.status === "Requested").length, color: "orange" },
                    { label: "Upcoming", value: upcoming.length, color: "blue" },
                    { label: "Completed", value: appointments.filter(a => a.status === "Completed").length, color: "green" },
                  ].map(s => (
                    <div key={s.label} className={`today-stat-card accent-${s.color}`} style={{ padding: "14px 16px" }}>
                      <div className="today-stat-value" style={{ fontSize: 26 }}>{s.value}</div>
                      <div className="today-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* status filter */}
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                  {STATUS_PILLS.map(st => {
                    const active = apptFilter === st;
                    return (
                      <button key={st} onClick={() => setApptFilter(st)}
                        style={{ padding: "4px 12px", borderRadius: 20, border: active ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb", background: active ? "#0d9488" : "#fff", color: active ? "#fff" : "#6b7280", fontSize: 11.5, fontWeight: active ? 700 : 500, cursor: "pointer", textTransform: "capitalize" }}>
                        {st}
                      </button>
                    );
                  })}
                </div>

                {apptView === "calendar"
                  ? <ApptCalendar appointments={appointments} onSelect={a => setApptPanel({ open: true, appt: a })} />
                  : (
                    /* list */
                    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                      {apptLoading ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#6b7280", gap: 10 }}><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…</div>
                      ) : (() => {
                        const filtered = apptFilter === "all" ? appointments : appointments.filter(a => a.status.toLowerCase() === apptFilter.toLowerCase());
                        return filtered.length === 0 ? (
                          <div style={{ padding: "52px 20px", textAlign: "center", color: "#0d9488", fontSize: 14 }}>No appointments yet. Create one or convert from a booking.</div>
                        ) : filtered.map((a, i) => (
                          <div key={a.id} onClick={() => setApptPanel({ open: true, appt: a })}
                            style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #e5e7eb" : "none", cursor: "pointer", background: isToday(a.startTime) ? "#f0fdfc" : "#fff" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                            onMouseLeave={e => (e.currentTarget.style.background = isToday(a.startTime) ? "#f0fdfc" : "#fff")}>
                            <div style={{ width: 48, textAlign: "center", flexShrink: 0 }}>
                              <p style={{ fontSize: 17, fontWeight: 800, color: "#0d9488", lineHeight: 1 }}>{a.startTime ? new Date(a.startTime).getDate() : "—"}</p>
                              <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", marginTop: 2 }}>{a.startTime ? new Date(a.startTime).toLocaleDateString("en-IN", { month: "short" }) : "TBD"}</p>
                            </div>
                            <div style={{ width: 1, height: 34, background: "#e5e7eb", flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{a.devoteeName || "—"} <span style={{ fontWeight: 500, color: "#6b7280" }}>· {a.appointmentType}</span></p>
                              <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{a.startTime ? `${fmt(a.startTime)} · ${fmtTime(a.startTime)}` : "Slot to be fixed"}{a.mode ? ` · ${a.mode}` : ""}{a.mobile ? ` · ${a.mobile}` : ""}</p>
                            </div>
                            {a.priority && a.priority !== "Normal" && <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.08)", padding: "2px 8px", borderRadius: 20 }}>{a.priority}</span>}
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#374151", background: "#f3f4f6", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>{a.status}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  )
                }
              </div>

              {apptPanel.open && (
                <AppointmentPanel appt={apptPanel.appt} onClose={() => setApptPanel({ open: false, appt: null })}
                  onSaved={() => { setApptPanel({ open: false, appt: null }); fetchAppointments(); }} />
              )}
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════════════
            REMEDIES tab — PRD §4 Stage 4 (placeholder, Phase 4)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "remedies" && (() => {
          const CATS = ["all", ...REMEDY_CATEGORIES];
          return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9fafb", minHeight: 0, overflowY: "auto" }}>
              <div className="adm-hero-card">
                <div className="adm-hero-row">
                  <div className="adm-hero-left">
                    <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}><Menu size={20} /></button>
                    <div className="adm-hero-icon-wrap"><span style={{ fontSize: 22 }}>🕯️</span></div>
                    <div className="adm-hero-text">
                      <p className="adm-hero-eyebrow">Spiritual Service</p>
                      <h1 className="adm-hero-h1">Divine Remedies</h1>
                      <p className="adm-hero-desc">Master remedy library — assign from any Trikala case</p>
                    </div>
                  </div>
                  <div className="adm-hero-right">
                    <div className="adm-hero-count"><span className="adm-hero-count-num">{remedyLib.length}</span><span className="adm-hero-count-lbl">Remedies</span></div>
                    <div className="adm-hero-sep" />
                    <div className="adm-hero-actions">
                      <button className="adm-hero-btn-gold" onClick={() => setRemedyPanel({ open: true, remedy: null })}>
                        <UserPlus size={14} /><span className="adm-hero-btn-txt">Add Remedy</span>
                      </button>
                      <button className="adm-hero-btn-out" onClick={fetchRemedyLib}>
                        <RefreshCw size={13} style={remedyLibLoading ? { animation: "spin 1s linear infinite" } : {}} />
                        <span className="adm-hero-btn-txt">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 28px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
                  {CATS.map(c => {
                    const active = remedyCatFilter === c;
                    return (
                      <button key={c} onClick={() => setRemedyCatFilter(c)}
                        style={{ padding: "4px 13px", borderRadius: 20, border: active ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb", background: active ? "#0d9488" : "#fff", color: active ? "#fff" : "#6b7280", fontSize: 11.5, fontWeight: active ? 700 : 500, cursor: "pointer" }}>
                        {c === "all" ? "All" : c}
                      </button>
                    );
                  })}
                </div>

                {remedyLibLoading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#6b7280", gap: 10 }}><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…</div>
                ) : remedyLib.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "52px 20px", textAlign: "center", color: "#0d9488", fontSize: 14 }}>No remedies in this category. Add one to build the library.</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
                    {remedyLib.map(r => (
                      <div key={r.id} className="remedy-card" onClick={() => setRemedyPanel({ open: true, remedy: r })} style={{ cursor: "pointer" }}>
                        <div className="remedy-card-icon">{remedyIcon(r.category)}</div>
                        <div className="remedy-card-name">{r.name}</div>
                        <div className="remedy-card-cat">{r.category}</div>
                        {r.defaultInstruction && <div className="remedy-card-desc">{r.defaultInstruction}</div>}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                          {r.defaultDuration && <span style={{ fontSize: 10, fontWeight: 600, color: "#374151", background: "#f3f4f6", padding: "2px 8px", borderRadius: 20 }}>{r.defaultDuration}</span>}
                          {r.followupRequired && <span style={{ fontSize: 10, fontWeight: 600, color: "#1d4ed8", background: "rgba(37,99,235,0.1)", padding: "2px 8px", borderRadius: 20 }}>Follow-up</span>}
                          {r.gurujiApprovalRequired && <span style={{ fontSize: 10, fontWeight: 600, color: "#0d9488", background: "rgba(13,148,136,0.10)", padding: "2px 8px", borderRadius: 20 }}>Guruji approval</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {remedyPanel.open && (
                <RemedyPanel remedy={remedyPanel.remedy} onClose={() => setRemedyPanel({ open: false, remedy: null })}
                  onSaved={() => { setRemedyPanel({ open: false, remedy: null }); fetchRemedyLib(); }} />
              )}
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════════════
            REPORTS tab — PRD §9 (placeholder, Phase 4)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "reports" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9fafb", minHeight: 0, overflowY: "auto" }}>
            <div className="adm-hero-card">
              <div className="adm-hero-row">
                <div className="adm-hero-left">
                  <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}><Menu size={20} /></button>
                  <div className="adm-hero-icon-wrap"><FileDown size={22} color="#0d9488" /></div>
                  <div className="adm-hero-text">
                    <p className="adm-hero-eyebrow">Export Center</p>
                    <h1 className="adm-hero-h1">Reports &amp; PDFs</h1>
                    <p className="adm-hero-desc">Generate and export all report types with watermarks</p>
                  </div>
                </div>
                <div className="adm-hero-right">
                  <div className="adm-hero-actions">
                    <button className="adm-hero-btn-gold" onClick={() => downloadPdfDirect("bookings", bookings)}>
                      <FileDown size={14} />
                      <span className="adm-hero-btn-txt">Bookings PDF</span>
                    </button>
                    <button className="adm-hero-btn-gold" onClick={() => downloadPdfDirect("contacts", contacts)}>
                      <FileDown size={14} />
                      <span className="adm-hero-btn-txt">Contacts PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: "24px 28px 32px" }}>
              {/* ── Service analytics (PRD §16) ── */}
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14 }}>Service Analytics</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 22 }}>
                {[
                  { label: "New This Week",     value: analytics?.newThisWeek ?? 0,      color: "blue" },
                  { label: "Pending Review",    value: analytics?.pendingReview ?? 0,    color: "orange" },
                  { label: "Follow-ups Overdue",value: analytics?.followupsOverdue ?? 0, color: "red" },
                  { label: "Closed This Month", value: analytics?.closedThisMonth ?? 0,  color: "green" },
                  { label: "Total Devotees",    value: analytics?.totalDevotees ?? 0,    color: "gold" },
                ].map(s => (
                  <div key={s.label} className={`today-stat-card accent-${s.color}`} style={{ padding: "14px 16px" }}>
                    <div className="today-stat-value" style={{ fontSize: 24 }}>{s.value}</div>
                    <div className="today-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              {analytics && analytics.byCategory.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE8DD", padding: "16px 18px" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Cases by Problem Category</p>
                    {analytics.byCategory.slice(0, 6).map(c => {
                      const max = Math.max(...analytics.byCategory.map(x => x.count), 1);
                      return (
                        <div key={c.category} style={{ marginBottom: 9 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6b7280", marginBottom: 3 }}>
                            <span style={{ textTransform: "capitalize" }}>{c.category}</span><span style={{ fontWeight: 700 }}>{c.count}</span>
                          </div>
                          <div style={{ height: 6, background: "#F3ECdf", borderRadius: 20, overflow: "hidden" }}>
                            <div style={{ width: `${(c.count / max) * 100}%`, height: "100%", background: "linear-gradient(90deg,#0d9488,#0d9488)", borderRadius: 20 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE8DD", padding: "16px 18px" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Remedies by Category</p>
                    {analytics.remediesByCategory.length === 0 ? (
                      <p style={{ fontSize: 12, color: "#0d9488" }}>No remedies assigned yet.</p>
                    ) : analytics.remediesByCategory.slice(0, 6).map(c => {
                      const max = Math.max(...analytics.remediesByCategory.map(x => x.count), 1);
                      return (
                        <div key={c.category} style={{ marginBottom: 9 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6b7280", marginBottom: 3 }}>
                            <span>{remedyIcon(c.category)} {c.category}</span><span style={{ fontWeight: 700 }}>{c.count}</span>
                          </div>
                          <div style={{ height: 6, background: "#F3ECdf", borderRadius: 20, overflow: "hidden" }}>
                            <div style={{ width: `${(c.count / max) * 100}%`, height: "100%", background: "linear-gradient(90deg,#0d9488,#14b8a6)", borderRadius: 20 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14 }}>Available Now</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 28 }}>
                {[
                  { icon: "📋", title: "Booking PDF",  desc: `${bookings.length} audience requests`, action: () => downloadPdfDirect("bookings", bookings), ready: true },
                  { icon: "📬", title: "Contact PDF",  desc: `${contacts.length} contact messages`,   action: () => downloadPdfDirect("contacts", contacts), ready: true },
                ].map(r => (
                  <div key={r.title} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE8DD", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", marginBottom: 3 }}>{r.title}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{r.desc}</p>
                      <button onClick={r.action} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                        <FileDown size={13} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0d9488", marginBottom: 14 }}>Coming in Phase 4</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {["Trikala Intake PDF","AI Draft PDF (Internal)","Guruji Review PDF","Final Consultation PDF","Remedy Instruction PDF","Follow-up Summary PDF","Devotee History PDF"].map(t => (
                  <div key={t} style={{ background: "#fff", border: "1px solid #EDE8DD", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: "#1f2937" }}>{t}</p>
                      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0d9488", background: "rgba(13,148,136,0.10)", padding: "2px 7px", borderRadius: 20, border: "1px solid rgba(13,148,136,0.22)" }}>Phase 4</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SETTINGS tab — audit log + system overview (PRD §11)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "settings" && (() => {
          return <SettingsTab
            todayStats={todayStats}
            trikalaCount={trikalaReadings.length}
            devoteeCount={devotees.length}
            appointmentCount={appointments.length}
            remedyCount={remedyLib.length}
            adminCount={admins.length}
            onSidebarToggle={() => setSidebarOpen(v => !v)}
          />;
        })()}

        {/* ── Admins tab: dark hero card (same style as bookings/contacts) ── */}
        {tab === "admins" && (
          <div className="adm-hero-card">
            <div className="adm-hero-row">
              {/* Left: hamburger + icon + title */}
              <div className="adm-hero-left">
                <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}>
                  <Menu size={20} />
                </button>
                <div className="adm-hero-icon-wrap">
                  <ShieldCheck size={22} color="#0d9488" />
                </div>
                <div className="adm-hero-text">
                  <p className="adm-hero-eyebrow">Configuration</p>
                  <h1 className="adm-hero-h1">Admin Users</h1>
                  <p className="adm-hero-desc">Manage who can log in to the admin console</p>
                </div>
              </div>

              {/* Right: count + actions */}
              <div className="adm-hero-right">
                <div className="adm-hero-count">
                  <span className="adm-hero-count-num">{admins.length}</span>
                  <span className="adm-hero-count-lbl">Admins</span>
                </div>
                <div className="adm-hero-sep" />
                <div className="adm-hero-actions">
                  <div className="adm-hero-live">
                    <span className="adm-live-dot" />
                    <span>Live</span>
                  </div>
                  <button className="adm-hero-btn-out" onClick={refresh}>
                    <RefreshCw size={13} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
                    <span className="adm-hero-btn-txt">Refresh</span>
                  </button>
                  <button className="adm-hero-btn-gold" onClick={() => setAdminPanel({ open: true, user: null })}>
                    <UserPlus size={14} />
                    <span className="adm-hero-btn-txt">New Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Trikala Readings: Devotee Requests UI ────────────────────── */}
        {tab === "trikala" && (() => {
          const SVC_LABELS: Record<string, string> = {
            horoscope:   "General Horoscope",
            ashta_rekha: "Ashta Rekha",
          };
          const SVC_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
            horoscope:   { bg: "#F3E8FF", color: "#7C3AED", dot: "#7C3AED" },
            ashta_rekha: { bg: "#FFF1E6", color: "#C2410C", dot: "#F97316" },
          };
          const STATUS_CFG: Record<string, { bg: string; color: string; dot: string }> = {
            "Submitted":    { bg: "#EEF4FF", color: "#3B82F6", dot: "#3B82F6" },
            "AI Report":    { bg: "#F3E8FF", color: "#7C3AED", dot: "#7C3AED" },
            "Under Review": { bg: "#FFF7E6", color: "#D97706", dot: "#D97706" },
            "Finalized":    { bg: "#ECFDF5", color: "#059669", dot: "#059669" },
            "Published":    { bg: "#DCFCE7", color: "#16A34A", dot: "#16A34A" },
          };
          const FILTER_PILLS = [
            { key: "all",           label: "All Cases",     dot: null },
            { key: "Submitted",     label: "Submitted",     dot: "#3B82F6" },
            { key: "Horoscope",     label: "Horoscope",     dot: "#7C3AED" },
            { key: "AI Report",     label: "AI Report",     dot: "#7C3AED" },
            { key: "Under Review",  label: "Under Review",  dot: "#D97706" },
            { key: "Finalized",     label: "Finalized",     dot: "#059669" },
            { key: "Published",     label: "Published",     dot: "#16A34A" },
          ];
          const q = trikalaSearch.toLowerCase();
          const filtered = trikalaReadings.filter(r => {
            const matchSearch = !q || r.fullName.toLowerCase().includes(q) || r.caseReference.toLowerCase().includes(q) || r.mobile.includes(q) || r.email.toLowerCase().includes(q);
            const matchFilter = trikalaFilter === "all" ? true
              : trikalaFilter === "Horoscope" ? r.serviceType === "horoscope"
              : r.status === trikalaFilter;
            return matchSearch && matchFilter;
          });

          const total       = trikalaReadings.length;
          const awaiting    = trikalaReadings.filter(r => r.status === "Submitted").length;
          const inProgress  = trikalaReadings.filter(r => r.status === "AI Report" || r.status === "Under Review").length;
          const published   = trikalaReadings.filter(r => r.status === "Published").length;

          const activeLabel = FILTER_PILLS.find(p => p.key === trikalaFilter)?.label ?? "All Cases";

          return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: 0, gap: 0, background: "#f9fafb", minHeight: 0 }}>

              <div className="adm-hero-card">
                <div className="adm-hero-row">
                  {/* Left: hamburger (mobile) + icon + title */}
                  <div className="adm-hero-left">
                    <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}>
                      <Menu size={20} />
                    </button>
                    <div className="adm-hero-icon-wrap">
                      <Star size={22} color="#0d9488" />
                    </div>
                    <div className="adm-hero-text">
                      <p className="adm-hero-eyebrow">Submissions</p>
                      <h1 className="adm-hero-h1">Devotee Requests</h1>
                      <p className="adm-hero-desc">Manage all incoming spiritual consultation requests</p>
                    </div>
                  </div>
                  {/* Right: count + actions */}
                  <div className="adm-hero-right">
                    <div className="adm-hero-count">
                      <span className="adm-hero-count-num">{total}</span>
                      <span className="adm-hero-count-lbl">Requests</span>
                    </div>
                    <div className="adm-hero-sep" />
                    <div className="adm-hero-actions">
                      <div className="adm-hero-live">
                        <span className="adm-live-dot" />
                        <span>Live</span>
                      </div>
                      <button className="adm-hero-btn-out" onClick={fetchTrikala}>
                        <RefreshCw size={13} style={trikalaLoading ? { animation: "spin 1s linear infinite" } : {}} />
                        <span className="adm-hero-btn-txt">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content area below hero — padded */}
              <div style={{ padding: "24px 28px 32px" }}>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
                {[
                  { icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" fill="#FFF1E6"/><path d="M2 8h20" stroke="#F97316" strokeWidth="1.8"/><circle cx="6" cy="14" r="1.5" fill="#F97316"/><circle cx="12" cy="14" r="1.5" fill="#F97316"/><circle cx="18" cy="14" r="1.5" fill="#F97316"/></svg>
                  ), label: "Total Requests", value: total, color: "#F97316" },
                  { icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#EEF4FF"/><path d="M12 6v6l3 3" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="8" stroke="#3B82F6" strokeWidth="1.5" fill="none"/></svg>
                  ), label: "Awaiting Review", value: awaiting, color: "#3B82F6" },
                  { icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFF7E6"/><path d="M12 7v5l3.5 2" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  ), label: "In Progress", value: inProgress, color: "#D97706" },
                  { icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#DCFCE7"/><path d="M7.5 12.5l3 3 5.5-6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ), label: "Published", value: published, color: "#16A34A" },
                ].map(card => (
                  <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ flexShrink: 0 }}>{card.icon}</div>
                    <div>
                      <p style={{ fontSize: 26, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{card.value}</p>
                      <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter pills + search */}
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {FILTER_PILLS.map(pill => {
                  const active = trikalaFilter === pill.key;
                  return (
                    <button key={pill.key} onClick={() => setTrikalaFilter(pill.key)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, border: active ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb", background: active ? "#0d9488" : "#fff", color: active ? "#fff" : "#6b7280", fontSize: 12.5, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                      {pill.dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#fff" : pill.dot, flexShrink: 0 }} />}
                      {pill.label}
                    </button>
                  );
                })}
                {/* Search */}
                <div style={{ marginLeft: "auto", position: "relative" }}>
                  <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#0d9488", pointerEvents: "none" }} />
                  <input type="text" placeholder="Search name, case ID, mobile…" value={trikalaSearch} onChange={e => setTrikalaSearch(e.target.value)}
                    style={{ paddingLeft: 30, paddingRight: 12, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12.5, color: "#1f2937", outline: "none", width: 230 }} />
                </div>
              </div>

              {/* Table card */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                {/* Table header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{activeLabel}</p>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
                </div>

                {trikalaLoading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#6b7280", fontSize: 14, gap: 10 }}>
                    <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
                  </div>
                ) : trikalaError ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, gap: 10 }}>
                    <AlertCircle size={28} color="#dc2626" />
                    <p style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}>{trikalaError}</p>
                    <button onClick={fetchTrikala} style={{ padding: "7px 18px", borderRadius: 8, border: "1px solid #dc2626", background: "#fff", color: "#dc2626", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>Retry</button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                          {["CASE ID", "DEVOTEE", "MOBILE", "SERVICE", "STATUS", "SUBMITTED", ""].map(h => (
                            <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "#0d9488", textTransform: "uppercase", whiteSpace: "nowrap", background: "#f9fafb" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: "52px 20px", textAlign: "center", color: "#0d9488", fontSize: 14 }}>No records found</td></tr>
                        ) : filtered.map((r, i) => {
                          const sts = STATUS_CFG[r.status] ?? { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" };
                          const svc = SVC_COLORS[r.serviceType] ?? { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" };
                          const isEven = i % 2 === 0;
                          return (
                            <tr key={r.id}
                              style={{ background: isEven ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb", transition: "background 0.1s" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                              onMouseLeave={e => (e.currentTarget.style.background = isEven ? "#fff" : "#f9fafb")}>
                              {/* Case ID */}
                              <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                <span style={{ background: "#FFFBEF", border: "1.5px solid #D4A946", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#92710a", letterSpacing: "0.02em" }}>
                                  {r.caseReference}
                                </span>
                              </td>
                              {/* Devotee */}
                              <td style={{ padding: "13px 16px" }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{r.fullName}</p>
                                <p style={{ fontSize: 11.5, color: "#6b7280" }}>{r.email}</p>
                              </td>
                              {/* Mobile */}
                              <td style={{ padding: "13px 16px", fontFamily: "monospace", fontSize: 13, color: "#3b2010", whiteSpace: "nowrap" }}>{r.mobile}</td>
                              {/* Service */}
                              <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: svc.bg, borderRadius: 20, padding: "3px 10px", fontSize: 11.5, fontWeight: 600, color: svc.color }}>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: svc.dot, flexShrink: 0 }} />
                                  {SVC_LABELS[r.serviceType] ?? r.serviceType}
                                </span>
                              </td>
                              {/* Status */}
                              <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sts.bg, borderRadius: 20, padding: "3px 10px", fontSize: 11.5, fontWeight: 600, color: sts.color }}>
                                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sts.dot, flexShrink: 0 }} />
                                  {r.status}
                                </span>
                              </td>
                              {/* Submitted date */}
                              <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#6b7280", whiteSpace: "nowrap" }}>
                                {r.createdAt ? new Date(r.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                              {/* Open button */}
                              <td style={{ padding: "13px 16px" }}>
                                <button onClick={() => openTrikalaDetail(r)}
                                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#3b2010", fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.color = "#0d9488"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#3b2010"; }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                  Open
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              </div>{/* /content padding */}
            </div>
          );
        })()}

        {/* ── Devotee Contacts ─────────────────────────────────────────── */}
        {tab === "devotees" && (() => {
          const REL_PILLS = [
            { key: "all", label: "All" }, { key: "new", label: "New" }, { key: "regular", label: "Regular" },
            { key: "donor", label: "Donor" }, { key: "volunteer", label: "Volunteer" },
            { key: "vip", label: "VIP" }, { key: "family", label: "Family" },
          ];
          const AVATAR_GRADIENTS = [
            "linear-gradient(135deg,#0d9488,#14b8a6)", "linear-gradient(135deg,#92600a,#C8902A)",
            "linear-gradient(135deg,#1a5276,#2E86C1)", "linear-gradient(135deg,#145a32,#1E8449)",
            "linear-gradient(135deg,#4a235a,#7D3C98)", "linear-gradient(135deg,#784212,#BA6010)",
          ];
          return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", background: "#f9fafb", minHeight: 0 }}>
              {/* Hero */}
              <div className="adm-hero-card">
                <div className="adm-hero-row">
                  <div className="adm-hero-left">
                    <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}><Menu size={20} /></button>
                    <div className="adm-hero-icon-wrap"><BookUser size={22} color="#0d9488" /></div>
                    <div className="adm-hero-text">
                      <p className="adm-hero-eyebrow">Devotee 360 Directory</p>
                      <h1 className="adm-hero-h1">Devotees</h1>
                      <p className="adm-hero-desc">Every profile links to cases, appointments, remedies & a full timeline</p>
                    </div>
                  </div>
                  <div className="adm-hero-right">
                    <div className="adm-hero-count"><span className="adm-hero-count-num">{devotees.length}</span><span className="adm-hero-count-lbl">Devotees</span></div>
                    <div className="adm-hero-sep" />
                    <div className="adm-hero-actions">
                      <button className="adm-hero-btn-gold" onClick={() => setAddDevoteeOpen(true)}>
                        <UserPlus size={14} /><span className="adm-hero-btn-txt">Add Devotee</span>
                      </button>
                      <button className="adm-hero-btn-out" onClick={fetchDevotees}>
                        <RefreshCw size={13} style={devoteesLoading ? { animation: "spin 1s linear infinite" } : {}} />
                        <span className="adm-hero-btn-txt">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 28px 32px" }}>
                {/* relationship pills + search */}
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                  {REL_PILLS.map(pill => {
                    const active = devoteeRel === pill.key;
                    return (
                      <button key={pill.key} onClick={() => setDevoteeRel(pill.key)}
                        style={{ padding: "5px 14px", borderRadius: 20, border: active ? "1.5px solid #0d9488" : "1.5px solid #e5e7eb", background: active ? "#0d9488" : "#fff", color: active ? "#fff" : "#6b7280", fontSize: 12.5, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                        {pill.label}
                      </button>
                    );
                  })}
                  <form onSubmit={e => { e.preventDefault(); fetchDevotees(); }} style={{ marginLeft: "auto", position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#0d9488", pointerEvents: "none" }} />
                    <input type="text" placeholder="Search name, phone, ref…" value={devoteeSearch} onChange={e => setDevoteeSearch(e.target.value)}
                      style={{ paddingLeft: 30, paddingRight: 12, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12.5, color: "#1f2937", outline: "none", width: 230 }} />
                  </form>
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Devotee Directory</p>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{devotees.length} record{devotees.length !== 1 ? "s" : ""}</p>
                  </div>
                  {devoteesLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#6b7280", fontSize: 14, gap: 10 }}>
                      <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
                    </div>
                  ) : devotees.length === 0 ? (
                    <div style={{ padding: "52px 20px", textAlign: "center", color: "#0d9488", fontSize: 14 }}>
                      No devotee profiles yet. New Trikala submissions auto-create devotees, or add one manually.
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                            {["DEVOTEE", "REF", "PHONE", "RELATIONSHIP", "LOCATION", ""].map(h => (
                              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "#0d9488", textTransform: "uppercase", whiteSpace: "nowrap", background: "#f9fafb" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {devotees.map((d, i) => {
                            const avatarBg = AVATAR_GRADIENTS[(d.name || "?").charCodeAt(0) % AVATAR_GRADIENTS.length];
                            const isEven = i % 2 === 0;
                            const relColor = relBadge(d.relationship);
                            return (
                              <tr key={d.id} onClick={() => openDevotee(d)}
                                style={{ background: isEven ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb", cursor: "pointer", transition: "background 0.1s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                                onMouseLeave={e => (e.currentTarget.style.background = isEven ? "#fff" : "#f9fafb")}>
                                <td style={{ padding: "13px 16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {d.photo ? (
                                      <img src={d.photo} alt={d.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #e5e7eb" }} />
                                    ) : (
                                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                                        {(d.name || "?")[0].toUpperCase()}
                                      </div>
                                    )}
                                    <div>
                                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{d.name}</p>
                                      {d.email && <p style={{ fontSize: 11.5, color: "#6b7280" }}>{d.email}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "13px 16px", fontFamily: "monospace", fontSize: 12, color: "#0d9488", whiteSpace: "nowrap" }}>{d.devoteeRef || "—"}</td>
                                <td style={{ padding: "13px 16px", fontFamily: "monospace", fontSize: 13, color: "#3b2010", whiteSpace: "nowrap" }}>{d.phone || "—"}</td>
                                <td style={{ padding: "13px 16px" }}>
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: relColor.bg, borderRadius: 20, padding: "3px 10px", fontSize: 11.5, fontWeight: 600, color: relColor.fg, textTransform: "capitalize" }}>
                                    {d.relationship || "new"}
                                  </span>
                                </td>
                                <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#6b7280" }}>{[d.city, d.state].filter(Boolean).join(", ") || "—"}</td>
                                <td style={{ padding: "13px 16px", textAlign: "right" }}><Eye size={15} color="#0d9488" /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* 360 profile slide-over */}
              <DevoteeProfilePanel
                history={devoteeHistory}
                loading={devoteeHistoryLoading}
                onClose={() => setDevoteeHistory(null)}
                onOpenCase={(caseRef) => {
                  const match = trikalaReadings.find(r => r.caseReference === caseRef);
                  if (match) { setDevoteeHistory(null); tabChange("trikala"); openTrikalaDetail(match); }
                  else { tabChange("trikala"); }
                }}
              />

              {/* Add devotee slide-over */}
              {addDevoteeOpen && (
                <AddDevoteePanel
                  onClose={() => setAddDevoteeOpen(false)}
                  onCreated={() => { setAddDevoteeOpen(false); fetchDevotees(); }}
                />
              )}
            </div>
          );
        })()}

        {/* ── Bookings / Contacts: dark hero card ─────────────────────── */}
        {tab !== "admins" && tab !== "trikala" && tab !== "devotees" && tab !== "today" && tab !== "appointments" && tab !== "remedies" && tab !== "reports" && tab !== "settings" && (
          <div className="adm-hero-card">
            <div className="adm-hero-row">

              {/* Left: hamburger (mobile) + icon + title */}
              <div className="adm-hero-left">
                <button className="adm-hero-ham" onClick={() => setSidebarOpen(v => !v)}>
                  <Menu size={20} />
                </button>
                <div className="adm-hero-icon-wrap">
                  {tab === "bookings" ? <Users size={22} color="#0d9488" /> : <Mail size={22} color="#0d9488" />}
                </div>
                <div className="adm-hero-text">
                  <p className="adm-hero-eyebrow">Submissions</p>
                  <h1 className="adm-hero-h1">
                    {tab === "bookings" ? "Appointment Bookings" : "Contact Messages"}
                  </h1>
                  <p className="adm-hero-desc">
                    {tab === "bookings" ? "Manage appointment booking submissions" : "Manage incoming contact messages"}
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
        {tab !== "admins" && tab !== "trikala" && tab !== "devotees" && tab !== "today" && tab !== "appointments" && tab !== "remedies" && tab !== "reports" && tab !== "settings" && (
          <div className="adm-searchbar">
            {/* Search input */}
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#0d9488", pointerEvents: "none" }} />
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
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18 }}>
              Manage who can log in to the admin console.
            </p>
            <div className="adm-table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1.5px solid #e5e7eb" }}>
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
                      <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f0fdfa")}
                        onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f9fafb")}>
                        <td style={{ ...td }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                              {a.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{a.name}</p>
                              <p style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{a.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...td }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", borderRadius: 20, padding: "3px 10px", background: isSuperAdmin ? "#f0fdfa" : "#ede9fe", color: isSuperAdmin ? "#0d9488" : "#7c3aed", border: `1px solid ${isSuperAdmin ? "rgba(13,148,136,0.3)" : "rgba(124,58,237,0.3)"}` }}>
                            <ShieldCheck size={11} /> {isSuperAdmin ? "SUPERADMIN" : "ADMIN"}
                          </span>
                        </td>
                        <td style={{ ...td, color: "#6b7280", fontSize: 12 }}>
                          {a.sectionsCount === 0 ? <em>All sections</em> : `${a.sectionsCount} section${a.sectionsCount !== 1 ? "s" : ""}`}
                        </td>
                        <td style={{ ...td, color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>
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
                            style={{ background: "#f9fafb", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: "#0d9488", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
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
        {tab !== "admins" && tab !== "trikala" && tab !== "devotees" && tab !== "today" && tab !== "appointments" && tab !== "remedies" && tab !== "reports" && tab !== "settings" && (
          <div className="adm-content">
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#6b7280", fontSize: 14, gap: 10 }}>
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
                    <tr style={{ background: "#f9fafb", borderBottom: "1.5px solid #e5e7eb" }}>
                      <th style={{ ...th, color: "#0d9488", width: 44 }}>#</th>
                      {(tab === "bookings" ? bookingCols : contactCols).map((col) => (
                        <th key={col} style={{ ...th, color: "#0d9488" }}>{col}</th>
                      ))}
                      <th style={{ ...th, color: "#0d9488", width: 60 }}>View</th>
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
                            style={{ background: isEven ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb", cursor: "pointer", transition: "background 0.1s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdfa")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = isEven ? "#fff" : "#f9fafb")}>
                            <td style={{ ...td, color: "#0d9488", fontWeight: 700, fontSize: 12 }}>{idx}</td>
                            {tab === "bookings" ? (
                              <>
                                <td style={{ ...td, fontWeight: 600, color: "#374151" }}>{(row as AudienceBooking).fullName}</td>
                                <td style={{ ...td, color: "#374151", fontFamily: "monospace" }}>{(row as AudienceBooking).mobile}</td>
                                <td style={{ ...td }}>{(row as AudienceBooking).profession}</td>
                                <td style={{ ...td }}>{(row as AudienceBooking).location}</td>
                                <td style={{ ...td }}>
                                  <span style={{ background: "#f0fdfa", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 600, color: "#0d9488", whiteSpace: "nowrap" }}>
                                    {(row as AudienceBooking).nearestAshram?.split(",")[0]}
                                  </span>
                                </td>
                                <td style={{ ...td, color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>{fmt(row.createdAt)}</td>
                              </>
                            ) : (
                              <>
                                <td style={{ ...td, fontWeight: 600, color: "#374151" }}>{(row as ContactMessage).name}</td>
                                <td style={{ ...td, color: "#374151" }}>{(row as ContactMessage).email}</td>
                                <td style={{ ...td }}>
                                  <span style={{ display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {(row as ContactMessage).subject}
                                  </span>
                                </td>
                                <td style={{ ...td, color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>{fmt(row.createdAt)}</td>
                              </>
                            )}
                            <td style={{ ...td }}>
                              <button onClick={() => setDetail(row)}
                                style={{ background: "#f9fafb", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: "#0d9488", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
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
        {tab !== "admins" && tab !== "trikala" && tab !== "devotees" && tab !== "today" && tab !== "appointments" && tab !== "remedies" && tab !== "reports" && tab !== "settings" && !loading && !error && filtered.length > PAGE_SIZE && (
          <footer className="adm-pagination">
            <p style={{ fontSize: 12, color: "#6b7280" }}>
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
                    style={{ ...pagBtn, background: pg === safePage ? "#0d9488" : "#f9fafb", color: pg === safePage ? "#fff" : "#374151", fontWeight: pg === safePage ? 700 : 600 }}>
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

      {/* Trikala Detail Panel */}
      <AnimatePresence>
        {trikalaDetail && (
          <TrikalaDetailPanel
            reading={trikalaDetail}
            onClose={closeTrikalaDetail}
            onStatusChange={updated => {
              setTrikalaReadings(prev => prev.map(r => r.id === updated.id ? updated : r));
              closeTrikalaDetail();
            }}
          />
        )}
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
        ::-webkit-scrollbar-thumb { background: rgba(13,148,136,0.25); border-radius: 3px; }

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
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
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
          color: #0d9488;
        }
        .adm-header-title {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
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
          background: linear-gradient(135deg,#0d9488,#14b8a6);
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 2px 10px rgba(13,148,136,0.25);
          white-space: nowrap;
        }
        .adm-btn-outline {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
        }

        /* ── Hero card (bookings / contacts) ───────── */
        .adm-hero-card {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
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
          color: #374151;
          padding: 4px;
          flex-shrink: 0;
          align-items: center;
        }
        .adm-hero-icon-wrap {
          width: 50px; height: 50px;
          border-radius: 50%;
          background: rgba(13,148,136,0.08);
          border: 1.5px solid rgba(13,148,136,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .adm-hero-text { min-width: 0; }
        .adm-hero-eyebrow {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #9ca3af; margin-bottom: 3px;
        }
        .adm-hero-h1 {
          font-size: 20px; font-weight: 900;
          color: #111827; line-height: 1.2; margin: 0;
        }
        .adm-hero-desc {
          font-size: 11.5px;
          color: #6b7280;
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
          color: #0d9488; line-height: 1;
        }
        .adm-hero-count-lbl {
          display: block; font-size: 8px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #9ca3af; margin-top: 2px;
        }
        .adm-hero-sep {
          width: 1px; height: 36px;
          background: #e5e7eb; flex-shrink: 0;
        }
        .adm-hero-live {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 20px;
          background: #dcfce7;
          border: 1.5px solid #86efac;
          font-size: 11px; font-weight: 700; color: #15803d;
          white-space: nowrap; flex-shrink: 0;
        }
        .adm-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e; flex-shrink: 0;
          display: inline-block;
          animation: live-pulse 2s ease-in-out infinite;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }
        .adm-hero-btn-out {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
          cursor: pointer; font-size: 12px; font-weight: 700;
          color: #374151; white-space: nowrap;
          flex-shrink: 0;
        }
        .adm-hero-btn-gold {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px; border: none;
          background: linear-gradient(135deg,#0d9488,#14b8a6);
          cursor: pointer; font-size: 12px; font-weight: 700;
          color: #fff; white-space: nowrap;
          box-shadow: 0 2px 12px rgba(13,148,136,0.25);
          flex-shrink: 0;
        }
        .adm-hero-btn-txt { display: inline; }

        /* ── Search bar ─────────────────────────────── */
        .adm-searchbar {
          padding: 14px 28px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .adm-search-input {
          width: 100%;
          height: 40px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding-left: 36px;
          padding-right: 14px;
          font-size: 13px;
          color: #1f2937;
          background: #fff;
          outline: none;
          box-sizing: border-box;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .adm-search-input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.10);
        }
        .adm-search-input::placeholder { color: #9ca3af; }

        /* ── Table wrapper ──────────────────────────── */
        .adm-content {
          flex: 1;
          overflow: auto;
          padding: 20px 28px;
        }
        .adm-table-wrap {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }

        /* ── Pagination ─────────────────────────────── */
        .adm-pagination {
          padding: 12px 28px;
          background: #fff;
          border-top: 1px solid #e5e7eb;
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
  color: "#6b7280",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "11px 14px",
  fontSize: 13,
  color: "#374151",
  verticalAlign: "middle",
};

const pagBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 7,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
};
