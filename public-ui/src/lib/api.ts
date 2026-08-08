const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── Admin User types ──────────────────────────────────────────── */
export interface AdminUser {
  id: number;
  name: string;
  mobile: string;
  role: "superadmin" | "admin" | "guruji";
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt?: string;
  allowedSections?: string[] | null;
}

function mapAdminUser(r: Record<string, any>): AdminUser {
  let secs: string[] | null = null;
  if (r.allowed_sections) {
    try { secs = typeof r.allowed_sections === "string" ? JSON.parse(r.allowed_sections) : r.allowed_sections; }
    catch { secs = null; }
  }
  return {
    id:             r.id,
    name:           r.name,
    mobile:         r.mobile,
    role:           r.role,
    status:         r.status ?? "active",
    lastLogin:      r.last_login ?? r.lastLogin,
    createdAt:      r.created_at ?? r.createdAt,
    allowedSections: secs,
  };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const json = await getJson(`/api/admin-users`);
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapAdminUser);
}

export async function createAdminUser(payload: {
  name: string; mobile: string; role: string;
}): Promise<AdminUser> {
  const data = await sendJson(`/api/admin-users`, "POST", payload);
  return mapAdminUser(data.data);
}

export async function updateAdminUser(id: number, payload: {
  name: string; role: string; status: string; allowedSections?: string[] | null;
}): Promise<AdminUser> {
  const data = await sendJson(`/api/admin-users/${id}`, "PATCH", payload);
  return mapAdminUser(data.data);
}

export async function deleteAdminUser(id: number): Promise<void> {
  await sendJson(`/api/admin-users/${id}`, "DELETE");
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

export async function adminVerifyOtp(mobile: string, otp: string): Promise<{ name: string; role: string; allowedSections?: string[] | null }> {
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
export interface AppointmentBooking {
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
function mapBooking(r: Record<string, any>): AppointmentBooking {
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
export async function getAppointmentBookingById(id: string | number): Promise<AppointmentBooking> {
  const json = await getJson(`/api/appointment-bookings/${id}`);
  return mapBooking(json.data ?? json);
}
export async function getAppointmentBookings(): Promise<AppointmentBooking[]> {
  const json = await getJson(`/api/appointment-bookings`);
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? json.bookings ?? []);
  return rows.map(mapBooking);
}

export async function updateBookingStatus(id: string | number, status: string): Promise<AppointmentBooking> {
  const data = await sendJson(`/api/appointment-bookings/${id}/status`, "PATCH", { status });
  return mapBooking(data.data ?? data);
}

export async function getContacts(): Promise<ContactMessage[]> {
  const json = await getJson(`/api/contacts`);
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

/* ── Booking Comments ────────────────────────────────────────────── */
export interface BookingComment {
  id: number;
  bookingId: number;
  text: string;
  isInternal: boolean;
  createdAt: string;
}
function mapBookingComment(r: Record<string, any>): BookingComment {
  return { id: r.id, bookingId: r.booking_id, text: r.text, isInternal: r.is_internal, createdAt: r.created_at };
}
export async function getBookingComments(bookingId: string | number): Promise<BookingComment[]> {
  const data = await getJson(`/api/appointment-bookings/${bookingId}/comments`);
  return (data.data ?? []).map(mapBookingComment);
}
export async function addBookingComment(bookingId: string | number, text: string, isInternal = false): Promise<BookingComment> {
  const data = await sendJson(`/api/appointment-bookings/${bookingId}/comments`, "POST", { text, is_internal: isInternal });
  return mapBookingComment(data.data);
}
export async function deleteBookingComment(bookingId: string | number, commentId: number): Promise<void> {
  await sendJson(`/api/appointment-bookings/${bookingId}/comments/${commentId}`, "DELETE");
}

export async function postAppointmentBooking(payload: {
  fullName: string;
  mobile: string;
  email?: string;
  profession: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  howKnown: string;
  nearestAshram: string;
  message?: string;
  photo?: string;
}) {
  const res = await fetch(`${BASE}/api/appointment-bookings`, {
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
  priority?: string;
  problemCategory?: string;
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
  whatsapp?: string;
  email: string;
  gender: string;
  occupation: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  preferredLanguage?: string;
  dob: string;
  tob?: string;

  pob: string;
  serviceType: string;
  guidanceQuery: string;
  palmImage?: string;
  consent?: boolean;
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
  const json = await getJson(`/api/trikala-readings`);
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapReading);
}

/** Admin — update reading status */
export async function updateTrikalaStatus(id: number, status: string): Promise<TrikalaReading> {
  const data = await sendJson(`/api/trikala-readings/${id}/status`, "PATCH", { status });
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
  const data = await getJson(`/api/case-notes/${encodeURIComponent(caseRef)}`);
  return (data.notes as Record<string, any>[]).map(r => ({
    id: r.id, caseReference: r.case_reference, text: r.text, createdAt: r.created_at,
  }));
}

export async function addCaseNote(caseRef: string, text: string): Promise<CaseNote> {
  const data = await sendJson(`/api/case-notes/${encodeURIComponent(caseRef)}`, "POST", { text });
  const r = data.note;
  return { id: r.id, caseReference: r.case_reference, text: r.text, createdAt: r.created_at };
}

export async function deleteCaseNote(caseRef: string, id: number): Promise<void> {
  await sendJson(`/api/case-notes/${encodeURIComponent(caseRef)}/${id}`, "DELETE");
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
  const data = await getJson(`/api/case-followups/${encodeURIComponent(caseRef)}`);
  return (data.followups as Record<string, any>[]).map(r => ({
    id: r.id, caseReference: r.case_reference, type: r.type,
    dateTime: r.date_time, notes: r.notes, createdAt: r.created_at,
  }));
}

export async function addCaseFollowup(caseRef: string, payload: { type: string; dateTime: string; notes: string }): Promise<CaseFollowup> {
  const data = await sendJson(`/api/case-followups/${encodeURIComponent(caseRef)}`, "POST", payload);
  const r = data.followup;
  return { id: r.id, caseReference: r.case_reference, type: r.type, dateTime: r.date_time, notes: r.notes, createdAt: r.created_at };
}

export async function deleteCaseFollowup(caseRef: string, id: number): Promise<void> {
  await sendJson(`/api/case-followups/${encodeURIComponent(caseRef)}/${id}`, "DELETE");
}

/* ── Case Pad ────────────────────────────────────────────────────── */
export async function getCasePad(caseRef: string): Promise<string | null> {
  const data = await getJson(`/api/case-pad/${encodeURIComponent(caseRef)}`);
  return data.imageData;
}

export async function saveCasePad(caseRef: string, imageData: string): Promise<void> {
  await sendJson(`/api/case-pad/${encodeURIComponent(caseRef)}`, "PUT", { imageData });
}

export async function clearCasePad(caseRef: string): Promise<void> {
  await sendJson(`/api/case-pad/${encodeURIComponent(caseRef)}`, "DELETE");
}

/* ── Auth header builder — reads credentials stored at login ─────── */
function adminAuthHeaders(withContentType = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (withContentType) headers["Content-Type"] = "application/json";
  if (typeof window !== "undefined") {
    const mobile = sessionStorage.getItem("admin_mobile");
    const key    = sessionStorage.getItem("admin_key");
    const who    = sessionStorage.getItem("admin_name");
    const role   = sessionStorage.getItem("admin_role");
    if (mobile) headers["x-admin-mobile"] = mobile;
    if (key)    headers["x-admin-key"]    = key;
    if (who)    headers["x-admin-name"]   = who;
    if (role)   headers["x-admin-role"]   = role;
  }
  return headers;
}

/* ── small fetch helpers ─────────────────────────────────────────── */
async function getJson(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { headers: adminAuthHeaders() });
  if (!res.ok) { let d: any = {}; try { d = await res.json(); } catch {} throw d.message ? d : new Error(`Server error: ${res.status}`); }
  return res.json();
}
async function sendJson(path: string, method: string, body?: any): Promise<any> {
  const headers = adminAuthHeaders(true);
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
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
  district?: string;
  state?: string;
  pincode?: string;
  country?: string;
  language?: string;
  profession?: string;
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
    city: r.city, district: r.district, state: r.state, pincode: r.pincode, country: r.country, language: r.language,
    profession: r.profession,
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
export interface DevoteeAttention {
  devoteeId: number; appointmentId?: number; attentionStatus: string;
  highlightMessage?: string; requiresFollowUp: boolean; updatedAt?: string;
}
export interface DevoteeHistory {
  devotee: Devotee;
  cases: any[];
  appointments: any[];
  remedies: any[];
  timeline: TimelineEvent[];
  bookings: any[];
  attention?: DevoteeAttention | null;
}
export async function getDevoteeHistory(id: number): Promise<DevoteeHistory> {
  const json = await getJson(`/api/devotees/${id}/history`);
  const d = json.data;
  const at = d.attention;
  return {
    devotee: mapDevotee(d.devotee),
    cases: d.cases ?? [],
    appointments: d.appointments ?? [],
    remedies: d.remedies ?? [],
    timeline: (d.timeline ?? []).map(mapTimeline),
    bookings: d.bookings ?? [],
    attention: at ? {
      devoteeId: at.devotee_id, appointmentId: at.appointment_id, attentionStatus: at.attention_status,
      highlightMessage: at.highlight_message, requiresFollowUp: at.requires_follow_up, updatedAt: at.updated_at,
    } : null,
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
   APPOINTMENTS — command center (PRD §6)
   (Pre-defined remedy library removed — Guruji writes remedies as free
    text in the Guruji Vakya panel; see GurujiVakya in trikala section.)
══════════════════════════════════════════════════════════════════ */
export interface Appointment {
  id: number; appointmentRef?: string; devoteeId?: number; caseReference?: string; bookingId?: number;
  parentAppointmentId?: number;
  devoteeName?: string; mobile?: string; appointmentType?: string; mode?: string;
  startTime?: string; endTime?: string; durationMinutes?: number; status: string;
  priority?: string; location?: string; meetingLink?: string; purpose?: string;
  outcomeNote?: string; assignedTo?: string;
  checkedInAt?: string; checkedInBy?: string; detailsVerified?: boolean;
  membersCount?: number; arrivalPhotoUrl?: string;
  officeRemarks?: string; gurujiRemarks?: string; darshanSummary?: string;
  /* lifecycle / state-machine */
  scheduleAttemptCount?: number; rescheduleCount?: number; maxAttempts?: number;
  lastScheduledAt?: string; confirmedAt?: string; confirmationMethod?: string;
  reminderSentAt?: string; darshanStartedAt?: string; completedAt?: string;
  cancelledAt?: string; cancellationReason?: string;
  noShowAt?: string; noShowReason?: string; closedAt?: string; closedReason?: string;
  createdAt?: string; updatedAt?: string;
}
function mapAppointment(r: Record<string, any>): Appointment {
  return {
    id: r.id, appointmentRef: r.appointment_ref ?? r.appointmentRef, devoteeId: r.devotee_id ?? r.devoteeId,
    caseReference: r.case_reference ?? r.caseReference, bookingId: r.booking_id ?? r.bookingId,
    parentAppointmentId: r.parent_appointment_id ?? r.parentAppointmentId,
    devoteeName: r.devotee_name ?? r.devoteeName, mobile: r.mobile,
    appointmentType: r.appointment_type ?? r.appointmentType, mode: r.mode,
    startTime: r.start_time ?? r.startTime, endTime: r.end_time ?? r.endTime,
    durationMinutes: r.duration_minutes ?? r.durationMinutes, status: r.status, priority: r.priority,
    location: r.location, meetingLink: r.meeting_link ?? r.meetingLink, purpose: r.purpose,
    outcomeNote: r.outcome_note ?? r.outcomeNote, assignedTo: r.assigned_to ?? r.assignedTo,
    checkedInAt: r.checked_in_at ?? r.checkedInAt, checkedInBy: r.checked_in_by ?? r.checkedInBy,
    detailsVerified: r.details_verified ?? r.detailsVerified,
    membersCount: r.members_count ?? r.membersCount, arrivalPhotoUrl: r.arrival_photo_url ?? r.arrivalPhotoUrl,
    officeRemarks: r.office_remarks ?? r.officeRemarks, gurujiRemarks: r.guruji_remarks ?? r.gurujiRemarks,
    darshanSummary: r.darshan_summary ?? r.darshanSummary,
    scheduleAttemptCount: r.schedule_attempt_count ?? r.scheduleAttemptCount,
    rescheduleCount: r.reschedule_count ?? r.rescheduleCount, maxAttempts: r.max_attempts ?? r.maxAttempts,
    lastScheduledAt: r.last_scheduled_at ?? r.lastScheduledAt, confirmedAt: r.confirmed_at ?? r.confirmedAt,
    confirmationMethod: r.confirmation_method ?? r.confirmationMethod,
    reminderSentAt: r.reminder_sent_at ?? r.reminderSentAt, darshanStartedAt: r.darshan_started_at ?? r.darshanStartedAt,
    completedAt: r.completed_at ?? r.completedAt,
    cancelledAt: r.cancelled_at ?? r.cancelledAt, cancellationReason: r.cancellation_reason ?? r.cancellationReason,
    noShowAt: r.no_show_at ?? r.noShowAt, noShowReason: r.no_show_reason ?? r.noShowReason,
    closedAt: r.closed_at ?? r.closedAt, closedReason: r.closed_reason ?? r.closedReason,
    createdAt: r.created_at ?? r.createdAt, updatedAt: r.updated_at ?? r.updatedAt,
  };
}
export const APPOINTMENT_TYPES = [
  "Trikala Consultation", "General Appointment", "Phone Call", "Video Call", "Temple Meeting",
  "Event Invitation", "VIP Meeting", "Follow-up", "Internal Meeting", "Travel Block", "Rest / Personal Time",
] as const;
/* Appointment Flow §3 — canonical lifecycle */
export const APPOINTMENT_STATUSES = [
  "Requested", "Scheduled", "Confirmed", "Reminder Sent",
  "Arrived", "In Darshan", "Completed", "Rescheduled", "Cancelled", "No-show", "Closed",
] as const;
/* Statuses that allow no further action (Flow §15.2) */
export const FINAL_STATUSES = ["Completed", "Closed"] as const;
/* The 3 ways a devotee meets Guruji (PRD §6) */
export const APPOINTMENT_MODES = [
  { value: "phone",     label: "Phone Call" },
  { value: "in-person", label: "Direct Meet" },
  { value: "video",     label: "Video Call (Google Meet)" },
] as const;

export async function getAppointments(opts: { status?: string; from?: string; to?: string } = {}): Promise<Appointment[]> {
  const qs = new URLSearchParams();
  if (opts.status && opts.status !== "all") qs.set("status", opts.status);
  if (opts.from) qs.set("from", opts.from);
  if (opts.to) qs.set("to", opts.to);
  const json = await getJson(`/api/appointments${qs.toString() ? "?" + qs : ""}`);
  return (json.data ?? []).map(mapAppointment);
}
/* Guruji darshan queue — everyone who checked in today, in arrival order */
export async function getArrivedQueue(): Promise<Appointment[]> {
  const json = await getJson(`/api/appointments/queue/arrived`);
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
/* Office staff: verify devotee details + photo and mark them Arrived for darshan */
export async function checkInAppointment(
  id: number,
  payload: { devotee?: Record<string, any>; verified_contact?: Record<string, any>; members_count?: number; member_names?: any[]; photo_url?: string; office_remarks?: string },
): Promise<{ appointment: Appointment; devotee: Devotee | null }> {
  const data = await sendJson(`/api/appointments/${id}/checkin`, "PATCH", payload);
  return { appointment: mapAppointment(data.data.appointment), devotee: data.data.devotee ? mapDevotee(data.data.devotee) : null };
}
/* Schedule an appointment straight from a Trikala case */
export async function convertCaseToAppointment(caseRef: string, payload: Record<string, any> = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/from-case/${encodeURIComponent(caseRef)}`, "POST", payload);
  return mapAppointment(data.data);
}

/* ── Workflow action endpoints (Flow §17.2) — the ONLY way to change status ── */
export async function scheduleAppointment(id: number, payload: { scheduled_at?: string; start_time?: string; mode?: string; appointment_type?: string; venue?: string; location?: string; purpose?: string; priority?: string; assigned_to?: string; meeting_link?: string; note?: string; notify_devotee?: boolean }): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/schedule`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function rescheduleAppointment(id: number, payload: { new_scheduled_at: string; reason: string; staff_note?: string; notify_devotee?: boolean }): Promise<{ appointment: Appointment; finalAttempt: boolean }> {
  const data = await sendJson(`/api/appointments/${id}/reschedule`, "PATCH", payload);
  const appointment = mapAppointment(data.meta?.appointment ?? data.data);
  return { appointment, finalAttempt: !!data.meta?.finalAttempt };
}
export async function confirmAppointment(id: number, payload: { confirmation_method?: string; note?: string } = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/confirm`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function sendAppointmentReminder(id: number): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/send-reminder`, "PATCH", {});
  return mapAppointment(data.data);
}
export async function startDarshan(id: number): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/start-darshan`, "PATCH", {});
  return mapAppointment(data.data);
}
export async function completeAppointment(id: number, payload: { guruji_remarks?: string; darshan_summary?: string; outcome_note?: string; book_follow_up?: boolean; follow_up?: Record<string, any> } = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/complete`, "PATCH", payload);
  return mapAppointment(data.meta?.appointment ?? data.data);
}
export async function cancelAppointment(id: number, payload: { reason: string; cancellation_source?: string; follow_up_required?: boolean; note?: string; notify_devotee?: boolean }): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/cancel`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function unholdAppointment(id: number, payload: { note?: string } = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/unhold`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function markNoShow(id: number, payload: { reason?: string; contacted?: boolean; follow_up_required?: boolean; note?: string } = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/no-show`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function closeAppointment(id: number, payload: { reason?: string } = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/close`, "PATCH", payload);
  return mapAppointment(data.data);
}
export async function bookFollowUp(id: number, payload: { scheduled_at?: string; mode?: string; appointment_type?: string; purpose?: string; notify_devotee?: boolean } = {}): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/${id}/book-follow-up`, "POST", payload);
  return mapAppointment(data.data);
}

/* ── Notes & timeline ──────────────────────────────────────────────────── */
export interface AppointmentNote {
  id: number; appointmentId: number; noteType: string; noteText: string; isPrivate: boolean; createdBy?: string; createdAt: string;
}
function mapApptNote(r: Record<string, any>): AppointmentNote {
  return { id: r.id, appointmentId: r.appointment_id, noteType: r.note_type, noteText: r.note_text, isPrivate: r.is_private, createdBy: r.created_by, createdAt: r.created_at };
}
export interface AppointmentEvent {
  id: number; eventType: string; fromStatus?: string; toStatus?: string; title: string; description?: string; createdBy?: string; createdAt: string;
}
function mapApptEvent(r: Record<string, any>): AppointmentEvent {
  return { id: r.id, eventType: r.event_type, fromStatus: r.from_status, toStatus: r.to_status, title: r.title, description: r.description, createdBy: r.created_by, createdAt: r.created_at };
}
export async function addAppointmentNote(id: number, payload: { note_text: string; note_type?: string; is_private?: boolean }): Promise<AppointmentNote> {
  const data = await sendJson(`/api/appointments/${id}/notes`, "POST", payload);
  return mapApptNote(data.data);
}
export async function getAppointmentNotes(id: number): Promise<AppointmentNote[]> {
  const json = await getJson(`/api/appointments/${id}/notes`);
  return (json.data ?? []).map(mapApptNote);
}
export async function getAppointmentTimeline(id: number): Promise<AppointmentEvent[]> {
  const json = await getJson(`/api/appointments/${id}/timeline`);
  return (json.data ?? []).map(mapApptEvent);
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
export async function convertBookingToAppointment(
  bookingId: string | number,
  params?: { start_time?: string; mode?: string; meeting_link?: string; location?: string }
): Promise<Appointment> {
  const data = await sendJson(`/api/appointments/from-booking/${bookingId}`, "POST", params || {});
  return mapAppointment(data.data);
}

/* ══════════════════════════════════════════════════════════════════
   RBAC — 8-role system (PRD §11)
══════════════════════════════════════════════════════════════════ */
export const ADMIN_ROLES = [
  { value: "superadmin", label: "Super Admin", desc: "Full access to all modules" },
  { value: "admin",      label: "Staff",        desc: "Section-based access" },
];

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

/* ══════════════════════════════════════════════════════════════════
   APP SETTINGS (PRD §2, §10) — backend-persisted key-value store
══════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════
   CONTACT → DEVOTEE conversion (PRD §8)
══════════════════════════════════════════════════════════════════ */
export async function convertContactToDevotee(
  contactId: number | string,
  phone?: string
): Promise<{ devotee: Devotee; created: boolean }> {
  const json = await sendJson(`/api/contacts/${contactId}/convert-to-devotee`, "POST", phone ? { phone } : {});
  return { devotee: mapDevotee(json.data.devotee), created: json.data.created };
}

/* ══════════════════════════════════════════════════════════════════
   DOCUMENTS (PRD §9) — track generated PDF records
══════════════════════════════════════════════════════════════════ */
export interface Document {
  id: number; relatedType?: string; relatedId?: string; documentType: string;
  title?: string; fileUrl?: string; watermark?: string; status: string;
  createdBy?: string; createdAt: string;
}
export async function getDocuments(relatedType?: string, relatedId?: string): Promise<Document[]> {
  const params = new URLSearchParams();
  if (relatedType) params.set("related_type", relatedType);
  if (relatedId)   params.set("related_id", relatedId);
  const json = await getJson(`/api/documents?${params}`);
  return (json.data ?? []).map((r: Record<string, any>) => ({
    id: r.id, relatedType: r.related_type, relatedId: r.related_id,
    documentType: r.document_type, title: r.title, fileUrl: r.file_url,
    watermark: r.watermark, status: r.status, createdBy: r.created_by, createdAt: r.created_at,
  }));
}
export async function createDocument(payload: Partial<Document>): Promise<Document> {
  const json = await sendJson("/api/documents", "POST", {
    related_type: payload.relatedType, related_id: payload.relatedId,
    document_type: payload.documentType, title: payload.title,
    file_url: payload.fileUrl, watermark: payload.watermark,
    status: payload.status, created_by: payload.createdBy,
  });
  const r = json.data;
  return { id: r.id, relatedType: r.related_type, relatedId: r.related_id,
    documentType: r.document_type, title: r.title, fileUrl: r.file_url,
    watermark: r.watermark, status: r.status, createdBy: r.created_by, createdAt: r.created_at };
}

export async function getAppSettings(): Promise<Record<string, any>> {
  try {
    const json = await getJson("/api/settings");
    return json.data ?? {};
  } catch { return {}; }
}

export async function saveAppSettings(settings: Record<string, any>): Promise<void> {
  await sendJson("/api/settings", "PATCH", settings);
}

/* ══════════════════════════════════════════════════════════════════
   REAL-TIME NOTIFICATIONS — SSE stream + recent log (PRD §10)
══════════════════════════════════════════════════════════════════ */
export interface NotificationEvent {
  id: number;
  type: string;
  template: string;
  name: string;
  phone: string;
  message: string;
  waUrl: string;
  case_reference: string | null;
  created_at: string;
}

export function subscribeNotifications(
  onEvent: (evt: NotificationEvent) => void,
  onError?: (e: Event) => void
): () => void {
  const es = new EventSource(`${BASE}/api/notifications/stream`);
  es.addEventListener("notification", (e: MessageEvent) => {
    try { onEvent(JSON.parse(e.data)); } catch (_) {}
  });
  if (onError) es.onerror = onError;
  return () => es.close();
}

export async function getRecentNotifications(): Promise<NotificationEvent[]> {
  try {
    const json = await getJson("/api/notifications/recent");
    return json.data ?? [];
  } catch { return []; }
}

export async function getWaLogs(limit = 50): Promise<any[]> {
  try {
    const json = await getJson(`/api/notifications/wa-logs?limit=${limit}`);
    return json.data ?? [];
  } catch { return []; }
}

/* ── Gallery ────────────────────────────────────────────────────── */
export interface GalleryImage {
  id: number;
  src: string;
  category: string;
  caption: string;
  captionKn: string;
  createdAt?: string;
}

function mapGalleryImage(r: Record<string, any>): GalleryImage {
  return {
    id: r.id,
    src: r.src,
    category: r.category,
    caption: r.caption ?? "",
    captionKn: r.caption_kn ?? "",
    createdAt: r.created_at,
  };
}

// Public read — no admin auth needed, used by the public /gallery page.
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const res = await fetch(`${BASE}/api/gallery`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapGalleryImage);
}

export async function createGalleryImage(payload: {
  src: string; category: string; caption?: string; captionKn?: string;
}): Promise<GalleryImage> {
  const data = await sendJson(`/api/gallery`, "POST", {
    src: payload.src,
    category: payload.category,
    caption: payload.caption ?? "",
    caption_kn: payload.captionKn ?? "",
  });
  return mapGalleryImage(data.data);
}

export async function deleteGalleryImage(id: number): Promise<void> {
  await sendJson(`/api/gallery/${id}`, "DELETE");
}

/* ── Articles ───────────────────────────────────────────────────── */
export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: number;
  slug: string;
  category: string;
  cover: string;
  title: string;
  titleKn: string;
  excerpt: string;
  excerptKn: string;
  /** HTML string from the rich-text editor. Legacy rows may be plain
   *  text with blank-line paragraph breaks — render helpers should
   *  handle both (see `articleContentHtml` below). */
  content: string;
  status: ArticleStatus;
  tags: string[];
  /** Extra images attached to the article (separate from the required
   *  `cover`), shown in a "Photo Gallery" dropdown on the public page. */
  gallery: string[];
  author: string;
  views: number;
  metaTitle: string;
  metaDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Legacy seeded rows stored content as plain text with "\n\n" between
 *  paragraphs; the editor now stores real HTML. Render either safely. */
export function articleContentHtml(content: string): string {
  if (!content) return "";
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  return content
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");
}

function mapArticle(r: Record<string, any>): Article {
  let tags: string[] = [];
  try { tags = typeof r.tags === "string" ? JSON.parse(r.tags) : (r.tags ?? []); } catch { tags = []; }
  let gallery: string[] = [];
  try { gallery = typeof r.gallery === "string" ? JSON.parse(r.gallery) : (r.gallery ?? []); } catch { gallery = []; }
  return {
    id: r.id,
    slug: r.slug,
    category: r.category,
    cover: r.cover,
    title: r.title,
    titleKn: r.title_kn ?? "",
    excerpt: r.excerpt ?? "",
    excerptKn: r.excerpt_kn ?? "",
    content: r.content ?? "",
    status: (r.status as ArticleStatus) ?? (r.published !== false ? "published" : "draft"),
    tags,
    gallery,
    author: r.author ?? "",
    views: r.views ?? 0,
    metaTitle: r.meta_title ?? "",
    metaDescription: r.meta_description ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// Public read (published only) — used by the public /articles pages.
export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${BASE}/api/articles`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const json = await res.json();
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapArticle);
}

// Admin read — every status, for the dashboard list + status tabs.
export async function getAllArticles(): Promise<Article[]> {
  const json = await getJson(`/api/articles?all=true`);
  const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return rows.map(mapArticle);
}

export interface ArticlePayload {
  title: string; titleKn?: string; category: string; cover: string;
  excerpt?: string; excerptKn?: string; content: string; status?: ArticleStatus;
  tags?: string[]; gallery?: string[]; author?: string; metaTitle?: string; metaDescription?: string;
}

function toArticleBody(payload: Partial<ArticlePayload>) {
  return {
    title: payload.title,
    title_kn: payload.titleKn ?? "",
    category: payload.category,
    cover: payload.cover,
    excerpt: payload.excerpt ?? "",
    excerpt_kn: payload.excerptKn ?? "",
    content: payload.content,
    status: payload.status ?? "draft",
    tags: payload.tags ?? [],
    gallery: payload.gallery ?? [],
    author: payload.author ?? "",
    meta_title: payload.metaTitle ?? "",
    meta_description: payload.metaDescription ?? "",
  };
}

export async function createArticle(payload: ArticlePayload): Promise<Article> {
  const data = await sendJson(`/api/articles`, "POST", toArticleBody(payload));
  return mapArticle(data.data);
}

export async function updateArticle(id: number, payload: Partial<ArticlePayload>): Promise<Article> {
  const data = await sendJson(`/api/articles/${id}`, "PATCH", toArticleBody(payload));
  return mapArticle(data.data);
}

export async function deleteArticle(id: number): Promise<void> {
  await sendJson(`/api/articles/${id}`, "DELETE");
}

export async function incrementArticleView(id: number): Promise<void> {
  try {
    await fetch(`${BASE}/api/articles/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  } catch { /* view counting is best-effort, never block the page */ }
}
