import { Router } from "express";
import {
  getAppointments, getAppointment, createAppointment,
  updateAppointment, deleteAppointment, getArrivedToday, checkInAppointment,
} from "../controllers/appointmentController.js";
import Appointment from "../models/Appointment.js";
import { pool } from "../config/db.js";

const router = Router();

/* PRD §6 — 11 appointment types */
export const APPOINTMENT_TYPES = [
  "Trikala Consultation", "General Audience", "Phone Call", "Video Call",
  "Temple Meeting", "Event Invitation", "VIP Meeting", "Follow-up",
  "Internal Meeting", "Travel Block", "Rest / Personal Time",
];

/* PRD §6 — appointment statuses (Arrived = office check-in before darshan) */
export const APPOINTMENT_STATUSES = [
  "Requested", "Approved", "Scheduled", "Confirmed", "Reminder Sent",
  "Arrived", "Completed", "No-show", "Rescheduled", "Cancelled", "Closed",
];

/* Static / collection routes BEFORE "/:id" so they aren't shadowed */
router.get("/queue/arrived", getArrivedToday);
router.get("/", getAppointments);
router.post("/", createAppointment);
router.get("/:id", getAppointment);
router.patch("/:id/checkin", checkInAppointment);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

/* POST /from-booking/:bookingId — one-click convert Appointment booking → appointment (PRD §8) */
router.post("/from-booking/:bookingId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM audience_bookings WHERE id = $1`, [req.params.bookingId]);
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
      mode:             "in-person",
      status:           "Requested",
      priority:         "Normal",
      location:         b.nearest_ashram || "",
      purpose:          b.message || "",
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
});

/* POST /from-case/:caseRef — schedule an appointment for a Trikala case (PRD §6) */
router.post("/from-case/:caseRef", async (req, res, next) => {
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
      status:           "Scheduled",
      priority:         c.priority || "Normal",
      start_time:       req.body.start_time || null,
      location:         req.body.location || "Guruji Ashram",
      purpose:          (c.guidance_query || "").slice(0, 280),
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
});

export default router;
