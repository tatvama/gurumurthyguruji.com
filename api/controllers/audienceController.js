import AppointmentBooking from "../models/AudienceBooking.js";
import { logAudit } from "../utils/auditLog.js";
import { pool } from "../config/db.js";

export const submitBooking = async (req, res, next) => {
  try {
    const { fullName, mobile, email, profession, city, district, state, pincode, location, howKnown, nearestAshram, message } = req.body;
    const record = await AppointmentBooking.create({
      full_name: fullName,
      mobile,
      email,
      profession,
      city,
      district,
      state,
      pincode,
      location: location || [city, district, state, pincode].filter(Boolean).join(", "),
      how_known: howKnown,
      nearest_ashram: nearestAshram,
      message,
    });
    res.status(201).json({
      success: true,
      message: "Your appointment booking request has been submitted. Guruji's team will contact you soon.",
      data: { id: record.id, created_at: record.created_at },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status || undefined;
    const rows = await AppointmentBooking.findAll({ limit, offset, status });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const record = await AppointmentBooking.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const getBookingComments = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM booking_comments WHERE booking_id = $1 ORDER BY created_at ASC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export const addBookingComment = async (req, res, next) => {
  try {
    const { text, is_internal = false } = req.body;
    if (!text?.trim()) return res.status(422).json({ success: false, message: "Comment text is required." });
    const { rows } = await pool.query(
      `INSERT INTO booking_comments (booking_id, text, is_internal) VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, text.trim(), !!is_internal]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

export const deleteBookingComment = async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM booking_comments WHERE id = $1 AND booking_id = $2`, [req.params.commentId, req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(422).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}.` });
    }
    const record = await AppointmentBooking.updateStatus(req.params.id, status);
    if (!record) return res.status(404).json({ success: false, message: "Not found." });
    await logAudit({ action: "UPDATE_BOOKING_STATUS", entityType: "appointment_booking", entityId: String(record.id), newValue: status });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
