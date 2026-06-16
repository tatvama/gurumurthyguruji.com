"use client";

export const dynamic = "force-dynamic";

/* ════════════════════════════════════════════════════════════════════
   GURUJI DARSHAN — Guruji's private console
   ---------------------------------------------------------------------
   Shows who has arrived today (office check-in queue, in arrival order).
   Selecting a devotee reveals:
     • Overview      — verified contact details + photo + office remarks
     • Timeline      — full appointment / case history for the devotee
     • Case / Visit  — the linked Trikala Jnana case (if any) or visit info
     • Remarks       — Guruji's private internal comment
     • Write Pad     — multipage A4 pen pad (stylus-accurate on tablet)
   Plus: mark darshan complete, and loop the next appointment date.
═══════════════════════════════════════════════════════════════════════ */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import WritingPadPro from "@/components/WritingPadPro";
import {
  getArrivedQueue, getDevoteeHistory, updateAppointment, createAppointment,
  type Appointment, type DevoteeHistory,
} from "@/lib/api";
import {
  ArrowLeft, RefreshCw, Phone, Mail, MapPin, Clock, CheckCircle2,
  CalendarPlus, Video, MessageSquare, User, FileText, History, NotebookPen, X,
} from "lucide-react";

type GTab = "overview" | "timeline" | "case" | "remarks" | "pad";

const MODE_LABEL: Record<string, string> = {
  phone: "Phone Call", "in-person": "Direct Meet", video: "Video Call (Google Meet)",
};

function fmtTime(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}
function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}

export default function GurujiDarshanPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [authed, setAuthed]   = useState<boolean | null>(null);
  const [adminName, setName]  = useState("");
  const [queue, setQueue]     = useState<Appointment[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [selId, setSelId]     = useState<number | null>(null);
  const [hist, setHist]       = useState<DevoteeHistory | null>(null);
  const [loadingH, setLoadingH] = useState(false);
  const [tab, setTab]         = useState<GTab>("overview");

  const [gurujiNote, setGurujiNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [bookOpen, setBookOpen]   = useState(false);
  const [bookWhen, setBookWhen]   = useState("");
  const [bookMode, setBookMode]   = useState("in-person");
  const [booking, setBooking]     = useState(false);
  const [bookedMsg, setBookedMsg] = useState("");

  /* ── auth guard (shares the admin sessionStorage login) ─────────── */
  useEffect(() => {
    const n = typeof window !== "undefined" ? sessionStorage.getItem("admin_name") : null;
    if (!n) { setAuthed(false); router.replace(`/${locale}/admin`); return; }
    setName(n); setAuthed(true);
  }, [locale, router]);

  const loadQueue = useCallback(async () => {
    setLoadingQ(true);
    try { setQueue(await getArrivedQueue()); }
    catch { /* ignore */ } finally { setLoadingQ(false); }
  }, []);
  useEffect(() => { if (authed) loadQueue(); }, [authed, loadQueue]);

  const sel = useMemo(() => queue.find(a => a.id === selId) || null, [queue, selId]);

  /* When a devotee is selected, pull their full 360 history */
  useEffect(() => {
    if (!sel) { setHist(null); return; }
    setGurujiNote(sel.gurujiRemarks || "");
    setBookOpen(false); setBookedMsg("");
    if (!sel.devoteeId) { setHist(null); return; }
    let ignore = false; setLoadingH(true);
    getDevoteeHistory(sel.devoteeId)
      .then(h => { if (!ignore) setHist(h); })
      .catch(() => {})
      .finally(() => { if (!ignore) setLoadingH(false); });
    return () => { ignore = true; };
  }, [sel]);

  /* The linked Trikala case row (raw snake_case), if this visit has one */
  const linkedCase = useMemo<any | null>(() => {
    if (!sel?.caseReference) return null;
    const fromHist = hist?.cases?.find((c: any) => (c.case_reference || c.caseReference) === sel.caseReference);
    return fromHist || null;
  }, [sel, hist]);

  async function saveNote() {
    if (!sel) return;
    setSavingNote(true);
    try {
      await updateAppointment(sel.id, { guruji_remarks: gurujiNote });
      setQueue(q => q.map(a => a.id === sel.id ? { ...a, gurujiRemarks: gurujiNote } : a));
    } catch { /* ignore */ } finally { setSavingNote(false); }
  }

  async function markCompleted() {
    if (!sel) return;
    setCompleting(true);
    try {
      await updateAppointment(sel.id, { status: "Completed" });
      await loadQueue();
    } catch { /* ignore */ } finally { setCompleting(false); }
  }

  async function bookNext() {
    if (!sel || !bookWhen) return;
    setBooking(true);
    try {
      await createAppointment({
        devotee_id:       sel.devoteeId || null,
        devotee_name:     sel.devoteeName,
        mobile:           sel.mobile,
        case_reference:   sel.caseReference || null,
        appointment_type: "Follow-up",
        mode:             bookMode,
        status:           "Scheduled",
        start_time:       new Date(bookWhen).toISOString(),
        purpose:          "Follow-up darshan (booked by Guruji)",
      });
      setBookedMsg(`Next appointment booked for ${fmtDateTime(new Date(bookWhen).toISOString())}`);
      setBookOpen(false); setBookWhen("");
    } catch { setBookedMsg("Could not book — please try again."); }
    finally { setBooking(false); }
  }

  if (authed === null) {
    return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>Loading…</div>;
  }
  if (!authed) return null;

  const TABS: { key: GTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <User size={15} /> },
    { key: "timeline", label: "History",  icon: <History size={15} /> },
    { key: "case",     label: linkedCase ? "Trikala Case" : "Visit",  icon: <FileText size={15} /> },
    { key: "remarks",  label: "Remarks",  icon: <MessageSquare size={15} /> },
    { key: "pad",      label: "Write Pad", icon: <NotebookPen size={15} /> },
  ];

  const dev = hist?.devotee;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f7fa", fontFamily: "'Inter','Segoe UI',sans-serif", color: "#1f2937" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 22px", height: 56, background: "linear-gradient(135deg,#0d9488,#0f766e)", color: "#fff", flexShrink: 0 }}>
        <button onClick={() => router.push(`/${locale}/admin`)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, padding: "7px 12px", borderRadius: 8, cursor: "pointer" }}>
          <ArrowLeft size={15} /> Admin
        </button>
        <span style={{ fontFamily: "serif", fontSize: 22 }}>ॐ</span>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>Guruji Darshan</p>
          <p style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1 }}>Today&rsquo;s Arrivals</p>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>🙏 {adminName}</span>
        <button onClick={loadQueue} title="Refresh queue"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 12.5, fontWeight: 600, padding: "7px 12px", borderRadius: 8, cursor: "pointer" }}>
          <RefreshCw size={14} style={loadingQ ? { animation: "spin 1s linear infinite" } : {}} /> Refresh
        </button>
      </div>

      {/* Body: queue | detail */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── Arrival queue ─────────────────────────────────────── */}
        <div style={{ width: 320, flexShrink: 0, borderRight: "1px solid #e5e7eb", background: "#fff", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #eef0f3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#0f766e" }}>Darshan Queue</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", background: "rgba(13,148,136,0.1)", padding: "3px 9px", borderRadius: 20 }}>{queue.length} arrived</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadingQ ? (
              <div style={{ padding: 30, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Loading…</div>
            ) : queue.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                No devotees have checked in yet today. Office staff mark arrivals from the Appointments tab.
              </div>
            ) : queue.map((a, i) => {
              const active = a.id === selId;
              const done = a.status === "Completed";
              return (
                <button key={a.id} onClick={() => { setSelId(a.id); setTab("overview"); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "12px 16px",
                    borderBottom: "1px solid #f2f4f6", border: "none", cursor: "pointer",
                    background: active ? "#f0fdfa" : "#fff", borderLeft: active ? "3px solid #0d9488" : "3px solid transparent" }}>
                  <div style={{ width: 26, fontSize: 13, fontWeight: 800, color: "#0d9488", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.devoteeName || "—"}</p>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                      <Clock size={10} style={{ display: "inline", marginRight: 3, verticalAlign: "-1px" }} />
                      {fmtTime(a.checkedInAt)} · {a.appointmentType}
                    </p>
                  </div>
                  {a.caseReference && <span title="Has Trikala case" style={{ fontSize: 9.5, fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "2px 6px", borderRadius: 6, flexShrink: 0 }}>TK</span>}
                  {done && <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail ────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
          {!sel ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", gap: 10 }}>
              <span style={{ fontSize: 46, opacity: 0.4 }}>🙏</span>
              <p style={{ fontSize: 14 }}>Select a devotee from the queue to begin darshan.</p>
            </div>
          ) : (
            <>
              {/* Devotee header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", background: "#fff", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #5eead4", background: "#eef2f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {dev?.photo ? <img src={dev.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 26 }}>🙏</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{sel.devoteeName}</p>
                  <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                    {sel.appointmentType} · {sel.mode ? (MODE_LABEL[sel.mode] || sel.mode) : "—"}
                    {sel.caseReference ? ` · Case ${sel.caseReference}` : ""}
                    {sel.checkedInAt ? ` · Arrived ${fmtTime(sel.checkedInAt)}` : ""}
                  </p>
                </div>
                {sel.status === "Completed"
                  ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "7px 13px", borderRadius: 20 }}><CheckCircle2 size={14} /> Darshan Done</span>
                  : <button onClick={markCompleted} disabled={completing}
                      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#0d9488,#14b8a6)", border: "none", padding: "9px 15px", borderRadius: 9, cursor: completing ? "default" : "pointer" }}>
                      <CheckCircle2 size={15} /> {completing ? "…" : "Mark Darshan Done"}
                    </button>}
                <button onClick={() => setBookOpen(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#0d9488", background: "rgba(13,148,136,0.08)", border: "1.5px solid #5eead4", padding: "9px 13px", borderRadius: 9, cursor: "pointer" }}>
                  <CalendarPlus size={15} /> Next Appointment
                </button>
              </div>

              {/* Book-next inline form */}
              {bookOpen && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, padding: "14px 24px", background: "#f0fdfa", borderBottom: "1px solid #cbeae3" }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#0f766e", marginBottom: 5 }}>Date &amp; Time</label>
                    <input type="datetime-local" value={bookWhen} onChange={e => setBookWhen(e.target.value)}
                      style={{ height: 38, padding: "0 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#1f2937", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#0f766e", marginBottom: 5 }}>Mode</label>
                    <select value={bookMode} onChange={e => setBookMode(e.target.value)}
                      style={{ height: 38, padding: "0 10px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#1f2937", outline: "none", background: "#fff" }}>
                      <option value="in-person">Direct Meet</option>
                      <option value="phone">Phone Call</option>
                      <option value="video">Video Call (Google Meet)</option>
                    </select>
                  </div>
                  <button onClick={bookNext} disabled={!bookWhen || booking}
                    style={{ height: 38, padding: "0 18px", borderRadius: 9, border: "none", background: "#0d9488", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: !bookWhen || booking ? "default" : "pointer", opacity: !bookWhen || booking ? 0.5 : 1 }}>
                    {booking ? "Booking…" : "Book"}
                  </button>
                  <button onClick={() => setBookOpen(false)} style={{ height: 38, width: 38, borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", color: "#6b7280" }}><X size={15} /></button>
                </div>
              )}
              {bookedMsg && <div style={{ padding: "8px 24px", background: "#ecfdf5", color: "#15803d", fontSize: 12.5, fontWeight: 600 }}>{bookedMsg}</div>}

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, padding: "0 18px", background: "#fff", borderBottom: "1px solid #e5e7eb", flexShrink: 0, overflowX: "auto" }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "13px 14px", border: "none", background: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: tab === t.key ? 800 : 600, color: tab === t.key ? "#0d9488" : "#6b7280",
                      borderBottom: tab === t.key ? "2.5px solid #0d9488" : "2.5px solid transparent", whiteSpace: "nowrap" }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", minHeight: 0 }}>
                {loadingH && <p style={{ fontSize: 12.5, color: "#9ca3af", marginBottom: 12 }}>Loading devotee history…</p>}

                {/* OVERVIEW */}
                {tab === "overview" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, maxWidth: 760 }}>
                    <InfoCard icon={<Phone size={15} />} label="Phone"    value={dev?.phone || sel.mobile} />
                    <InfoCard icon={<MessageSquare size={15} />} label="WhatsApp" value={dev?.whatsapp} />
                    <InfoCard icon={<Mail size={15} />} label="Email"    value={dev?.email} />
                    <InfoCard icon={<MapPin size={15} />} label="Address" value={[dev?.city, dev?.district, dev?.state, dev?.pincode].filter(Boolean).join(", ")} />
                    {sel.mode === "video" && sel.meetingLink && <InfoCard icon={<Video size={15} />} label="Meet Link" value={sel.meetingLink} />}
                    {sel.purpose && <InfoCard icon={<FileText size={15} />} label="Purpose" value={sel.purpose} wide />}
                    {sel.officeRemarks && <InfoCard icon={<MessageSquare size={15} />} label="Office Remarks (staff)" value={sel.officeRemarks} wide />}
                  </div>
                )}

                {/* TIMELINE */}
                {tab === "timeline" && (
                  <div style={{ maxWidth: 720 }}>
                    {!hist ? <p style={{ color: "#9ca3af", fontSize: 13 }}>No linked devotee profile.</p> : (
                      <>
                        <SectionTitle>Appointment History</SectionTitle>
                        {(hist.appointments || []).length === 0 ? <Empty>No earlier appointments.</Empty> :
                          hist.appointments.map((a: any) => (
                            <Row key={a.id}
                              title={`${a.appointment_type || a.appointmentType || "Appointment"}`}
                              sub={`${fmtDateTime(a.start_time || a.startTime)} · ${a.status}`}
                              tag={a.case_reference || a.caseReference} />
                          ))}
                        <SectionTitle style={{ marginTop: 18 }}>Activity Timeline</SectionTitle>
                        {(hist.timeline || []).length === 0 ? <Empty>No timeline events.</Empty> :
                          hist.timeline.map(ev => (
                            <Row key={ev.id} icon={ev.icon} title={ev.title} sub={`${ev.description || ""}${ev.description ? " · " : ""}${fmtDateTime(ev.createdAt)}`} />
                          ))}
                      </>
                    )}
                  </div>
                )}

                {/* CASE / VISIT */}
                {tab === "case" && (
                  <div style={{ maxWidth: 760 }}>
                    {linkedCase ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "4px 11px", borderRadius: 20 }}>Trikala Jnana · {linkedCase.case_reference}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", background: "#f3f4f6", padding: "4px 11px", borderRadius: 20 }}>{linkedCase.status}</span>
                        </div>
                        <Field label="Service"        value={linkedCase.service_type} />
                        <Field label="Devotee's Question / Concern" value={linkedCase.guidance_query} big />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                          <Field label="Date of Birth" value={linkedCase.dob} />
                          <Field label="Time of Birth" value={linkedCase.tob} />
                          <Field label="Place of Birth" value={linkedCase.pob} />
                        </div>
                        <div style={{ height: 1, background: "#e5e7eb", margin: "16px 0" }} />
                        <p style={{ fontSize: 12, fontWeight: 800, color: "#0f766e", marginBottom: 10, letterSpacing: "0.04em" }}>🪔 GURUJI VAKYA (current)</p>
                        <Field label="Guruji's Observation"   value={linkedCase.guruji_observation} big />
                        <Field label="Karmic Indication"      value={linkedCase.karmic_indication} big />
                        <Field label="Divine Remedy (free-text)" value={linkedCase.divine_remedy} big />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <Field label="Remedy Duration" value={linkedCase.remedy_duration} />
                          <Field label="Remedy Place"    value={linkedCase.remedy_place} />
                        </div>
                        <Field label="Mantra / Japa" value={linkedCase.mantra_japa} />
                        <Field label="Seva / Daana"  value={linkedCase.seva_daana} />
                        <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 14 }}>Guruji writes the remedy and guidance for this case from the Trikala case detail in the admin console.</p>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize: 13.5, color: "#374151", marginBottom: 10 }}>This is a general appointment (no Trikala Jnana case attached).</p>
                        <Field label="Type"     value={sel.appointmentType} />
                        <Field label="Mode"     value={sel.mode ? (MODE_LABEL[sel.mode] || sel.mode) : "—"} />
                        <Field label="Scheduled" value={fmtDateTime(sel.startTime)} />
                        <Field label="Purpose"  value={sel.purpose} big />
                      </>
                    )}
                  </div>
                )}

                {/* REMARKS */}
                {tab === "remarks" && (
                  <div style={{ maxWidth: 680 }}>
                    {sel.officeRemarks && (
                      <div style={{ marginBottom: 18 }}>
                        <p style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Office Staff Remarks</p>
                        <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, color: "#374151", lineHeight: 1.5 }}>{sel.officeRemarks}</div>
                      </div>
                    )}
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Guruji&rsquo;s Private Comment</p>
                    <textarea value={gurujiNote} onChange={e => setGurujiNote(e.target.value)} rows={7}
                      placeholder="Guruji's confidential notes about this devotee / darshan…"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#1f2937", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.55, boxSizing: "border-box" }} />
                    <button onClick={saveNote} disabled={savingNote}
                      style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: savingNote ? "default" : "pointer", opacity: savingNote ? 0.6 : 1 }}>
                      <CheckCircle2 size={15} /> {savingNote ? "Saving…" : "Save Comment"}
                    </button>
                  </div>
                )}

                {/* WRITE PAD */}
                {tab === "pad" && (
                  <WritingPadPro
                    padKey={sel.appointmentRef || `appt-${sel.id}`}
                    title={`Notes — ${sel.devoteeName || "Devotee"}`}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── small presentational helpers ─────────────────────────────────── */
function InfoCard({ icon, label, value, wide }: { icon: React.ReactNode; label: string; value?: string; wide?: boolean }) {
  return (
    <div style={{ gridColumn: wide ? "1 / -1" : "auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "13px 15px" }}>
      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0d9488", marginBottom: 5 }}>{icon} {label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", wordBreak: "break-word", lineHeight: 1.45 }}>{value || "—"}</p>
    </div>
  );
}
function Field({ label, value, big }: { label: string; value?: string; big?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: big ? 14 : 13.5, fontWeight: big ? 600 : 500, color: "#1f2937", lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{value || "—"}</p>
    </div>
  );
}
function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 11.5, fontWeight: 800, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, ...style }}>{children}</p>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>{children}</p>;
}
function Row({ icon, title, sub, tag }: { icon?: string; title: string; sub?: string; tag?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", marginBottom: 8 }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon || "•"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>{title}</p>
        {sub && <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{sub}</p>}
      </div>
      {tag && <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "2px 7px", borderRadius: 6, flexShrink: 0 }}>{tag}</span>}
    </div>
  );
}
