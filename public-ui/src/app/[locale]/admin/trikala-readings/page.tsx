"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getTrikalaReadings, updateTrikalaStatus, type TrikalaReading } from "@/lib/api";

/* ── Types ──────────────────────────────────────────────────────────── */
type TabFilter = "All Cases" | "Submitted" | "Horoscope" | "AI Report" | "Under Review" | "Finalized" | "Published";

const ALL_STATUSES = ["Submitted", "AI Report", "Under Review", "Finalized", "Published"] as const;

/* ── Status / service config ─────────────────────────────────────────── */
const STATUS_CFG: Record<string, { bg: string; color: string; dot: string }> = {
  "Submitted":    { bg:"#EEF4FF", color:"#3B82F6", dot:"#3B82F6" },
  "AI Report":    { bg:"#F3E8FF", color:"#7C3AED", dot:"#7C3AED" },
  "Under Review": { bg:"#FFF7E6", color:"#D97706", dot:"#D97706" },
  "Finalized":    { bg:"#ECFDF5", color:"#059669", dot:"#059669" },
  "Published":    { bg:"#DCFCE7", color:"#16A34A", dot:"#16A34A" },
};

const SVC_CFG: Record<string, { bg: string; color: string; border: string; icon: string; label: string }> = {
  "horoscope":   { bg:"#F3E8FF", color:"#6D28D9", border:"#DDD6FE", icon:"✨", label:"General Horoscope" },
  "ashta_rekha": { bg:"#FFF1EE", color:"#C2410C", border:"#FED7AA", icon:"🖐️", label:"Ashta Rekha" },
};

/* ── Stat card ──────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, iconBg, iconColor }: {
  icon: string; value: number; label: string; iconBg: string; iconColor: string;
}) {
  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E5E7EB", padding:"20px 22px", display:"flex", alignItems:"center", gap:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ width:48, height:48, borderRadius:12, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <span style={{ color:iconColor, fontSize:22 }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontSize:28, fontWeight:800, color:"#111827", lineHeight:1, marginBottom:4 }}>{value}</p>
        <p style={{ fontSize:13, color:"#6B7280" }}>{label}</p>
      </div>
    </div>
  );
}

/* ── Detail / Status Panel ──────────────────────────────────────────── */
function DetailPanel({
  reading,
  onClose,
  onStatusChange,
}: {
  reading: TrikalaReading;
  onClose: () => void;
  onStatusChange: (updated: TrikalaReading) => void;
}) {
  const [status,  setStatus]  = useState(reading.status);
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState("");

  const svc  = SVC_CFG[reading.serviceType] ?? SVC_CFG["horoscope"];
  const sts  = STATUS_CFG[status] ?? STATUS_CFG["Submitted"];

  async function save() {
    if (status === reading.status) return;
    setSaving(true); setSaveErr("");
    try {
      const updated = await updateTrikalaStatus(reading.id, status);
      onStatusChange(updated);
      onClose();
    } catch (e: any) {
      setSaveErr(e?.message || "Failed to update status");
    } finally { setSaving(false); }
  }

  function fmt(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
  }

  const rows: [string, string][] = [
    ["Case Ref",   reading.caseReference],
    ["Full Name",  reading.fullName],
    ["Mobile",     reading.mobile],
    ["Email",      reading.email],
    ["Gender",     reading.gender],
    ["Occupation", reading.occupation],
    ["Date of Birth", reading.dob ? new Date(reading.dob).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—"],
    ["Time of Birth", reading.tob || "—"],
    ["Place of Birth", reading.pob],
    ["Service",    svc.label],
    ["Submitted",  fmt(reading.createdAt)],
  ];

  return (
    <>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose}
        style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.38)", backdropFilter:"blur(2px)" }}
      />
      <motion.div
        initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }}
        transition={{ type:"spring", stiffness:320, damping:34 }}
        style={{ position:"fixed", top:0, right:0, bottom:0, zIndex:201, width:460, maxWidth:"100vw", background:"#F9FAFB", boxShadow:"-8px 0 40px rgba(0,0,0,0.15)", display:"flex", flexDirection:"column", fontFamily:"'Inter','Segoe UI',sans-serif" }}
      >
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1e0800,#2a1000)", padding:"20px 22px 18px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,220,170,0.55)" }}>
              Trikala Reading Request
            </span>
            <button onClick={onClose} style={{ background:"rgba(255,220,170,0.10)", border:"1px solid rgba(255,220,170,0.22)", borderRadius:8, width:30, height:30, cursor:"pointer", color:"rgba(255,220,170,0.9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              ✕
            </button>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:13 }}>
            <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,#FA580C,#c9822b)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:18, fontWeight:800, color:"#fff", boxShadow:"0 2px 12px rgba(250,88,12,0.4)" }}>
              {reading.fullName[0]?.toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:16, fontWeight:800, color:"rgba(255,220,170,0.95)", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{reading.fullName}</p>
              <p style={{ fontSize:11.5, color:"rgba(255,220,170,0.55)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{reading.email}</p>
            </div>
            <span style={{ ...STATUS_CFG[reading.status], flexShrink:0, fontSize:10.5, fontWeight:700, borderRadius:20, padding:"3px 10px", background:STATUS_CFG[reading.status]?.bg, color:STATUS_CFG[reading.status]?.color }}>
              {reading.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 16px", display:"flex", flexDirection:"column", gap:14 }}>

          {/* Details card */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E7EB", overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ padding:"11px 16px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13 }}>📋</span>
              <span style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9CA3AF" }}>Request Details</span>
            </div>
            {rows.map(([label, val]) => (
              <div key={label} style={{ display:"flex", padding:"9px 16px", borderBottom:"1px solid #F9FAFB" }}>
                <span style={{ width:130, minWidth:130, fontSize:12, fontWeight:600, color:"#9CA3AF" }}>{label}</span>
                <span style={{ flex:1, fontSize:13, color:"#1F2937", wordBreak:"break-word", lineHeight:1.5 }}>{val || "—"}</span>
              </div>
            ))}
            {/* Guidance */}
            <div style={{ padding:"9px 16px" }}>
              <p style={{ fontSize:12, fontWeight:600, color:"#9CA3AF", marginBottom:5 }}>Guidance Query</p>
              <p style={{ fontSize:13, color:"#1F2937", lineHeight:1.65 }}>{reading.guidanceQuery}</p>
            </div>
          </div>

          {/* Service badge */}
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E5E7EB", padding:"13px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 13px", borderRadius:20, background:svc.bg, border:`1px solid ${svc.border}`, fontSize:13, fontWeight:600, color:svc.color }}>
              <span style={{ fontSize:14 }}>{svc.icon}</span>{svc.label}
            </span>
          </div>

          {/* Status update */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E7EB", padding:"16px 16px", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:12, letterSpacing:"0.08em", textTransform:"uppercase" }}>Update Status</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CFG[s];
                const sel = status === s;
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${sel ? cfg.color : "#E5E7EB"}`, background: sel ? cfg.bg : "#F9FAFB", color: sel ? cfg.color : "#6B7280", fontSize:12.5, fontWeight: sel ? 700 : 500, cursor:"pointer", transition:"all 0.15s" }}>
                    {s}
                  </button>
                );
              })}
            </div>
            {saveErr && <p style={{ fontSize:12, color:"#ef4444", marginBottom:10 }}>{saveErr}</p>}
            <button onClick={save} disabled={saving || status === reading.status}
              style={{ width:"100%", height:44, borderRadius:10, border:"none", background: (saving || status === reading.status) ? "rgba(250,88,12,0.35)" : "#FA580C", color:"#fff", fontWeight:700, fontSize:14, cursor: (saving || status === reading.status) ? "default" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 3px 12px rgba(250,88,12,0.28)" }}>
              {saving ? "Saving…" : status === reading.status ? "No Change" : `Set → ${status}`}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function TrikalaReadingsAdmin() {
  const router = useRouter();
  const [cases,      setCases]      = useState<TrikalaReading[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [activeTab,  setActiveTab]  = useState<TabFilter>("All Cases");
  const [detail,     setDetail]     = useState<TrikalaReading | null>(null);

  const TABS: TabFilter[] = ["All Cases","Submitted","Horoscope","AI Report","Under Review","Finalized","Published"];

  /* ── Load data ── */
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await getTrikalaReadings();
      setCases(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load readings");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Filter ── */
  const filtered = useMemo(() => {
    let list = cases;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.caseReference.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    if (activeTab !== "All Cases") {
      if (activeTab === "Horoscope") {
        list = list.filter(c => c.serviceType === "horoscope");
      } else {
        list = list.filter(c => c.status === activeTab);
      }
    }
    return list;
  }, [cases, search, activeTab]);

  /* ── Stats ── */
  const total      = cases.length;
  const awaiting   = cases.filter(c => c.status === "Submitted" || c.status === "AI Report").length;
  const inProgress = cases.filter(c => c.status === "Under Review").length;
  const published  = cases.filter(c => c.status === "Published").length;

  const TAB_DOTS: Record<string, string> = {
    "Submitted":"#3B82F6","Horoscope":"#6D28D9","AI Report":"#7C3AED",
    "Under Review":"#D97706","Finalized":"#059669","Published":"#16A34A",
  };

  function handleStatusChange(updated: TrikalaReading) {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  function fmtDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
  }

  return (
    <div style={{ minHeight:"100vh", background:"#F3F0EB", fontFamily:"'Inter','Segoe UI',sans-serif" }}>

      {/* ── TOP NAV BAR ────────────────────────────────────────────── */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", height:60, display:"flex", alignItems:"center", padding:"0 28px", gap:16 }}>
        <Link href="/admin" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0, marginRight:8 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#b9934a,#8a6a30)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:18, color:"#fff" }}>ॐ</span>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:800, color:"#1F2937", lineHeight:1.2 }}>Guruji Astro</p>
            <p style={{ fontSize:10, fontWeight:600, color:"#9CA3AF", letterSpacing:"0.08em" }}>Admin Panel</p>
          </div>
        </Link>

        {/* Search */}
        <div style={{ flex:1, maxWidth:440, position:"relative" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search name, case ID, mobile…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", height:38, paddingLeft:36, paddingRight:12, border:"1.5px solid #E5E7EB", borderRadius:9, fontSize:13, color:"#1F2937", background:"#F9FAFB", outline:"none", boxSizing:"border-box" }}
          />
        </div>
        <button style={{ height:38, padding:"0 14px", borderRadius:9, border:"none", background:"#b9934a", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <div style={{ flex:1 }} />

        {/* Refresh */}
        <button onClick={load} title="Refresh"
          style={{ display:"flex", alignItems:"center", gap:6, height:36, padding:"0 13px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:"#374151", flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={loading ? { animation:"spin 1s linear infinite" } : {}}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
          </svg>
          Refresh
        </button>

        {/* Admin user */}
        <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#E5E7EB", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>admin</span>
        </div>

        {/* Back to main admin */}
        <button onClick={() => router.push("/admin")}
          style={{ display:"flex", alignItems:"center", gap:6, height:36, padding:"0 14px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:"#374151", flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <main style={{ padding:"32px 32px 48px", maxWidth:1380, margin:"0 auto" }}>

        {/* Page heading */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", marginBottom:4 }}>Devotee Requests</h1>
          <p style={{ fontSize:14, color:"#6B7280" }}>Manage all incoming spiritual consultation requests</p>
        </div>

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          <StatCard icon="📋" value={total}      label="Total Requests"  iconBg="#FEF2F2" iconColor="#EF4444" />
          <StatCard icon="⏳" value={awaiting}   label="Awaiting Review" iconBg="#EFF6FF" iconColor="#3B82F6" />
          <StatCard icon="👁️" value={inProgress} label="In Progress"     iconBg="#FFFBEB" iconColor="#F59E0B" />
          <StatCard icon="✅" value={published}  label="Published"       iconBg="#F0FDF4" iconColor="#22C55E" />
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            const dot = TAB_DOTS[tab];
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", borderRadius:50, border:`1.5px solid ${active ? "#b9934a" : "#D1D5DB"}`, background:"#fff", color: active ? "#1F2937" : "#4B5563", fontSize:13, fontWeight: active ? 700 : 500, cursor:"pointer", transition:"all 0.15s", boxShadow: active ? "0 1px 6px rgba(0,0,0,0.10)" : "none" }}>
                {dot && <span style={{ width:7, height:7, borderRadius:"50%", background:dot, display:"inline-block", flexShrink:0 }} />}
                {tab}
              </button>
            );
          })}
        </div>

        {/* Table card */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E7EB", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderBottom:"1px solid #F3F4F6" }}>
            <p style={{ fontSize:15, fontWeight:700, color:"#111827" }}>
              {activeTab === "All Cases" ? "All Cases" : activeTab}
            </p>
            <p style={{ fontSize:13, color:"#9CA3AF" }}>{filtered.length} records</p>
          </div>

          {/* Loading / Error / Table */}
          {loading ? (
            <div style={{ padding:"60px 20px", textAlign:"center", color:"#9CA3AF", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation:"spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
              </svg>
              Loading readings…
            </div>
          ) : error ? (
            <div style={{ padding:"60px 20px", textAlign:"center" }}>
              <p style={{ color:"#EF4444", fontSize:14, fontWeight:600, marginBottom:12 }}>{error}</p>
              <button onClick={load} style={{ padding:"8px 20px", borderRadius:8, border:"1px solid #EF4444", background:"#fff", color:"#EF4444", cursor:"pointer", fontSize:13, fontWeight:600 }}>Retry</button>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#F9FAFB", borderBottom:"1px solid #F3F4F6" }}>
                    {["CASE ID","DEVOTEE","MOBILE","SERVICE","STATUS","SUBMITTED",""].map(h => (
                      <th key={h} style={{ padding:"11px 16px", fontSize:11, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:"#9CA3AF", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding:"48px 20px", textAlign:"center", color:"#9CA3AF", fontSize:14 }}>No records found</td></tr>
                  ) : filtered.map(c => {
                    const svc = SVC_CFG[c.serviceType] ?? SVC_CFG["horoscope"];
                    const sts = STATUS_CFG[c.status]   ?? STATUS_CFG["Submitted"];
                    return (
                      <tr key={c.id}
                        style={{ borderBottom:"1px solid #F9FAFB", transition:"background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                        onMouseLeave={e => (e.currentTarget.style.background = "")}>

                        {/* Case ID */}
                        <td style={{ padding:"14px 16px", whiteSpace:"nowrap" }}>
                          <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:20, border:"1.5px solid #D4A946", fontSize:12, fontWeight:700, color:"#92710A", background:"#FFFBEF", letterSpacing:"0.02em" }}>
                            {c.caseReference}
                          </span>
                        </td>

                        {/* Devotee */}
                        <td style={{ padding:"14px 16px" }}>
                          <p style={{ fontSize:14, fontWeight:600, color:"#111827", marginBottom:1 }}>{c.fullName}</p>
                          <p style={{ fontSize:12, color:"#9CA3AF" }}>{c.email}</p>
                        </td>

                        {/* Mobile */}
                        <td style={{ padding:"14px 16px", fontSize:13, color:"#374151", fontFamily:"monospace", whiteSpace:"nowrap" }}>{c.mobile}</td>

                        {/* Service */}
                        <td style={{ padding:"14px 16px", whiteSpace:"nowrap" }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, background:svc.bg, border:`1px solid ${svc.border}`, fontSize:12.5, fontWeight:600, color:svc.color }}>
                            <span style={{ fontSize:13 }}>{svc.icon}</span>{svc.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding:"14px 16px", whiteSpace:"nowrap" }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, background:sts.bg, fontSize:12.5, fontWeight:600, color:sts.color }}>
                            <span style={{ width:6, height:6, borderRadius:"50%", background:sts.dot, display:"inline-block", flexShrink:0 }} />
                            {c.status}
                          </span>
                        </td>

                        {/* Submitted */}
                        <td style={{ padding:"14px 16px", fontSize:13, color:"#6B7280", whiteSpace:"nowrap" }}>{fmtDate(c.createdAt)}</td>

                        {/* Open */}
                        <td style={{ padding:"14px 16px", whiteSpace:"nowrap" }}>
                          <button onClick={() => setDetail(c)}
                            style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:"#374151", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
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
      </main>

      {/* Detail / Status panel */}
      <AnimatePresence>
        {detail && (
          <DetailPanel
            reading={detail}
            onClose={() => setDetail(null)}
            onStatusChange={updated => { handleStatusChange(updated); setDetail(null); }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          main { padding: 20px 16px 40px !important; }
          div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          header { padding: 0 14px !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  );
}
