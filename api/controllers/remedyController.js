import Remedy from "../models/Remedy.js";
import Devotee from "../models/Devotee.js";

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
    res.status(201).json({ success: true, data: r });
  } catch (err) { next(err); }
};

export const updateRemedy = async (req, res, next) => {
  try {
    const r = await Remedy.updateLibrary(req.params.id, req.body);
    if (!r) return res.status(404).json({ success: false, message: "Remedy not found." });
    res.json({ success: true, data: r });
  } catch (err) { next(err); }
};

export const deleteRemedy = async (req, res, next) => {
  try {
    await Remedy.deleteLibrary(req.params.id);
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
    // Record on the devotee timeline (PRD §7)
    if (a.devotee_id) {
      await Devotee.addTimeline(a.devotee_id, {
        event_type: "remedy_assigned",
        title: `Remedy assigned: ${a.remedy_name}`,
        description: a.custom_instruction || a.category,
        related_entity_type: "case_remedy", related_entity_id: String(a.id), icon: "🕯️",
      });
    }
    res.status(201).json({ success: true, data: a });
  } catch (err) { next(err); }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const a = await Remedy.updateAssignment(req.params.id, req.body);
    if (!a) return res.status(404).json({ success: false, message: "Assignment not found." });
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
