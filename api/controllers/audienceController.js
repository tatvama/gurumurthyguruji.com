import AudienceBooking from "../models/AudienceBooking.js";
import { logAudit } from "../utils/auditLog.js";

export const submitBooking = async (req, res, next) => {
  try {
    const { fullName, mobile, email, profession, city, district, state, location, howKnown, nearestAshram, message, photo } = req.body;
    const record = await AudienceBooking.create({
      full_name: fullName,
      mobile,
      email,
      profession,
      city,
      district,
      state,
      location: location || [city, district, state].filter(Boolean).join(", "),
      how_known: howKnown,
      nearest_ashram: nearestAshram,
      message,
      photo,
    });
    res.status(201).json({
      success: true,
      message: "Your request for a free audience has been submitted. Guruji's team will contact you soon.",
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
    const rows = await AudienceBooking.findAll({ limit, offset, status });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const record = await AudienceBooking.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(422).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}.` });
    }
    const record = await AudienceBooking.updateStatus(req.params.id, status);
    if (!record) return res.status(404).json({ success: false, message: "Not found." });
    await logAudit({ action: "UPDATE_BOOKING_STATUS", entityType: "audience_booking", entityId: String(record.id), newValue: status });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
