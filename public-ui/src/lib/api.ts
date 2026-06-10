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
  profession: string;
  location: string;
  howKnown: string;
  nearestAshram: string;
  message?: string;
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
    profession:    r.profession,
    location:      r.location,
    howKnown:      r.how_known   ?? r.howKnown,
    nearestAshram: r.nearest_ashram ?? r.nearestAshram,
    message:       r.message,
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
  profession: string;
  location: string;
  howKnown: string;
  nearestAshram: string;
  message?: string;
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
