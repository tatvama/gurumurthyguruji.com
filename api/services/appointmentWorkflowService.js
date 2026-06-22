import { pool } from "../config/db.js";
import Appointment from "../models/Appointment.js";
import Devotee from "../models/Devotee.js";
import AppointmentTimeline from "../models/AppointmentTimeline.js";
import DevoteeAttention from "../models/DevoteeAttention.js";
import { logAudit } from "../utils/auditLog.js";
import { autoNotify } from "../utils/notifyWhatsApp.js";

/* ════════════════════════════════════════════════════════════════════════════
   Appointment Workflow Service — the single source of truth for every
   appointment status change (Appointment Flow §19, §34).

   All status transitions go through here so that, together and atomically:
     • the appointment row is updated
     • an appointment_timeline event is written
     • the Devotee 360 timeline is updated
     • an audit log is written
     • the Devotee 360 attention flag is raised / cleared
     • a WhatsApp notification is fired (when enabled)

   Controllers must NOT change status directly — they call these functions.
═══════════════════════════════════════════════════════════════════════════ */

/* §19.1 — allowed status transitions. "Approved" / "Rescheduled" are legacy
   statuses kept for backward-compatibility with rows created before this flow. */
export const allowedTransitions = {
  Requested:        ["Scheduled", "Confirmed", "Arrived", "Cancelled", "Closed"],
  Approved:         ["Scheduled", "Confirmed", "Arrived", "Cancelled", "No-show", "Closed"], // legacy
  Scheduled:        ["Scheduled", "Confirmed", "Reminder Sent", "Arrived", "Cancelled", "No-show", "Closed"],
  Confirmed:        ["Scheduled", "Confirmed", "Reminder Sent", "Arrived", "Cancelled", "No-show", "Closed"],
  "Reminder Sent":  ["Scheduled", "Arrived", "Cancelled", "No-show", "Closed"],
  Rescheduled:      ["Scheduled", "Confirmed", "Arrived", "Cancelled", "No-show", "Closed"], // legacy
  Arrived:          ["In Darshan", "Completed"],
  "In Darshan":     ["Completed"],
  Completed:        [],
  Cancelled:        ["Closed"],
  "No-show":        ["Closed", "Scheduled"],
  Closed:           [],
};

export const FINAL_STATUSES = ["Completed", "Closed"];

export function assertTransitionAllowed(fromStatus, toStatus) {
  if (fromStatus === toStatus) return; // idempotent no-op moves are fine
  const allowed = allowedTransitions[fromStatus] || [];
  if (!allowed.includes(toStatus)) {
    const err = new Error(`Invalid appointment status transition: ${fromStatus} → ${toStatus}.`);
    err.status = 422;
    throw err;
  }
}

/* ── internal helpers ──────────────────────────────────────────────────── */

function fmtDateTime(value) {
  if (!value) return "to be confirmed";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return String(value); }
}

async function getOr404(id) {
  const appt = await Appointment.findById(id);
  if (!appt) {
    const err = new Error("Appointment not found.");
    err.status = 404;
    throw err;
  }
  return appt;
}

/* Write the appointment timeline + the Devotee 360 timeline together */
async function logEvent(appt, { event_type, from_status, to_status, title, description, metadata, icon, actor }) {
  await AppointmentTimeline.create({
    appointment_id: appt.id,
    devotee_id: appt.devotee_id || null,
    case_reference: appt.case_reference || null,
    event_type, from_status, to_status, title,
    description, metadata_json: metadata || null,
    created_by: actor || null,
  });
  if (appt.devotee_id) {
    await Devotee.addTimeline(appt.devotee_id, {
      event_type,
      title,
      description: description || "",
      related_entity_type: "appointment",
      related_entity_id: String(appt.id),
      icon: icon || "📅",
    });
  }
}

function notify(template, appt, data = {}) {
  if (!appt.mobile) return;
  autoNotify({
    template,
    phone: appt.mobile,
    name: appt.devotee_name || "Devotee",
    data,
    devotee_id: appt.devotee_id || null,
    case_reference: appt.case_reference || null,
  }).catch(() => {});
}

/* ── 1. SCHEDULE (first assignment of date/time) ───────────────────────── */
export async function scheduleAppointment(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  const startTime = body.scheduled_at || body.start_time || body.startTime;
  if (!startTime) { const e = new Error("Date/time is required to schedule."); e.status = 422; throw e; }

  assertTransitionAllowed(appt.status, "Scheduled");

  const patch = {
    status: "Scheduled",
    start_time: new Date(startTime).toISOString(),
    last_scheduled_at: appt.start_time || null,
    scheduled_by: actor,
    schedule_attempt_count: Math.max(appt.schedule_attempt_count || 0, 1),
    mode: body.mode || appt.mode,
    appointment_type: body.appointment_type || appt.appointment_type,
    location: body.venue ?? body.location ?? appt.location,
    purpose: body.purpose ?? appt.purpose,
    priority: body.priority || appt.priority,
    assigned_to: body.assigned_to ?? body.assigned_staff ?? appt.assigned_to,
    meeting_link: body.meeting_link ?? appt.meeting_link,
  };
  const updated = await Appointment.update(id, patch);

  await logEvent(updated, {
    event_type: "appointment_scheduled", from_status: appt.status, to_status: "Scheduled",
    title: `Appointment scheduled for ${fmtDateTime(updated.start_time)}`,
    description: body.note || "", icon: "🗓️", actor,
    metadata: { scheduled_at: updated.start_time, attempt: updated.schedule_attempt_count },
  });
  await logAudit({ userName: actor, action: "SCHEDULE_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), newValue: { start_time: updated.start_time } });
  await DevoteeAttention.set({ devotee_id: updated.devotee_id, appointment_id: updated.id, attention_status: "scheduled", highlight_message: null, requires_follow_up: false });

  if (body.notify_devotee !== false) {
    notify("appointment_scheduled", updated, {
      date: fmtDateTime(updated.start_time), venue: updated.location || "Guruji Ashram",
    });
  }
  return updated;
}

/* ── 2. RESCHEDULE (max 3 total attempts) ──────────────────────────────── */
export async function rescheduleAppointment(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  const newWhen = body.new_scheduled_at || body.scheduled_at || body.start_time;
  if (!newWhen) { const e = new Error("New date/time is required."); e.status = 422; throw e; }
  if (!body.reason) { const e = new Error("Reschedule reason is required."); e.status = 422; throw e; }

  if (!["Scheduled", "Confirmed", "Reminder Sent", "Rescheduled", "Approved"].includes(appt.status)) {
    const e = new Error("Appointment cannot be rescheduled from its current status."); e.status = 422; throw e;
  }

  const maxAttempts = appt.max_attempts || 3;
  if ((appt.schedule_attempt_count || 0) >= maxAttempts) {
    await closeAppointmentLead(id, "Maximum schedule attempts completed", actor, { fromReschedule: true });
    const e = new Error(`Maximum ${maxAttempts} scheduling attempts completed. Appointment lead has been closed.`);
    e.status = 409;
    throw e;
  }

  const oldWhen = appt.start_time;
  const updated = await Appointment.update(id, {
    status: "Rescheduled",
    start_time: new Date(newWhen).toISOString(),
    last_scheduled_at: oldWhen,
    schedule_attempt_count: (appt.schedule_attempt_count || 0) + 1,
    reschedule_count: (appt.reschedule_count || 0) + 1,
    scheduled_by: actor,
  });

  await logEvent(updated, {
    event_type: "appointment_rescheduled", from_status: appt.status, to_status: "Rescheduled",
    title: `Appointment rescheduled to ${fmtDateTime(updated.start_time)}`,
    description: `From ${fmtDateTime(oldWhen)} to ${fmtDateTime(updated.start_time)}. Reason: ${body.reason}`,
    icon: "🔁", actor,
    metadata: { old_scheduled_at: oldWhen, new_scheduled_at: updated.start_time, reason: body.reason, staff_note: body.staff_note || null, attempt: updated.schedule_attempt_count },
  });
  await logAudit({ userName: actor, action: "RESCHEDULE_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), oldValue: { start_time: oldWhen }, newValue: { start_time: updated.start_time, attempt: updated.schedule_attempt_count } });

  if (body.notify_devotee !== false) {
    notify("appointment_rescheduled", updated, {
      old_date_time: fmtDateTime(oldWhen), new_date_time: fmtDateTime(updated.start_time), reason: body.reason,
    });
  }
  return { appointment: updated, finalAttempt: updated.schedule_attempt_count >= maxAttempts };
}

/* ── 3. CONFIRM ────────────────────────────────────────────────────────── */
export async function confirmAppointment(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  assertTransitionAllowed(appt.status, "Confirmed");

  const updated = await Appointment.update(id, {
    status: "Confirmed",
    confirmed_at: new Date().toISOString(),
    confirmed_by: actor,
    confirmation_method: body.confirmation_method || "manual",
  });

  await logEvent(updated, {
    event_type: "appointment_confirmed", from_status: appt.status, to_status: "Confirmed",
    title: "Devotee confirmed attendance",
    description: body.note || `Confirmed via ${updated.confirmation_method}.`, icon: "✅", actor,
    metadata: { method: updated.confirmation_method },
  });
  await logAudit({ userName: actor, action: "CONFIRM_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), newValue: { method: updated.confirmation_method } });

  /* §8.4 / §23 — reaching Confirmed clears any prior follow-up highlight */
  if (updated.devotee_id) await DevoteeAttention.clear({ devotee_id: updated.devotee_id, cleared_by_appointment_id: updated.id });

  return updated;
}

/* ── 4. SEND REMINDER ──────────────────────────────────────────────────── */
export async function sendReminder(id, body = {}, actor = "system") {
  const appt = await getOr404(id);
  assertTransitionAllowed(appt.status, "Reminder Sent");

  const updated = await Appointment.update(id, {
    status: "Reminder Sent",
    reminder_sent_at: new Date().toISOString(),
    reminder_failed: false,
    reminder_failure_reason: null,
  });

  await logEvent(updated, {
    event_type: "appointment_reminder_sent", from_status: appt.status, to_status: "Reminder Sent",
    title: "Appointment reminder sent", description: "Reminder sent to devotee via WhatsApp.", icon: "🔔", actor,
  });
  await logAudit({ userName: actor, action: "SEND_APPOINTMENT_REMINDER", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id) });

  notify("appointment_reminder", updated, {
    date: updated.start_time ? fmtDateTime(updated.start_time) : "To be confirmed",
    time: updated.start_time ? new Date(updated.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—",
    location: updated.location || "Guruji Ashram",
  });
  return updated;
}

/* ── 5. CHECK-IN (office staff verify + mark Arrived) ──────────────────── */
export async function checkInAppointment(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  if (FINAL_STATUSES.includes(appt.status) || ["Arrived", "In Darshan", "Cancelled", "No-show"].includes(appt.status)) {
    const e = new Error("This appointment cannot be checked in from its current status."); e.status = 422; throw e;
  }

  const vc = body.verified_contact || body.devotee || {};
  const photo = body.photo_url || vc.photo || null;
  const membersCount = parseInt(body.members_count) || 1;

  const updated = await Appointment.update(id, {
    status: "Arrived",
    checked_in_at: new Date().toISOString(),
    checked_in_by: actor,
    details_verified: true,
    members_count: membersCount,
    arrival_photo_url: photo,
    office_remarks: body.office_remarks ?? appt.office_remarks ?? null,
  });

  /* Snapshot of the arrival verification */
  await pool.query(
    `INSERT INTO appointment_checkins
       (appointment_id, devotee_id, photo_url, members_count, member_names,
        contact_verified, address_verified, details_verified,
        verified_name, verified_phone, verified_whatsapp, verified_email,
        verified_city, verified_district, verified_state, verified_pincode, verified_address,
        office_remarks, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
    [
      updated.id, updated.devotee_id || null, photo, membersCount,
      body.member_names ? JSON.stringify(body.member_names) : null,
      true, !!(vc.city || vc.state || vc.address), true,
      vc.name || null, vc.phone || null, vc.whatsapp || null, vc.email || null,
      vc.city || null, vc.district || null, vc.state || null, vc.pincode || null, vc.address || null,
      body.office_remarks || null, actor,
    ]
  );

  /* Update the linked Devotee 360 record with verified details + photo */
  let devotee = null;
  if (updated.devotee_id) {
    const patch = {};
    for (const k of ["name", "phone", "whatsapp", "email", "city", "district", "state", "pincode"]) {
      if (vc[k] !== undefined && vc[k] !== null && vc[k] !== "") patch[k] = vc[k];
    }
    if (photo) patch.photo = photo;
    if (Object.keys(patch).length) devotee = await Devotee.update(updated.devotee_id, patch);
  }

  await logEvent(updated, {
    event_type: "appointment_arrived", from_status: appt.status, to_status: "Arrived",
    title: "Devotee arrived for darshan — details verified",
    description: `${membersCount} member${membersCount > 1 ? "s" : ""} arrived.${body.office_remarks ? ` ${body.office_remarks}` : ""}`,
    icon: "🙏", actor,
    metadata: { members_count: membersCount, verified: true },
  });
  await logAudit({ userName: actor, action: "CHECKIN_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), newValue: { verified: true, members: membersCount } });

  return { appointment: updated, devotee };
}

/* ── 6. START DARSHAN ──────────────────────────────────────────────────── */
export async function startDarshan(id, actor = "Guruji") {
  const appt = await getOr404(id);
  assertTransitionAllowed(appt.status, "In Darshan");

  const updated = await Appointment.update(id, {
    status: "In Darshan",
    darshan_started_at: new Date().toISOString(),
  });
  await logEvent(updated, {
    event_type: "darshan_started", from_status: appt.status, to_status: "In Darshan",
    title: "Darshan session started", description: "", icon: "🪔", actor,
  });
  await logAudit({ userName: actor, action: "START_DARSHAN", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id) });
  return updated;
}

/* ── 7. COMPLETE (+ optional follow-up booking) ────────────────────────── */
export async function completeAppointment(id, body = {}, actor = "Guruji") {
  const appt = await getOr404(id);
  if (!["Arrived", "In Darshan"].includes(appt.status)) {
    const e = new Error("Only arrived / in-darshan appointments can be completed."); e.status = 422; throw e;
  }

  const updated = await Appointment.update(id, {
    status: "Completed",
    completed_at: new Date().toISOString(),
    completed_by: actor,
    guruji_remarks: body.guruji_remarks ?? appt.guruji_remarks ?? null,
    darshan_summary: body.darshan_summary ?? appt.darshan_summary ?? null,
    outcome_note: body.outcome_note ?? appt.outcome_note ?? null,
  });

  await logEvent(updated, {
    event_type: "appointment_completed", from_status: appt.status, to_status: "Completed",
    title: "Darshan completed — Guruji remarks saved",
    description: body.darshan_summary || body.guruji_remarks || updated.outcome_note || "", icon: "✅", actor,
  });
  await logAudit({ userName: actor, action: "COMPLETE_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id) });

  if (updated.devotee_id) {
    await DevoteeAttention.set({ devotee_id: updated.devotee_id, appointment_id: updated.id, attention_status: "completed", highlight_message: null, requires_follow_up: false });
  }

  let followUp = null;
  if (body.book_follow_up && body.follow_up) {
    followUp = await bookFollowUp(id, body.follow_up, actor);
  }
  return { appointment: updated, followUp };
}

/* ── 8. CANCEL ─────────────────────────────────────────────────────────── */
export async function cancelAppointment(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  assertTransitionAllowed(appt.status, "Cancelled");

  const updated = await Appointment.update(id, {
    status: "Cancelled",
    cancelled_at: new Date().toISOString(),
    cancelled_by: actor,
    cancellation_reason: body.reason || "Cancelled",
    cancellation_source: body.cancellation_source || "staff",
  });

  await logEvent(updated, {
    event_type: "appointment_cancelled", from_status: appt.status, to_status: "Cancelled",
    title: "Appointment cancelled", description: `Reason: ${updated.cancellation_reason}`, icon: "🚫", actor,
    metadata: { source: updated.cancellation_source, follow_up_required: !!body.follow_up_required },
  });
  await logAudit({ userName: actor, action: "CANCEL_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), newValue: { reason: updated.cancellation_reason } });

  if (updated.devotee_id && body.follow_up_required) {
    await DevoteeAttention.set({
      devotee_id: updated.devotee_id, appointment_id: updated.id,
      attention_status: "cancelled_follow_up_required",
      highlight_message: "Cancelled appointment. Follow-up required until next confirmed appointment.",
      requires_follow_up: true,
    });
  }
  /* Notification on cancel removed per requirement — no WhatsApp/devotee alert. */
  return updated;
}

/* ── 9. NO-SHOW ────────────────────────────────────────────────────────── */
export async function markNoShow(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  assertTransitionAllowed(appt.status, "No-show");

  const updated = await Appointment.update(id, {
    status: "No-show",
    no_show_at: new Date().toISOString(),
    no_show_marked_by: actor,
    no_show_reason: body.reason || null,
  });

  await logEvent(updated, {
    event_type: "appointment_no_show", from_status: appt.status, to_status: "No-show",
    title: "Devotee did not arrive", description: body.reason || "", icon: "⚠️", actor,
    metadata: { contacted: !!body.contacted, follow_up_required: !!body.follow_up_required },
  });
  await logAudit({ userName: actor, action: "MARK_NO_SHOW", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id) });

  if (updated.devotee_id && body.follow_up_required !== false) {
    await DevoteeAttention.set({
      devotee_id: updated.devotee_id, appointment_id: updated.id,
      attention_status: "no_show_follow_up_required",
      highlight_message: "Missed appointment (no-show). Follow-up required until next confirmed appointment.",
      requires_follow_up: true,
    });
  }
  notify("no_show_followup", updated, { date: fmtDateTime(updated.start_time) });

  /* §14.6 — a no-show after max attempts closes the lead */
  let closed = null;
  if ((updated.schedule_attempt_count || 0) >= (updated.max_attempts || 3)) {
    closed = await closeAppointmentLead(id, "Maximum attempts completed after no-show", actor);
  }
  return closed || updated;
}

/* ── 10. UNHOLD (release time slot → back to Requested) ────────────────── */
export async function unholdAppointment(id, body = {}, actor = "Office Staff") {
  const appt = await getOr404(id);
  if (!["Scheduled", "Confirmed", "Reminder Sent"].includes(appt.status)) {
    const e = new Error("Appointment can only be unheld from Scheduled, Confirmed, or Reminder Sent status.");
    e.status = 422; throw e;
  }

  const updated = await Appointment.update(id, {
    status: "Requested",
    start_time: null,
    scheduled_by: null,
    confirmed_at: null,
    confirmed_by: null,
    reminder_sent_at: null,
  });

  await logEvent(updated, {
    event_type: "appointment_unhold", from_status: appt.status, to_status: "Requested",
    title: "Appointment unheld — time slot released",
    description: body.note || "Appointment returned to requested status; slot released.",
    icon: "🔓", actor,
    metadata: { previous_status: appt.status, previous_start_time: appt.start_time },
  });
  await logAudit({ userName: actor, action: "UNHOLD_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), oldValue: { status: appt.status, start_time: appt.start_time }, newValue: { status: "Requested" } });

  return updated;
}

/* ── 11. CLOSE LEAD ────────────────────────────────────────────────────── */
export async function closeAppointmentLead(id, reason, actor = "system", opts = {}) {
  const appt = await getOr404(id);
  if (appt.status === "Closed") return appt;

  const updated = await Appointment.update(id, {
    status: "Closed",
    closed_at: new Date().toISOString(),
    closed_by: actor,
    closed_reason: reason || "Closed",
  });

  await logEvent(updated, {
    event_type: "appointment_closed", from_status: appt.status, to_status: "Closed",
    title: "Appointment lead closed", description: updated.closed_reason, icon: "🔒", actor,
    metadata: { reason: updated.closed_reason },
  });
  await logAudit({ userName: actor, action: "CLOSE_APPOINTMENT", entityType: "appointment", entityId: updated.appointment_ref || String(updated.id), newValue: { reason: updated.closed_reason } });

  /* Highlight in Devotee 360 if no confirmed future appointment exists */
  if (updated.devotee_id) {
    const { rows } = await pool.query(
      `SELECT 1 FROM appointments
        WHERE devotee_id = $1 AND id <> $2
          AND status IN ('Confirmed','Reminder Sent','Arrived','In Darshan')
        LIMIT 1`,
      [updated.devotee_id, updated.id]
    );
    if (!rows.length) {
      await DevoteeAttention.set({
        devotee_id: updated.devotee_id, appointment_id: updated.id,
        attention_status: "closed_without_darshan",
        highlight_message: opts.fromReschedule
          ? "Previous appointment lead closed after maximum scheduling attempts. No confirmed appointment currently exists."
          : "Previous appointment lead closed. No confirmed appointment currently exists.",
        requires_follow_up: true,
      });
    }
  }
  return updated;
}

/* ── 11. BOOK FOLLOW-UP (child appointment) ────────────────────────────── */
export async function bookFollowUp(parentId, body = {}, actor = "Guruji") {
  const parent = await getOr404(parentId);
  const startTime = body.scheduled_at || body.start_time || body.startTime;
  const status = startTime ? "Scheduled" : "Requested";

  const child = await Appointment.create({
    devotee_id: parent.devotee_id || null,
    devotee_name: parent.devotee_name,
    mobile: parent.mobile,
    case_reference: parent.case_reference || null,
    parent_appointment_id: parent.id,
    appointment_type: body.appointment_type || "Follow-up",
    mode: body.mode || parent.mode || "in-person",
    status,
    priority: body.priority || parent.priority || "Normal",
    start_time: startTime ? new Date(startTime).toISOString() : null,
    location: body.venue ?? body.location ?? parent.location ?? "Guruji Ashram",
    purpose: body.purpose || "Follow-up appointment",
  });

  await logEvent(child, {
    event_type: "follow_up_booked", from_status: null, to_status: status,
    title: `Follow-up appointment created${startTime ? ` for ${fmtDateTime(startTime)}` : ""}`,
    description: `Booked from ${parent.appointment_ref || `#${parent.id}`}.`, icon: "📌", actor,
    metadata: { parent_appointment_id: parent.id },
  });
  await logEvent(parent, {
    event_type: "follow_up_booked", from_status: parent.status, to_status: parent.status,
    title: "Follow-up appointment booked", description: child.appointment_ref || `#${child.id}`, icon: "📌", actor,
  });
  await logAudit({ userName: actor, action: "BOOK_FOLLOW_UP", entityType: "appointment", entityId: child.appointment_ref || String(child.id), newValue: { parent: parent.appointment_ref || parent.id } });

  if (status === "Scheduled" && body.notify_devotee !== false) {
    notify("appointment_scheduled", child, { date: fmtDateTime(child.start_time), venue: child.location || "Guruji Ashram" });
  }
  return child;
}
