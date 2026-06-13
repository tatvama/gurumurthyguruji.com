import Appointment from "../models/Appointment.js";
import Devotee from "../models/Devotee.js";

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
    if (a.devotee_id) {
      await Devotee.addTimeline(a.devotee_id, {
        event_type: "appointment_created",
        title: `${a.appointment_type} scheduled`,
        description: a.start_time ? new Date(a.start_time).toLocaleString("en-IN") : "Slot to be fixed",
        related_entity_type: "appointment", related_entity_id: String(a.id), icon: "📅",
      });
    }
    res.status(201).json({ success: true, data: a });
  } catch (err) { next(err); }
};

/* PATCH /api/appointments/:id — update / status flow / outcome capture */
export const updateAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.update(req.params.id, req.body);
    if (!a) return res.status(404).json({ success: false, message: "Appointment not found." });
    if (req.body.status === "Completed" && a.devotee_id) {
      await Devotee.addTimeline(a.devotee_id, {
        event_type: "appointment_completed",
        title: `${a.appointment_type} completed`,
        description: a.outcome_note || "",
        related_entity_type: "appointment", related_entity_id: String(a.id), icon: "✅",
      });
    }
    res.json({ success: true, data: a });
  } catch (err) { next(err); }
};

/* DELETE /api/appointments/:id */
export const deleteAppointment = async (req, res, next) => {
  try {
    await Appointment.remove(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
