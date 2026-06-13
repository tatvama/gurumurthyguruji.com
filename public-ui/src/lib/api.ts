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
/** The 12 PRD case statuses (§5) */
export const TRIKALA_STATUSES = [
  "Submitted", "Incomplete", "Ready for AI Analysis", "AI Draft Generated",
  "Awaiting Guruji Review", "Under Review", "Remedy Assigned", "Follow-up Scheduled",
  "Finalized", "Published / Shared", "Closed", "Reopened",
] as const;

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
  status: string;        // one of TRIKALA_STATUSES (legacy: "AI Report" | "Published")
  /* PRD case-file fields */
  problemCategory?: string;
  priority?: string;
  preferredLanguage?: string;
  devoteeId?: number;
  assignedAdminId?: number;
  /* Guruji Vakya / guidance (PRD §3 Stage 3) */
  gurujiObservation?: string;
  karmicIndication?: string;
  divineRemedy?: string;
  remedyDuration?: string;
  remedyPlace?: string;
  mantraJapa?: string;
  sevaDaana?: string;
  followupRequired?: boolean;
  closureNote?: string;
  gurujiReviewedAt?: string;
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
    problemCategory:   r.problem_category   ?? r.problemCategory,
    priority:          r.priority,
    preferredLanguage: r.preferred_language ?? r.preferredLanguage,
    devoteeId:         r.devotee_id         ?? r.devoteeId,
    assignedAdminId:   r.assigned_admin_id  ?? r.assignedAdminId,
    gurujiObservation: r.guruji_observation ?? r.gurujiObservation,
    karmicIndication:  r.karmic_indication  ?? r.karmicIndication,
    divineRemedy:      r.divine_remedy       ?? r.divineRemedy,
    remedyDuration:    r.remedy_duration     ?? r.remedyDuration,
    remedyPlace:       r.remedy_place        ?? r.remedyPlace,
    mantraJapa:        r.mantra_japa         ?? r.mantraJapa,
    sevaDaana:         r.seva_daana          ?? r.sevaDaana,
    followupRequired:  r.followup_required   ?? r.followupRequired,
    closureNote:       r.closure_note        ?? r.closureNote,
    gurujiReviewedAt:  r.guruji_reviewed_at  ?? r.gurujiReviewedAt,
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

/* ── small fetch helpers ─────────────────────────────────────────── */
async function getJson(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) { let d: any = {}; try { d = await res.json(); } catch {} throw d.message ? d : new Error(`Server error: ${res.status}`); }
  return res.json();
}
async function sendJson(path: string, method: string, body?: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method, headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data: any = {}; try { data = await res.json(); } catch {}
  if (!res.ok) throw data;
  return data;
}

/* ══════════════════════════════════════════════════════════════════
   TRIKALA — Guruji Vakya + case-field updates (PRD §3 Stage 3, §5)
══════════════════════════════════════════════════════════════════ */
export async function updateTrikalaFields(id: number, fields: Record<string, any>): Promise<TrikalaReading> {
  const data = await sendJson(`/api/trikala-readings/${id}`, "PATCH", fields);
  return mapReading(data.data);
}

export interface GurujiVakya {
  guruji_observation?: string;
  karmic_indication?: string;
  divine_remedy?: string;
  remedy_duration?: string;
  remedy_place?: string;
  mantra_japa?: string;
  seva_daana?: string;
  followup_required?: boolean;
  closure_note?: string;
  advanceStatus?: boolean;
}
export async function saveGurujiVakya(id: number, vakya: GurujiVakya): Promise<TrikalaReading> {
  const data = await sendJson(`/api/trikala-readings/${id}/vakya`, "PATCH", vakya);
  return mapReading(data.data);
}

/* ══════════════════════════════════════════════════════════════════
   DEVOTEES — 360 directory (PRD §7)
══════════════════════════════════════════════════════════════════ */
export interface Devotee {
  id: number;
  devoteeRef?: string;
  name: string;
  photo?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  language?: string;
  relationship?: string;   // new | regular | donor | volunteer | vip | family
  tags?: string;
  associatedTemple?: string;
  sevaInterest?: string;
  firstContactAt?: string;
  familyLinks?: string;
  notes?: string;
  consent?: boolean;
  sensitive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
function mapDevotee(r: Record<string, any>): Devotee {
  return {
    id: r.id, devoteeRef: r.devotee_ref ?? r.devoteeRef, name: r.name, photo: r.photo,
    gender: r.gender, dob: r.dob, phone: r.phone, whatsapp: r.whatsapp, email: r.email,
    city: r.city, state: r.state, country: r.country, language: r.language,
    relationship: r.relationship, tags: r.tags, associatedTemple: r.associated_temple ?? r.associatedTemple,
    sevaInterest: r.seva_interest ?? r.sevaInterest, firstContactAt: r.first_contact_at ?? r.firstContactAt,
    familyLinks: r.family_links ?? r.familyLinks, notes: r.notes, consent: r.consent,
    sensitive: r.sensitive, status: r.status, createdAt: r.created_at ?? r.createdAt,
    updatedAt: r.updated_at ?? r.updatedAt,
  };
}

export interface TimelineEvent {
  id: number; eventType: string; title: string; description?: string;
  relatedEntityType?: string; relatedEntityId?: string; icon?: string; createdAt: string;
}
function mapTimeline(r: Record<string, any>): TimelineEvent {
  return {
    id: r.id, eventType: r.event_type, title: r.title, description: r.description,
    relatedEntityType: r.related_entity_type, relatedEntityId: r.related_entity_id,
    icon: r.icon, createdAt: r.created_at,
  };
}

export async function getDevotees(opts: { search?: string; relationship?: string } = {}): Promise<Devotee[]> {
  const qs = new URLSearchParams();
  if (opts.search) qs.set("search", opts.search);
  if (opts.relationship && opts.relationship !== "all") qs.set("relationship", opts.relationship);
  const json = await getJson(`/api/devotees${qs.toString() ? "?" + qs : ""}`);
  return (json.data ?? []).map(mapDevotee);
}
export async function getDevotee(id: number): Promise<Devotee> {
  const json = await getJson(`/api/devotees/${id}`);
  return mapDevotee(json.data);
}
export interface DevoteeHistory {
  devotee: Devotee;
  cases: any[];
  appointments: any[];
  remedies: any[];
  timeline: TimelineEvent[];
  bookings: any[];
}
export async function getDevoteeHistory(id: number): Promise<DevoteeHistory> {
  const json = await getJson(`/api/devotees/${id}/history`);
  const d = json.data;
  return {
    devotee: mapDevotee(d.devotee),
    cases: d.cases ?? [],
    appointments: d.appointments ?? [],
    remedies: d.remedies ?? [],
    timeline: (d.timeline ?? []).map(mapTimeline),
    bookings: d.bookings ?? [],
  };
}
export async function checkDuplicateDevotee(payload: { phone?: string; whatsapp?: string; email?: string; name?: string; city?: string }): Promise<Devotee[]> {
  const data = await sendJson(`/api/devotees/check-duplicate`, "POST", payload);
  return (data.data ?? []).map(mapDevotee);
}
export async function createDevotee(payload: Partial<Devotee> & { name: string; force?: boolean }): Promise<Devotee> {
  const data = await sendJson(`/api/devotees`, "POST", payload);
  return mapDevotee(data.data);
}
export async function updateDevotee(id: number, payload: Partial<Devotee>): Promise<Devotee> {
  const data = await sendJson(`/api/devotees/${id}`, "PATCH", payload);
  return mapDevotee(data.data);
}

/* ══════════════════════════════════════════════════════════════════
   REMEDIES — library + case assignments (PRD §3 Stage 4, §12-D)
══════════════════════════════════════════════════════════════════ */
export interface Remedy {
  id: number; name: string; category: string;
  defaultInstruction?: string; defaultDuration?: string; language?: string;
  reminderSchedule?: string; followupRequired?: boolean; adminCaution?: string;
  gurujiApprovalRequired?: boolean; active?: boolean; createdAt?: string;
}
function mapRemedy(r: Record<string, any>): Remedy {
  return {
    id: r.id, name: r.name, category: r.category,
    defaultInstruction: r.default_instruction ?? r.defaultInstruction,
    defaultDuration: r.default_duration ?? r.defaultDuration, language: r.language,
    reminderSchedule: r.reminder_schedule ?? r.reminderSchedule,
    followupRequired: r.followup_required ?? r.followupRequired,
    adminCaution: r.admin_caution ?? r.adminCaution,
    gurujiApprovalRequired: r.guruji_approval_required ?? r.gurujiApprovalRequired,
    active: r.active, createdAt: r.created_at ?? r.createdAt,
  };
}
export const REMEDY_CATEGORIES = [
  "Pooja", "Mantra", "Vrata", "Temple Visit", "Daana", "Seva",
  "Personal Discipline", "Follow-up Consultation",
] as const;

export async function getRemedyLibrary(category?: string): Promise<Remedy[]> {
  const qs = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  const json = await getJson(`/api/remedies${qs}`);
  return (json.data ?? []).map(mapRemedy);
}
export async function createRemedy(payload: Partial<Remedy> & { name: string; category: string }): Promise<Remedy> {
  const data = await sendJson(`/api/remedies`, "POST", payload);
  return mapRemedy(data.data);
}
export async function updateRemedy(id: number, payload: Partial<Remedy>): Promise<Remedy> {
  const data = await sendJson(`/api/remedies/${id}`, "PATCH", payload);
  return mapRemedy(data.data);
}
export async function deleteRemedy(id: number): Promise<void> {
  await sendJson(`/api/remedies/${id}`, "DELETE");
}

export interface CaseRemedy {
  id: number; caseReference?: string; devoteeId?: number; remedyId?: number;
  remedyName: string; category?: string; customInstruction?: string;
  startDate?: string; endDate?: string; status: string;
  completionNote?: string; adminRemarks?: string; gurujiRemarks?: string; createdAt?: string;
}
function mapCaseRemedy(r: Record<string, any>): CaseRemedy {
  return {
    id: r.id, caseReference: r.case_reference ?? r.caseReference, devoteeId: r.devotee_id ?? r.devoteeId,
    remedyId: r.remedy_id ?? r.remedyId, remedyName: r.remedy_name ?? r.remedyName, category: r.category,
    customInstruction: r.custom_instruction ?? r.customInstruction, startDate: r.start_date ?? r.startDate,
    endDate: r.end_date ?? r.endDate, status: r.status, completionNote: r.completion_note ?? r.completionNote,
    adminRemarks: r.admin_remarks ?? r.adminRemarks, gurujiRemarks: r.guruji_remarks ?? r.gurujiRemarks,
    createdAt: r.created_at ?? r.createdAt,
  };
}
export const REMEDY_STATUSES = ["Assigned", "In Progress", "Completed", "Reviewed", "Closed"] as const;

export async function getCaseRemedies(caseRef: string): Promise<CaseRemedy[]> {
  const json = await getJson(`/api/remedies/case/${encodeURIComponent(caseRef)}`);
  return (json.data ?? []).map(mapCaseRemedy);
}
export async function assignRemedy(caseRef: string, payload: Partial<CaseRemedy> & { remedy_name: string }): Promise<CaseRemedy> {
  const data = await sendJson(`/api/remedies/case/${encodeURIComponent(caseRef)}`, "POST", payload);
  return mapCaseRemedy(data.data);
}
export async function updateRemedyAssignment(id: number, payload: Record<string, any>): Promise<CaseRemedy> {
  const data = await sendJson(`/api/remedies/assignment/${id}`, "PATCH", payload);
  return mapCaseRemedy(data.data);
}
export async function deleteRemedyAssignment(id: number): Promise<void> {
  await sendJson(`/api/remedies/assignment/${id}`, "DELETE");
}

/* ══════════════════════════════════════════════════════════════════
   APPOINTMENTS — command center (PRD §6)
══════════════════════════════════════════════════════════════════ */
export interface Appointment {
  id: number; appointmentRef?: string; devoteeId?: number; caseReference?: string; bookingId?: number;
  devoteeName?: string; mobile?: string; appointmentType?: string; mode?: string;
  startTime?: string; endTime?: string; durationMinutes?: number; status: string;
  priority?: string; location?: string; meetingLink?: string; purpose?: string;
  outcomeNote?: string; assignedTo?: string; createdAt?: string; updatedAt?: string;
}
function mapAppointment(r: Record<string, any>): Appointment {
  return {
    id: r.id, appointmentRef: r.appointment_ref ?? r.appointmentRef, devoteeId: r.devotee_id ?? r.devoteeId,
    caseReference: r.case_reference ?? r.caseReference, bookingId: r.booking_id ?? r.bookingId,
    devoteeName: r.devotee_name ?? r.devoteeName, mobile: r.mobile,
    appointmentType: r.appointment_type ?? r.appointmentType, mode: r.mode,
    startTime: r.start_time ?? r.startTime, endTime: r.end_time ?? r.endTime,
    durationMinutes: r.duration_minutes ?? r.durationMinutes, status: r.status, priority: r.priority,
    location: r.location, meetingLink: r.meeting_link ?? r.meetingLink, purpose: r.purpose,
    outcomeNote: r.outcome_note ?? r.outcomeNote, assignedTo: r.assigned_to ?? r.assignedTo,
    createdAt: r.created_at ?? r.createdAt, updatedAt: r.updated_at ?? r.updatedAt,
  };
}
export const APPOINTMENT_TYPES = [
  "Trikala Consultation", "General Audience", "Phone Call", "Video Call", "Temple Meeting",
  "Event Invitation", "VIP Meeting", "Follow-up", "Internal Meeting", "Travel Block", "Rest / Personal Time",
] as const;
export const APPOINTMENT_STATUSES = [
  "Requested", "Approved", "Scheduled", "Confirmed", "Reminder Sent",
  "Completed", "No-show", "Rescheduled", "Cancelled", "Closed",
] as const;

export async function getAppointments(opts: { status?: string; from?: string; to?: string } = {}): Promise<Appointment[]> {
  const qs = new URLSearchParams();
  if (opts.status && opts.status !== "all") qs.set("status", opts.status);
  if (opts.from) qs.set("from", opts.from);
  if (opts.to) qs.set("to", opts.to);
  const json = await getJson(`/api/appointments${qs.toString() ? "?" + qs : ""}`);
  return (json.data ?? []).map(mapAppointment);
}
export async function createAppointment(payload: Record<string, any>): Promise<Appointment> {
  const data = await sendJson(`/api/appointments`, "POST", payload);
  return mapAppointment(data.data);
}
export async function updateAppointment(id: number, payload: Record<string, any>): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function deleteAppointment(id: number): Promise<void> {
  await sendJson(`/api/appointments/${id}`, "DELETE");
}

/* ══════════════════════════════════════════════════════════════════
   AI PRE-ANALYSIS (PRD §3 Stage 2)
══════════════════════════════════════════════════════════════════ */
export interface AiReport {
  id: number; caseReference: string; summary: string; missingFields: string;
  suggestedQuestions: string; draftReport: string; urgentPoints?: string; status: string; createdAt: string;
}
function mapAiReport(r: Record<string, any>): AiReport {
  return {
    id: r.id, caseReference: r.case_reference, summary: r.summary, missingFields: r.missing_fields,
    suggestedQuestions: r.suggested_questions, draftReport: r.draft_report,
    urgentPoints: r.urgent_points, status: r.status, createdAt: r.created_at,
  };
}
export async function getAiReport(caseRef: string): Promise<AiReport | null> {
  const json = await getJson(`/api/ai-reports/${encodeURIComponent(caseRef)}`);
  return json.data ? mapAiReport(json.data) : null;
}
export async function generateAiReport(caseRef: string): Promise<AiReport> {
  const data = await sendJson(`/api/ai-reports/${encodeURIComponent(caseRef)}/generate`, "POST", {});
  return mapAiReport(data.data);
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD — Today command center + analytics (PRD §13, §16)
══════════════════════════════════════════════════════════════════ */
export interface TodayStats {
  todaysAppointments: number; gurujiReviewPending: number; followupsDue: number;
  newIntake: number; missingInfo: number; reportsToPublish: number;
  urgentCases: number; noshowsYesterday: number; totalDevotees: number; openCases: number;
}
export async function getTodayStats(): Promise<TodayStats> {
  const json = await getJson(`/api/dashboard/today`);
  return json.data;
}
export interface Analytics {
  newThisWeek: number; pendingReview: number; followupsOverdue: number;
  closedThisMonth: number; totalDevotees: number;
  byCategory: { category: string; count: number }[];
  remediesByCategory: { category: string; count: number }[];
}
export async function getAnalytics(): Promise<Analytics> {
  const json = await getJson(`/api/dashboard/analytics`);
  return json.data;
}

/* ══════════════════════════════════════════════════════════════════
   AI CHAT — per-case contextual assistant (PRD §4-C)
══════════════════════════════════════════════════════════════════ */
export interface ChatMessage {
  id: number; caseReference: string; role: "user" | "assistant"; content: string; createdAt: string;
}
function mapChatMsg(r: Record<string, any>): ChatMessage {
  return { id: r.id, caseReference: r.case_reference, role: r.role, content: r.content, createdAt: r.created_at };
}
export async function getChatMessages(caseRef: string): Promise<ChatMessage[]> {
  const json = await getJson(`/api/chat/${encodeURIComponent(caseRef)}`);
  return (json.data ?? []).map(mapChatMsg);
}
export async function sendChatMessage(caseRef: string, content: string): Promise<{ userMessage: ChatMessage; aiMessage: ChatMessage }> {
  const data = await sendJson(`/api/chat/${encodeURIComponent(caseRef)}`, "POST", { content });
  return { userMessage: mapChatMsg(data.data.userMessage), aiMessage: mapChatMsg(data.data.aiMessage) };
}
export async function clearChatHistory(caseRef: string): Promise<void> {
  await sendJson(`/api/chat/${encodeURIComponent(caseRef)}`, "DELETE");
}

/* ══════════════════════════════════════════════════════════════════
   WHATSAPP TEMPLATES — reminder builder (PRD §10)
══════════════════════════════════════════════════════════════════ */
export const WHATSAPP_TEMPLATES = [
  "appointment_reminder", "case_submitted", "case_ready", "remedy_assigned",
  "followup_reminder", "welcome", "intake_incomplete", "no_show_followup",
] as const;
export type WhatsAppTemplate = typeof WHATSAPP_TEMPLATES[number];

export async function generateWhatsAppMessage(template: WhatsAppTemplate, data: Record<string, string>): Promise<{ message: string; waUrl: string | null }> {
  const res = await sendJson(`/api/whatsapp/generate`, "POST", { template, data });
  return res.data;
}
export async function logWhatsAppSent(payload: { devotee_id?: number; case_reference?: string; phone?: string; template?: string; message?: string }): Promise<void> {
  await sendJson(`/api/whatsapp/log`, "POST", payload);
}

/* ══════════════════════════════════════════════════════════════════
   BOOKING → APPOINTMENT conversion (PRD §8)
══════════════════════════════════════════════════════════════════ */
export async function convertBookingToAppointment(bookingId: string | number): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/from-booking/${bookingId}`, "POST", {});
  return mapAppointment(data.data);
}

/* ══════════════════════════════════════════════════════════════════
   RBAC — 8-role system (PRD §11)
══════════════════════════════════════════════════════════════════ */
export const ADMIN_ROLES = [
  { value: "superadmin",      label: "Super Admin",         desc: "Full access to all modules" },
  { value: "guruji",          label: "Guruji",              desc: "Guruji Vakya + Read all" },
  { value: "trikala_admin",   label: "Trikala Admin",       desc: "Manage all Trikala cases" },
  { value: "appt_manager",    label: "Appointment Manager", desc: "Manage appointments" },
  { value: "devotee_manager", label: "Devotee Manager",     desc: "Manage devotee profiles" },
  { value: "report_editor",   label: "Report Editor",       desc: "Generate & export reports" },
  { value: "viewer",          label: "Viewer",              desc: "Read-only access" },
  { value: "admin",           label: "Admin",               desc: "General admin access" },
  { value: "volunteer",       label: "Volunteer",           desc: "Limited task-specific access" },
] as const;

/* ══════════════════════════════════════════════════════════════════
   AUDIT LOG viewer (PRD §11, §19)
══════════════════════════════════════════════════════════════════ */
export interface AuditLog {
  id: number; userName?: string; action?: string; entityType?: string;
  entityId?: string; oldValue?: string; newValue?: string; createdAt: string;
}
export async function getAuditLogs(limit = 50): Promise<AuditLog[]> {
  const json = await getJson(`/api/audit-logs?limit=${limit}`);
  return (json.data ?? []).map((r: Record<string, any>) => ({
    id: r.id, userName: r.user_name, action: r.action, entityType: r.entity_type,
    entityId: r.entity_id, oldValue: r.old_value, newValue: r.new_value, createdAt: r.created_at,
  }));
}
