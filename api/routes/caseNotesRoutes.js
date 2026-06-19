import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN   = requireRole("admin", "guruji", "superadmin");
const ADMIN_SUPER = requireRole("admin", "superadmin");

const router = Router();

/* GET /api/case-notes/:caseRef — all notes for a case */
router.get("/:caseRef", ALL_ADMIN, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM case_notes WHERE case_reference = $1 ORDER BY created_at DESC",
      [req.params.caseRef]
    );
    res.json({ success: true, notes: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* POST /api/case-notes/:caseRef — add a note */
router.post("/:caseRef", ALL_ADMIN, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ success: false, message: "text is required" });
  try {
    const { rows } = await pool.query(
      "INSERT INTO case_notes (case_reference, text) VALUES ($1, $2) RETURNING *",
      [req.params.caseRef, text.trim()]
    );
    res.json({ success: true, note: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE /api/case-notes/:caseRef/:id — delete a note */
router.delete("/:caseRef/:id", ADMIN_SUPER, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM case_notes WHERE id = $1 AND case_reference = $2",
      [req.params.id, req.params.caseRef]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
