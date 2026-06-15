import { Router } from "express";
import {
  getAppointments, getAppointment, createAppointment,
  updateAppointment, deleteAppointment,
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

/* PRD §6 — 10 appointment statuses */
export const APPOINTMENT_STATUSES = [
  "Requested", "Approved", "Scheduled", "Confirmed", "Reminder Sent",
  "Completed", "No-show", "Rescheduled", "Cancelled", "Closed",
];

router.get("/", getAppointments);
router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

/* POST /from-booking/:bookingId — one-click convert audience booking → appointment (PRD §8) */
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

export default router;
