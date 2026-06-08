const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
