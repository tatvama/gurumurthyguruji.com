import Remedy from "../models/Remedy.js";
import Devotee from "../models/Devotee.js";
import { pool } from "../config/db.js";
import { logAudit } from "../utils/auditLog.js";
import { autoNotify } from "../utils/notifyWhatsApp.js";

/* ── Library ─────────────────────────────────────────────────────────── */
export const getLibrary = async (req, res, next) => {
  try {
    const rows = await Remedy.findAllLibrary({
      category: req.query.category, activeOnly: req.query.active === "true",
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export const createRemedy = async (req, res, next) => {
  try {
    const r = await Remedy.createLibrary(req.body);
    await logAudit({ action: "CREATE_REMEDY", entityType: "remedy", entityId: String(r.id), newValue: { name: r.name, category: r.category } });
    res.status(201).json({ success: true, data: r });
  } catch (err) { next(err); }
};

export const updateRemedy = async (req, res, next) => {
  try {
    const r = await Remedy.updateLibrary(req.params.id, req.body);
    if (!r) return res.status(404).json({ success: false, message: "Remedy not found." });
    await logAudit({ action: "UPDATE_REMEDY", entityType: "remedy", entityId: String(r.id), newValue: Object.keys(req.body) });
    res.json({ success: true, data: r });
  } catch (err) { next(err); }
};

export const deleteRemedy = async (req, res, next) => {
  try {
    await Remedy.deleteLibrary(req.params.id);
    await logAudit({ action: "DELETE_REMEDY", entityType: "remedy", entityId: req.params.id });
    res.json({ success: true });
  } catch (err) { next(err); }
};

/* ── Case assignments ────────────────────────────────────────────────── */
export const getCaseRemedies = async (req, res, next) => {
  try {
    const rows = await Remedy.findByCase(req.params.caseRef);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export const assignRemedy = async (req, res, next) => {
  try {
    const a = await Remedy.assign({ ...req.body, case_reference: req.params.caseRef });
    if (a.devotee_id) {
      await Devotee.addTimeline(a.devotee_id, {
        event_type: "remedy_assigned",
        title: `Remedy assigned: ${a.remedy_name}`,
        description: a.custom_instruction || a.category,
        related_entity_type: "case_remedy", related_entity_id: String(a.id), icon: "🕯️",
      });
    }
    await logAudit({ action: "ASSIGN_REMEDY", entityType: "case_remedy", entityId: String(a.id), newValue: { case: req.params.caseRef, remedy: a.remedy_name } });

    /* Auto-notify devotee about their remedy — fetch mobile from trikala_readings */
    try {
      const { rows } = await pool.query(
        `SELECT mobile, full_name FROM trikala_readings WHERE case_reference = $1 LIMIT 1`,
        [req.params.caseRef]
      );
      if (rows[0]?.mobile) {
        autoNotify({
          template: "remedy_assigned",
          phone: rows[0].mobile,
          name: rows[0].full_name || "Devotee",
          data: { remedy: a.remedy_name, duration: a.custom_instruction || "As advised" },
          devotee_id: a.devotee_id || null,
          case_reference: req.params.caseRef,
        }).catch(() => {});
      }
    } catch (_e) { /* best-effort */ }

    res.status(201).json({ success: true, data: a });
  } catch (err) { next(err); }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const a = await Remedy.updateAssignment(req.params.id, req.body);
    if (!a) return res.status(404).json({ success: false, message: "Assignment not found." });
    await logAudit({ action: "UPDATE_CASE_REMEDY", entityType: "case_remedy", entityId: String(a.id), newValue: req.body.status || Object.keys(req.body) });
    if (req.body.status === "Completed" && a.devotee_id) {
      await Devotee.addTimeline(a.devotee_id, {
        event_type: "remedy_completed",
        title: `Remedy completed: ${a.remedy_name}`,
        related_entity_type: "case_remedy", related_entity_id: String(a.id), icon: "✅",
      });
    }
    res.json({ success: true, data: a });
  } catch (err) { next(err); }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    await Remedy.deleteAssignment(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
