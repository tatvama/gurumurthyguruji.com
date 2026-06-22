import Appointment from "../models/Appointment.js";
import Devotee from "../models/Devotee.js";
import AppointmentTimeline from "../models/AppointmentTimeline.js";
import AppointmentNote from "../models/AppointmentNote.js";
import DevoteeAttention from "../models/DevoteeAttention.js";
import { logAudit } from "../utils/auditLog.js";
import { autoNotify } from "../utils/notifyWhatsApp.js";
import * as wf from "../services/appointmentWorkflowService.js";

const VALID_STATUSES = [
  "Requested", "Approved", "Scheduled", "Confirmed", "Reminder Sent",
  "Arrived", "In Darshan", "Completed", "No-show", "Rescheduled", "Cancelled", "Closed",
];

/* Fields a generic PATCH /:id may edit. Status is NOT here — status changes
   must go through the workflow action endpoints (Flow §17.2, §34). */
const EDITABLE_FIELDS = [
  "devotee_name", "mobile", "appointment_type", "mode", "start_time", "end_time",
  "duration_minutes", "priority", "location", "meeting_link", "purpose",
  "outcome_note", "assigned_to", "guruji_remarks", "office_remarks",
];

/* Resolve the acting staff/guruji name (+ role) from the authenticated request.
   Format: "Name (role)" so the timeline can show who did each action and in
   what capacity. Falls back gracefully when role/name are unavailable. */
const getActor = (req) => {
  const name =
    req.user?.name || req.body?.actor || req.headers["x-admin-name"] || req.query?.actor || "Office Staff";
  const role = req.user?.role || req.headers["x-admin-role"];
  return role ? `${name} (${role})` : name;
};

/* GET /api/appointments — list with status / date-range filters */
export const getAppointments = async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 300, 500);
    const offset = parseInt(req.query.offset) || 0;
    const rows = await Appointment.findAll({
      limit, offset,
      status: req.query.status || undefined,
      from: req.query.from || undefined,
      to: req.query.to || undefined,
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

/* GET /api/appointments/:id */
export const getAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.findById(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: "Appointment not found." });
    res.json({ success: true, data: a });
  } catch (err) { next(err); }
};

/* POST /api/appointments — create (PRD §6 booking flow) */
export const createAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.create(req.body);
    await AppointmentTimeline.create({
      appointment_id: a.id, devotee_id: a.devotee_id || null, case_reference: a.case_reference || null,
      event_type: "appointment_created", to_status: a.status,
      title: `${a.appointment_type} created`,
      description: a.start_time ? new Date(a.start_time).toLocaleString("en-IN") : "Awaiting staff scheduling.",
      created_by: getActor(req),
    });
    if (a.devotee_id) {
      await Devotee.addTimeline(a.devotee_id, {
        event_type: "appointment_created",
        title: `${a.appointment_type} scheduled`,
        description: a.start_time ? new Date(a.start_time).toLocaleString("en-IN") : "Slot to be fixed",
        related_entity_type: "appointment", related_entity_id: String(a.id), icon: "📅",
      });
      /* New active request flags the devotee until it progresses */
      if (a.status === "Requested") {
        await DevoteeAttention.set({ devotee_id: a.devotee_id, appointment_id: a.id, attention_status: "active_requested", highlight_message: null, requires_follow_up: false }).catch(() => {});
      }
    }
    await logAudit({ userName: getActor(req), action: "CREATE_APPOINTMENT", entityType: "appointment", entityId: a.appointment_ref || String(a.id), newValue: { type: a.appointment_type, status: a.status } });

    /* Auto-notify devotee on WhatsApp */
    if (a.mobile) {
      const dt = a.start_time ? new Date(a.start_time) : null;
      autoNotify({
        template: "appointment_reminder",
        phone: a.mobile,
        name: a.devotee_name || "Devotee",
        data: {
          date: dt ? dt.toLocaleDateString("en-IN") : "To be confirmed",
          time: dt ? dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—",
          location: a.location || "Guruji Ashram",
        },
        devotee_id: a.devotee_id || null,
        case_reference: a.case_reference || null,
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: a });
  } catch (err) { next(err); }
};

/* PATCH /api/appointments/:id — edit non-status fields only */
export const updateAppointment = async (req, res, next) => {
  try {
    if ("status" in req.body) {
      return res.status(422).json({ success: false, message: "Status changes must use a workflow action (schedule, confirm, check-in, complete, cancel, …)." });
    }
    const patch = {};
    for (const k of EDITABLE_FIELDS) if (k in req.body) patch[k] = req.body[k];
    const a = await Appointment.update(req.params.id, patch);
    if (!a) return res.status(404).json({ success: false, message: "Appointment not found." });
    await logAudit({ userName: getActor(req), action: "UPDATE_APPOINTMENT", entityType: "appointment", entityId: a.appointment_ref || String(a.id), newValue: Object.keys(patch) });
    res.json({ success: true, data: a });
  } catch (err) { next(err); }
};

/* DELETE /api/appointments/:id */
export const deleteAppointment = async (req, res, next) => {
  try {
    await Appointment.remove(req.params.id);
    await logAudit({ userName: getActor(req), action: "DELETE_APPOINTMENT", entityType: "appointment", entityId: req.params.id });
    res.json({ success: true });
  } catch (err) { next(err); }
};

/* GET /api/appointments/queue/arrived — Guruji darshan queue */
export const getArrivedToday = async (_req, res, next) => {
  try {
    const rows = await Appointment.findCheckedInToday();
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

/* ── Workflow action endpoints (Flow §17.2) ────────────────────────────── */
/* Each wraps a workflow-service function; the service enforces transitions,
   writes the timeline + audit + attention flag, and fires notifications. */
const action = (fn, key) => async (req, res, next) => {
  try {
    const result = await fn(req.params.id, req.body || {}, getActor(req));
    res.json({ success: true, data: result?.appointment ? result.appointment : result, meta: result?.appointment ? result : undefined });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

export const scheduleAppointment  = action(wf.scheduleAppointment);
export const rescheduleAppointment = action(wf.rescheduleAppointment);
export const confirmAppointment    = action(wf.confirmAppointment);
export const sendReminder          = action(wf.sendReminder);
export const startDarshan          = action(wf.startDarshan);
export const completeAppointment   = action(wf.completeAppointment);
export const cancelAppointment     = action(wf.cancelAppointment);
export const markNoShow            = action(wf.markNoShow);
export const unholdAppointment     = action(wf.unholdAppointment);

export const closeAppointment = async (req, res, next) => {
  try {
    const result = await wf.closeAppointmentLead(req.params.id, req.body?.reason || "Closed by staff", getActor(req));
    res.json({ success: true, data: result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

export const bookFollowUp = async (req, res, next) => {
  try {
    const child = await wf.bookFollowUp(req.params.id, req.body || {}, getActor(req));
    res.status(201).json({ success: true, data: child });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

/* PATCH /api/appointments/:id/checkin — office staff verify + mark Arrived */
export const checkInAppointment = async (req, res, next) => {
  try {
    const result = await wf.checkInAppointment(req.params.id, req.body || {}, getActor(req));
    res.json({ success: true, data: result });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
};

/* ── Notes & timeline ──────────────────────────────────────────────────── */
export const addNote = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found." });
    const note = await AppointmentNote.create({
      appointment_id: appt.id, devotee_id: appt.devotee_id || null,
      note_type: req.body.note_type, note_text: req.body.note_text,
      is_private: req.body.is_private, created_by: getActor(req),
    });
    await AppointmentTimeline.create({
      appointment_id: appt.id, devotee_id: appt.devotee_id || null,
      event_type: "note_added", title: `${note.note_type} note added`,
      description: note.note_text, created_by: getActor(req),
    });
    await logAudit({ userName: getActor(req), action: "ADD_APPOINTMENT_NOTE", entityType: "appointment", entityId: appt.appointment_ref || String(appt.id) });
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
};

export const getNotes = async (req, res, next) => {
  try {
    const rows = await AppointmentNote.listByAppointment(req.params.id);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export const getTimeline = async (req, res, next) => {
  try {
    const rows = await AppointmentTimeline.listByAppointment(req.params.id);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export { VALID_STATUSES };
