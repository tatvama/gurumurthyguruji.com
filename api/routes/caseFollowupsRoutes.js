import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");

const router = Router();

/* GET /api/case-followups/:caseRef */
router.get("/:caseRef", ALL_ADMIN, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM case_followups WHERE case_reference = $1 ORDER BY created_at DESC",
      [req.params.caseRef]
    );
    res.json({ success: true, followups: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* POST /api/case-followups/:caseRef */
router.post("/:caseRef", ALL_ADMIN, async (req, res) => {
  const { type, dateTime, notes } = req.body;
  if (!type || !dateTime) return res.status(400).json({ success: false, message: "type and dateTime are required" });
  try {
    const { rows } = await pool.query(
      "INSERT INTO case_followups (case_reference, type, date_time, notes) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.caseRef, type, dateTime, notes ?? ""]
    );
    res.json({ success: true, followup: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE /api/case-followups/:caseRef/:id */
router.delete("/:caseRef/:id", ADMIN_SUPER, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM case_followups WHERE id = $1 AND case_reference = $2",
      [req.params.id, req.params.caseRef]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
