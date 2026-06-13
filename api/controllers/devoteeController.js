import Devotee from "../models/Devotee.js";
import { pool } from "../config/db.js";

/* GET /api/devotees — directory list (search + relationship filter) */
export const getDevotees = async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 300, 500);
    const offset = parseInt(req.query.offset) || 0;
    const rows = await Devotee.findAll({
      limit, offset,
      search: req.query.search || undefined,
      relationship: req.query.relationship || undefined,
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

/* GET /api/devotees/:id — single profile */
export const getDevotee = async (req, res, next) => {
  try {
    const d = await Devotee.findById(req.params.id);
    if (!d) return res.status(404).json({ success: false, message: "Devotee not found." });
    res.json({ success: true, data: d });
  } catch (err) { next(err); }
};

/* GET /api/devotees/:id/history — full 360 history (PRD §7, §8) */
export const getDevoteeHistory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const d = await Devotee.findById(id);
    if (!d) return res.status(404).json({ success: false, message: "Devotee not found." });

    const [cases, appts, remedies, timeline, bookings] = await Promise.all([
      pool.query(`SELECT id, case_reference, service_type, problem_category, status, priority, created_at
                  FROM trikala_readings WHERE devotee_id = $1 ORDER BY created_at DESC`, [id]),
      pool.query(`SELECT id, appointment_ref, appointment_type, status, start_time, mode, outcome_note
                  FROM appointments WHERE devotee_id = $1 ORDER BY start_time DESC NULLS LAST`, [id]),
      pool.query(`SELECT id, remedy_name, category, status, start_date, end_date, case_reference
                  FROM case_remedies WHERE devotee_id = $1 ORDER BY created_at DESC`, [id]),
      Devotee.getTimeline(id),
      pool.query(`SELECT id, nearest_ashram, location, status, created_at
                  FROM audience_bookings WHERE devotee_id = $1 ORDER BY created_at DESC`, [id]),
    ]);

    res.json({
      success: true,
      data: {
        devotee:  d,
        cases:    cases.rows,
        appointments: appts.rows,
        remedies: remedies.rows,
        timeline,
        bookings: bookings.rows,
      },
    });
  } catch (err) { next(err); }
};

/* POST /api/devotees/check-duplicate — duplicate detection (PRD §12-C) */
export const checkDuplicate = async (req, res, next) => {
  try {
    const { phone, whatsapp, email, name, city } = req.body;
    const matches = await Devotee.findDuplicates({ phone, whatsapp, email, name, city });
    res.json({ success: true, data: matches });
  } catch (err) { next(err); }
};

/* POST /api/devotees — create (warns on duplicate unless force=true) */
export const createDevotee = async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.force) {
      const dupes = await Devotee.findDuplicates({
        phone: b.phone, whatsapp: b.whatsapp, email: b.email, name: b.name, city: b.city,
      });
      if (dupes.length) {
        return res.status(409).json({
          success: false,
          message: `This person may already exist as ${dupes[0].devotee_ref}.`,
          duplicates: dupes,
        });
      }
    }
    const d = await Devotee.create(b);
    await Devotee.addTimeline(d.id, {
      event_type: "profile_created", title: "Devotee profile created",
      description: `${d.name} added to Devotee 360 directory`, icon: "🙏",
    });
    res.status(201).json({ success: true, data: d });
  } catch (err) { next(err); }
};

/* PATCH /api/devotees/:id — update */
export const updateDevotee = async (req, res, next) => {
  try {
    const d = await Devotee.update(req.params.id, req.body);
    if (!d) return res.status(404).json({ success: false, message: "Devotee not found." });
    res.json({ success: true, data: d });
  } catch (err) { next(err); }
};

/* GET /api/devotees/:id/timeline */
export const getTimeline = async (req, res, next) => {
  try {
    const rows = await Devotee.getTimeline(req.params.id);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

/* POST /api/devotees/:id/timeline — add a manual timeline event */
export const addTimelineEvent = async (req, res, next) => {
  try {
    const ev = await Devotee.addTimeline(req.params.id, req.body);
    res.status(201).json({ success: true, data: ev });
  } catch (err) { next(err); }
};
