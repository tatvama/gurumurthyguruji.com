import { Router } from "express";
import {
  getAppointments, getAppointment, createAppointment,
  updateAppointment, deleteAppointment, getArrivedToday, checkInAppointment,
  scheduleAppointment, rescheduleAppointment, confirmAppointment, sendReminder,
  startDarshan, completeAppointment, cancelAppointment, markNoShow, closeAppointment,
  bookFollowUp, addNote, getNotes, getTimeline,
} from "../controllers/appointmentController.js";
import Appointment from "../models/Appointment.js";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");
const GURUJI_SUPER = requireRole("guruji", "superadmin");

const router = Router();

/* PRD §6 — 11 appointment types */
export const APPOINTMENT_TYPES = [
  "Trikala Consultation", "General Audience", "Phone Call", "Video Call",
  "Temple Meeting", "Event Invitation", "VIP Meeting", "Follow-up",
  "Internal Meeting", "Travel Block", "Rest / Personal Time",
];

/* Appointment Flow §3 — canonical lifecycle statuses
   (Approved / Rescheduled kept as legacy values for old rows) */
export const APPOINTMENT_STATUSES = [
  "Requested", "Scheduled", "Confirmed", "Reminder Sent",
  "Arrived", "In Darshan", "Completed", "Cancelled", "No-show", "Closed",
];

/* Static / collection routes BEFORE "/:id" so they aren't shadowed */
router.get("/queue/arrived", ALL_ADMIN, getArrivedToday);
router.get("/",              ALL_ADMIN, getAppointments);
router.post("/",             ADMIN_SUPER, createAppointment);

router.get("/:id",    ALL_ADMIN,   getAppointment);
router.patch("/:id",  ADMIN_SUPER, updateAppointment);
router.delete("/:id", ADMIN_SUPER, deleteAppointment);

/* ── Workflow action endpoints (Flow §17.2) — status changes only here ── */
router.patch("/:id/schedule",      ADMIN_SUPER,  scheduleAppointment);
router.patch("/:id/reschedule",    ADMIN_SUPER,  rescheduleAppointment);
router.patch("/:id/confirm",       ADMIN_SUPER,  confirmAppointment);
router.patch("/:id/send-reminder", ADMIN_SUPER,  sendReminder);
router.patch("/:id/checkin",       ADMIN_SUPER,  checkInAppointment);
router.patch("/:id/start-darshan", GURUJI_SUPER, startDarshan);
router.patch("/:id/complete",      GURUJI_SUPER, completeAppointment);
router.patch("/:id/cancel",        ADMIN_SUPER,  cancelAppointment);
router.patch("/:id/no-show",       ADMIN_SUPER,  markNoShow);
router.patch("/:id/close",         ADMIN_SUPER,  closeAppointment);
router.post("/:id/book-follow-up", ALL_ADMIN,    bookFollowUp);

/* ── Notes & timeline ──────────────────────────────────────────────────── */
router.post("/:id/notes",   ALL_ADMIN, addNote);
router.get("/:id/notes",    ALL_ADMIN, getNotes);
router.get("/:id/timeline", ALL_ADMIN, getTimeline);

/* POST /from-booking/:bookingId — one-click convert Appointment booking → appointment (PRD §8) */
router.post("/from-booking/:bookingId", ADMIN_SUPER, async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM appointment_bookings WHERE id = $1`, [req.params.bookingId]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Booking not found" });
    const b = rows[0];
    /* Guard: don't create a duplicate if one already exists for this booking */
    const { rows: existing } = await pool.query(
      `SELECT id FROM appointments WHERE booking_id = $1 LIMIT 1`, [b.id]
    );
    if (existing.length) {
      return res.status(409).json({ success: false, message: "Appointment already exists for this booking", appointmentId: existing[0].id });
    }
    const appt = await Appointment.create({
      booking_id:       b.id,
      devotee_id:       b.devotee_id || null,
      devotee_name:     b.full_name,
      mobile:           b.mobile,
      appointment_type: "General Audience",
      mode:             req.body.mode || "in-person",
      status:           req.body.start_time ? "Scheduled" : "Requested",
      priority:         "Normal",
      start_time:       req.body.start_time || null,
      location:         b.nearest_ashram || "",
      meeting_link:     req.body.meeting_link || null,
      purpose:          b.message || "",
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
});

/* POST /from-case/:caseRef — schedule an appointment for a Trikala case (PRD §6) */
router.post("/from-case/:caseRef", ADMIN_SUPER, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM trikala_readings WHERE case_reference = $1`, [req.params.caseRef]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Case not found" });
    const c = rows[0];
    const appt = await Appointment.create({
      case_reference:   c.case_reference,
      devotee_id:       c.devotee_id || null,
      devotee_name:     c.full_name,
      mobile:           c.mobile,
      appointment_type: "Trikala Consultation",
      mode:             req.body.mode || "in-person",
      status:           req.body.start_time ? "Scheduled" : "Requested",
      priority:         c.priority || "Normal",
      start_time:       req.body.start_time || null,
      location:         req.body.location || "Guruji Ashram",
      purpose:          (c.guidance_query || "").slice(0, 280),
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
});

export default router;
