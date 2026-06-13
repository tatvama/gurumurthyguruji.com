const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── Admin User types ──────────────────────────────────────────── */
export interface AdminUser {
  id: number;
  name: string;
  mobile: string;
  role: "superadmin" | "admin";
  sectionsCount: number;
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt?: string;
}

function mapAdminUser(r: Record<string, any>): AdminUser {
  return {
    id:            r.id,
    name:          r.name,
    mobile:        r.mobile,
    role:          r.role,
    sectionsCount: r.sections_count ?? r.sectionsCount ?? 0,
    status:        r.status,
    lastLogin:     r.last_login ?? r.lastLogin,
    createdAt:     r.created_at ?? r.createdAt,
  };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${BASE}/api/admin-users`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapAdminUser);
}

export async function createAdminUser(payload: {
  name: string; mobile: string; role: string;
}): Promise<AdminUser> {
  const res = await fetch(`${BASE}/api/admin-users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return mapAdminUser(data.data);
}

export async function updateAdminUser(id: number, payload: {
  name: string; role: string; status: string;
}): Promise<AdminUser> {
  const res = await fetch(`${BASE}/api/admin-users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return mapAdminUser(data.data);
}

export async function deleteAdminUser(id: number): Promise<void> {
  const res = await fetch(`${BASE}/api/admin-users/${id}`, { method: "DELETE" });
  if (!res.ok) { const d = await res.json(); throw d; }
}

export async function adminSendOtp(mobile: string): Promise<{ otp: string }> {
  const res = await fetch(`${BASE}/api/admin-users/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function adminVerifyOtp(mobile: string, otp: string): Promise<{ name: string; role: string }> {
  const res = await fetch(`${BASE}/api/admin-users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data;
}

/* ── Admin read types (camelCase, matching DB snake_case mapped below) */
export interface AudienceBooking {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  profession: string;
  city?: string;
  district?: string;
  state?: string;
  location: string;
  howKnown: string;
  nearestAshram: string;
  message?: string;
  photo?: string;
  status?: string;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

/* ── snake_case → camelCase mappers ─────────────────────────────── */
function mapBooking(r: Record<string, any>): AudienceBooking {
  return {
    id:            r.id ?? r._id,
    fullName:      r.full_name   ?? r.fullName,
    mobile:        r.mobile,
    email:         r.email,
    profession:    r.profession,
    city:          r.city,
    district:      r.district,
    state:         r.state,
    location:      r.location,
    howKnown:      r.how_known   ?? r.howKnown,
    nearestAshram: r.nearest_ashram ?? r.nearestAshram,
    message:       r.message,
    photo:         r.photo,
    status:        r.status,
    createdAt:     r.created_at  ?? r.createdAt,
  };
}

function mapContact(r: Record<string, any>): ContactMessage {
  return {
    id:        r.id ?? r._id,
    name:      r.name,
    email:     r.email,
    subject:   r.subject,
    message:   r.message,
    createdAt: r.created_at ?? r.createdAt,
  };
}

/* ── Admin GET functions ─────────────────────────────────────────── */
export async function getAudienceBookings(): Promise<AudienceBooking[]> {
  const res = await fetch(`${BASE}/api/audience-bookings`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? json.bookings ?? []);
  return rows.map(mapBooking);
}

export async function getContacts(): Promise<ContactMessage[]> {
  const res = await fetch(`${BASE}/api/contacts`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? json.contacts ?? []);
  return rows.map(mapContact);
}

export async function postContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await fetch(`${BASE}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function postAudienceBooking(payload: {
  fullName: string;
  mobile: string;
  email?: string;
  profession: string;
  city?: string;
  district?: string;
  state?: string;
  howKnown: string;
  nearestAshram: string;
  message?: string;
  photo?: string;
}) {
  const res = await fetch(`${BASE}/api/audience-bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

/* ══════════════════════════════════════════════════════════════════
   TRIKALA READINGS
══════════════════════════════════════════════════════════════════ */
export interface TrikalaReading {
  id: number;
  caseReference: string;
  fullName: string;
  mobile: string;
  email: string;
  gender: string;
  occupation: string;
  dob: string;
  tob?: string;
  pob: string;
  serviceType: string;   // "horoscope" | "ashta_rekha"
  guidanceQuery: string;
  status: string;        // "Submitted" | "AI Report" | "Under Review" | "Finalized" | "Published"
  createdAt?: string;
  updatedAt?: string;
}

function mapReading(r: Record<string, any>): TrikalaReading {
  return {
    id:             r.id,
    caseReference:  r.case_reference  ?? r.caseReference,
    fullName:       r.full_name       ?? r.fullName,
    mobile:         r.mobile,
    email:          r.email,
    gender:         r.gender,
    occupation:     r.occupation,
    dob:            r.dob,
    tob:            r.tob,
    pob:            r.pob,
    serviceType:    r.service_type    ?? r.serviceType,
    guidanceQuery:  r.guidance_query  ?? r.guidanceQuery,
    status:         r.status,
    createdAt:      r.created_at      ?? r.createdAt,
    updatedAt:      r.updated_at      ?? r.updatedAt,
  };
}

/** Submit the 4-step form — returns caseReference on success */
export async function postTrikalaReading(payload: {
  fullName: string;
  mobile: string;
  email: string;
  gender: string;
  occupation: string;
  dob: string;
  tob?: string;
  pob: string;
  serviceType: string;
  guidanceQuery: string;
  palmImage?: string;
}): Promise<{ caseReference: string; status: string }> {
  const res = await fetch(`${BASE}/api/trikala-readings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data: any = {};
  try { data = await res.json(); } catch (_e) { /* non-JSON body */ }
  if (!res.ok) {
    const fieldMsg = Array.isArray(data?.errors) ? data.errors.map((e: any) => e.message).join(". ") : "";
    const msg = fieldMsg || data?.message || ("Server error " + res.status);
    const err: any = new Error(msg);
    err.errors = data?.errors;
    err.status  = res.status;
    throw err;
  }
  return data.data;
}

/** Admin — fetch all readings */
export async function getTrikalaReadings(): Promise<TrikalaReading[]> {
  const res = await fetch(`${BASE}/api/trikala-readings`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapReading);
}

/** Admin — update reading status */
export async function updateTrikalaStatus(id: number, status: string): Promise<TrikalaReading> {
  const res = await fetch(`${BASE}/api/trikala-readings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return mapReading(data.data);
}

/* ── Case Notes ──────────────────────────────────────────────────── */
export interface CaseNote {
  id: number;
  caseReference: string;
  text: string;
  createdAt: string;
}

export async function getCaseNotes(caseRef: string): Promise<CaseNote[]> {
  const res = await fetch(`${BASE}/api/case-notes/${encodeURIComponent(caseRef)}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return (data.notes as Record<string, any>[]).map(r => ({
    id: r.id, caseReference: r.case_reference, text: r.text, createdAt: r.created_at,
  }));
}

export async function addCaseNote(caseRef: string, text: string): Promise<CaseNote> {
  const res = await fetch(`${BASE}/api/case-notes/${encodeURIComponent(caseRef)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  const r = data.note;
  return { id: r.id, caseReference: r.case_reference, text: r.text, createdAt: r.created_at };
}

export async function deleteCaseNote(caseRef: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/api/case-notes/${encodeURIComponent(caseRef)}/${id}`, { method: "DELETE" });
  if (!res.ok) { const d = await res.json(); throw d; }
}

/* ── Case Follow-ups ─────────────────────────────────────────────── */
export interface CaseFollowup {
  id: number;
  caseReference: string;
  type: string;
  dateTime: string;
  notes: string;
  createdAt: string;
}

export async function getCaseFollowups(caseRef: string): Promise<CaseFollowup[]> {
  const res = await fetch(`${BASE}/api/case-followups/${encodeURIComponent(caseRef)}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return (data.followups as Record<string, any>[]).map(r => ({
    id: r.id, caseReference: r.case_reference, type: r.type,
    dateTime: r.date_time, notes: r.notes, createdAt: r.created_at,
  }));
}

export async function addCaseFollowup(caseRef: string, payload: { type: string; dateTime: string; notes: string }): Promise<CaseFollowup> {
  const res = await fetch(`${BASE}/api/case-followups/${encodeURIComponent(caseRef)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  const r = data.followup;
  return { id: r.id, caseReference: r.case_reference, type: r.type, dateTime: r.date_time, notes: r.notes, createdAt: r.created_at };
}

export async function deleteCaseFollowup(caseRef: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/api/case-followups/${encodeURIComponent(caseRef)}/${id}`, { method: "DELETE" });
  if (!res.ok) { const d = await res.json(); throw d; }
}

/* ── Case Pad ────────────────────────────────────────────────────── */
export async function getCasePad(caseRef: string): Promise<string | null> {
  const res = await fetch(`${BASE}/api/case-pad/${encodeURIComponent(caseRef)}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data.imageData;
}

export async function saveCasePad(caseRef: string, imageData: string): Promise<void> {
  const res = await fetch(`${BASE}/api/case-pad/${encodeURIComponent(caseRef)}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageData }),
  });
  if (!res.ok) { const d = await res.json(); throw d; }
}

export async function clearCasePad(caseRef: string): Promise<void> {
  const res = await fetch(`${BASE}/api/case-pad/${encodeURIComponent(caseRef)}`, { method: "DELETE" });
  if (!res.ok) { const d = await res.json(); throw d; }
}
